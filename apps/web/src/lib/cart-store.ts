'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@kebab-biteri/types'

interface CartState {
  items: CartItem[]
  branchId: string | null
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  setBranch: (branchId: string) => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      branchId: null,

      addItem: (item) =>
        set((state) => {
          // Check for identical existing item (same product, variant, modifiers, notes)
          const existingIdx = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === item.variantId &&
              JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers) &&
              i.notes === item.notes,
          )
          if (existingIdx >= 0) {
            const items = [...state.items]
            items[existingIdx] = {
              ...items[existingIdx],
              quantity: items[existingIdx].quantity + item.quantity,
              lineTotal: items[existingIdx].lineTotal + item.lineTotal,
            }
            return { items }
          }
          return { items: [...state.items, item] }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) }
          }
          return {
            items: state.items.map((i) =>
              i.id === id
                ? {
                    ...i,
                    quantity,
                    lineTotal: (i.unitPrice + i.modifiers.reduce((s, m) => s + m.priceDelta, 0)) * quantity,
                  }
                : i,
            ),
          }
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [], branchId: null }),
      setBranch: (branchId) => set({ branchId }),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.lineTotal, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'kb-cart',
      partialize: (state) => ({ items: state.items, branchId: state.branchId }),
    },
  ),
)

// Convenience selector hook for item count
export const useCartItemCount = () => useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
