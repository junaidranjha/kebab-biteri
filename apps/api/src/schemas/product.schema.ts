import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ProductDocument = Product & Document

@Schema({ _id: false })
export class ProductVariant {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  price: number

  @Prop()
  calories: number

  @Prop({ default: false })
  isDefault: boolean
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant)

@Schema({ _id: false })
export class ModifierOption {
  @Prop({ required: true })
  name: string

  @Prop({ default: 0 })
  priceDelta: number

  @Prop({ default: false })
  isDefault: boolean
}

export const ModifierOptionSchema = SchemaFactory.createForClass(ModifierOption)

@Schema({ _id: false })
export class ProductModifier {
  @Prop({ required: true })
  name: string

  @Prop({ default: 0 })
  minSelect: number

  @Prop()
  maxSelect: number

  @Prop({ type: [ModifierOptionSchema], default: [] })
  options: ModifierOption[]
}

export const ProductModifierSchema = SchemaFactory.createForClass(ProductModifier)

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  imageUrl: string

  @Prop({ type: Types.ObjectId, required: true, ref: 'Category' })
  categoryId: Types.ObjectId

  @Prop({ required: true })
  basePrice: number

  @Prop({ default: 0 })
  rating: number

  @Prop({ default: 0 })
  reviewCount: number

  @Prop({ default: false })
  isPopular: boolean

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: [String], default: [] })
  allergens: string[]

  @Prop()
  calories: number

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[]

  @Prop({ type: [ProductModifierSchema], default: [] })
  modifiers: ProductModifier[]

  @Prop()
  deletedAt: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product)
