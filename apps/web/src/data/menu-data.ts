import type { Category, Product, Promotion, MenuResponse } from '@kebab-biteri/types'

// Extended Product type with extra fields for static menu
export interface MenuItem extends Product {
  number?: number
  category?: string
  isNew?: boolean
  isFeatured?: boolean
  priceUnit?: string
}

// ─── Categories ────────────────────────────────────────
export const categories: Category[] = [
  { id: 'doner-kebab', name: 'Doner Kebab', slug: 'doner-kebab', iconUrl: null, sortOrder: 1, isActive: true },
  { id: 'doner-durum', name: 'Doner Dürüm', slug: 'doner-durum', iconUrl: null, sortOrder: 2, isActive: true },
  { id: 'hamburguesa', name: 'Hamburguesa', slug: 'hamburguesa', iconUrl: null, sortOrder: 3, isActive: true },
  { id: 'wrap', name: 'Wrap', slug: 'wrap', iconUrl: null, sortOrder: 4, isActive: true },
  { id: 'lahmacun', name: 'Lahmacun Pizza Turca', slug: 'lahmacun', iconUrl: null, sortOrder: 5, isActive: true },
  { id: 'ensaladas', name: 'Ensaladas', slug: 'ensaladas', iconUrl: null, sortOrder: 6, isActive: true },
  { id: 'platos-menus', name: 'Platos Menús', slug: 'platos-menus', iconUrl: null, sortOrder: 7, isActive: true },
  { id: 'raciones', name: 'Raciones', slug: 'raciones', iconUrl: null, sortOrder: 8, isActive: true },
  { id: 'bebidas', name: 'Bebidas', slug: 'bebidas', iconUrl: null, sortOrder: 9, isActive: true },
  { id: 'featured', name: 'Menús Destacados', slug: 'featured', iconUrl: null, sortOrder: 10, isActive: true },
  { id: 'offers', name: 'Ofertas Especiales', slug: 'offers', iconUrl: null, sortOrder: 11, isActive: true },
]

export const categoryEmojis: Record<string, string> = {
  'doner-kebab': '🥙',
  'doner-durum': '🌯',
  'hamburguesa': '🍔',
  'wrap': '🫓',
  'lahmacun': '🍕',
  'ensaladas': '🥗',
  'platos-menus': '🍱',
  'raciones': '🍟',
  'bebidas': '🥤',
  'featured': '⭐',
  'offers': '🔥',
}

// ─── Image Helpers ─────────────────────────────────────
let _id = 0
function pid() { return `p${++_id}` }

const LOCAL_IMG = {
  kebab: '/images/menu/kebab_pita_real.jpg',
  durum: '/images/menu/durum_real.jpg',
  burger: '/images/menu/hamburguesa.png',
  lahmacun: '/images/menu/lahmacun.png',
  plato: '/images/menu/kebab_plato_real.jpg',
  seekh: '/images/menu/seekh_kebab.png',
  ensalada: '/images/menu/ensalada_real.jpg',
  alitas: '/images/menu/alitas_real.jpg',
}

const UNSPLASH_IMG = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80&fit=crop`

// ─── Products ──────────────────────────────────────────
export const products: MenuItem[] = [
  // === DONER KEBAB (1-10) ===
  { id: pid(), name: 'Kebab de ternera', slug: 'kebab-de-ternera', number: 1, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de ternera, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/01-kebab-de-ternera.webp', basePrice: 4.50, rating: 4.8, reviewCount: 156, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 550 },
  { id: pid(), name: 'Kebab de ternera solo carne', slug: 'kebab-de-ternera-solo-carne', number: 2, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de ternera y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/02-kebab-de-ternera-solo-carne.webp', basePrice: 5.00, rating: 4.6, reviewCount: 89, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 500 },
  { id: pid(), name: 'Kebab de pollo', slug: 'kebab-de-pollo', number: 3, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de pollo, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/03-kebab-de-pollo.webp', basePrice: 4.50, rating: 4.7, reviewCount: 203, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 520 },
  { id: pid(), name: 'Kebab de pollo solo carne', slug: 'kebab-de-pollo-solo-carne', number: 4, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/04-kebab-de-pollo-solo-carne.webp', basePrice: 5.00, rating: 4.5, reviewCount: 67, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 480 },
  { id: pid(), name: 'Kebab mixto', slug: 'kebab-mixto', number: 5, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de ternera y de pollo, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/05-kebab-mixto.webp', basePrice: 4.50, rating: 4.8, reviewCount: 178, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 560 },
  { id: pid(), name: 'Kebab mixto solo carne', slug: 'kebab-mixto-solo-carne', number: 6, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de ternera y de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/06-kebab-mixto-solo-carne.webp', basePrice: 5.00, rating: 4.5, reviewCount: 54, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 510 },
  { id: pid(), name: 'Kebab loco', slug: 'kebab-loco', number: 7, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de ternera y de pollo o mixta con patatas dentro y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/07-kebab-loco.webp', basePrice: 5.00, rating: 4.9, reviewCount: 92, isPopular: true, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 650 },
  { id: pid(), name: 'Kebab vegetal', slug: 'kebab-vegetal', number: 8, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/08-kebab-vegetal.webp', basePrice: 4.00, rating: 4.3, reviewCount: 41, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 380 },
  { id: pid(), name: 'Kebab falafel', slug: 'kebab-falafel', number: 9, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, pasta de garbanzos, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/09-kebab-falafel.webp', basePrice: 4.50, rating: 4.4, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 420 },
  { id: pid(), name: 'Kebab infantil', slug: 'kebab-infantil', number: 10, category: 'Doner Kebab', categoryId: 'doner-kebab', description: 'Pan de pita turco, carne de ternera y de pollo o mixta y si quieres con nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/10-kebab-infantil.webp', basePrice: 4.50, rating: 4.6, reviewCount: 33, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 400 },

  // === DONER DÜRÜM (11-20) ===
  { id: pid(), name: 'Doner dürüm de ternera', slug: 'doner-durum-de-ternera', number: 11, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de ternera, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/11-doner-durum-de-ternera.webp', basePrice: 5.00, rating: 4.8, reviewCount: 124, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 580 },
  { id: pid(), name: 'Dürüm de ternera solo carne', slug: 'durum-de-ternera-solo-carne', number: 12, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de ternera y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/12-durum-de-ternera-solo-carne.webp', basePrice: 5.50, rating: 4.5, reviewCount: 76, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 530 },
  { id: pid(), name: 'Dürüm de pollo', slug: 'durum-de-pollo', number: 13, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/13-durum-de-pollo.webp', basePrice: 5.00, rating: 4.7, reviewCount: 98, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 540 },
  { id: pid(), name: 'Dürüm de pollo solo carne', slug: 'durum-de-pollo-solo-carne', number: 14, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/14-durum-de-pollo-solo-carne.webp', basePrice: 5.50, rating: 4.4, reviewCount: 51, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 490 },
  { id: pid(), name: 'Dürüm mixto', slug: 'durum-mixto', number: 15, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de ternera y pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/15-durum-mixto.webp', basePrice: 5.00, rating: 4.8, reviewCount: 145, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 590 },
  { id: pid(), name: 'Dürüm mixto solo carne', slug: 'durum-mixto-solo-carne', number: 16, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de ternera o pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/16-durum-mixto-solo-carne.webp', basePrice: 5.50, rating: 4.5, reviewCount: 43, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 540 },
  { id: pid(), name: 'Dürüm loco', slug: 'durum-loco', number: 17, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de ternera o de pollo o mixta con patatas y dentro nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/17-durum-loco.webp', basePrice: 5.50, rating: 4.9, reviewCount: 78, isPopular: true, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 680 },
  { id: pid(), name: 'Dürüm vegetal', slug: 'durum-vegetal', number: 18, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/18-durum-vegetal.webp', basePrice: 4.50, rating: 4.2, reviewCount: 29, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 400 },
  { id: pid(), name: 'Dürüm falafel', slug: 'durum-falafel', number: 19, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, pasta de garbanzos, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/19-durum-falafel.webp', basePrice: 4.50, rating: 4.3, reviewCount: 35, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 440 },
  { id: pid(), name: 'Dürüm infantil', slug: 'durum-infantil', number: 20, category: 'Doner Dürüm', categoryId: 'doner-durum', description: 'Masa fina turca, carne de ternera o de pollo o mixta y si quieres con nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/20-durum-infantil.webp', basePrice: 5.00, rating: 4.5, reviewCount: 28, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 420 },

  // === HAMBURGUESA (21) ===
  { id: pid(), name: 'Hamburguesa completa', slug: 'hamburguesa-completa', number: 21, category: 'Hamburguesa', categoryId: 'hamburguesa', description: 'Hamburguesa de pollo o ternera, lechuga, tomate, queso, kétchup, mahonesa.', imageUrl: '/images/menu/21-hamburguesa-completa.webp', basePrice: 4.50, rating: 4.7, reviewCount: 112, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 520 },

  // === WRAP (22) ===
  { id: pid(), name: 'Wrap seekh kebab', slug: 'wrap-seekh-kebab', number: 22, category: 'Wrap', categoryId: 'wrap', description: 'Wrap de pan fino turco con brocheta seekh kebab, lechuga, tomate, cebolla y salsa yogurt.', imageUrl: '/images/menu/22-wrap-seekh-kebab.webp', basePrice: 6.00, rating: 4.7, reviewCount: 67, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 620 },

  // === LAHMACUN PIZZA TURCA (23-31) ===
  { id: pid(), name: 'Lahmacun de ternera', slug: 'lahmacun-de-ternera', number: 23, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne picada de ternera, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/23-lahmacun-de-ternera.webp', basePrice: 5.50, rating: 4.6, reviewCount: 84, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 600 },
  { id: pid(), name: 'Lahmacun de ternera solo carne', slug: 'lahmacun-de-ternera-solo-carne', number: 24, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne picada de ternera y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/24-lahmacun-de-ternera-solo-carne.webp', basePrice: 6.00, rating: 4.5, reviewCount: 46, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 550 },
  { id: pid(), name: 'Lahmacun de pollo', slug: 'lahmacun-de-pollo', number: 25, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne picada de pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/25-lahmacun-de-pollo.webp', basePrice: 5.50, rating: 4.5, reviewCount: 52, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 570 },
  { id: pid(), name: 'Lahmacun de pollo solo carne', slug: 'lahmacun-de-pollo-solo-carne', number: 26, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne picada de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/26-lahmacun-de-pollo-solo-carne.webp', basePrice: 6.00, rating: 4.4, reviewCount: 31, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 520 },
  { id: pid(), name: 'Lahmacun mixto', slug: 'lahmacun-mixto', number: 27, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne picada de ternera y de pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/27-lahmacun-mixto.webp', basePrice: 5.50, rating: 4.7, reviewCount: 69, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 610 },
  { id: pid(), name: 'Lahmacun mixto solo carne', slug: 'lahmacun-mixto-solo-carne', number: 28, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne de ternera y de pollo y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/28-lahmacun-mixto-solo-carne.webp', basePrice: 6.00, rating: 4.5, reviewCount: 37, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 560 },
  { id: pid(), name: 'Lahmacun loco', slug: 'lahmacun-loco', number: 29, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne de ternera o de pollo o mixta con patatas dentro y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/29-lahmacun-loco.webp', basePrice: 6.00, rating: 4.8, reviewCount: 58, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 720 },
  { id: pid(), name: 'Solo lahmacun', slug: 'solo-lahmacun', number: 30, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con carne picada, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/30-solo-lahmacun.webp', basePrice: 5.00, rating: 4.3, reviewCount: 24, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 480 },
  { id: pid(), name: 'Lahmacun falafel', slug: 'lahmacun-falafel', number: 31, category: 'Lahmacun Pizza Turca', categoryId: 'lahmacun', description: 'Masa de pizza turca con pasta de garbanzos, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/31-lahmacun-falafel.webp', basePrice: 5.50, rating: 4.4, reviewCount: 30, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 500 },

  // === ENSALADAS (32-35) ===
  { id: pid(), name: 'Ensalada verde', slug: 'ensalada-verde', number: 32, category: 'Ensaladas', categoryId: 'ensaladas', description: 'Lechuga, tomate, cebolla, pepino y oliva verde.', imageUrl: '/images/menu/32-ensalada-verde.webp', basePrice: 5.00, rating: 4.3, reviewCount: 42, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 180 },
  { id: pid(), name: 'Ensalada turka', slug: 'ensalada-turka', number: 33, category: 'Ensaladas', categoryId: 'ensaladas', description: 'Lechuga, tomate, cebolla, atún, aceitunas y queso de cabra.', imageUrl: '/images/menu/33-ensalada-turka.webp', basePrice: 5.50, rating: 4.5, reviewCount: 56, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['pescado', 'lactosa'], calories: 250 },
  { id: pid(), name: 'Ensalada de pollo', slug: 'ensalada-de-pollo', number: 34, category: 'Ensaladas', categoryId: 'ensaladas', description: 'Lechuga, tomate, pollo picado y cebolla.', imageUrl: '/images/menu/34-ensalada-de-pollo.webp', basePrice: 5.50, rating: 4.6, reviewCount: 48, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 320 },
  { id: pid(), name: 'Ensalada de ternera', slug: 'ensalada-de-ternera', number: 35, category: 'Ensaladas', categoryId: 'ensaladas', description: 'Lechuga, tomate y cebolla.', imageUrl: '/images/menu/35-ensalada-de-ternera.webp', basePrice: 5.50, rating: 4.4, reviewCount: 27, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 340 },

  // === PLATOS MENÚS (36-48) ===
  { id: pid(), name: 'Kebab al plato de ternera o pollo', slug: 'kebab-al-plato-de-ternera-o-pollo', number: 36, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Pan turco, carne de ternera o pollo, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt + patatas.', imageUrl: LOCAL_IMG.plato, basePrice: 6.50, rating: 4.7, reviewCount: 73, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-36', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-36', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 750 },
  { id: pid(), name: 'Kebab al plato mixto', slug: 'kebab-al-plato-mixto', number: 37, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Pan turco, carne de ternera y pollo + patatas y ensalada y nuestra deliciosa salsa de yogurt.', imageUrl: LOCAL_IMG.plato, basePrice: 7.00, rating: 4.8, reviewCount: 65, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-37', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-37', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 820 },
  { id: pid(), name: 'Kebab al plato mixto solo con carne y salsa', slug: 'kebab-al-plato-mixto-solo-carne-salsa', number: 38, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Pan turco, carne de ternera o pollo o mixto + patatas y salsa yogurt.', imageUrl: LOCAL_IMG.plato, basePrice: 7.50, rating: 4.6, reviewCount: 41, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-38', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-38', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 780 },
  { id: pid(), name: 'Kebab al plato falafel', slug: 'kebab-al-plato-falafel', number: 39, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Pan turco, pasta de garbanzos (5 unidades), lechuga, tomate, cebolla y nuestra salsa yogurt + patatas.', imageUrl: UNSPLASH_IMG('photo-1593001874117-c99c800e3eb7'), basePrice: 6.50, rating: 4.4, reviewCount: 33, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-39', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-39', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 680 },
  { id: pid(), name: 'Plato degustación', slug: 'plato-degustacion', number: 40, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Pan turco, carne de ternera y pollo, falafel, arroz, lechuga, tomate, cebolla, queso y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/40-plato-degustacion.webp', basePrice: 8.00, rating: 4.9, reviewCount: 54, isPopular: true, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 950 },
  { id: pid(), name: 'Menú kebab', slug: 'menu-kebab', number: 41, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Pan de pita turco, carne de ternera o de pollo mixta, lechuga, tomate, cebolla, queso y nuestra deliciosa salsa yogurt + patatas + bebida.', imageUrl: LOCAL_IMG.kebab, basePrice: 7.00, rating: 4.8, reviewCount: 189, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [{ id: 'mod-41', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-41', name: 'Añadir queso (+0,50€)', priceDelta: 0.50, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 850 },
  { id: pid(), name: 'Menú dürüm', slug: 'menu-durum', number: 42, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Masa fina turca, carne de ternera, de pollo o mixta, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt + patatas + bebida.', imageUrl: LOCAL_IMG.durum, basePrice: 7.50, rating: 4.8, reviewCount: 156, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [{ id: 'mod-42', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-42', name: 'Añadir queso (+0,50€)', priceDelta: 0.50, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 880 },
  { id: pid(), name: 'Menú lahmacun pizza turca', slug: 'menu-lahmacun-pizza-turca', number: 43, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Masa de pizza turca con carne picada de ternera o pollo o mixta, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt + patatas + bebida.', imageUrl: '/images/menu/43-menu-lahmacun.webp', basePrice: 8.00, rating: 4.6, reviewCount: 72, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 900 },
  { id: pid(), name: 'Menú infantil de kebab o dürüm', slug: 'menu-infantil-de-kebab-o-durum', number: 44, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Masa fina turca o pan turco con carne de ternera o de pollo o mixta y nuestra deliciosa salsa de yogurt + patatas + zumo o batido.', imageUrl: LOCAL_IMG.kebab, basePrice: 7.00, rating: 4.5, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-44', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-44', name: 'Añadir queso (+0,30€)', priceDelta: 0.30, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 650 },
  { id: pid(), name: 'Menú alitas de pollo o nuggets', slug: 'menu-alitas-de-pollo-o-nuggets', number: 45, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Alitas de pollo o nuggets de pollo + patatas y bebida.', imageUrl: '/images/menu/45-menu-alitas-de-pollo-o-nuggets.webp', basePrice: 7.00, rating: 4.6, reviewCount: 81, isPopular: true, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 720 },
  { id: pid(), name: 'Menú hamburguesa', slug: 'menu-hamburguesa', number: 46, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Hamburguesa de pollo o ternera, patatas, lechuga, tomate, queso y refresco.', imageUrl: '/images/menu/46-menu-hamburguesa.webp', basePrice: 7.00, rating: 4.7, reviewCount: 95, isPopular: true, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 880 },
  { id: pid(), name: 'Menú calamares', slug: 'menu-calamares', number: 47, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Calamares, patatas y bebida.', imageUrl: '/images/menu/47-menu-calamares.webp', basePrice: 7.50, rating: 4.5, reviewCount: 63, isPopular: false, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 700 },
  { id: pid(), name: 'Menú SEEKH KEBAB', slug: 'menu-seekh-kebab', number: 48, category: 'Platos Menús', categoryId: 'platos-menus', description: 'Con arroz o patatas y bebida.', imageUrl: LOCAL_IMG.seekh, basePrice: 7.00, rating: 4.6, reviewCount: 47, isPopular: false, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [{ id: 'mod-48', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-48', name: 'Menú de maxi o solo carne (+0,50€)', priceDelta: 0.50, isDefault: false }] }], allergens: ['gluten'], calories: 750 },

  // === RACIONES (49-65) ===
  { id: pid(), name: 'Ración de patatas fritas', slug: 'racion-de-patatas-fritas', number: 49, category: 'Raciones', categoryId: 'raciones', description: 'Ración de patatas fritas crujientes y doradas.', imageUrl: '/images/menu/49-racion-de-patatas-fritas.webp', basePrice: 2.80, rating: 4.5, reviewCount: 56, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 350 },
  { id: pid(), name: 'Ración de patatas bravas o alioli', slug: 'racion-de-patatas-bravas-o-alioli', number: 50, category: 'Raciones', categoryId: 'raciones', description: 'Patatas bravas con salsa picante casera o salsa alioli.', imageUrl: '/images/menu/50-racion-de-patatas-bravas-o-alioli.webp', basePrice: 3.50, rating: 4.6, reviewCount: 48, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 380 },
  { id: pid(), name: 'Ración de patatas deluxe', slug: 'racion-de-patatas-deluxe', number: 51, category: 'Raciones', categoryId: 'raciones', description: 'Patatas deluxe sazonadas con especias especiales.', imageUrl: '/images/menu/51-racion-de-patatas-deluxe.webp', basePrice: 3.50, rating: 4.5, reviewCount: 32, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 400 },
  { id: pid(), name: 'Samosa', slug: 'samosa', number: 52, category: 'Raciones', categoryId: 'raciones', description: 'Empanadilla crujiente rellena de verduras y especias.', imageUrl: '/images/menu/52-samosa.webp', basePrice: 4.50, rating: 4.7, reviewCount: 29, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 250 },
  { id: pid(), name: 'Ración falafel', slug: 'racion-falafel', number: 53, category: 'Raciones', categoryId: 'raciones', description: 'Croquetas de garbanzo especiadas y doradas.', imageUrl: '/images/menu/53-racion-falafel.webp', basePrice: 4.00, rating: 4.5, reviewCount: 36, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 320 },
  { id: pid(), name: 'Ración de pedrata', slug: 'racion-de-pedrata', number: 54, category: 'Raciones', categoryId: 'raciones', description: 'Especialidad de la casa con patatas y salsas.', imageUrl: '/images/menu/54-racion-de-pedrata.webp', basePrice: 4.00, rating: 4.6, reviewCount: 21, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 380 },
  { id: pid(), name: 'Arroz basmati de india', slug: 'arroz-basmati-de-india', number: 55, category: 'Raciones', categoryId: 'raciones', description: 'Arroz basmati aromático cocinado al estilo indio.', imageUrl: '/images/menu/55-arroz-basmati-de-india.webp', basePrice: 4.00, rating: 4.4, reviewCount: 18, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 280 },
  { id: pid(), name: 'Rabas', slug: 'rabas', number: 56, category: 'Raciones', categoryId: 'raciones', description: 'Rabas de calamar empanadas y fritas crujientes.', imageUrl: '/images/menu/56-rabas.webp', basePrice: 5.00, rating: 4.7, reviewCount: 34, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 420 },
  { id: pid(), name: 'Alitas de pollo', slug: 'alitas-de-pollo', number: 57, category: 'Raciones', categoryId: 'raciones', description: 'Alitas de pollo sabrosas y crujientes.', imageUrl: '/images/menu/57-alitas-de-pollo.webp', basePrice: 4.50, rating: 4.6, reviewCount: 52, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 380 },
  { id: pid(), name: 'Nuggets de pollo', slug: 'nuggets-de-pollo', number: 58, category: 'Raciones', categoryId: 'raciones', description: 'Nuggets de pollo empanados fritas.', imageUrl: '/images/menu/58-nuggets-de-pollo.webp', basePrice: 4.50, rating: 4.5, reviewCount: 39, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 350 },
  { id: pid(), name: 'Ración de calamares', slug: 'racion-de-calamares', number: 59, category: 'Raciones', categoryId: 'raciones', description: 'Anillas de calamar crujientes a la romana.', imageUrl: '/images/menu/59-racion-de-calamares.webp', basePrice: 5.00, rating: 4.6, reviewCount: 43, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 440 },
  { id: pid(), name: 'Bola de carne', slug: 'bola-de-carne', number: 60, category: 'Raciones', categoryId: 'raciones', description: 'Bola de carne frita crujiente. Precio por unidad.', imageUrl: '/images/menu/60-bola-de-carne.webp', basePrice: 2.50, rating: 4.4, reviewCount: 25, isPopular: false, isActive: true, isNew: true, isFeatured: false, priceUnit: 'unidad', variants: [], modifiers: [], allergens: ['gluten'], calories: 180 },
  { id: pid(), name: 'Bola de queso', slug: 'bola-de-queso', number: 61, category: 'Raciones', categoryId: 'raciones', description: 'Bola de queso fundido crujiente. Precio por unidad.', imageUrl: '/images/menu/61-bola-de-queso.webp', basePrice: 2.50, rating: 4.5, reviewCount: 31, isPopular: false, isActive: true, isNew: true, isFeatured: false, priceUnit: 'unidad', variants: [], modifiers: [], allergens: ['lactosa', 'gluten'], calories: 200 },
  { id: pid(), name: 'Fingers de pollo', slug: 'fingers-de-pollo', number: 62, category: 'Raciones', categoryId: 'raciones', description: 'Tiras de pechuga de pollo crujientes.', imageUrl: '/images/menu/62-fingers-de-pollo.webp', basePrice: 5.00, rating: 4.6, reviewCount: 44, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 400 },
  { id: pid(), name: 'Pop corn de pollo', slug: 'pop-corn-de-pollo', number: 63, category: 'Raciones', categoryId: 'raciones', description: 'Bocaditos crujientes de pollo estilo pop corn.', imageUrl: '/images/menu/63-pop-corn-de-pollo.webp', basePrice: 4.50, rating: 4.5, reviewCount: 28, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 360 },
  { id: pid(), name: 'Pedrata Grande', slug: 'pedrata-grande', number: 64, category: 'Raciones', categoryId: 'raciones', description: 'Pedrata tamaño ración grande con salsas.', imageUrl: '/images/menu/64-pedrata-grande.webp', basePrice: 6.00, rating: 4.7, reviewCount: 19, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 550 },
  { id: pid(), name: 'Aros de cebolla', slug: 'aros-de-cebolla', number: 65, category: 'Raciones', categoryId: 'raciones', description: 'Aros de cebolla crujientes y dorados.', imageUrl: '/images/menu/65-aros-de-cebolla.webp', basePrice: 4.00, rating: 4.4, reviewCount: 22, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 320 },

  // === BEBIDAS (66-76) ===
  { id: pid(), name: 'Pepsi', slug: 'bebida-pepsi', number: 66, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl.', imageUrl: '/images/menu/66-pepsi.webp', basePrice: 1.80, rating: 4.5, reviewCount: 45, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 150 },
  { id: pid(), name: 'Pepsi Cero', slug: 'bebida-pepsi-cero', number: 67, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl sin azúcar.', imageUrl: '/images/menu/67-pepsi-cero.webp', basePrice: 1.80, rating: 4.4, reviewCount: 30, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 0 },
  { id: pid(), name: 'Pepsi Light', slug: 'bebida-pepsi-light', number: 68, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl.', imageUrl: '/images/menu/68-pepsi-light.webp', basePrice: 1.80, rating: 4.3, reviewCount: 22, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 5 },
  { id: pid(), name: 'Kas Naranja', slug: 'bebida-kas-naranja', number: 69, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl.', imageUrl: '/images/menu/69-kas-naranja.webp', basePrice: 1.80, rating: 4.5, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 130 },
  { id: pid(), name: 'Kas Limón', slug: 'bebida-kas-limon', number: 70, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl.', imageUrl: '/images/menu/70-kas-limon.webp', basePrice: 1.80, rating: 4.4, reviewCount: 29, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 120 },
  { id: pid(), name: 'Aquarius Naranja', slug: 'bebida-aquarius-naranja', number: 71, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl.', imageUrl: '/images/menu/71-aquarius-naranja.webp', basePrice: 1.80, rating: 4.5, reviewCount: 40, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 110 },
  { id: pid(), name: 'Aquarius Limón', slug: 'bebida-aquarius-limon', number: 72, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl.', imageUrl: '/images/menu/72-aquarius-limon.webp', basePrice: 1.80, rating: 4.4, reviewCount: 35, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 100 },
  { id: pid(), name: 'Agua', slug: 'bebida-agua', number: 73, category: 'Bebidas', categoryId: 'bebidas', description: 'Botella 50cl.', imageUrl: '/images/menu/73-agua.webp', basePrice: 1.00, rating: 4.5, reviewCount: 60, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 0 },
  { id: pid(), name: '1L Pepsi', slug: 'bebida-1l-pepsi', number: 74, category: 'Bebidas', categoryId: 'bebidas', description: 'Botella de 1 Litro.', imageUrl: '/images/menu/74-1l-pepsi.webp', basePrice: 2.50, rating: 4.6, reviewCount: 88, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 420 },
  { id: pid(), name: 'Nestea', slug: 'bebida-nestea', number: 75, category: 'Bebidas', categoryId: 'bebidas', description: 'Lata 33cl.', imageUrl: '/images/menu/75-nestea.webp', basePrice: 1.80, rating: 4.5, reviewCount: 34, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 120 },
  { id: pid(), name: 'Zumo tropical', slug: 'bebida-zumo-tropical', number: 76, category: 'Bebidas', categoryId: 'bebidas', description: 'Zumo tropical 33cl.', imageUrl: '/images/menu/76-zumo-tropical.webp', basePrice: 1.80, rating: 4.5, reviewCount: 19, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 130 },

  // === FEATURED MENUS & COMBOS (Image 2) ===
  { id: pid(), name: 'Menú Kebab', slug: 'featured-menu-kebab', category: 'Menús Destacados', categoryId: 'featured', description: 'Kebab (pan pita) + Patatas + Bebida', imageUrl: LOCAL_IMG.kebab, basePrice: 7.00, rating: 4.8, reviewCount: 189, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 850 },
  { id: pid(), name: 'Menú Dürüm', slug: 'featured-menu-durum', category: 'Menús Destacados', categoryId: 'featured', description: 'Dürüm (pan fino) + Patatas + Bebida', imageUrl: LOCAL_IMG.durum, basePrice: 7.50, rating: 4.8, reviewCount: 156, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 880 },
  { id: pid(), name: '3 Uds de pollo y patatas fritas', slug: 'featured-3-uds-de-pollo', category: 'Menús Destacados', categoryId: 'featured', description: '3 Unidades de pollo crujiente + Patatas fritas', imageUrl: UNSPLASH_IMG('photo-1562967914-608f82629710'), basePrice: 8.00, rating: 4.7, reviewCount: 98, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 720 },
  { id: pid(), name: 'Menú Pollo Crujiente', slug: 'featured-menu-pollo-crujiente', category: 'Menús Destacados', categoryId: 'featured', description: 'Pollo crujiente + Patatas + Bebida', imageUrl: UNSPLASH_IMG('photo-1562967914-608f82629710'), basePrice: 7.50, rating: 4.6, reviewCount: 76, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 780 },
  { id: pid(), name: 'Menú Nuggets', slug: 'featured-menu-nuggets', category: 'Menús Destacados', categoryId: 'featured', description: 'Nuggets de pollo + Patatas + Bebida', imageUrl: UNSPLASH_IMG('photo-1562967914-608f82629710'), basePrice: 7.00, rating: 4.5, reviewCount: 64, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 700 },
  { id: pid(), name: 'Menú Alitas de Pollo', slug: 'featured-menu-alitas-de-pollo', category: 'Menús Destacados', categoryId: 'featured', description: 'Alitas de pollo + Patatas + Bebida', imageUrl: UNSPLASH_IMG('photo-1527477396000-e27163b481c2'), basePrice: 7.00, rating: 4.6, reviewCount: 81, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: [], calories: 720 },
  { id: pid(), name: 'Calamares', slug: 'featured-calamares', category: 'Menús Destacados', categoryId: 'featured', description: 'Ración de calamares + Patatas + Bebida', imageUrl: UNSPLASH_IMG('photo-1599487488170-d11ec9c172f0'), basePrice: 7.50, rating: 4.5, reviewCount: 63, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 700 },
  { id: pid(), name: 'Menú Wrap Seekh Kebab', slug: 'featured-menu-wrap-seekh-kebab', category: 'Menús Destacados', categoryId: 'featured', description: 'Wrap Seekh Kebab + Patatas + Bebida', imageUrl: LOCAL_IMG.seekh, basePrice: 8.00, rating: 4.7, reviewCount: 52, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 820 },
  { id: pid(), name: 'Menú Hamburguesa', slug: 'featured-menu-hamburguesa', category: 'Menús Destacados', categoryId: 'featured', description: 'Hamburguesa completa + Patatas + Bebida', imageUrl: LOCAL_IMG.burger, basePrice: 7.00, rating: 4.7, reviewCount: 95, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 880 },
  { id: pid(), name: 'Menú Hamburguesa Doble', slug: 'featured-menu-hamburguesa-doble', category: 'Menús Destacados', categoryId: 'featured', description: 'Hamburguesa doble + Patatas + Bebida', imageUrl: LOCAL_IMG.burger, basePrice: 9.50, rating: 4.8, reviewCount: 73, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 1100 },
  { id: pid(), name: 'Menú Seekh Kebab', slug: 'featured-menu-seekh-kebab', category: 'Menús Destacados', categoryId: 'featured', description: 'Seekh Kebab + Patatas o Arroz + Bebida', imageUrl: LOCAL_IMG.seekh, basePrice: 7.50, rating: 4.6, reviewCount: 47, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 750 },
  { id: pid(), name: 'Menú Pop Corn', slug: 'featured-menu-pop-corn', category: 'Menús Destacados', categoryId: 'featured', description: 'Pop corn de pollo + Patatas + Bebida', imageUrl: UNSPLASH_IMG('photo-1562967914-608f82629710'), basePrice: 7.00, rating: 4.5, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 680 },
  { id: pid(), name: 'Menú Donner Box', slug: 'featured-menu-donner-box', category: 'Menús Destacados', categoryId: 'featured', description: 'Caja Kebab con carne + patatas + bebida', imageUrl: LOCAL_IMG.plato, basePrice: 6.00, rating: 4.6, reviewCount: 56, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 650 },
]

// ─── Special Offers (Source Image 2) ───────────────────
export interface SpecialOffer {
  id: string
  title: string
  base: string
  imageUrl: string
  options: { label: string; price: number }[]
}

export const specialOffers: SpecialOffer[] = [
  {
    id: 'offer-durum',
    title: 'Oferta Especial — Dürüm',
    base: '1 Patatas + 1L Bebida',
    imageUrl: LOCAL_IMG.durum,
    options: [
      { label: '+2 dürüm', price: 14.00 },
      { label: '+3 dürüm', price: 17.00 },
      { label: '+4 dürüm', price: 22.00 },
      { label: '2 patatas + 5 dürüm', price: 26.00 },
    ],
  },
  {
    id: 'offer-kebab',
    title: 'Oferta Especial — Kebab',
    base: '1 Patatas + 1L Bebida',
    imageUrl: LOCAL_IMG.kebab,
    options: [
      { label: '+2 kebab', price: 12.00 },
      { label: '+3 kebab', price: 15.00 },
      { label: '+4 kebab', price: 19.00 },
      { label: '2 patatas + 5 kebab', price: 23.00 },
    ],
  },
]

// ─── Promotions (for promo carousel) ──────────────────
export const promotions: Promotion[] = [
  { id: 'promo-1', title: 'Oferta Especial — Dürüm', subtitle: '1 Patatas + 1L Bebida + 2 Dürüm', imageUrl: LOCAL_IMG.durum, badgeText: '14,00€', sortOrder: 0, isActive: true },
  { id: 'promo-2', title: 'Oferta Especial — Kebab', subtitle: '1 Patatas + 1L Bebida + 2 Kebab', imageUrl: LOCAL_IMG.kebab, badgeText: '12,00€', sortOrder: 1, isActive: true },
  { id: 'promo-3', title: 'Menú Hamburguesa Doble', subtitle: 'Hamburguesa Doble + Patatas + Bebida', imageUrl: LOCAL_IMG.burger, badgeText: '9,50€', sortOrder: 2, isActive: true },
  { id: 'promo-4', title: 'Menú Donner Box', subtitle: 'Box Carne + Patatas + Bebida', imageUrl: LOCAL_IMG.plato, badgeText: '6,00€', sortOrder: 3, isActive: true },
]

// ─── Restaurant / Delivery Info ─────────────────────────
export const restaurantInfo = {
  name: 'KEBAB BITERI',
  type: 'DONNER KEBAB',
  cuisine: 'COMIDA TURCA — PLATOS COMBINADOS — HAMBURGUESAS',
  deliveryPlatforms: ['Uber Eats', 'Glovo', 'Just Eat'],
  payment: 'TU PAGO CON TARJETA TAMBIÉN EN TU DOMICILIO',
  phone1: '943 504 833',
  phone2: '671 374 739',
  deliveryHours: 'DE 12:30H A 23:30H',
  delivery: '¡SERVICIO A DOMICILIO GRATIS!',
  minOrderRenteria: 'PEDIDO MÍNIMO 10€ — RENTERIA',
  minOrderPasajes: 'PEDIDO MÍNIMO 13€ — PASAJES, OIARTZUN',
  halal: true,
}

// ─── Full Menu Response ────────────────────────────────
export const menuData: MenuResponse = {
  categories,
  products: products as unknown as Product[],
  promotions,
}

// ─── Helper Functions ─────────────────────────────────
export function getProductBySlug(slug: string): MenuItem | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(categoryId: string): MenuItem[] {
  return products.filter((p) => p.categoryId === categoryId)
}

export function getPopularProducts(): MenuItem[] {
  return products.filter((p) => p.isPopular)
}

export function getFeaturedProducts(): MenuItem[] {
  return products.filter((p) => p.isFeatured)
}

export function getNewProducts(): MenuItem[] {
  return products.filter((p) => p.isNew)
}
