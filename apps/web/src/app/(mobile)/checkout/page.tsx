'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MapPin, CreditCard, Wallet, Banknote, Smartphone, Truck, Store, LogIn, User, Phone as PhoneIcon, StickyNote, Sparkles, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { createOrder } from '@/hooks/use-orders'
import { Button } from '@/components/ui/button'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'
import { getAccessToken } from '@/lib/api-client'
import { restaurantInfo } from '@/data/menu-data'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

const MIN_FREE_DELIVERY = 11.00
const STANDARD_DELIVERY_FEE = 2.50

const paymentMethods: { id: string; labelKey: string; icon: typeof CreditCard }[] = [
  { id: 'CASH', labelKey: 'checkout.cash', icon: Banknote },
  { id: 'CARD', labelKey: 'checkout.card', icon: CreditCard },
  { id: 'APPLE_PAY', labelKey: 'checkout.applePay', icon: Smartphone },
  { id: 'GOOGLE_PAY', labelKey: 'checkout.googlePay', icon: Wallet },
  { id: 'BIZUM', labelKey: 'checkout.bizum', icon: Wallet },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { t, locale } = useI18n()
  const [step, setStep] = useState(0)
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [placing, setPlacing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const steps = [t('checkout.delivery'), t('checkout.summary'), t('checkout.payment')] as const

  useState(() => {
    setIsLoggedIn(!!getAccessToken())
  })

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
  const isFreeDelivery = subtotal >= MIN_FREE_DELIVERY || orderType === 'PICKUP'
  const under11Difference = (orderType === 'DELIVERY' && subtotal < MIN_FREE_DELIVERY) ? (MIN_FREE_DELIVERY - subtotal) : 0
  const deliveryFee = orderType === 'DELIVERY' ? (subtotal >= MIN_FREE_DELIVERY ? 0 : STANDARD_DELIVERY_FEE) : 0
  const total = subtotal + under11Difference + deliveryFee

  if (isLoggedIn === false) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F4BE2C]/20 border border-amber-300">
          <LogIn className="h-10 w-10 text-[#D99F16]" />
        </div>
        <h1 className="mt-4 font-sans text-xl font-black text-zinc-950">{t('orders.loginRequired')}</h1>
        <p className="mt-2 text-sm font-medium text-zinc-500">{t('orders.loginPrompt')}</p>
        <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
          <Link href="/profile/login?redirect=/checkout">
            <Button size="lg" fullWidth className="font-black">{t('orders.loginBtn')}</Button>
          </Link>
          <Link href="/menu">
            <Button variant="outline" size="lg" fullWidth className="font-black">{t('product.backToMenu')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0 && isLoggedIn) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-black text-zinc-950">{t('cart.empty')}</p>
        <Button className="mt-4 font-black" onClick={() => router.push('/menu')}>{t('cart.viewMenu')}</Button>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (orderType === 'DELIVERY' && !address.trim()) {
      toast.error(locale === 'es-ES' ? 'Por favor introduce la dirección de entrega' : 'Please enter a delivery address')
      return
    }
    if (!name.trim()) {
      toast.error(locale === 'es-ES' ? 'Por favor introduce tu nombre' : 'Please enter your name')
      return
    }
    if (!phone.trim()) {
      toast.error(locale === 'es-ES' ? 'Por favor introduce tu teléfono' : 'Please enter your phone number')
      return
    }

    setPlacing(true)

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        variantId: item.variantId ?? undefined,
        variantName: item.variantName ?? undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        modifierOptionIds: item.modifiers.map((m) => m.optionId),
        notes: item.notes ?? undefined,
      }))

      // Always format notes in Spanish for the admin kitchen view
      let fullNotes = `Cliente: ${name}, Teléfono: ${phone}`
      if (under11Difference > 0) {
        fullNotes += ` | Recargo mínimo <11€: ${formatPrice(under11Difference)}`
      }
      if (notes.trim()) {
        fullNotes += ` | Notas: ${notes.trim()}`
      }

      const order = await createOrder({
        items: orderItems,
        orderType,
        paymentMethod,
        deliveryAddress: orderType === 'DELIVERY' ? address.trim() : undefined,
        notes: fullNotes,
      })

      toast.success(locale === 'es-ES' ? '¡Pedido confirmado! 🎉' : 'Order confirmed! 🎉')
      clearCart()
      router.push(`/orders/${order._id}`)
    } catch (err: any) {
      const msg = err?.message ?? (locale === 'es-ES' ? 'No se pudo completar el pedido' : 'Could not complete the order')
      if (err?.statusCode === 401) {
        toast.error(t('orders.loginPrompt'))
        router.push('/profile/login?redirect=/checkout')
      } else {
        toast.error(msg)
      }
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 lg:top-[65px] z-20 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-lg border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="touch-target -ml-2 flex items-center justify-center rounded-full">
                <ChevronLeft className="h-6 w-6 text-zinc-950" />
              </button>
            ) : (
              <Link href="/cart" className="touch-target -ml-2 flex items-center justify-center rounded-full">
                <ChevronLeft className="h-6 w-6 text-zinc-950" />
              </Link>
            )}
            <h1 className="font-sans text-xl font-black text-zinc-950">{t('checkout.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
        {/* Step indicator */}
        <div className="mt-3 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-black',
                i <= step ? 'bg-[#F4BE2C] text-zinc-950 shadow-sm' : 'bg-amber-100/60 text-zinc-400',
              )}>
                {i + 1}
              </div>
              <span className={cn('text-xs font-bold', i <= step ? 'text-zinc-950' : 'text-zinc-400')}>{s}</span>
              {i < steps.length - 1 && <div className={cn('h-0.5 flex-1 rounded', i < step ? 'bg-[#F4BE2C]' : 'bg-amber-200')} />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 py-4 pb-32">
        {/* Step 0: Delivery info */}
        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            {/* Order type */}
            <div>
              <h2 className="mb-3 font-sans text-base font-black text-zinc-950">{t('checkout.orderType')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setOrderType('DELIVERY')} className={cn('flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all', orderType === 'DELIVERY' ? 'border-[#F4BE2C] bg-[#FFFDF0] shadow-sm' : 'border-amber-200 bg-white')}>
                  <Truck className={cn('h-6 w-6', orderType === 'DELIVERY' ? 'text-[#D99F16]' : 'text-zinc-400')} />
                  <span className="text-sm font-black text-zinc-950">{t('checkout.delivery')}</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {isFreeDelivery ? t('checkout.freeDeliveryLabel') : `+${formatPrice(STANDARD_DELIVERY_FEE)}`}
                  </span>
                </button>
                <button onClick={() => setOrderType('PICKUP')} className={cn('flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all', orderType === 'PICKUP' ? 'border-[#F4BE2C] bg-[#FFFDF0] shadow-sm' : 'border-amber-200 bg-white')}>
                  <Store className={cn('h-6 w-6', orderType === 'PICKUP' ? 'text-[#D99F16]' : 'text-zinc-400')} />
                  <span className="text-sm font-black text-zinc-950">{t('checkout.pickup')}</span>
                  <span className="text-xs font-semibold text-zinc-500">GRATIS</span>
                </button>
              </div>

              {/* Delivery Fee & Under 11 Notice Box */}
              {orderType === 'DELIVERY' && (
                <div className="mt-3 rounded-2xl p-3.5 border border-amber-300 bg-amber-50/90 text-xs shadow-2xs">
                  {subtotal >= MIN_FREE_DELIVERY ? (
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{t('cart.freeDeliveryUnlocked')}</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5 text-amber-950 font-bold">
                      <AlertCircle className="h-4 w-4 text-[#E50909] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-black text-zinc-950">
                          {locale === 'es-ES'
                            ? `Subtotal comida: ${formatPrice(subtotal)} (Mínimo requerido 11,00€)`
                            : `Food Subtotal: ${formatPrice(subtotal)} (Minimum requirement €11.00)`}
                        </p>
                        <p className="text-[11px] font-semibold text-amber-900">
                          {locale === 'es-ES'
                            ? `Se añade un recargo de ${formatPrice(under11Difference)} para completar los 11,00€ + ${formatPrice(STANDARD_DELIVERY_FEE)} de envío.`
                            : `Difference charge of ${formatPrice(under11Difference)} is added to reach €11.00 minimum + ${formatPrice(STANDARD_DELIVERY_FEE)} delivery fee.`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact info */}
            <div>
              <h2 className="mb-3 font-sans text-base font-black text-zinc-950">{t('checkout.contactInfo')}</h2>
              <div className="space-y-3">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('checkout.namePlaceholder')}
                    className="h-12 w-full rounded-xl border border-amber-300 bg-amber-50/30 pl-11 pr-4 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/40" />
                </div>
                {/* Phone */}
                <div className="relative">
                  <PhoneIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                  <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('checkout.phonePlaceholder')}
                    className="h-12 w-full rounded-xl border border-amber-300 bg-amber-50/30 pl-11 pr-4 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/40" />
                </div>
              </div>
            </div>

            {/* Delivery address with map */}
            {orderType === 'DELIVERY' && (
              <div>
                <h2 className="mb-3 font-sans text-base font-black text-zinc-950">{t('checkout.address')}</h2>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-[#E50909]" />
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
                    placeholder={t('checkout.addressPlaceholder')}
                    className="w-full resize-none rounded-xl border border-amber-300 bg-amber-50/30 pl-11 pr-4 py-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/40" />
                </div>

                {/* Use my location button */}
                <button onClick={() => {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`
                        setAddress(prev => prev ? `${prev} (GPS: ${coords})` : `GPS: ${coords}`)
                        toast.success('Ubicación añadida / Location added')
                      },
                      () => toast.error('Error al obtener ubicación / Location error'),
                    )
                  }
                }} className="mt-2 flex items-center gap-2 text-xs font-black text-[#D99F16] hover:underline">
                  <MapPin className="h-4 w-4" /> {t('checkout.useLocation')}
                </button>

                {/* Google Maps preview */}
                {address.trim() && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-amber-200">
                    <iframe
                      width="100%"
                      height="160"
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(address.replace('GPS: ', ''))}&output=embed`}
                      className="border-0"
                      title="Delivery location map"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Delivery notes */}
            <div>
              <h2 className="mb-3 font-sans text-base font-black text-zinc-950 flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-zinc-500" /> {t('checkout.deliveryNotes')}
              </h2>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                placeholder={t('checkout.notesPlaceholder')}
                className="w-full resize-none rounded-xl border border-amber-300 bg-amber-50/30 px-4 py-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none" />
            </div>
          </div>
        )}

        {/* Step 1: Summary */}
        {step === 1 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="font-sans text-base font-black text-zinc-950">{t('checkout.summary')}</h2>

            {/* Contact info recap */}
            <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-sm">
              <p className="font-black text-zinc-950">{name}</p>
              <p className="text-xs font-semibold text-zinc-600">📞 {phone}</p>
              {orderType === 'DELIVERY' && address && (
                <p className="text-xs font-semibold text-zinc-600 mt-1">📍 {address}</p>
              )}
              {notes && <p className="text-xs italic text-zinc-600 mt-1">📝 {notes}</p>}
            </div>

            {/* Items */}
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-white border border-amber-200 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4BE2C] text-sm font-black text-zinc-950">{item.quantity}×</span>
                  <div>
                    <p className="text-sm font-black text-zinc-950">{item.productName}</p>
                    {item.variantName && <p className="text-xs font-semibold text-zinc-500">{item.variantName}</p>}
                    {item.modifiers.length > 0 && <p className="text-xs text-zinc-500">{item.modifiers.map((m) => m.optionName).join(', ')}</p>}
                  </div>
                </div>
                <span className="text-sm font-black text-zinc-950">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}

            {/* Total */}
            <div className="rounded-2xl bg-gradient-to-br from-[#FFFDF0] to-[#FFF9D6] border border-amber-300 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-semibold text-zinc-600">Subtotal comida</span><span className="font-black text-zinc-950">{formatPrice(subtotal)}</span></div>
                {under11Difference > 0 && (
                  <div className="flex justify-between text-amber-900"><span className="font-semibold">Recargo pedido &lt; 11,00€</span><span className="font-black">+{formatPrice(under11Difference)}</span></div>
                )}
                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-600">{t('cart.deliveryFee')}</span>
                    {deliveryFee === 0 ? <span className="font-black text-emerald-700">GRATIS / FREE</span> : <span className="font-black text-zinc-950">+{formatPrice(deliveryFee)}</span>}
                  </div>
                )}
                <div className="border-t border-amber-300/80 pt-2 flex justify-between"><span className="font-black text-zinc-950">{t('cart.total')}</span><span className="font-sans text-xl font-black text-zinc-950">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-sans text-base font-black text-zinc-950">{t('checkout.payment')}</h2>
            <div className="space-y-2">
              {paymentMethods.map((pm) => {
                const Icon = pm.icon
                return (
                  <button key={pm.id} onClick={() => setPaymentMethod(pm.id)} className={cn('flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 transition-all', paymentMethod === pm.id ? 'border-[#F4BE2C] bg-[#FFFDF0] shadow-sm' : 'border-amber-200 bg-white')}>
                    <Icon className="h-5 w-5 text-zinc-900" />
                    <span className="flex-1 text-left text-sm font-bold text-zinc-950">{t(pm.labelKey as any)}</span>
                    <div className={cn('flex h-5 w-5 items-center justify-center rounded-full border-2', paymentMethod === pm.id ? 'border-[#F4BE2C] bg-[#F4BE2C]' : 'border-amber-300')}>
                      {paymentMethod === pm.id && <div className="h-2 w-2 rounded-full bg-zinc-950" />}
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="rounded-2xl bg-amber-50/80 p-4 border border-amber-200">
              <p className="text-xs font-semibold text-zinc-700">{restaurantInfo.payment}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-64 z-30 app-container border-t border-amber-200 bg-white/95 p-4 backdrop-blur-lg safe-bottom pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {step < 2 ? (
          <Button size="xl" fullWidth onClick={() => {
            if (step === 0) {
              if (orderType === 'DELIVERY' && !address.trim()) { toast.error(locale === 'es-ES' ? 'Por favor introduce la dirección' : 'Please enter delivery address'); return }
              if (!name.trim()) { toast.error(locale === 'es-ES' ? 'Por favor introduce tu nombre' : 'Please enter your name'); return }
              if (!phone.trim()) { toast.error(locale === 'es-ES' ? 'Por favor introduce tu teléfono' : 'Please enter your phone number'); return }
            }
            setStep(step + 1)
          }} className="font-black">
            {t('checkout.continue')} →
          </Button>
        ) : (
          <Button size="xl" fullWidth loading={placing} onClick={handlePlaceOrder} disabled={placing} className="font-black">
            {placing ? t('checkout.placingOrder') : `${t('checkout.placeOrder')} · ${formatPrice(total)}`}
          </Button>
        )}
      </div>
    </div>
  )
}
