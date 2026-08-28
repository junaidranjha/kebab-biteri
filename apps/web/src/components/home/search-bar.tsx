'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { t } = useI18n()

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/menu?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/menu')
    }
  }, [query, router])

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        inputMode="search"
        placeholder={t('home.searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="h-12 w-full rounded-2xl border border-amber-200 bg-white pl-11 pr-4 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/50"
      />
    </div>
  )
}
