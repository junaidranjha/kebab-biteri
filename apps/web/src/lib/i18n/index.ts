'use client'

import { useState, useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translations, type Locale, type TranslationKey } from './translations'

interface I18nStoreState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const useI18nStore = create<I18nStoreState>()(
  persist(
    (set) => ({
      locale: 'es-ES',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'kb-locale',
    },
  ),
)

export function useI18n() {
  const store = useI18nStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentLocale = mounted ? store.locale : 'es-ES'

  return {
    locale: currentLocale,
    setLocale: store.setLocale,
    t: (key: TranslationKey) => {
      return translations[currentLocale]?.[key] ?? translations['es-ES']?.[key] ?? key
    },
  }
}
