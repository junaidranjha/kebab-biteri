import { PaymentMethod } from './enums'

export interface CreatePaymentDto {
  orderId: string
  method: PaymentMethod
}

export interface PaymentIntent {
  paymentId: string
  clientSecret: string | null
  provider: string
  status: string
}
