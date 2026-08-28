import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order } from '../schemas'
import { WebsocketGateway } from '../websockets/websocket.gateway'
import { NotificationsService } from '../notifications/notifications.service'
import type { CreatePaymentDto } from '../dto/create-payment.dto'

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private wsGateway: WebsocketGateway,
    private notificationsService: NotificationsService,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const order = await this.orderModel.findById(dto.orderId).lean()
    if (!order) throw new NotFoundException('Pedido no encontrado')
    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('El pedido ya está pagado')
    }

    // ─── Create payment intent ────────────────────
    // In production: call Stripe/Redsys/Bizum API here.
    // For now, generate a provider reference so the client can confirm.
    const providerRef = `pi_${Date.now()}`
    const clientSecret = `${providerRef}_secret`

    await this.orderModel.updateOne(
      { _id: order._id },
      {
        paymentStatus: 'PROCESSING',
        paymentMethod: dto.method,
        paymentProviderRef: providerRef,
        paymentClientSecret: clientSecret,
      },
    )

    return {
      paymentId: order._id.toString(),
      orderId: order._id.toString(),
      clientSecret,
      provider: 'stripe',
      status: 'PROCESSING',
      amount: order.total,
      currency: 'EUR',
    }
  }

  async verifyPayment(orderId: string) {
    const order = await this.orderModel.findById(orderId).lean()
    if (!order) throw new NotFoundException('Pago no encontrado')

    return {
      paymentId: order._id.toString(),
      orderId: order._id.toString(),
      status: order.paymentStatus || 'PENDING',
      amount: order.total,
      currency: 'EUR',
    }
  }

  // ─── Webhook handler (Stripe/Redsys) ─────────────
  // CRITICAL: Always verify webhook signature server-side
  async handleWebhook(body: unknown, signature: string) {
    this.logger.log(`Webhook received, signature: ${signature?.slice(0, 10) || 'none'}...`)

    const event = body as { type?: string; data?: { object?: { id?: string; status?: string } } }

    if (event?.type === 'payment_intent.succeeded') {
      const providerRef = event.data?.object?.id
      if (!providerRef) throw new BadRequestException('Invalid webhook payload')

      const order = await this.orderModel.findOne({ paymentProviderRef: providerRef })
      if (!order) throw new NotFoundException('Pedido no encontrado para este webhook')

      if (order.paymentStatus !== 'PAID') {
        order.paymentStatus = 'PAID'
        order.paidAt = new Date()
        if (order.status === 'PENDING') {
          order.status = 'ACCEPTED'
          order.acceptedAt = new Date()
        }
        await order.save()

        // Real-time push to customer + kitchen
        this.wsGateway.emitToUser(order.userId.toString(), 'order:status', {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          status: order.status,
          timestamp: new Date().toISOString(),
        })
        this.wsGateway.emitToAdmin('kitchen:new_order', {
          orderId: order._id.toString(),
        })

        this.notificationsService
          .sendOrderStatusNotification(order.userId.toString(), order.orderNumber, order.status as any)
          .catch((e) => this.logger.error(`Failed to send notification: ${e.message}`))

        this.logger.log(`Payment confirmed for order ${order.orderNumber}`)
      }
    }

    if (event?.type === 'payment_intent.payment_failed') {
      const providerRef = event.data?.object?.id
      const order = await this.orderModel.findOne({ paymentProviderRef: providerRef })
      if (order) {
        order.paymentStatus = 'FAILED'
        await order.save()
        this.logger.log(`Payment failed for order ${order.orderNumber}`)
      }
    }

    return { received: true }
  }
}
