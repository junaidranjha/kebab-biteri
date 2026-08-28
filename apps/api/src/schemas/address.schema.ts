import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type AddressDocument = Address & Document

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId

  @Prop({ required: true })
  label: string

  @Prop({ required: true })
  street: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  postalCode: string

  @Prop({ default: 'España' })
  country: string

  @Prop({ required: true })
  lat: number

  @Prop({ required: true })
  lng: number

  @Prop()
  instructions: string

  @Prop({ default: false })
  isDefault: boolean
}

export const AddressSchema = SchemaFactory.createForClass(Address)
