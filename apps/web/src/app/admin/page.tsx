'use client'

import Link from 'next/link'
import { Package, Euro, Clock, ChefHat, ArrowRight, TrendingUp, ShoppingBag } from 'lucide-react'
import { formatPrice, timeAgo, cn } from '@/lib/utils'
import { useAdminOrders, type AdminOrder } from '@/hooks/use-admin-orders'
import { products } from '@/data/menu-data'

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-warning/10 text-warning' },
  ACCEPTED: { label: 'Accepted', color: 'bg-info/10 text-info' },
  PREPARING: { label: 'Preparing', color: 'bg-primary/10 text-primary' },
  READY: { label: 'Ready', color: 'bg-success/10 text-success' },
  OUT_FOR_DELIVERY: { label: 'On the way', color: 'bg-info/10 text-info' },
  DELIVERED: { label: 'Delivered', color: 'bg-charcoal-100 text-charcoal-600' },
  CANCELLED: { label: 'Cancelled', color: 'bg-danger/10 text-danger' },
}

export default function AdminDashboard() {
  const { orders, loading, newOrderIds } = useAdminOrders()

  const activeOrders = orders.filter((o: AdminOrder) => !['DELIVERED', 'CANCELLED'].includes(o.status))
  const totalRevenue = orders.filter((o: AdminOrder) => o.status !== 'CANCELLED').reduce((sum: number, o: AdminOrder) => sum + o.total, 0)
  const recentOrders = orders.slice(0, 5)
  const popularProducts = products.filter(p => p.isPopular).slice(0, 5)
  const hasNewOrders = newOrderIds.size > 0

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const stats = [
    { label: 'Orders today', value: String(orders.length), icon: Package, color: 'text-amber-500' },
    { label: 'Active orders', value: String(activeOrders.length), icon: Clock, color: 'text-[#D99F16]' },
    { label: 'Revenue', value: formatPrice(totalRevenue), icon: Euro, color: 'text-emerald-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-black text-zinc-950">Dashboard Overview</h1>
        <p className="mt-1 text-sm font-semibold text-zinc-500">Live operational stats for Kebab Biteri</p>
      </div>

      {hasNewOrders && (
        <div className="rounded-2xl border border-amber-300 bg-[#F4BE2C]/15 p-4 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#E50909]" />
            <p className="text-sm font-black text-zinc-950">
              ⚡ {newOrderIds.size} new order{newOrderIds.size !== 1 ? 's' : ''} received!
            </p>
          </div>
          <Link href="/admin/orders" className="mt-2 inline-flex items-center gap-1 text-xs font-black uppercase text-zinc-950 underline">
            View orders <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-500">{stat.label}</p>
                  <p className="mt-1 font-sans text-3xl font-black text-zinc-950">{stat.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                  <Icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {activeOrders.length > 0 ? (
        <div className="rounded-2xl border border-amber-300 bg-[#F4BE2C] p-4 shadow-sm text-zinc-950">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 stroke-[2.5]" />
            <p className="text-sm font-black">
              {activeOrders.length} order{activeOrders.length !== 1 ? 's' : ''} currently in preparation
            </p>
          </div>
          <Link href="/admin/kitchen" className="mt-2 inline-flex items-center gap-1 text-xs font-black uppercase underline">
            Open Kitchen Display (KDS) <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-zinc-400" />
            <p className="text-sm font-bold text-zinc-900">No active orders</p>
          </div>
          <p className="mt-1 text-xs font-medium text-zinc-500">New customer orders will automatically appear here</p>
        </div>
      )}

      <div className="rounded-2xl border border-amber-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-amber-100 p-4">
          <h2 className="font-sans text-base font-black text-zinc-950">Recent Orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-black uppercase text-amber-600 hover:underline">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-amber-100">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="mx-auto h-10 w-10 text-zinc-300" />
              <p className="mt-2 text-sm font-bold text-zinc-900">No orders yet</p>
              <p className="text-xs text-zinc-500">Incoming orders will show up here</p>
            </div>
          ) : recentOrders.map((order: AdminOrder) => {
            const isNew = newOrderIds.has(order._id)
            return (
              <div key={order._id} className={cn('flex items-center justify-between p-4', isNew && 'bg-amber-50')}>
                <div>
                  <p className="text-sm font-black text-zinc-950">
                    #{order.orderNumber}
                    {isNew && <span className="ml-2 rounded-full bg-[#E50909] px-2 py-0.5 text-[10px] font-black text-white">NEW</span>}
                  </p>
                  <p className="text-xs font-medium text-zinc-500">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {timeAgo(order.placedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', statusLabels[order.status]?.color)}>
                    {statusLabels[order.status]?.label ?? order.status}
                  </span>
                  <span className="text-sm font-black text-zinc-950">{formatPrice(order.total)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-sans text-base font-black text-zinc-950">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Link href="/admin/kitchen" className="flex flex-col items-center gap-2 rounded-2xl border border-amber-200/80 bg-white p-5 transition-all hover:border-[#F4BE2C] hover:shadow-md group">
            <ChefHat className="h-8 w-8 text-[#F4BE2C] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-zinc-950">Kitchen KDS</span>
          </Link>
          <Link href="/admin/orders" className="flex flex-col items-center gap-2 rounded-2xl border border-amber-200/80 bg-white p-5 transition-all hover:border-[#F4BE2C] hover:shadow-md group">
            <Package className="h-8 w-8 text-[#F4BE2C] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-zinc-950">Orders</span>
          </Link>
          <Link href="/admin/menu" className="flex flex-col items-center gap-2 rounded-2xl border border-amber-200/80 bg-white p-5 transition-all hover:border-[#F4BE2C] hover:shadow-md group">
            <ShoppingBag className="h-8 w-8 text-[#F4BE2C] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-zinc-950">Menu Manager</span>
          </Link>
          <Link href="/admin/analytics" className="flex flex-col items-center gap-2 rounded-2xl border border-amber-200/80 bg-white p-5 transition-all hover:border-[#F4BE2C] hover:shadow-md group">
            <TrendingUp className="h-8 w-8 text-[#F4BE2C] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-zinc-950">Analytics</span>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-amber-100 p-4">
          <h2 className="font-sans text-base font-black text-zinc-950">Top Selling Products</h2>
        </div>
        <div className="divide-y divide-amber-100">
          {popularProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-black text-zinc-950">{p.name}</p>
                <p className="text-xs font-semibold text-zinc-500">{p.category}</p>
              </div>
              <span className="text-sm font-black text-zinc-950">{formatPrice(p.basePrice)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
