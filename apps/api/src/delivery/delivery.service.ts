import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, User } from '../schemas'
import { WebsocketGateway } from '../websockets/websocket.gateway'

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    private wsGateway: WebsocketGateway,
  ) {}

  async assignDriver(orderId: string, driverId: string) {
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new NotFoundException('Order not found')
    if (order.status !== 'READY') throw new BadRequestException('Order must be ready first')

    order.status = 'OUT_FOR_DELIVERY'
    order.outForDeliveryAt = new Date()
    await order.save()

    const updated = await this.orderModel.findById(order._id).lean()
    this.wsGateway.emitToUser(order.userId.toString(), 'order:status', {
      orderId, orderNumber: order.orderNumber, status: 'OUT_FOR_DELIVERY', timestamp: new Date().toISOString(),
    })
    this.wsGateway.emitToAdmin('order:status_updated', { order: updated })
    return updated
  }

  async pickup(orderId: string, driverId: string) {
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new NotFoundException('Order not found')
    if (order.status !== 'OUT_FOR_DELIVERY') throw new BadRequestException('Order is not out for delivery')

    order.outForDeliveryAt = new Date()
    await order.save()

    this.wsGateway.emitToUser(order.userId.toString(), 'order:status', {
      orderId, orderNumber: order.orderNumber, status: 'OUT_FOR_DELIVERY', timestamp: new Date().toISOString(),
    })
    return order
  }

  async deliver(orderId: string, driverId: string) {
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new NotFoundException('Order not found')

    order.status = 'DELIVERED'
    order.deliveredAt = new Date()
    await order.save()

    const updated = await this.orderModel.findById(order._id).lean()
    this.wsGateway.emitToUser(order.userId.toString(), 'order:status', {
      orderId, orderNumber: order.orderNumber, status: 'DELIVERED', timestamp: new Date().toISOString(),
    })
    this.wsGateway.emitToAdmin('order:status_updated', { order: updated })
    return updated
  }

  async updateEta(orderId: string, etaMinutes: number) {
    const order = await this.orderModel.findById(orderId)
    if (!order) throw new NotFoundException('Order not found')

    const eta = new Date(Date.now() + etaMinutes * 60000)
    order.estimatedDeliveryAt = eta
    await order.save()

    this.wsGateway.emitToUser(order.userId.toString(), 'order:eta', {
      orderId, orderNumber: order.orderNumber, etaMinutes, estimatedDeliveryAt: eta.toISOString(),
    })
    return { orderId, etaMinutes, estimatedDeliveryAt: eta }
  }

  async getAvailableDrivers() {
    return this.userModel.find({ role: 'DELIVERY', isActive: true }).select('firstName lastName phone').lean()
  }

  async getDriverDeliveries(driverId: string) {
    return this.orderModel.find({ status: { $in: ['READY', 'OUT_FOR_DELIVERY'] } }).lean()
  }

  async toggleAvailability(driverId: string, available: boolean) {
    return this.userModel.findByIdAndUpdate(driverId, { isActive: available }, { new: true })
  }
}
