'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Plus } from 'lucide-react'
import { usePopularProducts } from '@/hooks/use-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { toast } from '@/components/ui/toaster'
import { useI18n } from '@/lib/i18n'
import type { CartItem, Product } from '@kebab-biteri/types'

export function PopularSection() {
  const { data: products, isLoading } = usePopularProducts()
  const addItem = useCartStore((s) => s.addItem)
  const { t } = useI18n()

  const handleQuickAdd = (product: Product) => {
    const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0]
    const price = defaultVariant?.price ?? product.basePrice

    const item: CartItem = {
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      variantId: defaultVariant?.id ?? null,
      variantName: defaultVariant?.name ?? null,
      unitPrice: price,
      quantity: 1,
      modifiers: [],
      lineTotal: price,
      notes: null,
    }
    addItem(item)
    toast.success(`${product.name} ${t('common.added')}`)
  }

  if (isLoading) {
    return (
      <div className="px-4">
        <Skeleton className="mb-3 h-6 w-32" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!products?.length) return null

  return (
    <div className="px-4 pb-2">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-sans text-lg font-black tracking-tight text-zinc-900">🔥 {t('home.popular')}</h2>
        <Link href="/menu" className="text-xs font-black uppercase text-[#D99F16] hover:underline">
          {t('home.seeAll')}
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="card-app group flex flex-col hover:border-amber-400 transition-all shadow-sm"
          >
            <div className="relative h-32 w-full bg-amber-50">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 480px) 50vw, 240px"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-zinc-950/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-[#F4BE2C]">
                <Star className="h-3 w-3 fill-[#F4BE2C] text-[#F4BE2C]" />
                <span>{product.rating}</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-3">
              <h3 className="line-clamp-1 text-sm font-black text-zinc-900">{product.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 font-medium">{product.description}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <p className="text-base font-black text-zinc-950">{formatPrice(product.basePrice)}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleQuickAdd(product)
                  }}
                  className="touch-target flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4BE2C] text-zinc-950 shadow-sm transition-all active:scale-90 hover:bg-amber-400 font-bold"
                  aria-label={`Add ${product.name}`}
                >
                  <Plus className="h-5 w-5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
