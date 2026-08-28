'use client'

import Link from 'next/link'
import { ShoppingBag, User, MapPin, Search, LogOut, Store, Phone, Clock, ExternalLink, X } from 'lucide-react'
import { useCartItemCount } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { restaurantInfo } from '@/data/menu-data'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function DesktopHeader() {
  const router = useRouter()
  const itemCount = useCartItemCount()
  const { t, locale } = useI18n()
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [showLocationModal, setShowLocationModal] = useState(false)

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/menu?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/menu')
    }
  }, [query, router])

  return (
    <>
      <header className="hidden lg:flex sticky top-0 z-30 items-center justify-between bg-white/95 px-8 py-3.5 backdrop-blur-md border-b border-amber-200 shadow-xs">
        {/* Search Input */}
        <div className="relative w-96">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder={t('home.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-10 w-full rounded-2xl border border-amber-200 bg-amber-50/40 pl-10 pr-4 text-xs font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/40 shadow-2xs"
          />
        </div>

        {/* Center Location / Pickup Location Button */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-1.5 border border-amber-300 text-xs font-black text-zinc-950 hover:bg-[#F4BE2C] transition-all active:scale-95 shadow-2xs"
          title="Ver Ubicación de Recogida / Pickup Location"
        >
          <Store className="h-4 w-4 text-[#E50909]" />
          <span>{restaurantInfo.name} · Errenteria</span>
          <span className="ml-1 rounded-full bg-[#E50909] px-2 py-0.5 text-[10px] font-black text-white">RECOGIDA 📍</span>
        </button>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {/* Quick Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-2xl bg-[#F4BE2C] px-4 py-2 text-xs font-black text-zinc-950 shadow-sm transition-all hover:bg-amber-400 active:scale-95 border border-amber-300"
          >
            <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
            <span>{t('cart.title')}</span>
            {itemCount > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1.5 text-[10px] font-black text-[#F4BE2C]">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Profile & Sign Out Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-black text-zinc-950 transition-all hover:bg-amber-100 shadow-2xs"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4BE2C] text-xs font-black text-zinc-950">
                  {user.firstName?.[0] ?? 'U'}
                </div>
                <span className="max-w-28 truncate">{user.firstName}</span>
              </Link>
              <button
                onClick={() => {
                  logout()
                  router.push('/')
                }}
                title={t('profile.logout')}
                className="flex items-center gap-1.5 rounded-2xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition-all hover:bg-red-100 active:scale-95 shadow-2xs"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden xl:inline">{t('profile.logout')}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 text-zinc-950 transition-all hover:bg-amber-100 active:scale-95 shadow-2xs"
              aria-label="Profile"
            >
              <User className="h-5 w-5 stroke-[2]" />
            </Link>
          )}
        </div>
      </header>

      {/* Pickup Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLocationModal(false)}>
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs" />
          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-amber-300 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4BE2C] text-zinc-950 shadow-xs">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-sans text-xl font-black text-zinc-950">Punto de Recogida / Pickup Location</h2>
                  <p className="text-xs font-semibold text-zinc-500">{restaurantInfo.name} · Errenteria</p>
                </div>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-amber-100">
                <X className="h-5 w-5 text-zinc-950" />
              </button>
            </div>

            {/* Address & Store Info */}
            <div className="space-y-2.5 rounded-2xl bg-amber-50/80 p-4 border border-amber-200 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 shrink-0 text-[#E50909] mt-0.5" />
                <div>
                  <p className="font-black text-zinc-950 text-sm">{restaurantInfo.name}</p>
                  <p className="font-semibold text-zinc-700">Calle Viteri 12, 20100 Errenteria, Gipuzkoa</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 font-bold text-zinc-800 pt-1">
                <Phone className="h-4 w-4 text-[#D99F16]" />
                <span>Tel: {restaurantInfo.phone1} / {restaurantInfo.phone2}</span>
              </div>
              <div className="flex items-center gap-2.5 font-bold text-zinc-800">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Horario: {restaurantInfo.deliveryHours} (Todos los días)</span>
              </div>
            </div>

            {/* Google Maps Preview */}
            <div className="overflow-hidden rounded-2xl border border-amber-300 shadow-2xs">
              <iframe
                width="100%"
                height="200"
                loading="lazy"
                src="https://www.google.com/maps?q=Kebab+Biteri+Errenteria+Gipuzkoa&output=embed"
                className="border-0"
                title="Kebab Biteri Google Maps location"
              />
            </div>

            {/* Open Google Maps external CTA */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Kebab+Biteri+Errenteria+Gipuzkoa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" fullWidth className="font-black gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>{locale === 'es-ES' ? 'Abrir en Google Maps' : 'Open in Google Maps'}</span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </>
  )
}
