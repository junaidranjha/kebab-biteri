'use client'

import { HomeHeader } from '@/components/home/home-header'
import { SearchBar } from '@/components/home/search-bar'
import { PromoCarousel } from '@/components/home/promo-carousel'
import { CategoryScroller } from '@/components/home/category-scroller'
import { PopularSection } from '@/components/home/popular-section'
import { DeliveryInfo } from '@/components/home/delivery-info'
import { TrustSection } from '@/components/home/trust-section'
import { useI18n } from '@/lib/i18n'

export default function HomePage() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col">
      <HomeHeader />
      {/* Signature Golden Yellow Hero Card */}
      <section className="px-4 pb-3 pt-3">
        <div className="relative overflow-hidden rounded-3xl bg-[#F4BE2C] p-6 shadow-md border border-amber-300">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-3 py-1 text-xs font-black text-[#F4BE2C] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#E50909] animate-pulse" />
              {t('home.heroBadge')}
            </div>
            <h2 className="mt-3 font-sans text-3xl font-black italic tracking-tight text-zinc-950 leading-tight whitespace-pre-line">
              {t('home.heroTitle')}
            </h2>
            <p className="mt-2 text-xs font-semibold text-zinc-800">
              {t('home.heroDesc')}
            </p>
            <a
              href="/menu"
              className="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-7 text-sm font-black text-[#F4BE2C] shadow-lg transition-all active:scale-95 hover:bg-zinc-900"
            >
              {t('home.exploreMenu')}
            </a>
          </div>
          {/* Subtle background graphic glow */}
          <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-white/20 blur-xl" />
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#E50909]/10 blur-lg" />
        </div>
      </section>
      {/* Search */}
      <div className="px-4 lg:hidden">
        <SearchBar />
      </div>
      {/* Offers */}
      <PromoCarousel />
      {/* Categories */}
      <div className="px-4 pt-2">
        <h2 className="mb-3 font-sans text-lg font-black text-zinc-950">{t('home.categories')}</h2>
        <CategoryScroller />
      </div>
      {/* Popular */}
      <PopularSection />
      {/* Delivery Info */}
      <DeliveryInfo />
      {/* Trust */}
      <TrustSection />
    </div>
  )
}
