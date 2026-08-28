import { IsUUID, IsEnum } from 'class-validator'
import { PaymentMethod } from '@kebab-biteri/types'

export class CreatePaymentDto {
  @IsUUID()
  orderId: string

  @IsEnum(PaymentMethod)
  method: PaymentMethod
}
