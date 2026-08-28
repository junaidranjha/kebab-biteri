export interface CartItemModifier {
  modifierId: string
  modifierName: string
  optionId: string
  optionName: string
  priceDelta: number
}

export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  variantId: string | null
  variantName: string | null
  unitPrice: number
  quantity: number
  modifiers: CartItemModifier[]
  lineTotal: number
  notes: string | null
}

export interface Cart {
  id: string
  branchId: string | null
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  itemCount: number
}

export interface AddCartItemDto {
  productId: string
  variantId?: string
  quantity: number
  modifierOptionIds?: string[]
  notes?: string
}

export interface UpdateCartItemDto {
  quantity?: number
  notes?: string
}
