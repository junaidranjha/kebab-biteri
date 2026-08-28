'use client'

import Link from 'next/link'
import { useMenu } from '@/hooks/use-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryIcon } from '@/components/category-icons'

export function CategoryScroller() {
  const { data, isLoading } = useMenu()
  const categories = data?.categories ?? []

  if (isLoading) {
    return (
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 py-1">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/menu?cat=${cat.slug}`}
          className="group flex shrink-0 flex-col items-center gap-1.5"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-amber-200 shadow-sm transition-all duration-200 group-hover:bg-[#F4BE2C] group-hover:scale-105 group-hover:border-amber-400">
            <CategoryIcon slug={cat.slug} className="h-7 w-7 transition-transform group-hover:scale-110" />
          </div>
          <span className="max-w-[76px] truncate text-[11px] font-black text-zinc-950 tracking-tight">{cat.name}</span>
        </Link>
      ))}
    </div>
  )
}
