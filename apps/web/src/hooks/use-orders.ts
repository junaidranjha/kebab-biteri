'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api, getAccessToken } from '@/lib/api-client'
import { getSocket } from '@/lib/ws-client'

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
  status: string
  orderType: string
  paymentMethod: string
  paymentStatus?: string
  customerName?: string
  customerPhone?: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  notes?: string | null
  deliveryAddress?: string
  placedAt: string
  acceptedAt?: string | null
  preparingAt?: string | null
  readyAt?: string | null
  outForDeliveryAt?: string | null
  deliveredAt?: string | null
  cancelledAt?: string | null
  estimatedDeliveryAt?: string | null
  userId?: { firstName: string; lastName: string; email: string; phone: string } | string
}

export type OrderListItem = Order
export type OrderDetail = Order

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOrders = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await api.get<{ data: Order[] }>('/orders')
      setOrders(Array.isArray(res?.data) ? res.data : [])
      setError(null)
    } catch (e) {
      setError(e as Error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()

    // Listen for real-time status updates
    const socket = getSocket()
    if (socket) {
      socket.on('order:status', (data: { orderId: string; status: string }) => {
        setOrders(prev => prev.map(o =>
          o._id === data.orderId ? { ...o, status: data.status } : o
        ))
      })
    }

    return () => {
      if (socket) socket.off('order:status')
    }
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const orderIdRef = useRef(orderId)

  useEffect(() => {
    orderIdRef.current = orderId
    if (!orderId) {
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchOrder = async () => {
      const token = getAccessToken()
      if (!token) {
        setLoading(false)
        setError(new Error('Not authenticated'))
        return
      }
      try {
        const res = await api.get<Order>(`/orders/${orderId}`)
        if (!cancelled) {
          setOrder(res)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e as Error)
          setLoading(false)
        }
      }
    }
    fetchOrder()

    // Poll every 5 seconds + listen for WebSocket updates
    const interval = setInterval(fetchOrder, 5000)

    const socket = getSocket()
    if (socket) {
      socket.on('order:status', (data: { orderId: string; status: string }) => {
        if (data.orderId === orderIdRef.current) {
          setOrder(prev => prev ? { ...prev, status: data.status } : prev)
        }
      })
    }

    return () => {
      cancelled = true
      clearInterval(interval)
      if (socket) socket.off('order:status')
    }
  }, [orderId])

  return { order, loading, error }
}

export async function createOrder(data: {
  items: Array<{
    productId: string
    productName?: string
    variantId?: string
    variantName?: string
    quantity: number
    unitPrice?: number
    modifierOptionIds?: string[]
    notes?: string
  }>
  orderType: string
  paymentMethod: string
  deliveryAddress?: string
  notes?: string
}): Promise<Order> {
  return api.post<Order>('/orders', {
    orderType: data.orderType,
    paymentMethod: data.paymentMethod,
    deliveryAddress: data.deliveryAddress,
    notes: data.notes,
    items: data.items,
  })
}

export async function cancelOrder(orderId: string) {
  return api.post(`/orders/${orderId}/cancel`)
}
