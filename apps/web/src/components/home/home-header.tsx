'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartItemCount } from '@/lib/cart-store'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'

export function HomeHeader() {
  const itemCount = useCartItemCount()

  return (
    <header className="safe-top bg-[#F4BE2C] px-4 pb-3 pt-3 shadow-sm border-b border-amber-300 lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" className="transition-transform active:scale-95">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/60 bg-zinc-900 text-white shadow-md transition-transform active:scale-95"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-[#F4BE2C]" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E50909] px-1.5 text-[10px] font-black text-white shadow-sm">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
