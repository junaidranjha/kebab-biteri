'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, Heart, Star, Minus, Plus, Check, Loader2 } from 'lucide-react'
import { useProduct } from '@/hooks/use-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { formatPrice, cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { toast } from '@/components/ui/toaster'
import type { CartItem, ModifierOption } from '@kebab-biteri/types'

export default function ProductPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const { data: product, isLoading } = useProduct(params.slug)
  const addItem = useCartStore((s) => s.addItem)

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [liked, setLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)

  // Set default variant when product loads
  useEffect(() => {
    if (product) {
      const defaultV = product.variants.find((v) => v.isDefault) ?? product.variants[0]
      setSelectedVariantId(defaultV?.id ?? null)
      // Pre-select default options
      const defaults = new Set<string>()
      for (const mod of product.modifiers) {
        for (const opt of mod.options) {
          if (opt.isDefault) defaults.add(opt.id)
        }
      }
      setSelectedOptions(defaults)
    }
  }, [product])

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId)
  const basePrice = selectedVariant?.price ?? product?.basePrice ?? 0

  const modifiersTotal = useMemo(() => {
    if (!product) return 0
    let total = 0
    for (const mod of product.modifiers) {
      for (const opt of mod.options) {
        if (selectedOptions.has(opt.id)) total += opt.priceDelta
      }
    }
    return total
  }, [product, selectedOptions])

  const unitPrice = basePrice + modifiersTotal
  const totalPrice = unitPrice * quantity

  const toggleOption = (modId: string, option: ModifierOption, maxSelect: number | null) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev)
      if (next.has(option.id)) {
        next.delete(option.id)
      } else {
        if (maxSelect !== null && maxSelect > 0) {
          const modOptions = product?.modifiers.find((m) => m.id === modId)?.options ?? []
          const selectedInMod = modOptions.filter((o) => next.has(o.id))
          if (selectedInMod.length >= maxSelect) {
            next.delete(selectedInMod[0].id)
          }
        }
        next.add(option.id)
      }
      return next
    })
  }

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/menu')
    }
  }

  const handleAddToCart = async () => {
    if (!product || isAdding) return

    setIsAdding(true)

    // Simulate subtle micro-interaction latency for realistic feeedback
    await new Promise((res) => setTimeout(res, 250))

    const cartModifiers = product.modifiers
      .flatMap((mod) =>
        mod.options
          .filter((opt) => selectedOptions.has(opt.id))
          .map((opt) => ({
            modifierId: mod.id,
            modifierName: mod.name,
            optionId: opt.id,
            optionName: opt.name,
            priceDelta: opt.priceDelta,
          })),
      )

    const item: CartItem = {
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      variantId: selectedVariantId,
      variantName: selectedVariant?.name ?? null,
      unitPrice,
      quantity,
      modifiers: cartModifiers,
      lineTotal: totalPrice,
      notes: notes.trim() || null,
    }

    addItem(item)
    setIsAdding(false)
    setAddedSuccess(true)
    toast.success(`${product.name} added to cart`)

    setTimeout(() => {
      setAddedSuccess(false)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Skeleton className="h-72 w-full rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-8 w-2/3 rounded-xl" />
          <Skeleton className="h-5 w-full rounded-xl" />
          <Skeleton className="h-5 w-3/4 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <p className="text-xl font-black text-zinc-950">Product not found</p>
        <p className="mt-1 text-sm font-medium text-zinc-500">The product you are looking for is unavailable</p>
        <Button onClick={handleBack} className="mt-5 font-black">
          Back to Menu
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#FFFDF2]">
      {/* Hero Image Container */}
      <div className="relative h-72 w-full bg-amber-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <div className="safe-top absolute inset-x-0 top-0 flex items-center justify-between p-4 z-10">
          <button
            onClick={handleBack}
            className="touch-target flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-transform active:scale-95 hover:bg-white"
            aria-label="Go Back"
          >
            <ChevronLeft className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="touch-target flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-all active:scale-90 hover:bg-white"
            aria-label="Favorite"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-all duration-200',
                liked ? 'fill-[#E50909] text-[#E50909] scale-110' : 'text-zinc-800',
              )}
            />
          </button>
        </div>
      </div>

      {/* Main Content Sheet Container */}
      <div className="flex flex-1 flex-col rounded-t-3xl -mt-4 bg-[#FFFDF2] px-5 pb-36 pt-5 shadow-2xl relative z-10 border-t border-amber-200">
        {/* Title + Price Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-black text-zinc-950 tracking-tight leading-snug">
              {product.name}
            </h1>
            {/* Rating + Calorie Row */}
            <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                <Star className="h-3.5 w-3.5 fill-[#F4BE2C] text-[#F4BE2C]" />
                <span className="font-black text-zinc-950">{product.rating}</span>
                <span className="text-zinc-500 font-semibold">({product.reviewCount})</span>
              </span>
              {product.calories && (
                <span className="text-zinc-600 font-semibold">· {product.calories} kcal</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="font-sans text-2xl font-black text-zinc-950">
              {formatPrice(unitPrice)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-amber-200/80" />

        {/* Product Description */}
        <div className="space-y-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#D99F16]">Description</h2>
          <p className="text-sm font-medium leading-relaxed text-zinc-700">{product.description}</p>
        </div>

        {/* Dietary Information / Allergens */}
        {product.allergens.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-2 text-xs font-black uppercase tracking-wider text-[#D99F16]">Dietary Information</h2>
            <div className="flex flex-wrap gap-1.5">
              {product.allergens.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-amber-100/80 border border-amber-300 px-3 py-1 text-xs font-black uppercase text-zinc-900 shadow-2xs"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Variants / Size Option Customization */}
        {product.variants.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2.5 text-xs font-black uppercase tracking-wider text-[#D99F16]">Choose Size / Option</h2>
            <div className="space-y-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 transition-all active:scale-[0.99]',
                    selectedVariantId === variant.id
                      ? 'border-[#F4BE2C] bg-[#FFFDF0] shadow-sm'
                      : 'border-amber-200 bg-white hover:border-amber-300',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                        selectedVariantId === variant.id
                          ? 'border-[#F4BE2C] bg-[#F4BE2C]'
                          : 'border-amber-300 bg-white',
                      )}
                    >
                      {selectedVariantId === variant.id && (
                        <div className="h-2 w-2 rounded-full bg-zinc-950" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-zinc-950">{variant.name}</span>
                    {variant.calories && (
                      <span className="text-xs font-semibold text-zinc-500">{variant.calories} kcal</span>
                    )}
                  </div>
                  <span className="text-sm font-black text-zinc-950">{formatPrice(variant.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modifiers Selection */}
        {product.modifiers.map((mod) => (
          <div key={mod.id} className="mt-6">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#D99F16]">{mod.name}</h2>
              {mod.minSelect > 0 && (
                <span className="text-xs font-black text-[#E50909]">Required</span>
              )}
              {mod.maxSelect && mod.maxSelect > 1 && (
                <span className="text-xs font-semibold text-zinc-500">Max {mod.maxSelect}</span>
              )}
            </div>
            <div className="space-y-2">
              {mod.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleOption(mod.id, opt, mod.maxSelect)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 transition-all active:scale-[0.99]',
                    selectedOptions.has(opt.id)
                      ? 'border-[#F4BE2C] bg-[#FFFDF0] shadow-sm'
                      : 'border-amber-200 bg-white hover:border-amber-300',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all',
                        selectedOptions.has(opt.id)
                          ? 'border-[#F4BE2C] bg-[#F4BE2C]'
                          : 'border-amber-300 bg-white',
                      )}
                    >
                      {selectedOptions.has(opt.id) && (
                        <Check className="h-3.5 w-3.5 text-zinc-950 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-zinc-950">{opt.name}</span>
                  </div>
                  {opt.priceDelta > 0 && (
                    <span className="text-sm font-black text-zinc-900">+{formatPrice(opt.priceDelta)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Special Instructions (Notes) */}
        <div className="mt-6">
          <h2 className="mb-2 text-xs font-black uppercase tracking-wider text-[#D99F16]">Special instructions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. no onions, extra sauce..."
            rows={2}
            maxLength={200}
            className="w-full resize-none rounded-2xl border border-amber-300 bg-amber-50/30 px-4 py-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 focus:border-[#F4BE2C] focus:outline-none focus:ring-2 focus:ring-[#F4BE2C]/40 transition-all"
          />
        </div>

        {/* Quantity Controls */}
        <div className="mt-6">
          <h2 className="mb-2 text-xs font-black uppercase tracking-wider text-[#D99F16]">Quantity</h2>
          <div className="flex items-center justify-start gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50/80 text-zinc-950 font-black transition-all active:scale-95 disabled:opacity-40"
              aria-label="Decrease Quantity"
            >
              <Minus className="h-4 w-4 stroke-[2.5]" />
            </button>
            <span className="w-10 text-center font-sans text-xl font-black text-zinc-950">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              disabled={quantity >= 20}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4BE2C] text-zinc-950 font-black shadow-sm transition-all active:scale-95 hover:bg-amber-400 disabled:opacity-40"
              aria-label="Increase Quantity"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Add To Cart CTA */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-64 z-30 app-container border-t border-amber-200 bg-white/95 p-4 backdrop-blur-xl safe-bottom">
        <Button
          size="xl"
          fullWidth
          onClick={handleAddToCart}
          disabled={isAdding}
          className={cn(
            'justify-between font-black text-base transition-all duration-300',
            addedSuccess
              ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
              : 'bg-[#F4BE2C] text-zinc-950 hover:bg-[#e2ad1b] border-amber-300 shadow-md',
          )}
        >
          {isAdding ? (
            <span className="flex items-center gap-2 mx-auto">
              <Loader2 className="h-5 w-5 animate-spin" /> Adding...
            </span>
          ) : addedSuccess ? (
            <span className="flex items-center gap-2 mx-auto">
              <Check className="h-5 w-5 stroke-[3]" /> Added to Cart
            </span>
          ) : (
            <>
              <span>Add to Cart</span>
              <span className="ml-auto font-black">{formatPrice(totalPrice)}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

