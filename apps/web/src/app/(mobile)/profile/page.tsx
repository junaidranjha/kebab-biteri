'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, MapPin, Heart, Bell, Settings, ChevronRight, LogIn, Shield, Globe, LogOut, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { PwaQrCard } from '@/components/pwa-qr-card'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { toast } from '@/components/ui/toaster'

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const { t, locale, setLocale } = useI18n()
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const menuSections = [
    {
      title: t('profile.account'),
      items: [
        { icon: Package, label: t('profile.myOrders'), href: '/orders' },
        { icon: MapPin, label: t('profile.myAddresses'), href: '/orders' },
        { icon: Heart, label: t('profile.favorites'), href: '/menu' },
      ],
    },
    {
      title: t('profile.preferences'),
      items: [
        { icon: Bell, label: t('profile.notifications'), onClick: () => setShowSettingsModal(true) },
        { icon: Globe, label: t('profile.language'), onClick: () => setShowSettingsModal(true) },
        { icon: Settings, label: t('profile.settings'), onClick: () => setShowSettingsModal(true) },
      ],
    },
    {
      title: t('profile.information'),
      items: [
        { icon: Shield, label: t('profile.privacy'), href: '/privacy' },
        { icon: ChevronRight, label: t('profile.help'), href: '/terms' },
      ],
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="safe-top bg-white px-4 pb-2 pt-4 border-b border-amber-200">
          <h1 className="font-sans text-2xl font-black text-zinc-950">{t('profile.title')}</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F4BE2C] border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 lg:top-[65px] z-20 bg-white px-4 pb-3 pt-4 border-b border-amber-200 shadow-xs flex items-center justify-between">
        <h1 className="font-sans text-2xl font-black text-zinc-950">{t('profile.title')}</h1>
        <LanguageSwitcher />
      </header>

      <div className="flex-1 px-4 py-4 pb-28">
        {user ? (
          <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-r from-[#FFFDF0] to-[#FFF9D6] p-5 border border-amber-300 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4BE2C] text-2xl font-black text-zinc-950 shadow-md">
              {user.firstName?.[0] ?? '?'}
            </div>
            <div className="flex-1">
              <p className="font-black text-zinc-950 text-base">{user.firstName} {user.lastName}</p>
              <p className="text-xs font-semibold text-zinc-600">{user.email ?? user.phone ?? ''}</p>
              <button
                onClick={() => {
                  logout()
                  toast.success('Sesión cerrada correctamente / Signed out successfully')
                }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3.5 py-1.5 text-xs font-black text-red-700 hover:bg-red-100 shadow-2xs active:scale-95 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('profile.logout')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-[#FFFDF0] p-6 text-center shadow-xs">
            <p className="text-lg font-black text-zinc-950">{t('profile.welcome')}</p>
            <p className="mt-1 text-xs font-medium text-zinc-600">{t('profile.loginDesc')}</p>
            <Link href="/profile/login">
              <Button className="mt-4 font-black" size="lg">
                <LogIn className="h-5 w-5 stroke-[2.5]" /> {t('profile.login')} / {t('profile.register')}
              </Button>
            </Link>
          </div>
        )}

        {/* PWA QR Code Installation Card */}
        <div className="mt-5">
          <PwaQrCard />
        </div>

        <div className="mt-6 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 px-1 text-xs font-black uppercase tracking-wider text-[#D99F16]">{section.title}</h2>
              <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-xs">
                {section.items.map((item: any, i) => {
                  const Icon = item.icon
                  if (item.href) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3.5 active:bg-amber-50 hover:bg-amber-50/50 transition-colors ${i > 0 ? 'border-t border-amber-100' : ''}`}
                      >
                        <Icon className="h-5 w-5 text-zinc-900" />
                        <span className="flex-1 text-sm font-bold text-zinc-900">{item.label}</span>
                        <ChevronRight className="h-5 w-5 text-amber-400" />
                      </Link>
                    )
                  }
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-amber-50 hover:bg-amber-50/50 transition-colors ${i > 0 ? 'border-t border-amber-100' : ''}`}
                    >
                      <Icon className="h-5 w-5 text-zinc-900" />
                      <span className="flex-1 text-sm font-bold text-zinc-900">{item.label}</span>
                      <ChevronRight className="h-5 w-5 text-amber-400" />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowSettingsModal(false)}>
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs" />
            <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-amber-300 space-y-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#D99F16]" />
                  <h2 className="font-sans text-xl font-black text-zinc-950">{t('profile.settings')}</h2>
                </div>
                <button onClick={() => setShowSettingsModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-amber-100">
                  <X className="h-5 w-5 text-zinc-950" />
                </button>
              </div>

              {/* Language Selection Setting */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-zinc-600">{t('profile.language')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setLocale('es-ES')
                      toast.success('Idioma cambiado a Español 🇪🇸')
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-xs font-black transition-all ${locale === 'es-ES' ? 'border-[#F4BE2C] bg-[#FFFDF0] text-zinc-950 shadow-sm' : 'border-amber-200 bg-white text-zinc-600'}`}
                  >
                    <span>Español 🇪🇸</span>
                    {locale === 'es-ES' && <Check className="h-4 w-4 text-[#D99F16]" />}
                  </button>
                  <button
                    onClick={() => {
                      setLocale('en-US')
                      toast.success('Language switched to English 🇬🇧')
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-xs font-black transition-all ${locale === 'en-US' ? 'border-[#F4BE2C] bg-[#FFFDF0] text-zinc-950 shadow-sm' : 'border-amber-200 bg-white text-zinc-600'}`}
                  >
                    <span>English 🇬🇧</span>
                    {locale === 'en-US' && <Check className="h-4 w-4 text-[#D99F16]" />}
                  </button>
                </div>
              </div>

              {/* Push Notifications Toggle Setting */}
              <div className="space-y-2 pt-2 border-t border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-zinc-950">{t('profile.notifications')}</p>
                    <p className="text-xs font-semibold text-zinc-500">Notificaciones de estado del pedido en tiempo real</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotificationsEnabled(!notificationsEnabled)
                      toast.success(!notificationsEnabled ? 'Notificaciones activadas 🔔' : 'Notificaciones desactivadas 🔕')
                    }}
                    className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-[#F4BE2C]' : 'bg-zinc-300'}`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <Button size="lg" fullWidth onClick={() => setShowSettingsModal(false)} className="mt-4 font-black">
                {locale === 'es-ES' ? 'Guardar Cambios' : 'Done'}
              </Button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-400 font-medium">Kebab Biteri v0.1.0 · Hecho con ❤️ en Errenteria, Gipuzkoa</p>
      </div>
    </div>
  )
}
