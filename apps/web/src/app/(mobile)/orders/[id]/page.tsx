'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Check, Clock, Truck, Package, Home, AlertCircle, Store, MapPin, Phone, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, formatTime, cn } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'
import { useOrder, cancelOrder } from '@/hooks/use-orders'
import { getAccessToken } from '@/lib/api-client'
import { restaurantInfo } from '@/data/menu-data'
import { TrackingMap } from '@/components/order/tracking-map'

const timeline = [
  { status: 'PENDING', label: 'Order placed', icon: Package },
  { status: 'ACCEPTED', label: 'Restaurant confirmed', icon: Check },
  { status: 'PREPARING', label: 'Preparing your order', icon: Clock },
  { status: 'READY', label: 'Ready for pickup', icon: Check },
  { status: 'OUT_FOR_DELIVERY', label: 'On the way', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered', icon: Home },
]

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { order, loading, error } = useOrder(params.id)
  const isLoggedIn = typeof window !== 'undefined' && getAccessToken()

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <LogIn className="h-12 w-12 text-subtle" />
        <p className="mt-4 text-lg font-semibold text-charcoal">Login required</p>
        <Link href="/profile/login" className="mt-4"><Button>Log in</Button></Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <Link href="/orders" className="touch-target -ml-2 flex items-center justify-center rounded-full">
              <ChevronLeft className="h-6 w-6 text-charcoal" />
            </Link>
            <h1 className="font-display text-xl font-extrabold text-charcoal">Order</h1>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="h-12 w-12 text-danger" />
        <p className="mt-4 text-lg font-semibold text-charcoal">Could not load order</p>
        <Link href="/orders" className="mt-4"><Button variant="outline">View my orders</Button></Link>
      </div>
    )
  }

  const isCancelled = order.status === 'CANCELLED'
  const isDelivery = order.orderType === 'DELIVERY'
  const activeStep = isCancelled ? -1 : timeline.findIndex((t) => t.status === order.status)
  const eta = order.estimatedDeliveryAt
    ? new Date(order.estimatedDeliveryAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '25-35 min'

  const handleCancel = async () => {
    if (order.status !== 'PENDING' && order.status !== 'ACCEPTED') {
      toast.error('Cannot cancel order in preparation')
      return
    }
    try {
      await cancelOrder(order._id)
      toast.success('Order cancelled')
      router.push('/orders')
    } catch (e: any) {
      toast.error(e.message || 'Could not cancel order')
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/orders" className="touch-target -ml-2 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-6 w-6 text-charcoal" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-extrabold text-charcoal">Order #{order.orderNumber}</h1>
            <p className="text-xs text-muted">{formatTime(order.placedAt)}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4">
        {!isCancelled && (
          <div className="mb-5 rounded-2xl bg-primary-50 p-4 text-center">
            <p className="text-xs font-medium text-muted">
              {isDelivery ? 'Estimated delivery time' : 'Estimated preparation time'}
            </p>
            <p className="font-display text-2xl font-extrabold text-primary">{eta}</p>
            <p className="mt-1 text-xs text-muted">
              {isDelivery ? '🛵 Free home delivery' : '🏪 In-store pickup'}
            </p>
          </div>
        )}

        {isCancelled && (
          <div className="mb-5 rounded-2xl bg-danger/10 p-4 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-danger" />
            <p className="mt-2 text-sm font-bold text-danger">Order cancelled</p>
          </div>
        )}

        {/* Live tracking map */}
        {order.deliveryAddress && (
          <TrackingMap
            deliveryAddress={order.deliveryAddress}
            status={order.status}
            orderType={order.orderType}
          />
        )}

        <div className="mb-6">
          <h2 className="mb-4 font-display text-base font-bold text-charcoal">Order status</h2>
          <div className="relative">
            {timeline.map((step, i) => {
              const Icon = step.icon
              const reached = !isCancelled && i <= activeStep
              const isCurrent = !isCancelled && i === activeStep
              const tsField = `${step.status.toLowerCase()}At` as keyof typeof order
              const timestamp = order[tsField] as string | null
              return (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                      reached ? 'bg-primary text-white' : 'bg-surface-alt text-subtle',
                      isCurrent && 'ring-4 ring-primary/20',
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={cn('my-1 w-0.5 flex-1 min-h-8 rounded', !isCancelled && i < activeStep ? 'bg-primary' : 'bg-border')} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={cn('text-sm font-semibold', reached ? 'text-charcoal' : 'text-subtle', isCurrent && 'text-primary')}>{step.label}</p>
                    {timestamp && <p className="text-xs text-muted">{formatTime(timestamp)}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {isDelivery && order.deliveryAddress && (
          <div className="mb-4 rounded-2xl border border-border p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-charcoal">
              <MapPin className="h-4 w-4 text-primary" /> Delivery address
            </h3>
            <p className="text-sm text-muted">{order.deliveryAddress}</p>
          </div>
        )}

        <div className="rounded-2xl border border-border p-4">
          <h2 className="mb-3 font-display text-base font-bold text-charcoal">Order details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Type</span>
              <span className="font-medium text-charcoal">{isDelivery ? 'Delivery' : 'Store pickup'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment</span>
              <span className="font-medium text-charcoal">
                {order.paymentMethod === 'CASH' ? 'Cash' : order.paymentMethod === 'CARD' ? 'Card' : order.paymentMethod}
              </span>
            </div>
            <div className="border-t border-border pt-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span className="text-muted">{item.quantity}× {item.productName}</span>
                  <span className="font-medium">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-2 space-y-1">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-medium">{formatPrice(order.subtotal)}</span></div>
              {order.deliveryFee > 0 && <div className="flex justify-between"><span className="text-muted">Delivery</span><span className="font-medium">{formatPrice(order.deliveryFee)}</span></div>}
              <div className="flex justify-between"><span className="font-bold text-charcoal">Total</span><span className="font-bold text-primary">{formatPrice(order.total)}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-surface-alt p-4">
          <h3 className="mb-2 text-sm font-bold text-charcoal">{restaurantInfo.name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Phone className="h-3.5 w-3.5" />
            <a href={`tel:${restaurantInfo.phone1}`} className="font-medium text-primary">{restaurantInfo.phone1}</a>
            <span>·</span>
            <a href={`tel:${restaurantInfo.phone2}`} className="font-medium text-primary">{restaurantInfo.phone2}</a>
          </div>
          <p className="mt-1 text-xs text-muted">🕒 {restaurantInfo.deliveryHours}</p>
        </div>

        <div className="mt-5 space-y-3">
          {(order.status === 'PENDING' || order.status === 'ACCEPTED') && (
            <Button variant="danger" fullWidth onClick={handleCancel}>Cancel order</Button>
          )}
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => router.push('/')}>Home</Button>
            <Button variant="secondary" fullWidth onClick={() => router.push('/menu')}>Order again</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
