import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type BranchDocument = Branch & Document

@Schema({ _id: false })
export class OpeningHour {
  @Prop({ required: true })
  dayOfWeek: number

  @Prop({ required: true })
  openTime: string

  @Prop({ required: true })
  closeTime: string

  @Prop({ default: false })
  closed: boolean
}

export const OpeningHourSchema = SchemaFactory.createForClass(OpeningHour)

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  street: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  postalCode: string

  @Prop({ required: true })
  lat: number

  @Prop({ required: true })
  lng: number

  @Prop({ required: true })
  phone: string

  @Prop({ default: 5.0 })
  deliveryRadiusKm: number

  @Prop({ default: 1.99 })
  deliveryFee: number

  @Prop({ default: 10.0 })
  minOrderAmount: number

  @Prop({ default: 20 })
  avgPrepTimeMin: number

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: [OpeningHourSchema], default: [] })
  openingHours: OpeningHour[]
}

export const BranchSchema = SchemaFactory.createForClass(Branch)
