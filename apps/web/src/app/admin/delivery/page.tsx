'use client'

import { useState, useEffect } from 'react'
import { Truck, MapPin, Phone, Clock, Package, Navigation, X, User, Bike } from 'lucide-react'
import { api } from '@/lib/api-client'
import { formatPrice, timeAgo, cn } from '@/lib/utils'
import { useAdminOrders, type AdminOrder } from '@/hooks/use-admin-orders'

const statusLabels: Record<string, { label: string; color: string }> = {
  READY: { label: 'Ready for pickup', color: 'bg-success/10 text-success' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', color: 'bg-info/10 text-info' },
  DELIVERED: { label: 'Delivered', color: 'bg-charcoal-100 text-charcoal-600' },
}

export default function AdminDeliveryPage() {
  const { orders, updateStatus } = useAdminOrders()
  const [riders, setRiders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [assignRiderId, setAssignRiderId] = useState<string>('')

  // Fetch available riders (delivery role users)
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        // The backend endpoint requires a branchId — use a dummy one
        const res = await api.get<any[]>('/delivery/available-drivers/any')
        setRiders(Array.isArray(res) ? res : [])
      } catch {
        // If no riders, show empty state
        setRiders([])
      }
    }
    fetchRiders()
  }, [])

  // Delivery-related orders: READY (need assignment) + OUT_FOR_DELIVERY (in progress)
  const readyOrders = orders.filter(o => o.status === 'READY' && o.orderType === 'DELIVERY')
  const inProgress = orders.filter(o => o.status === 'OUT_FOR_DELIVERY' && o.orderType === 'DELIVERY')
  const completed = orders.filter(o => o.status === 'DELIVERED' && o.orderType === 'DELIVERY').slice(0, 10)

  const handleAssign = async (orderId: string) => {
    if (!assignRiderId) return
    try {
      await api.patch(`/delivery/assign/${orderId}`, { driverId: assignRiderId })
      // The WebSocket will update the order status automatically
      setSelectedOrder(null)
      setAssignRiderId('')
    } catch (e: any) {
      // Error — the order might already be assigned
    }
  }

  const handleMarkDelivered = async (orderId: string) => {
    await updateStatus(orderId, 'DELIVERED')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Delivery Management</h1>
        <p className="mt-1 text-sm text-muted">
          {readyOrders.length} ready for pickup · {inProgress.length} out for delivery · {completed.length} completed today
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Ready for pickup</p>
              <p className="font-display text-2xl font-bold text-charcoal">{readyOrders.length}</p>
            </div>
            <Package className="h-7 w-7 text-success" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Out for delivery</p>
              <p className="font-display text-2xl font-bold text-charcoal">{inProgress.length}</p>
            </div>
            <Truck className="h-7 w-7 text-info" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Available riders</p>
              <p className="font-display text-2xl font-bold text-charcoal">{riders.length}</p>
            </div>
            <Bike className="h-7 w-7 text-primary" />
          </div>
        </div>
      </div>

      {/* Available riders */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-base font-bold text-charcoal flex items-center gap-2">
            <Bike className="h-5 w-5 text-primary" /> Available Riders
          </h2>
        </div>
        <div className="divide-y divide-border">
          {riders.length === 0 ? (
            <div className="p-6 text-center">
              <Bike className="mx-auto h-10 w-10 text-subtle" />
              <p className="mt-2 text-sm text-muted">No riders available</p>
              <p className="text-xs text-muted">Register delivery riders in the system to assign orders</p>
            </div>
          ) : (
            riders.map((rider) => (
              <div key={rider._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {rider.firstName?.[0] ?? 'R'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{rider.firstName} {rider.lastName}</p>
                    {rider.phone && <p className="text-xs text-muted">{rider.phone}</p>}
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                  <span className="h-2 w-2 rounded-full bg-success" /> Online
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ready for pickup — needs rider assignment */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-charcoal flex items-center gap-2">
          <Package className="h-5 w-5 text-success" /> Ready for Pickup ({readyOrders.length})
        </h2>
        {readyOrders.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted">No orders ready for delivery</p>
            <p className="text-xs text-muted">Orders will appear here when the kitchen marks them as ready</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {readyOrders.map((order) => (
              <div key={order._id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-charcoal">#{order.orderNumber}</span>
                  <span className="text-xs text-muted">{timeAgo(order.placedAt)}</span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="font-semibold text-charcoal">{order.customerName || 'Customer'}</p>
                  {order.customerPhone && (
                    <a href={`tel:${order.customerPhone}`} className="flex items-center gap-1 text-xs text-primary">
                      <Phone className="h-3 w-3" /> {order.customerPhone}
                    </a>
                  )}
                  {order.deliveryAddress && (
                    <p className="flex items-start gap-1 text-xs text-muted">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" /> {order.deliveryAddress}
                    </p>
                  )}
                  <p className="text-xs text-muted">{order.items.length} items · {formatPrice(order.total)}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setSelectedOrder(order); setAssignRiderId(riders[0]?._id ?? '') }}
                    className="flex-1 rounded-lg bg-primary py-2 text-xs font-bold text-white hover:bg-primary-600">
                    Assign rider
                  </button>
                  <button onClick={() => setSelectedOrder(order)}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-charcoal hover:bg-surface-alt">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Out for delivery — in progress */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-charcoal flex items-center gap-2">
          <Truck className="h-5 w-5 text-info" /> Out for Delivery ({inProgress.length})
        </h2>
        {inProgress.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted">No active deliveries</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {inProgress.map((order) => (
              <div key={order._id} className="rounded-xl border border-info/30 bg-info/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-charcoal">#{order.orderNumber}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-info">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-info" /> En route
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="font-semibold text-charcoal">{order.customerName || 'Customer'}</p>
                  {order.customerPhone && (
                    <a href={`tel:${order.customerPhone}`} className="flex items-center gap-1 text-xs text-primary">
                      <Phone className="h-3 w-3" /> {order.customerPhone}
                    </a>
                  )}
                  {order.deliveryAddress && (
                    <div className="mt-2 overflow-hidden rounded-lg">
                      <iframe
                        width="100%"
                        height="120"
                        loading="lazy"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(order.deliveryAddress)}&output=embed`}
                        className="border-0"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted">{order.items.length} items · {formatPrice(order.total)}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setSelectedOrder(order)}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-charcoal hover:bg-surface">
                    Details
                  </button>
                  <button onClick={() => handleMarkDelivered(order._id)}
                    className="flex-1 rounded-lg bg-success py-2 text-xs font-bold text-white hover:bg-success/90">
                    Mark delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed deliveries */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-charcoal">Recently Completed</h2>
        {completed.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-sm text-muted">No completed deliveries yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold text-muted">
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completed.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-alt">
                    <td className="p-3 font-semibold text-charcoal">#{order.orderNumber}</td>
                    <td className="p-3 text-charcoal">{order.customerName || '—'}</td>
                    <td className="p-3 text-muted text-xs max-w-48 truncate">{order.deliveryAddress || '—'}</td>
                    <td className="p-3 font-bold text-charcoal">{formatPrice(order.total)}</td>
                    <td className="p-3 text-muted">{timeAgo(order.placedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail + assign modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="absolute inset-0 bg-charcoal-900/50" />
          <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">#{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-muted">{timeAgo(selectedOrder.placedAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-alt">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status */}
            <div className="mt-3">
              <span className={cn('inline-block rounded-md px-3 py-1 text-sm font-semibold', statusLabels[selectedOrder.status]?.color)}>
                {statusLabels[selectedOrder.status]?.label || selectedOrder.status}
              </span>
            </div>

            {/* Customer info */}
            <div className="mt-4 space-y-2 rounded-xl bg-surface-alt p-4">
              {selectedOrder.customerName && <p className="text-sm font-semibold text-charcoal">{selectedOrder.customerName}</p>}
              {selectedOrder.customerPhone && (
                <a href={`tel:${selectedOrder.customerPhone}`} className="flex items-center gap-2 text-sm text-primary">
                  <Phone className="h-4 w-4" /> {selectedOrder.customerPhone}
                </a>
              )}
              {selectedOrder.deliveryAddress && (
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted" />
                    <span className="font-semibold text-charcoal">Delivery address</span>
                  </div>
                  <div className="mt-1 overflow-hidden rounded-lg">
                    <iframe width="100%" height="180" loading="lazy"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(selectedOrder.deliveryAddress)}&output=embed`}
                      className="border-0" />
                  </div>
                  <p className="mt-1 text-xs text-muted">{selectedOrder.deliveryAddress}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mt-4">
              <h3 className="mb-2 font-semibold text-charcoal">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-surface-alt p-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded bg-primary text-xs font-bold text-white">{item.quantity}</span>
                      <p className="font-medium text-charcoal">{item.productName}</p>
                    </div>
                    <span className="font-bold text-charcoal">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assign rider section */}
            {selectedOrder.status === 'READY' && (
              <div className="mt-4 rounded-xl border border-border p-4">
                <h3 className="mb-2 font-semibold text-charcoal flex items-center gap-2">
                  <User className="h-4 w-4" /> Assign a rider
                </h3>
                {riders.length === 0 ? (
                  <p className="text-sm text-muted">No riders available. Register delivery riders first.</p>
                ) : (
                  <div className="space-y-2">
                    <select value={assignRiderId} onChange={(e) => setAssignRiderId(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-charcoal focus:border-primary focus:outline-none">
                      <option value="">Select a rider...</option>
                      {riders.map((r) => (
                        <option key={r._id} value={r._id}>{r.firstName} {r.lastName}{r.phone ? ` (${r.phone})` : ''}</option>
                      ))}
                    </select>
                    <button onClick={() => handleAssign(selectedOrder._id)} disabled={!assignRiderId}
                      className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-600 disabled:opacity-50">
                      Assign & Send for delivery
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Total */}
            <div className="mt-4 rounded-xl border border-border p-4">
              <div className="flex justify-between"><span className="font-bold text-charcoal">Total</span><span className="font-bold text-primary">{formatPrice(selectedOrder.total)}</span></div>
              <p className="mt-1 text-xs text-muted">Payment: {selectedOrder.paymentMethod}</p>
            </div>

            {/* Mark delivered */}
            {selectedOrder.status === 'OUT_FOR_DELIVERY' && (
              <button onClick={() => { handleMarkDelivered(selectedOrder._id); setSelectedOrder(null) }}
                className="mt-4 w-full rounded-xl bg-success py-3 text-sm font-bold text-white hover:bg-success/90">
                Mark as delivered
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
