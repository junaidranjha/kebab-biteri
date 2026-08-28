'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UtensilsCrossed, ShoppingBag, Package, User, Flame } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useCartItemCount } from '@/lib/cart-store'
import { useOrders } from '@/hooks/use-orders'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { cn } from '@/lib/utils'

export function DesktopSidebar() {
  const pathname = usePathname()
  const cartCount = useCartItemCount()
  const { orders } = useOrders()
  const { t } = useI18n()
  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/menu', label: t('nav.menu'), icon: UtensilsCrossed },
    { href: '/cart', label: t('nav.cart'), icon: ShoppingBag, showBadge: true, count: cartCount },
    { href: '/orders', label: t('nav.orders'), icon: Package, showBadge: true, count: activeOrders },
    { href: '/profile', label: t('nav.profile'), icon: User },
  ]

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-64 flex-col border-r border-amber-200 bg-white p-5 shadow-sm">
      {/* Brand Logo */}
      <div className="pb-6 border-b border-amber-100">
        <Link href="/" className="transition-transform active:scale-95 inline-block">
          <Logo size="lg" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex-1 space-y-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition-all duration-200',
                active
                  ? 'bg-[#F4BE2C] text-zinc-950 shadow-sm scale-[1.02]'
                  : 'text-zinc-700 hover:bg-amber-50 hover:text-zinc-950',
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('h-5 w-5', active ? 'text-zinc-950 stroke-[2.5]' : 'text-zinc-500')} />
                <span>{item.label}</span>
              </div>
              {item.showBadge && item.count > 0 && (
                <span className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-black',
                  active ? 'bg-zinc-950 text-[#F4BE2C]' : 'bg-[#E50909] text-white',
                )}>
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Special Offer Badge */}
      <div className="my-4 rounded-2xl bg-gradient-to-br from-[#FFFDF0] to-[#FFF9D6] p-4 border border-amber-300 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-black text-[#D99F16]">
          <Flame className="h-4 w-4 text-[#E50909]" />
          <span>{t('home.heroBadge')}</span>
        </div>
        <p className="mt-1 text-xs font-semibold text-zinc-700 leading-snug">
          {t('home.heroDesc')}
        </p>
      </div>

      {/* Footer / Language Switcher */}
      <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
        <LanguageSwitcher />
        <span className="text-[10px] font-bold text-zinc-400">v0.1.0</span>
      </div>
    </aside>
  )
}
