'use client'

import Link from 'next/link'
import { ChevronLeft, Bell, ShoppingBag, Tag, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotifPref {
  id: string
  label: string
  desc: string
  icon: typeof Bell
  enabled: boolean
  type: 'transactional' | 'marketing'
}

const initialPrefs: NotifPref[] = [
  { id: 'order_placed', label: 'Pedido confirmado', desc: 'Cuando tu pedido es confirmado', icon: ShoppingBag, enabled: true, type: 'transactional' },
  { id: 'order_preparing', label: 'Preparing', desc: 'Cuando el restaurante empieza a preparar', icon: ShoppingBag, enabled: true, type: 'transactional' },
  { id: 'order_ready', label: 'Pedido listo', desc: 'Cuando tu pedido está listo', icon: ShoppingBag, enabled: true, type: 'transactional' },
  { id: 'order_delivery', label: 'Out for delivery', desc: 'Cuando tu pedido está en camino', icon: ShoppingBag, enabled: true, type: 'transactional' },
  { id: 'order_delivered', label: 'Deliverydo', desc: 'Confirmación de entrega', icon: ShoppingBag, enabled: true, type: 'transactional' },
  { id: 'promo_offers', label: 'Ofertas y promociones', desc: 'Discounts especiales y novedades', icon: Tag, enabled: false, type: 'marketing' },
  { id: 'new_products', label: 'New productos', desc: 'Cuando añadimos productos al menú', icon: Tag, enabled: false, type: 'marketing' },
]

import { useState } from 'react'

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState(initialPrefs)

  const toggle = (id: string) => {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))
  }

  const transactional = prefs.filter((p) => p.type === 'transactional')
  const marketing = prefs.filter((p) => p.type === 'marketing')

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="touch-target -ml-2 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-6 w-6 text-charcoal" />
          </Link>
          <h1 className="font-display text-xl font-extrabold text-charcoal">Notifications</h1>
        </div>
      </header>

      <div className="flex-1 px-4 py-4">
        {/* Transactional — always allowed */}
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-subtle">
          Transaccionales
        </h2>
        <div className="mb-6 overflow-hidden rounded-2xl border border-border">
          {transactional.map((pref, i) => {
            const Icon = pref.icon
            return (
              <div
                key={pref.id}
                className={cn('flex items-center gap-3 px-4 py-3.5', i > 0 && 'border-t border-border')}
              >
                <Icon className="h-5 w-5 text-muted" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{pref.label}</p>
                  <p className="text-xs text-muted">{pref.desc}</p>
                </div>
                <Toggle checked={pref.enabled} onChange={() => toggle(pref.id)} />
              </div>
            )
          })}
        </div>

        {/* Marketing — GDPR consent */}
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-subtle">
          Marketing <span className="text-danger">(requiere consentimiento)</span>
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          {marketing.map((pref, i) => {
            const Icon = pref.icon
            return (
              <div
                key={pref.id}
                className={cn('flex items-center gap-3 px-4 py-3.5', i > 0 && 'border-t border-border')}
              >
                <Icon className="h-5 w-5 text-muted" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{pref.label}</p>
                  <p className="text-xs text-muted">{pref.desc}</p>
                </div>
                <Toggle checked={pref.enabled} onChange={() => toggle(pref.id)} />
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-xs text-subtle">
          Las notificaciones transaccionales son necesarias para el servicio.
          Puedes desactivar las de marketing en cualquier momento (GDPR).
        </p>
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}
