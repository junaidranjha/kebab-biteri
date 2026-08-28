export interface Category {
  id: string
  name: string
  slug: string
  iconUrl: string | null
  sortOrder: number
  isActive: boolean
}

export interface ProductModifier {
  id: string
  name: string
  minSelect: number
  maxSelect: number | null
  options: ModifierOption[]
}

export interface ModifierOption {
  id: string
  name: string
  priceDelta: number
  isDefault: boolean
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  calories: number | null
  isDefault: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  categoryId: string
  basePrice: number
  rating: number
  reviewCount: number
  isPopular: boolean
  isActive: boolean
  variants: ProductVariant[]
  modifiers: ProductModifier[]
  allergens: string[]
  calories: number | null
  // Extended fields for static menu
  number?: number
  category?: string
  isNew?: boolean
  isFeatured?: boolean
  priceUnit?: string
}

export interface Promotion {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  badgeText: string | null
  sortOrder: number
  isActive: boolean
}

export interface MenuResponse {
  categories: Category[]
  products: Product[]
  promotions: Promotion[]
}
