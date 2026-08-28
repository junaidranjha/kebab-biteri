import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type PromotionDocument = Promotion & Document

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  subtitle: string

  @Prop({ required: true })
  imageUrl: string

  @Prop()
  badgeText: string

  @Prop()
  linkUrl: string

  @Prop({ default: 0 })
  sortOrder: number

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  startsAt: Date

  @Prop()
  endsAt: Date
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion)
