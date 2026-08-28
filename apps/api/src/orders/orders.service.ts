import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Order, Coupon, User } from '../schemas'
import { WebsocketGateway } from '../websockets/websocket.gateway'
import { NotificationsService } from '../notifications/notifications.service'
import type { CreateOrderDto } from '../dto/create-order.dto'

// Single branch — hardcoded since there's only one location
const BRANCH = {
  name: 'Kebab Biteri',
  deliveryFee: 0, // Free delivery
  avgPrepTimeMin: 20,
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(User.name) private userModel: Model<User>,
    private wsGateway: WebsocketGateway,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Get user info for customer name/phone
    const user = await this.userModel.findById(userId).lean()
    if (!user) throw new NotFoundException('User not found')

    // Build order items from the DTO — use frontend-provided prices (static menu data)
    let subtotal = 0
    const orderItems: any[] = []

    for (const item of dto.items as any[]) {
      const unitPrice = item.unitPrice ?? 0
      const lineTotal = unitPrice * item.quantity
      subtotal += lineTotal

      orderItems.push({
        productId: new Types.ObjectId(),
        productName: item.productName ?? 'Unknown Product',
        variantName: item.variantName ?? null,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
        notes: item.notes ?? null,
        modifiersJson: item.modifiers ? item.modifiers.map((m: any) => m.optionName ?? m).filter(Boolean) : [],
      })
    }

    if (subtotal <= 0) throw new BadRequestException('Order must contain at least one item')

    const deliveryFee = dto.orderType === 'DELIVERY' ? BRANCH.deliveryFee : 0

    let discount = 0
    let couponId: Types.ObjectId | null = null
    if (dto.couponCode) {
      const coupon = await this.couponModel.findOne({ code: dto.couponCode, isActive: true }).lean()
      if (!coupon) throw new BadRequestException('Invalid coupon')
      couponId = coupon._id
      if (coupon.type === 'PERCENTAGE') discount = (subtotal * coupon.value) / 100
      else if (coupon.type === 'FIXED_AMOUNT') discount = coupon.value
      else if (coupon.type === 'FREE_DELIVERY') discount = deliveryFee
      discount = Math.min(discount, subtotal)
    }

    const total = subtotal + deliveryFee - discount
    const orderCount = await this.orderModel.countDocuments()
    const orderNumber = String(10000 + orderCount + 1)

    const order = await this.orderModel.create({
      orderNumber,
      userId: new Types.ObjectId(userId),
      customerName: `${user.firstName} ${user.lastName}`,
      customerPhone: user.phone ?? user.email ?? '',
      branchId: new Types.ObjectId(), // Single branch — use a dummy ID
      status: 'PENDING',
      orderType: dto.orderType,
      subtotal,
      deliveryFee,
      discount,
      total,
      notes: dto.notes,
      deliveryAddress: dto.deliveryAddress ?? '',
      paymentMethod: dto.paymentMethod,
      items: orderItems,
      estimatedDeliveryAt: new Date(Date.now() + (BRANCH.avgPrepTimeMin + 30) * 60000),
    })

    if (couponId) {
      await this.couponModel.updateOne({ _id: couponId }, { $inc: { usesCount: 1 } })
    }

    // ─── Real-time: emit to admin + kitchen ─────────
    const populatedOrder = await this.orderModel.findById(order._id).lean()
    this.wsGateway.emitToAdmin('order:created', { order: populatedOrder })
    this.wsGateway.emitToAdmin('kitchen:new_order', { order: populatedOrder })

    this.logger.log(`Order ${orderNumber} created for user ${userId}, emitted to admin`)

    return populatedOrder
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const orders = await this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ placedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    const total = await this.orderModel.countDocuments({ userId: new Types.ObjectId(userId) })
    return { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.orderModel.findById(orderId).lean()
    if (!order) throw new NotFoundException('Order not found')
    if (order.userId.toString() !== userId) throw new ForbiddenException('Not authorized')
    return order
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.orderModel.findOne({ orderNumber }).lean()
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new NotFoundException('Order not found')
    if (order.userId.toString() !== userId) throw new ForbiddenException('Not authorized')
    if (order.status !== 'PENDING' && order.status !== 'ACCEPTED') {
      throw new BadRequestException('Cannot cancel order in preparation')
    }

    order.status = 'CANCELLED'
    order.cancelledAt = new Date()
    await order.save()

    const updated = await this.orderModel.findById(order._id).lean()
    this.wsGateway.emitToAdmin('order:status_updated', { order: updated })
    this.wsGateway.emitToUser(order.userId.toString(), 'order:status', {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      status: 'CANCELLED',
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async updateStatus(orderId: string, status: string, adminUserId: string) {
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new NotFoundException('Order not found')

    order.status = status
    const tsMap: Record<string, string> = {
      ACCEPTED: 'acceptedAt',
      PREPARING: 'preparingAt',
      READY: 'readyAt',
      OUT_FOR_DELIVERY: 'outForDeliveryAt',
      DELIVERED: 'deliveredAt',
    }
    const tsField = tsMap[status]
    if (tsField) (order as any)[tsField] = new Date()

    await order.save()

    const updated = await this.orderModel.findById(order._id).lean()

    // ─── Real-time: notify user + admin ────────────
    this.wsGateway.emitToUser(order.userId.toString(), 'order:status', {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      status,
      timestamp: new Date().toISOString(),
    })
    this.wsGateway.emitToAdmin('order:status_updated', { order: updated })

    this.notificationsService
      .sendOrderStatusNotification(order.userId.toString(), order.orderNumber, status as any)
      .catch((e) => this.logger.error(`Failed to send notification: ${e.message}`))

    this.logger.log(`Order ${order.orderNumber} status updated to ${status} by admin ${adminUserId}`)

    return updated
  }
}
