'use client'

import { useI18n } from '@/lib/i18n'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18n()

  const isEs = locale === 'es-ES'

  return (
    <div className={`inline-flex items-center rounded-full bg-zinc-950 p-1 border border-amber-300 shadow-sm ${className}`}>
      <button
        onClick={() => setLocale('es-ES')}
        className={`rounded-full px-2.5 py-0.5 text-xs font-black transition-all ${
          isEs ? 'bg-[#F4BE2C] text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
        }`}
      >
        ES 🇪🇸
      </button>
      <button
        onClick={() => setLocale('en-US')}
        className={`rounded-full px-2.5 py-0.5 text-xs font-black transition-all ${
          !isEs ? 'bg-[#F4BE2C] text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
        }`}
      >
        EN 🇬🇧
      </button>
    </div>
  )
}
