import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true })
  email: string

  @Prop({ unique: true, sparse: true })
  phone: string

  @Prop()
  passwordHash: string

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ enum: ['CUSTOMER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DELIVERY'], default: 'CUSTOMER' })
  role: string

  @Prop()
  avatarUrl: string

  @Prop({ default: false })
  marketingConsent: boolean

  @Prop()
  fcmToken: string

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  lastLoginAt: Date

  @Prop()
  deletedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
