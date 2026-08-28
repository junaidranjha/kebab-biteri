'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, getAccessToken } from '@/lib/api-client'
import { getAdminSocket } from '@/lib/ws-client'

export interface AdminOrder {
  _id: string
  orderNumber: string
  status: string
  orderType: string
  paymentMethod: string
  paymentStatus?: string
  customerName?: string
  customerPhone?: string
  deliveryAddress?: string
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    lineTotal: number
    notes?: string
  }>
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  notes?: string
  placedAt: string
  userId?: { firstName: string; lastName: string; email: string; phone: string }
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set())

  const fetchOrders = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await api.get<{ data: AdminOrder[] }>('/admin/orders?limit=100')
      setOrders(res?.data ?? [])
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

    // Use the dedicated admin socket — joins the 'admin' room on the backend
    const socket = getAdminSocket()
    if (!socket) return

    const handleNewOrder = (data: { order: AdminOrder }) => {
      console.log('[Admin] New order received via WebSocket:', data?.order?.orderNumber)
      if (data?.order?._id) {
        setOrders(prev => {
          if (prev.some(o => o._id === data.order._id)) return prev
          setNewOrderIds(prevIds => new Set([...prevIds, data.order._id]))
          return [data.order, ...prev]
        })
      }
    }

    const handleStatusUpdate = (data: { order: AdminOrder }) => {
      console.log('[Admin] Status update received via WebSocket:', data?.order?.orderNumber)
      if (data?.order?._id) {
        setOrders(prev => prev.map(o =>
          o._id === data.order._id ? data.order : o
        ))
      }
    }

    // Listen for both event names
    socket.on('order:created', handleNewOrder)
    socket.on('order:status_updated', handleStatusUpdate)

    return () => {
      socket.off('order:created', handleNewOrder)
      socket.off('order:status_updated', handleStatusUpdate)
    }
  }, [fetchOrders])

  const updateStatus = useCallback(async (orderId: string, status: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
    } catch (e) {
      fetchOrders()
    }
  }, [fetchOrders])

  const clearNewBadge = useCallback((orderId: string) => {
    setNewOrderIds(prev => {
      const next = new Set(prev)
      next.delete(orderId)
      return next
    })
  }, [])

  return { orders, loading, error, newOrderIds, clearNewBadge, refetch: fetchOrders, updateStatus }
}
