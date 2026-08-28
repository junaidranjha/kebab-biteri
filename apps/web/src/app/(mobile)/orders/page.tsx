'use client'

import Link from 'next/link'
import { ChevronLeft, Package, Clock, CheckCircle2, Truck, AlertCircle, Store, LogIn } from 'lucide-react'
import { formatPrice, timeAgo, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useOrders } from '@/hooks/use-orders'
import { getAccessToken } from '@/lib/api-client'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function OrdersPage() {
  const { orders, loading, error } = useOrders()
  const { t } = useI18n()
  const isLoggedIn = typeof window !== 'undefined' && getAccessToken()

  const statusConfig: Record<string, { labelKey: string; icon: typeof Clock; color: string }> = {
    PENDING: { labelKey: 'orders.pending', icon: Clock, color: 'text-amber-700' },
    ACCEPTED: { labelKey: 'orders.accepted', icon: CheckCircle2, color: 'text-blue-700' },
    PREPARING: { labelKey: 'orders.preparing', icon: Clock, color: 'text-[#D99F16]' },
    READY: { labelKey: 'orders.ready', icon: CheckCircle2, color: 'text-emerald-700' },
    OUT_FOR_DELIVERY: { labelKey: 'orders.outForDelivery', icon: Truck, color: 'text-blue-700' },
    DELIVERED: { labelKey: 'orders.delivered', icon: CheckCircle2, color: 'text-emerald-700' },
    CANCELLED: { labelKey: 'orders.cancelled', icon: AlertCircle, color: 'text-[#E50909]' },
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="safe-top sticky top-0 z-20 bg-white px-4 pb-3 pt-3 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="touch-target -ml-2 flex items-center justify-center rounded-full">
                <ChevronLeft className="h-6 w-6 text-zinc-950" />
              </Link>
              <h1 className="font-sans text-xl font-black text-zinc-950">{t('orders.title')}</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F4BE2C]/20 border border-amber-300">
            <LogIn className="h-10 w-10 text-[#D99F16]" />
          </div>
          <p className="mt-4 text-xl font-black text-zinc-950">{t('orders.loginRequired')}</p>
          <p className="mt-1 text-sm font-medium text-zinc-500">{t('orders.loginPrompt')}</p>
          <Link href="/profile/login?redirect=/orders" className="mt-6">
            <Button size="lg" className="font-black">{t('orders.loginBtn')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 lg:top-[65px] z-20 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-lg border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="touch-target -ml-2 flex items-center justify-center rounded-full">
              <ChevronLeft className="h-6 w-6 text-zinc-950" />
            </Link>
            <h1 className="font-sans text-xl font-black text-zinc-950">{t('orders.title')}</h1>
            {orders.length > 0 && (
              <span className="ml-2 rounded-full bg-[#F4BE2C] px-3 py-0.5 text-xs font-black text-zinc-950 shadow-sm">
                {orders.length}
              </span>
            )}
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex-1 px-4 py-4 pb-28">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F4BE2C] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-12 w-12 text-[#E50909]" />
            <p className="mt-4 text-base font-black text-zinc-950">Error</p>
            <p className="text-xs text-zinc-500 font-medium">Please check your connection and try again</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F4BE2C]/20 border border-amber-300">
              <Package className="h-12 w-12 text-[#D99F16]" />
            </div>
            <p className="mt-4 text-xl font-black text-zinc-950">{t('orders.empty')}</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">{t('orders.emptyDesc')}</p>
            <Link href="/menu" className="mt-6">
              <Button size="lg" className="font-black">{t('orders.makeOrder')}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.PENDING
              const StatusIcon = status.icon
              return (
                <Link key={order._id} href={`/orders/${order._id}`} className="card-app block p-4 border border-amber-200 hover:border-amber-400 active:scale-[0.99] transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-black text-zinc-950">Order #{order.orderNumber}</p>
                      <p className="mt-0.5 text-xs font-semibold text-zinc-500">{timeAgo(order.placedAt)}</p>
                    </div>
                    <span className={cn('flex items-center gap-1 text-xs font-black rounded-full px-2.5 py-1 bg-amber-100/80', status.color)}>
                      <StatusIcon className="h-3.5 w-3.5" />{t(status.labelKey as any)}
                    </span>
                  </div>
                  <div className="mt-3 border-t border-amber-100 pt-2.5">
                    <p className="text-xs font-medium text-zinc-600 line-clamp-2">{order.items.map((i) => `${i.quantity}× ${i.productName}`).join(' · ')}</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-base font-black text-zinc-950">{formatPrice(order.total)}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-zinc-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {order.orderType === 'DELIVERY' ? <Truck className="h-3.5 w-3.5 text-emerald-600" /> : <Store className="h-3.5 w-3.5 text-[#D99F16]" />}
                        {order.orderType === 'DELIVERY' ? t('checkout.delivery') : t('checkout.pickup')}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
