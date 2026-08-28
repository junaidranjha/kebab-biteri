'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useMenu } from '@/hooks/use-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { specialOffers } from '@/data/menu-data'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { toast } from '@/components/ui/toaster'
import { Flame } from 'lucide-react'
import type { CartItem } from '@kebab-biteri/types'

export function PromoCarousel() {
  const { data, isLoading } = useMenu()
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)

  const promos = data?.promotions ?? []

  useEffect(() => {
    if (promos.length <= 1) return
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % promos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [promos.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const child = el.children[activeIdx] as HTMLElement | undefined
    if (child) {
      el.scrollTo({ left: child.offsetLeft - 16, behavior: 'smooth' })
    }
  }, [activeIdx])

  if (isLoading) {
    return (
      <div className="px-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  if (promos.length === 0) return null

  const handleAddOffer = (offer: typeof specialOffers[0]) => {
    const firstOption = offer.options[0]
    if (!firstOption) return
    const item: CartItem = {
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: offer.id,
      productName: `${offer.title} ${firstOption.label}`,
      productImage: offer.imageUrl,
      variantId: null,
      variantName: firstOption.label,
      unitPrice: firstOption.price,
      quantity: 1,
      modifiers: [],
      lineTotal: firstOption.price,
      notes: null,
    }
    addItem(item)
    toast.success(`${offer.title} added to cart`)
  }

  return (
    <section className="py-2">
      <div className="mb-2 flex items-center gap-2 px-4">
        <Flame className="h-5 w-5 text-[#E50909]" />
        <h2 className="font-sans text-lg font-black tracking-tight text-zinc-900">Special Deals & Combos</h2>
      </div>
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2"
      >
        {promos.map((promo, idx) => (
          <button
            key={promo.id}
            onClick={() => setActiveIdx(idx)}
            className="relative h-36 w-72 md:h-44 md:w-80 lg:h-48 lg:w-96 shrink-0 overflow-hidden rounded-2xl text-left border border-amber-300 shadow-sm"
          >
            <Image
              src={promo.imageUrl}
              alt={promo.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 288px, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              {promo.badgeText && (
                <span className="absolute right-2.5 top-2.5 rounded-xl bg-[#F4BE2C] px-2.5 py-1 text-xs font-black text-zinc-950 shadow-md">
                  {promo.badgeText}
                </span>
              )}
              <h3 className="text-sm md:text-base font-black text-white leading-snug">{promo.title}</h3>
              <p className="text-xs font-medium text-amber-200">{promo.subtitle}</p>
            </div>
          </button>
        ))}
        {/* Special offers */}
        {specialOffers.map((offer) => (
          <button
            key={offer.id}
            onClick={() => handleAddOffer(offer)}
            className="relative h-36 w-72 md:h-44 md:w-80 lg:h-48 lg:w-96 shrink-0 overflow-hidden rounded-2xl text-left border border-amber-300 shadow-sm"
          >
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 288px, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <span className="absolute right-2.5 top-2.5 rounded-xl bg-[#E50909] px-2.5 py-1 text-xs font-black text-white shadow-md">
                HOT DEAL
              </span>
              <h3 className="text-sm md:text-base font-black text-white">{offer.title}</h3>
              <p className="text-xs text-zinc-300">{offer.base}</p>
              <p className="mt-0.5 text-sm md:text-base font-black text-[#F4BE2C]">{formatPrice(offer.options[0]?.price ?? 0)}</p>
            </div>
          </button>
        ))}
      </div>
      {/* Dots indicator */}
      {promos.length > 1 && (
        <div className="flex justify-center gap-1.5 py-1">
          {promos.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${idx === activeIdx ? 'w-6 bg-[#F4BE2C]' : 'w-1.5 bg-amber-200'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
