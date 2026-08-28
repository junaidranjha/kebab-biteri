import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'

export type OrderDocument = Order & Document

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId

  @Prop({ required: true })
  productName: string

  @Prop()
  variantName: string

  @Prop({ required: true })
  unitPrice: number

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  lineTotal: number

  @Prop()
  notes: string

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  modifiersJson: any
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId

  @Prop()
  customerName: string

  @Prop()
  customerPhone: string

  @Prop({ type: Types.ObjectId, required: true, ref: 'Branch' })
  branchId: Types.ObjectId

  @Prop({ enum: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REJECTED'], default: 'PENDING' })
  status: string

  @Prop({ enum: ['DELIVERY', 'PICKUP'], default: 'DELIVERY' })
  orderType: string

  @Prop({ required: true })
  subtotal: number

  @Prop({ default: 0 })
  deliveryFee: number

  @Prop({ default: 0 })
  discount: number

  @Prop({ required: true })
  total: number

  @Prop()
  notes: string

  @Prop()
  deliveryAddress: string

  @Prop()
  estimatedDeliveryAt: Date

  @Prop({ default: Date.now })
  placedAt: Date

  @Prop()
  acceptedAt: Date

  @Prop()
  preparingAt: Date

  @Prop()
  readyAt: Date

  @Prop()
  outForDeliveryAt: Date

  @Prop()
  deliveredAt: Date

  @Prop()
  cancelledAt: Date

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  addressId: Types.ObjectId

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[]

  @Prop({ type: Types.ObjectId })
  couponId: Types.ObjectId

  @Prop({ enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' })
  paymentStatus: string

  @Prop()
  paymentMethod: string

  @Prop()
  paymentProviderRef: string

  @Prop()
  paymentClientSecret: string

  @Prop()
  paidAt: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)
