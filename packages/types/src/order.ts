import { OrderStatus, OrderType, PaymentStatus, PaymentMethod } from './enums'
import { CartItem } from './cart'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  variantName: string | null
  unitPrice: number
  quantity: number
  modifiers: CartItem['modifiers']
  lineTotal: number
  notes: string | null
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  orderType: OrderType
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod | null
  branchId: string
  branchName: string
  deliveryAddress: string | null
  estimatedDeliveryAt: string | null
  placedAt: string
  updatedAt: string
  timeline: OrderTimelineEvent[]
}

export interface OrderTimelineEvent {
  status: OrderStatus
  label: string
  timestamp: string | null
  reached: boolean
}

export interface CreateOrderDto {
  branchId: string
  orderType: OrderType
  addressId?: string
  paymentMethod: PaymentMethod
  couponCode?: string
  notes?: string
}

export interface CouponValidationDto {
  code: string
  subtotal: number
}

export interface CouponValidationResult {
  valid: boolean
  discount: number
  message: string
}
