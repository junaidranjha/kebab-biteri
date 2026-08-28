'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Minus, Plus, Trash2, ShoppingBag, Truck, Sparkles, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

const MIN_ORDER_AMOUNT = 11.00
const STANDARD_DELIVERY_FEE = 2.50

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCartStore()
  const { t, locale } = useI18n()

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
  const isFreeDelivery = subtotal >= MIN_ORDER_AMOUNT
  const under11Difference = isFreeDelivery ? 0 : MIN_ORDER_AMOUNT - subtotal
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE) : 0
  const discount = 0
  const total = subtotal + under11Difference + deliveryFee - discount

  if (items.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="safe-top sticky top-0 lg:top-[65px] z-20 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-md border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="touch-target -ml-2 flex items-center justify-center rounded-full">
                <ChevronLeft className="h-6 w-6 text-zinc-900" />
              </Link>
              <h1 className="font-sans text-xl font-black text-zinc-950">{t('cart.title')}</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F4BE2C]/20 border border-amber-300">
            <ShoppingBag className="h-12 w-12 text-[#D99F16]" />
          </div>
          <p className="mt-4 text-xl font-black text-zinc-950">{t('cart.empty')}</p>
          <p className="mt-1 text-sm font-medium text-zinc-500">{t('cart.emptyDesc')}</p>
          <Button className="mt-6 font-black" size="lg" onClick={() => router.push('/menu')}>
            {t('cart.viewMenu')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 lg:top-[65px] z-20 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-lg border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/menu" className="touch-target -ml-2 flex items-center justify-center rounded-full">
              <ChevronLeft className="h-6 w-6 text-zinc-950" />
            </Link>
            <h1 className="font-sans text-xl font-black text-zinc-950">{t('cart.title')}</h1>
            <span className="ml-2 rounded-full bg-[#F4BE2C] px-3 py-0.5 text-xs font-black text-zinc-950 shadow-sm">
              {items.reduce((s, i) => s + i.quantity, 0)} {t('cart.items')}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex-1 px-4 py-4 pb-28">
        {/* Minimum Order Fee Banner (< 11€) */}
        <div className="mb-4 rounded-2xl p-3.5 border text-xs shadow-xs transition-all">
          {isFreeDelivery ? (
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border-emerald-300 p-3 rounded-xl">
              <Sparkles className="h-5 w-5 shrink-0 text-emerald-600" />
              <span className="font-black text-sm">{t('cart.freeDeliveryUnlocked')}</span>
            </div>
          ) : (
            <div className="space-y-2 bg-amber-50/95 border-amber-300 p-4 rounded-2xl border shadow-xs">
              <div className="flex items-start gap-2.5 text-amber-950">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#E50909] mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-zinc-950">
                    {locale === 'es-ES'
                      ? `Tu pedido de comida es de ${formatPrice(subtotal)}. El pedido mínimo es de 11,00€.`
                      : `Your food order is ${formatPrice(subtotal)}. Minimum food order requirement is €11.00.`}
                  </p>
                  <p className="text-xs font-bold text-amber-900 leading-relaxed">
                    {locale === 'es-ES'
                      ? `Para tramitar tu pedido por debajo de 11,00€, se incluye un recargo de ${formatPrice(under11Difference)} para alcanzar el mínimo de 11,00€ + ${formatPrice(STANDARD_DELIVERY_FEE)} de gastos de envío.`
                      : `To complete an order under €11.00, a difference charge of ${formatPrice(under11Difference)} is added to meet the €11.00 minimum + ${formatPrice(STANDARD_DELIVERY_FEE)} delivery fee.`}
                  </p>
                  <p className="text-[11px] font-black text-[#E50909] mt-1">
                    {locale === 'es-ES'
                      ? `💡 ¡Añade ${formatPrice(under11Difference)} más en productos para conseguir ENVÍO GRATIS!`
                      : `💡 Add ${formatPrice(under11Difference)} more food items for FREE delivery!`}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-amber-200/80 mt-2">
                <div
                  className="h-full bg-[#F4BE2C] transition-all duration-300 shadow-xs"
                  style={{ width: `${Math.min(100, (subtotal / MIN_ORDER_AMOUNT) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card-app flex gap-3 p-3 border border-amber-200">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-amber-50">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black text-zinc-950">{item.productName}</h3>
                    {item.variantName && (
                      <p className="text-xs font-semibold text-zinc-500">{item.variantName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="touch-target -mr-1 -mt-1 flex items-center justify-center text-red-500 hover:text-red-700"
                    aria-label={t('common.remove')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {item.modifiers.length > 0 && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 font-medium">
                    {item.modifiers.map((m) => m.optionName).join(', ')}
                  </p>
                )}
                {item.notes && (
                  <p className="mt-0.5 text-xs italic text-zinc-500">"{item.notes}"</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-base font-black text-zinc-950">{formatPrice(item.lineTotal)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-zinc-900 font-black active:scale-95"
                    >
                      <Minus className="h-4 w-4 stroke-[2.5]" />
                    </button>
                    <span className="w-6 text-center text-sm font-black text-zinc-950">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4BE2C] text-zinc-950 font-black shadow-xs active:scale-95 hover:bg-amber-400"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-5 rounded-3xl bg-gradient-to-br from-[#FFFDF0] to-[#FFF9D6] p-4 border border-amber-300 shadow-sm space-y-2.5">
          <h2 className="font-sans text-base font-black text-zinc-950">{t('cart.summary')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-zinc-600">Subtotal comida</span>
              <span className="font-black text-zinc-950">{formatPrice(subtotal)}</span>
            </div>
            
            {!isFreeDelivery && (
              <div className="flex justify-between text-amber-900">
                <span className="font-semibold">Recargo por pedido &lt; 11,00€</span>
                <span className="font-black">+{formatPrice(under11Difference)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="font-semibold text-zinc-600">{t('cart.deliveryFee')}</span>
              {isFreeDelivery ? (
                <span className="font-black text-emerald-700">GRATIS / FREE</span>
              ) : (
                <span className="font-black text-zinc-950">+{formatPrice(deliveryFee)}</span>
              )}
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span className="font-semibold">{t('cart.discount')}</span>
                <span className="font-black">-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="border-t border-amber-300/80 pt-2.5 flex justify-between items-center">
              <div>
                <span className="font-black text-zinc-950 text-base">Total a Pagar</span>
                {!isFreeDelivery && (
                  <p className="text-[10px] font-bold text-amber-800">
                    (11,00€ mínimo + 2,50€ envío)
                  </p>
                )}
              </div>
              <span className="font-sans text-2xl font-black text-zinc-950">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky checkout CTA */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-64 z-30 app-container border-t border-amber-200 bg-white/95 p-4 backdrop-blur-lg safe-bottom pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Button size="xl" fullWidth onClick={() => router.push('/checkout')} className="font-black">
          {t('cart.checkout')} · {formatPrice(total)}
        </Button>
      </div>
    </div>
  )
}
