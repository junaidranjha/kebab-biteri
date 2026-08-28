'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UtensilsCrossed, ShoppingBag, User, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartItemCount } from '@/lib/cart-store'
import { useOrders } from '@/hooks/use-orders'
import { useI18n } from '@/lib/i18n'

export function MobileBottomNav() {
  const pathname = usePathname()
  const cartCount = useCartItemCount()
  const { orders } = useOrders()
  const { t } = useI18n()
  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/menu', label: t('nav.menu'), icon: UtensilsCrossed },
    { href: '/cart', label: t('nav.cart'), icon: ShoppingBag, showBadge: true, badgeType: 'cart' as const },
    { href: '/orders', label: t('nav.orders'), icon: Package, showBadge: true, badgeType: 'orders' as const },
    { href: '/profile', label: t('nav.profile'), icon: User },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-200/80 bg-white/95 backdrop-blur-xl safe-bottom app-container shadow-lg lg:hidden">
      <div className="flex items-center justify-around px-3 py-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          const badgeCount = item.badgeType === 'cart' ? cartCount : item.badgeType === 'orders' ? activeOrders : 0
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200',
                active ? 'bg-[#F4BE2C] text-zinc-950 font-bold shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5 transition-transform duration-200', active && 'scale-110')} strokeWidth={active ? 2.5 : 2} />
                {item.showBadge && badgeCount > 0 && (
                  <span className={cn(
                    'absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black leading-none shadow-sm',
                    active ? 'bg-zinc-950 text-[#F4BE2C]' : 'bg-[#E50909] text-white'
                  )}>
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
