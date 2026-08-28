'use client'

import { Package, Euro, TrendingUp, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useOrderStore } from '@/lib/order-store'
import { products } from '@/data/menu-data'

export default function AdminAnalyticsPage() {
  const orders = useOrderStore((s) => s.orders)

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status))
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  const statusBreakdown: Record<string, number> = {}
  for (const o of orders) {
    statusBreakdown[o.status] = (statusBreakdown[o.status] ?? 0) + 1
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    PREPARING: 'Preparing',
    READY: 'Ready',
    OUT_FOR_DELIVERY: 'On the way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  }

  const topProducts = products.filter(p => p.isPopular).slice(0, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Analytics</h1>
        <p className="mt-1 text-sm text-muted">Restaurant performance overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <Package className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-medium text-muted">Total orders</p>
          <p className="font-display text-2xl font-bold text-charcoal">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <Euro className="h-6 w-6 text-success" />
          <p className="mt-2 text-sm font-medium text-muted">Total revenue</p>
          <p className="font-display text-2xl font-bold text-charcoal">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <TrendingUp className="h-6 w-6 text-saffron-dark" />
          <p className="mt-2 text-sm font-medium text-muted">Avg order value</p>
          <p className="font-display text-2xl font-bold text-charcoal">{formatPrice(avgOrderValue)}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <Clock className="h-6 w-6 text-info" />
          <p className="mt-2 text-sm font-medium text-muted">Active orders</p>
          <p className="font-display text-2xl font-bold text-charcoal">{activeOrders.length}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status breakdown */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-display text-base font-bold text-charcoal">Orders by status</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted">No data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{statusLabels[status] ?? status}</span>
                  <span className="font-bold text-charcoal">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-display text-base font-bold text-charcoal">Popular products</h2>
          <div className="space-y-2">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-charcoal">{p.name}</span>
                <span className="font-bold text-primary">{formatPrice(p.basePrice)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
