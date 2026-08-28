'use client'

import { useState } from 'react'
import { AlertCircle, RefreshCw, X, MapPin, Phone, Package, Truck, Store, Clock } from 'lucide-react'
import { formatPrice, timeAgo, cn } from '@/lib/utils'
import { useAdminOrders, type AdminOrder } from '@/hooks/use-admin-orders'

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-amber-100 text-amber-800 border border-amber-300' },
  ACCEPTED: { label: 'Aceptado', color: 'bg-blue-100 text-blue-800 border border-blue-300' },
  PREPARING: { label: 'En preparación', color: 'bg-yellow-100 text-yellow-800 border border-amber-400 font-bold' },
  READY: { label: 'Listo para entrega', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300' },
  OUT_FOR_DELIVERY: { label: 'En reparto', color: 'bg-indigo-100 text-indigo-800 border border-indigo-300' },
  DELIVERED: { label: 'Entregado', color: 'bg-zinc-100 text-zinc-700 border border-zinc-300' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800 border border-red-300' },
}

const statusFlow: Record<string, string> = {
  PENDING: 'ACCEPTED',
  ACCEPTED: 'PREPARING',
  PREPARING: 'READY',
  READY: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
}

const statusButtonLabels: Record<string, string> = {
  PENDING: 'Aceptar pedido',
  ACCEPTED: 'Empezar preparación',
  PREPARING: 'Marcar como listo',
  READY: 'Enviar a domicilio',
  OUT_FOR_DELIVERY: 'Marcar entregado',
}

const filterOptions = [
  { id: 'ALL', label: 'Todos' },
  { id: 'ACTIVE', label: 'Activos' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'ACCEPTED', label: 'Aceptados' },
  { id: 'PREPARING', label: 'En preparación' },
  { id: 'READY', label: 'Listos' },
  { id: 'OUT_FOR_DELIVERY', label: 'En reparto' },
  { id: 'DELIVERED', label: 'Entregados' },
  { id: 'CANCELLED', label: 'Cancelados' },
]

export default function AdminOrdersPage() {
  const { orders, loading, newOrderIds, refetch, updateStatus } = useAdminOrders()
  const [filter, setFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  const filtered = filter === 'ALL'
    ? orders
    : filter === 'ACTIVE'
    ? orders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status))
    : filter === 'PENDING'
    ? orders.filter((o) => ['PENDING', 'ACCEPTED'].includes(o.status))
    : orders.filter((o) => o.status === filter)

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F4BE2C] border-t-transparent" /></div>
  }

  const handleAdvance = async (orderId: string, currentStatus: string) => {
    const next = statusFlow[currentStatus]
    if (next) await updateStatus(orderId, next)
  }

  const handleCancel = async (orderId: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      await updateStatus(orderId, 'CANCELLED')
      if (selectedOrder?._id === orderId) setSelectedOrder(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-black text-zinc-950">Gestión de Pedidos (Admin)</h1>
          <p className="mt-1 text-sm font-semibold text-zinc-500">{orders.length} pedidos en total · {orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length} activos</p>
        </div>
        <button onClick={refetch} className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300 bg-white hover:bg-amber-50 shadow-xs" aria-label="Actualizar">
          <RefreshCw className="h-4 w-4 text-zinc-800" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filterOptions.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={cn('shrink-0 rounded-xl px-3.5 py-2 text-xs font-black transition-all shadow-xs', filter === f.id ? 'bg-[#F4BE2C] text-zinc-950 shadow-sm' : 'bg-white border border-amber-200 text-zinc-700 hover:bg-amber-50')}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-zinc-400" />
          <p className="mt-4 text-base font-black text-zinc-950">No hay pedidos registrados</p>
          <p className="text-xs font-semibold text-zinc-500">Los nuevos pedidos recibidos aparecerán aquí en tiempo real</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-200 bg-amber-50/50 text-left text-xs font-black text-zinc-900 uppercase tracking-wider">
                <th className="p-4">Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Productos</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Total</th>
                <th className="p-4">Tiempo</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filtered.map((order) => {
                const isNew = newOrderIds.has(order._id)
                const canAdvance = statusFlow[order.status] !== undefined
                const canCancel = order.status === 'PENDING' || order.status === 'ACCEPTED'
                return (
                  <tr key={order._id} className={cn('hover:bg-amber-50/60 transition-colors', isNew && 'bg-amber-100/50')}>
                    <td className="p-4 font-black text-zinc-950 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      #{order.orderNumber}
                      {isNew && <span className="ml-2 rounded-full bg-[#E50909] px-2 py-0.5 text-[10px] font-black text-white shadow-xs">NUEVO</span>}
                    </td>
                    <td className="p-4 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <p className="text-sm font-bold text-zinc-950">{order.customerName || '—'}</p>
                      {order.customerPhone && <p className="text-xs font-medium text-zinc-500">{order.customerPhone}</p>}
                    </td>
                    <td className="p-4">
                      <span className={cn('rounded-full px-3 py-1 text-xs font-black', statusLabels[order.status]?.color)}>
                        {statusLabels[order.status]?.label ?? order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-zinc-800">{order.items.length}</td>
                    <td className="p-4 font-bold text-zinc-800">{order.orderType === 'DELIVERY' ? '🛵 Domicilio' : '🏪 Recoger'}</td>
                    <td className="p-4 font-black text-zinc-950">{formatPrice(order.total)}</td>
                    <td className="p-4 font-semibold text-zinc-500">{timeAgo(order.placedAt)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-black text-zinc-950 hover:bg-amber-100">Ver</button>
                        {canAdvance && (
                          <button onClick={() => handleAdvance(order._id, order.status)} className="rounded-xl bg-[#F4BE2C] px-3 py-1 text-xs font-black text-zinc-950 hover:bg-amber-400 shadow-xs">
                            {statusButtonLabels[order.status] || 'Avanzar'}
                          </button>
                        )}
                        {canCancel && (
                          <button onClick={() => handleCancel(order._id)} className="rounded-xl border border-red-300 bg-red-50 px-3 py-1 text-xs font-black text-red-700 hover:bg-red-100">Cancelar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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

            {/* Status */}
            <div className="mt-4">
              <span className={cn('inline-block rounded-full px-3.5 py-1 text-xs font-black', statusLabels[selectedOrder.status]?.color)}>
                {statusLabels[selectedOrder.status]?.label}
              </span>
            </div>

            {/* Customer info */}
            <div className="mt-4 space-y-2 rounded-2xl bg-amber-50/80 p-4 border border-amber-200">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-[#D99F16]" />
                <span className="font-black text-zinc-950">{selectedOrder.customerName || 'Desconocido'}</span>
              </div>
              {selectedOrder.customerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-zinc-500" />
                  <a href={`tel:${selectedOrder.customerPhone}`} className="font-bold text-[#D99F16] hover:underline">{selectedOrder.customerPhone}</a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-800">
                {selectedOrder.orderType === 'DELIVERY' ? <Truck className="h-4 w-4 text-emerald-600" /> : <Store className="h-4 w-4 text-[#D99F16]" />}
                <span>{selectedOrder.orderType === 'DELIVERY' ? '🛵 Entrega a domicilio' : '🏪 Recoger en tienda'}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="flex items-start gap-2 text-sm pt-1">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E50909]" />
                  <div>
                    <p className="font-black text-zinc-950">Dirección de Entrega:</p>
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
                </div>
              )}
              {selectedOrder.notes && (
                <div className="flex items-start gap-2 text-sm pt-1">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                  <p className="text-xs font-semibold text-zinc-700 italic">"{selectedOrder.notes}"</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mt-4">
              <h3 className="mb-2 font-black text-zinc-950">Productos del Pedido</h3>
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

            {/* Total */}
            <div className="mt-4 rounded-2xl border border-amber-300 bg-gradient-to-br from-[#FFFDF0] to-[#FFF9D6] p-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="font-semibold text-zinc-600">Subtotal</span><span className="font-black text-zinc-950">{formatPrice(selectedOrder.subtotal)}</span></div>
                {selectedOrder.deliveryFee > 0 && <div className="flex justify-between"><span className="font-semibold text-zinc-600">Gastos de Envío</span><span className="font-black text-zinc-950">{formatPrice(selectedOrder.deliveryFee)}</span></div>}
                {selectedOrder.discount > 0 && <div className="flex justify-between text-emerald-700"><span className="font-semibold">Descuento</span><span className="font-black">-{formatPrice(selectedOrder.discount)}</span></div>}
                <div className="border-t border-amber-300 pt-2 flex justify-between"><span className="font-black text-zinc-950">Total</span><span className="font-sans text-xl font-black text-zinc-950">{formatPrice(selectedOrder.total)}</span></div>
              </div>
              <div className="mt-2 text-xs font-bold text-zinc-600">Método de Pago: {selectedOrder.paymentMethod}</div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              {statusFlow[selectedOrder.status] && (
                <button onClick={() => { handleAdvance(selectedOrder._id, selectedOrder.status); setSelectedOrder(null) }}
                  className="flex-1 rounded-2xl bg-[#F4BE2C] py-3 text-sm font-black text-zinc-950 hover:bg-amber-400 shadow-md transition-transform active:scale-95">
                  {statusButtonLabels[selectedOrder.status]}
                </button>
              )}
              {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'ACCEPTED') && (
                <button onClick={() => handleCancel(selectedOrder._id)}
                  className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-black text-red-700 hover:bg-red-100">
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
