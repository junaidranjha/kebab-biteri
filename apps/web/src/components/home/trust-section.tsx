'use client'

import { ShieldCheck, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { restaurantInfo } from '@/data/menu-data'
import { useI18n } from '@/lib/i18n'

export function TrustSection() {
  const { t } = useI18n()

  return (
    <section className="mx-4 mb-6">
      <div className="rounded-3xl border border-amber-300 bg-amber-50/60 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="gap-1 bg-emerald-600 font-black text-white px-2.5 py-0.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('home.halalBadge')}
          </Badge>
          <span className="text-xs font-black uppercase text-zinc-900">{t('home.donerKebabTag')}</span>
        </div>
        <p className="mt-2 text-xs font-semibold text-zinc-700">{t('home.turkishCuisineTag')}</p>
        <div className="mt-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#D99F16]" />
          <div className="flex gap-1.5">
            {restaurantInfo.deliveryPlatforms.map((p) => (
              <span key={p} className="rounded-xl border border-amber-200 bg-white px-2.5 py-0.5 text-[10px] font-black text-zinc-900 shadow-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
