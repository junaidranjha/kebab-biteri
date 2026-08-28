import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CouponDocument = Coupon & Document

@Schema()
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string

  @Prop({ enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_DELIVERY'], required: true })
  type: string

  @Prop({ required: true })
  value: number

  @Prop({ default: 0 })
  minOrderAmount: number

  @Prop()
  maxUses: number

  @Prop({ default: 0 })
  usesCount: number

  @Prop()
  startsAt: Date

  @Prop()
  endsAt: Date

  @Prop({ default: true })
  isActive: boolean
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)
