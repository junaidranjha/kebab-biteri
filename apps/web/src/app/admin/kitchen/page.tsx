'use client'

import { Clock, ChefHat, MapPin, Phone, Truck, Store, X, CheckCircle2 } from 'lucide-react'
import { cn, timeAgo, formatPrice } from '@/lib/utils'
import { useAdminOrders, type AdminOrder } from '@/hooks/use-admin-orders'
import { useState } from 'react'

const statusFlow: Record<string, string> = {
  PENDING: 'PREPARING',
  ACCEPTED: 'PREPARING',
  PROCESSING: 'PREPARING',
  PREPARING: 'READY',
  READY: 'OUT_FOR_DELIVERY',
}

const buttonLabels: Record<string, string> = {
  PENDING: 'Aceptar y Empezar',
  ACCEPTED: 'Empezar Preparación',
  PROCESSING: 'Empezar Preparación',
  PREPARING: 'Marcar Listo',
  READY: 'Enviar a Domicilio',
}

export default function KitchenDisplayPage() {
  const { orders, updateStatus } = useAdminOrders()
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  const kitchenOrders = orders.filter(o =>
    ['PENDING', 'ACCEPTED', 'PROCESSING', 'PREPARING', 'READY'].includes(o.status)
  )

  // Column 1: New & Accepted incoming orders
  const pending = kitchenOrders.filter(o => ['PENDING', 'ACCEPTED', 'PROCESSING'].includes(o.status))
  // Column 2: Currently being prepared
  const preparing = kitchenOrders.filter(o => o.status === 'PREPARING')
  // Column 3: Food prepared and ready for pickup/delivery
  const ready = kitchenOrders.filter(o => o.status === 'READY')

  const advance = async (orderId: string, status: string) => {
    const next = statusFlow[status]
    if (next) await updateStatus(orderId, next)
  }

  const columns = [
    { id: 'pending', label: '1. Nuevos / Aceptados', orders: pending, color: 'border-t-[#E50909]', count: pending.length },
    { id: 'preparing', label: '2. En Preparación', orders: preparing, color: 'border-t-[#F4BE2C]', count: preparing.length },
    { id: 'ready', label: '3. Listos para Entrega', orders: ready, color: 'border-t-emerald-600', count: ready.length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-black text-zinc-950">Pantalla de Cocina (Kitchen Display)</h1>
        <p className="mt-1 text-sm font-semibold text-zinc-500">Gestión de cocina en tiempo real — {kitchenOrders.length} pedidos activos</p>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100/50 border border-amber-300">
            <ChefHat className="h-10 w-10 text-[#D99F16]" />
          </div>
          <p className="mt-4 text-lg font-black text-zinc-950">Sin pedidos activos en cocina</p>
          <p className="text-sm font-medium text-zinc-500">Los nuevos pedidos recibidos aparecerán aquí automáticamente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {columns.map((col) => (
            <div key={col.id} className={cn('rounded-2xl border border-amber-200 bg-white border-t-4 shadow-xs', col.color)}>
              <div className="flex items-center justify-between border-b border-amber-200 p-4 bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <h2 className="font-sans text-base font-black text-zinc-950">{col.label}</h2>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#F4BE2C] px-2 text-xs font-black text-zinc-950">
                    {col.count}
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-4">
                {col.orders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Clock className="mx-auto h-8 w-8 text-zinc-300" />
                    <p className="mt-2 text-xs font-semibold text-zinc-400">Sin pedidos en este estado</p>
                  </div>
                ) : (
                  col.orders.map((order) => (
                    <div key={order._id} className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 shadow-2xs hover:border-amber-400 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-zinc-950">#{order.orderNumber}</span>
                        <span className="text-xs font-semibold text-zinc-500">{timeAgo(order.placedAt)}</span>
                      </div>
                      {order.customerName && (
                        <p className="mt-1 text-xs font-bold text-zinc-700">{order.customerName}</p>
                      )}
                      <div className="mt-3 space-y-1.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F4BE2C] text-xs font-black text-zinc-950">
                              {item.quantity}×
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-black text-zinc-950">{item.productName}</p>
                              {item.notes && <p className="text-xs italic font-medium text-zinc-600">"{item.notes}"</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-amber-200 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-700">
                            {order.orderType === 'DELIVERY' ? '🛵 Domicilio' : '🏪 Recoger'}
                          </span>
                          <span className="text-xs font-black text-zinc-950">{formatPrice(order.total)}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => setSelectedOrder(order)}
                            className="rounded-xl border border-amber-300 bg-white px-2.5 py-1 text-xs font-black text-zinc-950 hover:bg-amber-100">
                            Detalles
                          </button>
                          {statusFlow[order.status] && (
                            <button onClick={() => advance(order._id, order.status)}
                              className="rounded-xl bg-[#F4BE2C] px-3 py-1 text-xs font-black text-zinc-950 shadow-xs hover:bg-amber-400 transition-transform active:scale-95">
                              {buttonLabels[order.status]}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs" />
          <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-amber-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-sans text-xl font-black text-zinc-950">Pedido #{selectedOrder.orderNumber}</h2>
                <p className="text-xs font-semibold text-zinc-500">{timeAgo(selectedOrder.placedAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-amber-100">
                <X className="h-5 w-5 text-zinc-950" />
              </button>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-amber-50/80 p-4 border border-amber-200">
              {selectedOrder.customerName && (
                <p className="text-sm font-black text-zinc-950">{selectedOrder.customerName}</p>
              )}
              {selectedOrder.customerPhone && (
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Phone className="h-4 w-4 text-zinc-500" />
                  <a href={`tel:${selectedOrder.customerPhone}`} className="text-[#D99F16] hover:underline">{selectedOrder.customerPhone}</a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-800">
                {selectedOrder.orderType === 'DELIVERY' ? <Truck className="h-4 w-4 text-emerald-600" /> : <Store className="h-4 w-4 text-[#D99F16]" />}
                <span>{selectedOrder.orderType === 'DELIVERY' ? '🛵 Domicilio' : '🏪 Recoger en tienda'}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="mt-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E50909]" />
                    <p className="text-sm font-black text-zinc-950">Dirección de Entrega:</p>
                  </div>
                  <div className="mt-1 overflow-hidden rounded-xl border border-amber-300">
                    <iframe
                      width="100%"
                      height="180"
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(selectedOrder.deliveryAddress)}&output=embed`}
                      className="border-0"
                    />
                  </div>
                  <p className="mt-1 text-xs font-bold text-zinc-700">{selectedOrder.deliveryAddress}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="mb-2 font-black text-zinc-950">Productos</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl bg-amber-50/50 p-3 text-sm border border-amber-200">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F4BE2C] text-xs font-black text-zinc-950">{item.quantity}×</span>
                      <div>
                        <p className="font-black text-zinc-950">{item.productName}</p>
                        {item.notes && <p className="text-xs italic text-zinc-500">"{item.notes}"</p>}
                      </div>
                    </div>
                    <span className="font-black text-zinc-950">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-300 bg-gradient-to-br from-[#FFFDF0] to-[#FFF9D6] p-4">
              <div className="flex justify-between"><span className="font-black text-zinc-950">Total</span><span className="font-sans text-xl font-black text-zinc-950">{formatPrice(selectedOrder.total)}</span></div>
            </div>

            {statusFlow[selectedOrder.status] && (
              <button onClick={() => { advance(selectedOrder._id, selectedOrder.status); setSelectedOrder(null) }}
                className="mt-4 w-full rounded-2xl bg-[#F4BE2C] py-3 text-sm font-black text-zinc-950 hover:bg-amber-400 shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>{buttonLabels[selectedOrder.status]}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
