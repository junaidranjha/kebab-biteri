'use client'

import { Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { specialOffers, promotions } from '@/data/menu-data'
import { formatPrice } from '@/lib/utils'

export default function AdminDealsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">Offers & Promotions</h1>
          <p className="mt-1 text-sm text-muted">{promotions.length} promotions · {specialOffers.length} special offers</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> New promotion</Button>
      </div>

      {/* Promotions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {promotions.map((promo) => (
          <div key={promo.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-charcoal">{promo.title}</p>
                <p className="text-sm text-muted">{promo.subtitle}</p>
              </div>
              {promo.badgeText && (
                <span className="rounded-lg bg-primary px-2.5 py-1 text-sm font-bold text-white">
                  {promo.badgeText}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Special Offers */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-charcoal">Special Offers</h2>
        <div className="space-y-3">
          {specialOffers.map((offer) => (
            <div key={offer.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-charcoal">{offer.title}</p>
                  <p className="text-sm text-muted">Base: {offer.base}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {offer.options.map((opt) => (
                  <div key={opt.label} className="flex items-center justify-between rounded-lg bg-surface-alt px-3 py-2 text-sm">
                    <span className="font-medium text-charcoal">{opt.label}</span>
                    <span className="font-bold text-primary">{formatPrice(opt.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {promotions.length === 0 && specialOffers.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <AlertCircle className="h-12 w-12 text-subtle" />
          <p className="mt-4 text-sm text-muted">No active promotions</p>
        </div>
      )}
    </div>
  )
}
