import { IsString, IsEnum, IsOptional, IsInt, Min, Max, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { OrderType, PaymentMethod } from '@kebab-biteri/types'

export class CreateOrderItemDto {
  @IsString()
  productId: string

  @IsOptional()
  @IsString()
  variantId?: string

  @IsInt()
  @Min(1)
  @Max(20)
  quantity: number

  @IsOptional()
  @IsArray()
  modifierOptionIds?: string[]

  @IsOptional()
  @IsString()
  notes?: string

  // Frontend-provided fields for static menu products
  @IsOptional()
  @IsString()
  productName?: string

  @IsOptional()
  unitPrice?: number

  @IsOptional()
  variantName?: string
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  branchId?: string

  @IsEnum(OrderType)
  orderType: OrderType

  @IsOptional()
  @IsString()
  addressId?: string

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @IsOptional()
  @IsString()
  couponCode?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsString()
  deliveryAddress?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]
}
