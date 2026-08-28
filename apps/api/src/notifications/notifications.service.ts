import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Notification, User } from '../schemas'

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  constructor(
    @InjectModel(Notification.name) private notifModel: Model<Notification>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    type: string = 'TRANSACTIONAL',
    data?: Record<string, string>,
  ) {
    if (type === 'MARKETING') {
      const user = await this.userModel.findById(userId).lean()
      if (!user?.marketingConsent) return
    }

    const notification = await this.notifModel.create({
      userId: new Types.ObjectId(userId),
      type,
      title,
      body,
      data,
    })

    const user = await this.userModel.findById(userId).lean()
    if (!user?.fcmToken) return notification

    // In production: use firebase-admin to send FCM
    this.logger.log(`Push notification sent to user ${userId}: ${title}`)
    return notification
  }

  async sendOrderStatusNotification(userId: string, orderNumber: string, status: string) {
    const messages: Record<string, { title: string; body: string }> = {
      PENDING: { title: '🌯 Kebab Biteri', body: `Tu pedido #${orderNumber} ha sido recibido.` },
      ACCEPTED: { title: '✅ Kebab Biteri', body: `Tu pedido #${orderNumber} ha sido confirmado.` },
      PREPARING: { title: '🔥 Kebab Biteri', body: `Tu pedido #${orderNumber} se está preparando.` },
      READY: { title: '📦 Kebab Biteri', body: `Tu pedido #${orderNumber} está listo.` },
      OUT_FOR_DELIVERY: { title: '🛵 Kebab Biteri', body: `Tu pedido #${orderNumber} está en reparto.` },
      DELIVERED: { title: '🎉 Kebab Biteri', body: `Tu pedido #${orderNumber} ha sido entregado. ¡Gracias!` },
      CANCELLED: { title: '❌ Kebab Biteri', body: `Tu pedido #${orderNumber} ha sido cancelado.` },
    }

    const msg = messages[status]
    if (!msg) return
    return this.sendPushNotification(userId, msg.title, msg.body, 'TRANSACTIONAL', { orderNumber, status })
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const notifications = await this.notifModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    const total = await this.notifModel.countDocuments({ userId: new Types.ObjectId(userId) })
    return { data: notifications, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.notifModel.updateOne(
      { _id: notificationId, userId: new Types.ObjectId(userId) },
      { readAt: new Date() },
    )
  }

  async markAllAsRead(userId: string) {
    return this.notifModel.updateMany(
      { userId: new Types.ObjectId(userId), readAt: null },
      { readAt: new Date() },
    )
  }

  async getUnreadCount(userId: string) {
    return this.notifModel.countDocuments({ userId: new Types.ObjectId(userId), readAt: null })
  }
}
