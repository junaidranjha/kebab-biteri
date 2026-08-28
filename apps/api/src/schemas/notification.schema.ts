import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'

export type NotificationDocument = Notification & Document

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId

  @Prop({ enum: ['TRANSACTIONAL', 'MARKETING'], default: 'TRANSACTIONAL' })
  type: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  body: string

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any

  @Prop()
  readAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
