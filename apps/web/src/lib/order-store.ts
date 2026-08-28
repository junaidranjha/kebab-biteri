'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { restaurantInfo } from '@/data/menu-data'

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

export type OrderType = 'DELIVERY' | 'PICKUP'
export type PaymentMethod = 'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'BIZUM' | 'CASH'

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  variantName: string | null
  unitPrice: number
  quantity: number
  lineTotal: number
  modifiers: string[]
  notes: string | null
}

export interface Order {
  _id: string
  orderNumber: string
  status: OrderStatus
  orderType: OrderType
  paymentMethod: PaymentMethod
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  notes: string | null
  address: string | null
  placedAt: string
  acceptedAt: string | null
  preparingAt: string | null
  readyAt: string | null
  outForDeliveryAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  estimatedDeliveryAt: string | null
  branchName: string
}

interface OrderState {
  orders: Order[]
  createOrder: (data: {
    items: OrderItem[]
    orderType: OrderType
    paymentMethod: PaymentMethod
    address: string | null
    notes: string | null
    deliveryFee: number
    discount: number
  }) => Order
  updateStatus: (orderId: string, status: OrderStatus) => void
  cancelOrder: (orderId: string) => void
  getOrder: (orderId: string) => Order | undefined
  clearOrders: () => void
}

let orderCounter = 10000

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (data) => {
        const subtotal = data.items.reduce((sum, i) => sum + i.lineTotal, 0)
        const total = subtotal + data.deliveryFee - data.discount
        orderCounter = Math.max(orderCounter, ...get().orders.map(o => parseInt(o.orderNumber) || 10000)) + 1

        const now = new Date()
        const eta = new Date(now.getTime() + 35 * 60000) // 35 min

        const order: Order = {
          _id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          orderNumber: String(orderCounter),
          status: 'PENDING',
          orderType: data.orderType,
          paymentMethod: data.paymentMethod,
          items: data.items,
          subtotal,
          deliveryFee: data.deliveryFee,
          discount: data.discount,
          total,
          notes: data.notes,
          address: data.address,
          placedAt: now.toISOString(),
          acceptedAt: null,
          preparingAt: null,
          readyAt: null,
          outForDeliveryAt: null,
          deliveredAt: null,
          cancelledAt: null,
          estimatedDeliveryAt: eta.toISOString(),
          branchName: restaurantInfo.name,
        }

        set((state) => ({ orders: [order, ...state.orders] }))

        // Simulate order progression
        simulateOrderProgression(order._id, set)

        return order
      },

      updateStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o._id !== orderId) return o
            const now = new Date().toISOString()
            const updates: Partial<Order> = { status }
            if (status === 'ACCEPTED') updates.acceptedAt = now
            if (status === 'PREPARING') updates.preparingAt = now
            if (status === 'READY') updates.readyAt = now
            if (status === 'OUT_FOR_DELIVERY') updates.outForDeliveryAt = now
            if (status === 'DELIVERED') updates.deliveredAt = now
            if (status === 'CANCELLED') updates.cancelledAt = now
            return { ...o, ...updates }
          }),
        })),

      cancelOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o._id === orderId ? { ...o, status: 'CANCELLED', cancelledAt: new Date().toISOString() } : o,
          ),
        })),

      getOrder: (orderId) => get().orders.find((o) => o._id === orderId),

      clearOrders: () => set({ orders: [] }),
    }),
    { name: 'kb-orders' },
  ),
)

// Simulate order status progression for realistic feel
function simulateOrderProgression(orderId: string, set: (fn: (state: OrderState) => Partial<OrderState>) => void) {
  const progress: Array<{ status: OrderStatus; delay: number }> = [
    { status: 'ACCEPTED', delay: 3000 },
    { status: 'PREPARING', delay: 8000 },
    { status: 'READY', delay: 20000 },
    { status: 'OUT_FOR_DELIVERY', delay: 25000 },
    { status: 'DELIVERED', delay: 45000 },
  ]

  for (const step of progress) {
    setTimeout(() => {
      set((state) => ({
        orders: state.orders.map((o) => {
          if (o._id !== orderId) return o
          if (o.status === 'CANCELLED') return o // Don't progress cancelled orders
          const now = new Date().toISOString()
          const updates: Partial<Order> = { status: step.status }
          if (step.status === 'ACCEPTED') updates.acceptedAt = now
          if (step.status === 'PREPARING') updates.preparingAt = now
          if (step.status === 'READY') updates.readyAt = now
          if (step.status === 'OUT_FOR_DELIVERY') updates.outForDeliveryAt = now
          if (step.status === 'DELIVERED') updates.deliveredAt = now
          return { ...o, ...updates }
        }),
      }))
    }, step.delay)
  }
}
