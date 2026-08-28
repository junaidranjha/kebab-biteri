'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { MenuClient } from '@/components/menu/menu-client'
import { Skeleton } from '@/components/ui/skeleton'

function MenuPageInner() {
  const searchParams = useSearchParams()
  const initialCat = searchParams.get('cat') ?? 'all'
  const initialQuery = searchParams.get('q') ?? ''

  return <MenuClient initialCategory={initialCat} initialQuery={initialQuery} />
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <MenuPageInner />
    </Suspense>
  )
}
