import mongoose from 'mongoose'
import * as bcrypt from 'bcryptjs'

const DB_URL = process.env.DATABASE_URL ?? 'mongodb://localhost:27017/'
const { ObjectId } = mongoose.Schema.Types

// Inline schemas for seeding
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DELIVERY'], default: 'CUSTOMER' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  iconUrl: String,
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  street: String, city: String, postalCode: String,
  lat: Number, lng: Number, phone: String,
  deliveryRadiusKm: { type: Number, default: 5.0 },
  deliveryFee: { type: Number, default: 1.99 },
  minOrderAmount: { type: Number, default: 10.0 },
  avgPrepTimeMin: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true },
  openingHours: [{ dayOfWeek: Number, openTime: String, closeTime: String, closed: Boolean }],
}, { timestamps: true })

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  imageUrl: String,
  categoryId: { type: ObjectId, ref: 'Category' },
  basePrice: Number,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  allergens: [String],
  calories: Number,
  variants: [{ name: String, price: Number, calories: Number, isDefault: Boolean }],
  modifiers: [{ name: String, minSelect: Number, maxSelect: Number, options: [{ name: String, priceDelta: Number, isDefault: Boolean }] }],
  deletedAt: Date,
}, { timestamps: true })

const PromotionSchema = new mongoose.Schema({
  title: String, subtitle: String, imageUrl: String, badgeText: String,
  sortOrder: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true })

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_DELIVERY'] },
  value: Number, minOrderAmount: { type: Number, default: 0 },
  maxUses: Number, usesCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
})

async function main() {
  console.log('🌱 Seeding Kebab Biteri MongoDB...')
  await mongoose.connect(DB_URL)
  console.log('Connected to MongoDB')

  const User = mongoose.model('User', UserSchema)
  const Category = mongoose.model('Category', CategorySchema)
  const Branch = mongoose.model('Branch', BranchSchema)
  const Product = mongoose.model('Product', ProductSchema)
  const Promotion = mongoose.model('Promotion', PromotionSchema)
  const Coupon = mongoose.model('Coupon', CouponSchema)

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Branch.deleteMany({}),
    Product.deleteMany({}), Promotion.deleteMany({}), Coupon.deleteMany({}),
  ])
  console.log('Cleared existing data')

  // ─── Admin user ─────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  await User.create({
    email: 'admin@kebabbiteri.com', firstName: 'Admin', lastName: 'Biteri',
    role: 'ADMIN', passwordHash: adminPassword,
  })
  console.log('✓ Admin user created')

  // ─── Branch ─────────────────────────────────────
  const branch = await Branch.create({
    name: 'Kebab Biteri Madrid Centro', slug: 'madrid-centro',
    street: 'Calle Gran Vía 45', city: 'Madrid', postalCode: '28013',
    lat: 40.4203, lng: -3.7058, phone: '+34 910 000 000',
    deliveryRadiusKm: 5.0, deliveryFee: 1.99, minOrderAmount: 10.0, avgPrepTimeMin: 20,
    openingHours: Array.from({ length: 7 }, (_, day) => ({
      dayOfWeek: day, openTime: '11:00', closeTime: '23:30', closed: day === 0,
    })),
  })
  console.log('✓ Branch created')

  // ─── Categories ─────────────────────────────────
    const categories = [
    { name: 'Doner Kebab', slug: 'doner-kebab', sortOrder: 1 },
    { name: 'Doner Dürüm', slug: 'doner-durum', sortOrder: 2 },
    { name: 'Hamburguesa', slug: 'hamburguesa', sortOrder: 3 },
    { name: 'Wrap', slug: 'wrap', sortOrder: 4 },
    { name: 'Lahmacun Pizza Turca', slug: 'lahmacun', sortOrder: 5 },
    { name: 'Ensaladas', slug: 'ensaladas', sortOrder: 6 },
    { name: 'Platos Menús', slug: 'platos-menus', sortOrder: 7 },
    { name: 'Raciones', slug: 'raciones', sortOrder: 8 },
    { name: 'Bebidas', slug: 'bebidas', sortOrder: 9 },
  ]
  const createdCats = await Category.create(categories)
  console.log(`✓ ${createdCats.length} categories created`)

  const getCat = (slug: string) => createdCats.find((c: any) => c.slug === slug)?._id

  // ─── Products ──────────────────────────────────
    const products = [
  // === DONER KEBAB (1-10) ===
  { name: 'Kebab de ternera', slug: 'kebab-de-ternera', number: 1, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de ternera, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/01-kebab-de-ternera.webp', basePrice: 4.50, rating: 4.8, reviewCount: 156, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 550 },
  { name: 'Kebab de ternera solo carne', slug: 'kebab-de-ternera-solo-carne', number: 2, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de ternera y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/02-kebab-de-ternera-solo-carne.webp', basePrice: 5.00, rating: 4.6, reviewCount: 89, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 500 },
  { name: 'Kebab de pollo', slug: 'kebab-de-pollo', number: 3, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de pollo, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/03-kebab-de-pollo.webp', basePrice: 4.50, rating: 4.7, reviewCount: 203, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 520 },
  { name: 'Kebab de pollo solo carne', slug: 'kebab-de-pollo-solo-carne', number: 4, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/04-kebab-de-pollo-solo-carne.webp', basePrice: 5.00, rating: 4.5, reviewCount: 67, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 480 },
  { name: 'Kebab mixto', slug: 'kebab-mixto', number: 5, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de ternera y de pollo, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/05-kebab-mixto.webp', basePrice: 4.50, rating: 4.8, reviewCount: 178, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 560 },
  { name: 'Kebab mixto solo carne', slug: 'kebab-mixto-solo-carne', number: 6, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de ternera y de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/06-kebab-mixto-solo-carne.webp', basePrice: 5.00, rating: 4.5, reviewCount: 54, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 510 },
  { name: 'Kebab loco', slug: 'kebab-loco', number: 7, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de ternera y de pollo o mixta con patatas dentro y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/07-kebab-loco.webp', basePrice: 5.00, rating: 4.9, reviewCount: 92, isPopular: true, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 650 },
  { name: 'Kebab vegetal', slug: 'kebab-vegetal', number: 8, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/08-kebab-vegetal.webp', basePrice: 4.00, rating: 4.3, reviewCount: 41, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 380 },
  { name: 'Kebab falafel', slug: 'kebab-falafel', number: 9, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, pasta de garbanzos, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/09-kebab-falafel.webp', basePrice: 4.50, rating: 4.4, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 420 },
  { name: 'Kebab infantil', slug: 'kebab-infantil', number: 10, category: 'Doner Kebab', categoryId: getCat('doner-kebab'), description: 'Pan de pita turco, carne de ternera y de pollo o mixta y si quieres con nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/10-kebab-infantil.webp', basePrice: 4.50, rating: 4.6, reviewCount: 33, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 400 },

  // === DONER DÜRÜM (11-20) ===
  { name: 'Doner dürüm de ternera', slug: 'doner-durum-de-ternera', number: 11, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de ternera, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/11-doner-durum-de-ternera.webp', basePrice: 5.00, rating: 4.8, reviewCount: 124, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 580 },
  { name: 'Dürüm de ternera solo carne', slug: 'durum-de-ternera-solo-carne', number: 12, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de ternera y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/12-durum-de-ternera-solo-carne.webp', basePrice: 5.50, rating: 4.5, reviewCount: 76, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 530 },
  { name: 'Dürüm de pollo', slug: 'durum-de-pollo', number: 13, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/13-durum-de-pollo.webp', basePrice: 5.00, rating: 4.7, reviewCount: 98, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 540 },
  { name: 'Dürüm de pollo solo carne', slug: 'durum-de-pollo-solo-carne', number: 14, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/14-durum-de-pollo-solo-carne.webp', basePrice: 5.50, rating: 4.4, reviewCount: 51, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 490 },
  { name: 'Dürüm mixto', slug: 'durum-mixto', number: 15, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de ternera y pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/15-durum-mixto.webp', basePrice: 5.00, rating: 4.8, reviewCount: 145, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 590 },
  { name: 'Dürüm mixto solo carne', slug: 'durum-mixto-solo-carne', number: 16, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de ternera o pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/16-durum-mixto-solo-carne.webp', basePrice: 5.50, rating: 4.5, reviewCount: 43, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 540 },
  { name: 'Dürüm loco', slug: 'durum-loco', number: 17, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de ternera o de pollo o mixta con patatas y dentro nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/17-durum-loco.webp', basePrice: 5.50, rating: 4.9, reviewCount: 78, isPopular: true, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 680 },
  { name: 'Dürüm vegetal', slug: 'durum-vegetal', number: 18, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/18-durum-vegetal.webp', basePrice: 4.50, rating: 4.2, reviewCount: 29, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 400 },
  { name: 'Dürüm falafel', slug: 'durum-falafel', number: 19, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, pasta de garbanzos, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/19-durum-falafel.webp', basePrice: 4.50, rating: 4.3, reviewCount: 35, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 440 },
  { name: 'Dürüm infantil', slug: 'durum-infantil', number: 20, category: 'Doner Dürüm', categoryId: getCat('doner-durum'), description: 'Masa fina turca, carne de ternera o de pollo o mixta y si quieres con nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/20-durum-infantil.webp', basePrice: 5.00, rating: 4.5, reviewCount: 28, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 420 },

  // === HAMBURGUESA (21) ===
  { name: 'Hamburguesa completa', slug: 'hamburguesa-completa', number: 21, category: 'Hamburguesa', categoryId: getCat('hamburguesa'), description: 'Hamburguesa de pollo o ternera, lechuga, tomate, queso, kétchup, mahonesa.', imageUrl: '/images/menu/21-hamburguesa-completa.webp', basePrice: 4.50, rating: 4.7, reviewCount: 112, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 520 },

  // === WRAP (22) ===
  { name: 'Wrap seekh kebab', slug: 'wrap-seekh-kebab', number: 22, category: 'Wrap', categoryId: getCat('wrap'), description: 'Wrap de pan fino turco con brocheta seekh kebab, lechuga, tomate, cebolla y salsa yogurt.', imageUrl: '/images/menu/22-wrap-seekh-kebab.webp', basePrice: 6.00, rating: 4.7, reviewCount: 67, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 620 },

  // === LAHMACUN PIZZA TURCA (23-31) ===
  { name: 'Lahmacun de ternera', slug: 'lahmacun-de-ternera', number: 23, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne picada de ternera, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/23-lahmacun-de-ternera.webp', basePrice: 5.50, rating: 4.6, reviewCount: 84, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 600 },
  { name: 'Lahmacun de ternera solo carne', slug: 'lahmacun-de-ternera-solo-carne', number: 24, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne picada de ternera y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/24-lahmacun-de-ternera-solo-carne.webp', basePrice: 6.00, rating: 4.5, reviewCount: 46, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 550 },
  { name: 'Lahmacun de pollo', slug: 'lahmacun-de-pollo', number: 25, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne picada de pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/25-lahmacun-de-pollo.webp', basePrice: 5.50, rating: 4.5, reviewCount: 52, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 570 },
  { name: 'Lahmacun de pollo solo carne', slug: 'lahmacun-de-pollo-solo-carne', number: 26, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne picada de pollo y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/26-lahmacun-de-pollo-solo-carne.webp', basePrice: 6.00, rating: 4.4, reviewCount: 31, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 520 },
  { name: 'Lahmacun mixto', slug: 'lahmacun-mixto', number: 27, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne picada de ternera y de pollo, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/27-lahmacun-mixto.webp', basePrice: 5.50, rating: 4.7, reviewCount: 69, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 610 },
  { name: 'Lahmacun mixto solo carne', slug: 'lahmacun-mixto-solo-carne', number: 28, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne de ternera y de pollo y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/28-lahmacun-mixto-solo-carne.webp', basePrice: 6.00, rating: 4.5, reviewCount: 37, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 560 },
  { name: 'Lahmacun loco', slug: 'lahmacun-loco', number: 29, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne de ternera o de pollo o mixta con patatas dentro y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/29-lahmacun-loco.webp', basePrice: 6.00, rating: 4.8, reviewCount: 58, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 720 },
  { name: 'Solo lahmacun', slug: 'solo-lahmacun', number: 30, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con carne picada, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/30-solo-lahmacun.webp', basePrice: 5.00, rating: 4.3, reviewCount: 24, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 480 },
  { name: 'Lahmacun falafel', slug: 'lahmacun-falafel', number: 31, category: 'Lahmacun Pizza Turca', categoryId: getCat('lahmacun'), description: 'Masa de pizza turca con pasta de garbanzos, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/31-lahmacun-falafel.webp', basePrice: 5.50, rating: 4.4, reviewCount: 30, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 500 },

  // === ENSALADAS (32-35) ===
  { name: 'Ensalada verde', slug: 'ensalada-verde', number: 32, category: 'Ensaladas', categoryId: getCat('ensaladas'), description: 'Lechuga, tomate, cebolla, pepino y oliva verde.', imageUrl: '/images/menu/32-ensalada-verde.webp', basePrice: 5.00, rating: 4.3, reviewCount: 42, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 180 },
  { name: 'Ensalada turka', slug: 'ensalada-turka', number: 33, category: 'Ensaladas', categoryId: getCat('ensaladas'), description: 'Lechuga, tomate, cebolla, atún, aceitunas y queso de cabra.', imageUrl: '/images/menu/33-ensalada-turka.webp', basePrice: 5.50, rating: 4.5, reviewCount: 56, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['pescado', 'lactosa'], calories: 250 },
  { name: 'Ensalada de pollo', slug: 'ensalada-de-pollo', number: 34, category: 'Ensaladas', categoryId: getCat('ensaladas'), description: 'Lechuga, tomate, pollo picado y cebolla.', imageUrl: '/images/menu/34-ensalada-de-pollo.webp', basePrice: 5.50, rating: 4.6, reviewCount: 48, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 320 },
  { name: 'Ensalada de ternera', slug: 'ensalada-de-ternera', number: 35, category: 'Ensaladas', categoryId: getCat('ensaladas'), description: 'Lechuga, tomate y cebolla.', imageUrl: '/images/menu/35-ensalada-de-ternera.webp', basePrice: 5.50, rating: 4.4, reviewCount: 27, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 340 },

  // === PLATOS MENÚS (36-48) ===
  { name: 'Kebab al plato de ternera o pollo', slug: 'kebab-al-plato-de-ternera-o-pollo', number: 36, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Pan turco, carne de ternera o pollo, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt + patatas.', imageUrl: '/images/menu/36-kebab-al-plato-de-ternera-o-pollo.webp', basePrice: 6.50, rating: 4.7, reviewCount: 73, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-36', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-36', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 750 },
  { name: 'Kebab al plato mixto', slug: 'kebab-al-plato-mixto', number: 37, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Pan turco, carne de ternera y pollo + patatas y ensalada y nuestra deliciosa salsa de yogurt.', imageUrl: '/images/menu/36-kebab-al-plato-de-ternera-o-pollo.webp', basePrice: 7.00, rating: 4.8, reviewCount: 65, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-37', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-37', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 820 },
  { name: 'Kebab al plato mixto solo con carne y salsa', slug: 'kebab-al-plato-mixto-solo-carne-salsa', number: 38, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Pan turco, carne de ternera o pollo o mixto + patatas y salsa yogurt.', imageUrl: '/images/menu/36-kebab-al-plato-de-ternera-o-pollo.webp', basePrice: 7.50, rating: 4.6, reviewCount: 41, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-38', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-38', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 780 },
  { name: 'Kebab al plato falafel', slug: 'kebab-al-plato-falafel', number: 39, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Pan turco, pasta de garbanzos (5 unidades), lechuga, tomate, cebolla y nuestra salsa yogurt + patatas.', imageUrl: '/images/menu/39-kebab-al-plato-falafel.webp', basePrice: 6.50, rating: 4.4, reviewCount: 33, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-39', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-39', name: 'Añadir arroz (+1,00€)', priceDelta: 1.00, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 680 },
  { name: 'Plato degustación', slug: 'plato-degustacion', number: 40, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Pan turco, carne de ternera y pollo, falafel, arroz, lechuga, tomate, cebolla, queso y nuestra deliciosa salsa yogurt.', imageUrl: '/images/menu/40-plato-degustacion.webp', basePrice: 8.00, rating: 4.9, reviewCount: 54, isPopular: true, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 950 },
  { name: 'Menú kebab', slug: 'menu-kebab', number: 41, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Pan de pita turco, carne de ternera o de pollo mixta, lechuga, tomate, cebolla, queso y nuestra deliciosa salsa yogurt + patatas + bebida.', imageUrl: '/images/menu/01-kebab-de-ternera.webp', basePrice: 7.00, rating: 4.8, reviewCount: 189, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [{ id: 'mod-41', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-41', name: 'Añadir queso (+0,50€)', priceDelta: 0.50, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 850 },
  { name: 'Menú dürüm', slug: 'menu-durum', number: 42, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Masa fina turca, carne de ternera, de pollo o mixta, lechuga, tomate, cebolla y nuestra deliciosa salsa de yogurt + patatas + bebida.', imageUrl: '/images/menu/11-doner-durum-de-ternera.webp', basePrice: 7.50, rating: 4.8, reviewCount: 156, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [{ id: 'mod-42', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-42', name: 'Añadir queso (+0,50€)', priceDelta: 0.50, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 880 },
  { name: 'Menú lahmacun pizza turca', slug: 'menu-lahmacun-pizza-turca', number: 43, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Masa de pizza turca con carne picada de ternera o pollo o mixta, lechuga, tomate, cebolla, y nuestra deliciosa salsa yogurt + patatas + bebida.', imageUrl: '/images/menu/43-menu-lahmacun.webp', basePrice: 8.00, rating: 4.6, reviewCount: 72, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 900 },
  { name: 'Menú infantil de kebab o dürüm', slug: 'menu-infantil-de-kebab-o-durum', number: 44, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Masa fina turca o pan turco con carne de ternera o de pollo o mixta y nuestra deliciosa salsa de yogurt + patatas + zumo o batido.', imageUrl: '/images/menu/01-kebab-de-ternera.webp', basePrice: 7.00, rating: 4.5, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [{ id: 'mod-44', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-44', name: 'Añadir queso (+0,30€)', priceDelta: 0.30, isDefault: false }] }], allergens: ['gluten', 'lactosa'], calories: 650 },
  { name: 'Menú alitas de pollo o nuggets', slug: 'menu-alitas-de-pollo-o-nuggets', number: 45, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Alitas de pollo o nuggets de pollo + patatas y bebida.', imageUrl: '/images/menu/45-menu-alitas-de-pollo-o-nuggets.webp', basePrice: 7.00, rating: 4.6, reviewCount: 81, isPopular: true, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 720 },
  { name: 'Menú hamburguesa', slug: 'menu-hamburguesa', number: 46, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Hamburguesa de pollo o ternera, patatas, lechuga, tomate, queso y refresco.', imageUrl: '/images/menu/46-menu-hamburguesa.webp', basePrice: 7.00, rating: 4.7, reviewCount: 95, isPopular: true, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 880 },
  { name: 'Menú calamares', slug: 'menu-calamares', number: 47, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Calamares, patatas y bebida.', imageUrl: '/images/menu/47-menu-calamares.webp', basePrice: 7.50, rating: 4.5, reviewCount: 63, isPopular: false, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 700 },
  { name: 'Menú SEEKH KEBAB', slug: 'menu-seekh-kebab', number: 48, category: 'Platos Menús', categoryId: getCat('platos-menus'), description: 'Con arroz o patatas y bebida.', imageUrl: '/images/menu/22-wrap-seekh-kebab.webp', basePrice: 7.00, rating: 4.6, reviewCount: 47, isPopular: false, isActive: true, isNew: true, isFeatured: true, variants: [], modifiers: [{ id: 'mod-48', name: 'Extra', minSelect: 0, maxSelect: 1, options: [{ id: 'opt-48', name: 'Menú de maxi o solo carne (+0,50€)', priceDelta: 0.50, isDefault: false }] }], allergens: ['gluten'], calories: 750 },

  // === RACIONES (49-65) ===
  { name: 'Ración de patatas fritas', slug: 'racion-de-patatas-fritas', number: 49, category: 'Raciones', categoryId: getCat('raciones'), description: 'Ración de patatas fritas crujientes y doradas.', imageUrl: '/images/menu/49-racion-de-patatas-fritas.webp', basePrice: 2.80, rating: 4.5, reviewCount: 56, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 350 },
  { name: 'Ración de patatas bravas o alioli', slug: 'racion-de-patatas-bravas-o-alioli', number: 50, category: 'Raciones', categoryId: getCat('raciones'), description: 'Patatas bravas con salsa picante casera o salsa alioli.', imageUrl: '/images/menu/50-racion-de-patatas-bravas-o-alioli.webp', basePrice: 3.50, rating: 4.6, reviewCount: 48, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 380 },
  { name: 'Ración de patatas deluxe', slug: 'racion-de-patatas-deluxe', number: 51, category: 'Raciones', categoryId: getCat('raciones'), description: 'Patatas deluxe sazonadas con especias especiales.', imageUrl: '/images/menu/51-racion-de-patatas-deluxe.webp', basePrice: 3.50, rating: 4.5, reviewCount: 32, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 400 },
  { name: 'Samosa', slug: 'samosa', number: 52, category: 'Raciones', categoryId: getCat('raciones'), description: 'Empanadilla crujiente rellena de verduras y especias.', imageUrl: '/images/menu/52-samosa.webp', basePrice: 4.50, rating: 4.7, reviewCount: 29, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 250 },
  { name: 'Ración falafel', slug: 'racion-falafel', number: 53, category: 'Raciones', categoryId: getCat('raciones'), description: 'Croquetas de garbanzo especiadas y doradas.', imageUrl: '/images/menu/53-racion-falafel.webp', basePrice: 4.00, rating: 4.5, reviewCount: 36, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 320 },
  { name: 'Ración de pedrata', slug: 'racion-de-pedrata', number: 54, category: 'Raciones', categoryId: getCat('raciones'), description: 'Especialidad de la casa con patatas y salsas.', imageUrl: '/images/menu/54-racion-de-pedrata.webp', basePrice: 4.00, rating: 4.6, reviewCount: 21, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 380 },
  { name: 'Arroz basmati de india', slug: 'arroz-basmati-de-india', number: 55, category: 'Raciones', categoryId: getCat('raciones'), description: 'Arroz basmati aromático cocinado al estilo indio.', imageUrl: '/images/menu/55-arroz-basmati-de-india.webp', basePrice: 4.00, rating: 4.4, reviewCount: 18, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 280 },
  { name: 'Rabas', slug: 'rabas', number: 56, category: 'Raciones', categoryId: getCat('raciones'), description: 'Rabas de calamar empanadas y fritas crujientes.', imageUrl: '/images/menu/56-rabas.webp', basePrice: 5.00, rating: 4.7, reviewCount: 34, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 420 },
  { name: 'Alitas de pollo', slug: 'alitas-de-pollo', number: 57, category: 'Raciones', categoryId: getCat('raciones'), description: 'Alitas de pollo sabrosas y crujientes.', imageUrl: '/images/menu/57-alitas-de-pollo.webp', basePrice: 4.50, rating: 4.6, reviewCount: 52, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 380 },
  { name: 'Nuggets de pollo', slug: 'nuggets-de-pollo', number: 58, category: 'Raciones', categoryId: getCat('raciones'), description: 'Nuggets de pollo empanados fritas.', imageUrl: '/images/menu/58-nuggets-de-pollo.webp', basePrice: 4.50, rating: 4.5, reviewCount: 39, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 350 },
  { name: 'Ración de calamares', slug: 'racion-de-calamares', number: 59, category: 'Raciones', categoryId: getCat('raciones'), description: 'Anillas de calamar crujientes a la romana.', imageUrl: '/images/menu/59-racion-de-calamares.webp', basePrice: 5.00, rating: 4.6, reviewCount: 43, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 440 },
  { name: 'Bola de carne', slug: 'bola-de-carne', number: 60, category: 'Raciones', categoryId: getCat('raciones'), description: 'Bola de carne frita crujiente. Precio por unidad.', imageUrl: '/images/menu/60-bola-de-carne.webp', basePrice: 2.50, rating: 4.4, reviewCount: 25, isPopular: false, isActive: true, isNew: true, isFeatured: false, priceUnit: 'unidad', variants: [], modifiers: [], allergens: ['gluten'], calories: 180 },
  { name: 'Bola de queso', slug: 'bola-de-queso', number: 61, category: 'Raciones', categoryId: getCat('raciones'), description: 'Bola de queso fundido crujiente. Precio por unidad.', imageUrl: '/images/menu/61-bola-de-queso.webp', basePrice: 2.50, rating: 4.5, reviewCount: 31, isPopular: false, isActive: true, isNew: true, isFeatured: false, priceUnit: 'unidad', variants: [], modifiers: [], allergens: ['lactosa', 'gluten'], calories: 200 },
  { name: 'Fingers de pollo', slug: 'fingers-de-pollo', number: 62, category: 'Raciones', categoryId: getCat('raciones'), description: 'Tiras de pechuga de pollo crujientes.', imageUrl: '/images/menu/62-fingers-de-pollo.webp', basePrice: 5.00, rating: 4.6, reviewCount: 44, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 400 },
  { name: 'Pop corn de pollo', slug: 'pop-corn-de-pollo', number: 63, category: 'Raciones', categoryId: getCat('raciones'), description: 'Bocaditos crujientes de pollo estilo pop corn.', imageUrl: '/images/menu/63-pop-corn-de-pollo.webp', basePrice: 4.50, rating: 4.5, reviewCount: 28, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 360 },
  { name: 'Pedrata Grande', slug: 'pedrata-grande', number: 64, category: 'Raciones', categoryId: getCat('raciones'), description: 'Pedrata tamaño ración grande con salsas.', imageUrl: '/images/menu/64-pedrata-grande.webp', basePrice: 6.00, rating: 4.7, reviewCount: 19, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 550 },
  { name: 'Aros de cebolla', slug: 'aros-de-cebolla', number: 65, category: 'Raciones', categoryId: getCat('raciones'), description: 'Aros de cebolla crujientes y dorados.', imageUrl: '/images/menu/65-aros-de-cebolla.webp', basePrice: 4.00, rating: 4.4, reviewCount: 22, isPopular: false, isActive: true, isNew: true, isFeatured: false, variants: [], modifiers: [], allergens: ['gluten'], calories: 320 },

  // === BEBIDAS (66-76) ===
  { name: 'Pepsi', slug: 'bebida-pepsi', number: 66, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl.', imageUrl: '/images/menu/66-pepsi.webp', basePrice: 1.80, rating: 4.5, reviewCount: 45, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 150 },
  { name: 'Pepsi Cero', slug: 'bebida-pepsi-cero', number: 67, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl sin azúcar.', imageUrl: '/images/menu/67-pepsi-cero.webp', basePrice: 1.80, rating: 4.4, reviewCount: 30, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 0 },
  { name: 'Pepsi Light', slug: 'bebida-pepsi-light', number: 68, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl.', imageUrl: '/images/menu/68-pepsi-light.webp', basePrice: 1.80, rating: 4.3, reviewCount: 22, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 5 },
  { name: 'Kas Naranja', slug: 'bebida-kas-naranja', number: 69, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl.', imageUrl: '/images/menu/69-kas-naranja.webp', basePrice: 1.80, rating: 4.5, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 130 },
  { name: 'Kas Limón', slug: 'bebida-kas-limon', number: 70, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl.', imageUrl: '/images/menu/70-kas-limon.webp', basePrice: 1.80, rating: 4.4, reviewCount: 29, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 120 },
  { name: 'Aquarius Naranja', slug: 'bebida-aquarius-naranja', number: 71, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl.', imageUrl: '/images/menu/71-aquarius-naranja.webp', basePrice: 1.80, rating: 4.5, reviewCount: 40, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 110 },
  { name: 'Aquarius Limón', slug: 'bebida-aquarius-limon', number: 72, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl.', imageUrl: '/images/menu/72-aquarius-limon.webp', basePrice: 1.80, rating: 4.4, reviewCount: 35, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 100 },
  { name: 'Agua', slug: 'bebida-agua', number: 73, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Botella 50cl.', imageUrl: '/images/menu/73-agua.webp', basePrice: 1.00, rating: 4.5, reviewCount: 60, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 0 },
  { name: '1L Pepsi', slug: 'bebida-1l-pepsi', number: 74, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Botella de 1 Litro.', imageUrl: '/images/menu/74-1l-pepsi.webp', basePrice: 2.50, rating: 4.6, reviewCount: 88, isPopular: true, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 420 },
  { name: 'Nestea', slug: 'bebida-nestea', number: 75, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Lata 33cl.', imageUrl: '/images/menu/75-nestea.webp', basePrice: 1.80, rating: 4.5, reviewCount: 34, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 120 },
  { name: 'Zumo tropical', slug: 'bebida-zumo-tropical', number: 76, category: 'Bebidas', categoryId: getCat('bebidas'), description: 'Zumo tropical 33cl.', imageUrl: '/images/menu/76-zumo-tropical.webp', basePrice: 1.80, rating: 4.5, reviewCount: 19, isPopular: false, isActive: true, isNew: false, isFeatured: false, variants: [], modifiers: [], allergens: [], calories: 130 },

  // === FEATURED MENUS & COMBOS (Image 2) ===
  { name: 'Menú Kebab', slug: 'featured-menu-kebab', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Kebab (pan pita) + Patatas + Bebida', imageUrl: '/images/menu/01-kebab-de-ternera.webp', basePrice: 7.00, rating: 4.8, reviewCount: 189, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 850 },
  { name: 'Menú Dürüm', slug: 'featured-menu-durum', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Dürüm (pan fino) + Patatas + Bebida', imageUrl: '/images/menu/11-doner-durum-de-ternera.webp', basePrice: 7.50, rating: 4.8, reviewCount: 156, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 880 },
  { name: '3 Uds de pollo y patatas fritas', slug: 'featured-3-uds-de-pollo', category: 'Menús Destacados', categoryId: getCat('featured'), description: '3 Unidades de pollo crujiente + Patatas fritas', imageUrl: '/images/menu/58-nuggets-de-pollo.webp', basePrice: 8.00, rating: 4.7, reviewCount: 98, isPopular: true, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 720 },
  { name: 'Menú Pollo Crujiente', slug: 'featured-menu-pollo-crujiente', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Pollo crujiente + Patatas + Bebida', imageUrl: '/images/menu/58-nuggets-de-pollo.webp', basePrice: 7.50, rating: 4.6, reviewCount: 76, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 780 },
  { name: 'Menú Nuggets', slug: 'featured-menu-nuggets', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Nuggets de pollo + Patatas + Bebida', imageUrl: '/images/menu/58-nuggets-de-pollo.webp', basePrice: 7.00, rating: 4.5, reviewCount: 64, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 700 },
  { name: 'Menú Alitas de Pollo', slug: 'featured-menu-alitas-de-pollo', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Alitas de pollo + Patatas + Bebida', imageUrl: '/images/menu/57-alitas-de-pollo.webp', basePrice: 7.00, rating: 4.6, reviewCount: 81, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: [], calories: 720 },
  { name: 'Calamares', slug: 'featured-calamares', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Ración de calamares + Patatas + Bebida', imageUrl: '/images/menu/59-racion-de-calamares.webp', basePrice: 7.50, rating: 4.5, reviewCount: 63, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['pescado', 'gluten'], calories: 700 },
  { name: 'Menú Wrap Seekh Kebab', slug: 'featured-menu-wrap-seekh-kebab', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Wrap Seekh Kebab + Patatas + Bebida', imageUrl: '/images/menu/22-wrap-seekh-kebab.webp', basePrice: 8.00, rating: 4.7, reviewCount: 52, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 820 },
  { name: 'Menú Hamburguesa', slug: 'featured-menu-hamburguesa', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Hamburguesa completa + Patatas + Bebida', imageUrl: '/images/menu/21-hamburguesa-completa.webp', basePrice: 7.00, rating: 4.7, reviewCount: 95, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 880 },
  { name: 'Menú Hamburguesa Doble', slug: 'featured-menu-hamburguesa-doble', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Hamburguesa doble + Patatas + Bebida', imageUrl: '/images/menu/21-hamburguesa-completa.webp', basePrice: 9.50, rating: 4.8, reviewCount: 73, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 1100 },
  { name: 'Menú Seekh Kebab', slug: 'featured-menu-seekh-kebab', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Seekh Kebab + Patatas o Arroz + Bebida', imageUrl: '/images/menu/22-wrap-seekh-kebab.webp', basePrice: 7.50, rating: 4.6, reviewCount: 47, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 750 },
  { name: 'Menú Pop Corn', slug: 'featured-menu-pop-corn', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Pop corn de pollo + Patatas + Bebida', imageUrl: '/images/menu/58-nuggets-de-pollo.webp', basePrice: 7.00, rating: 4.5, reviewCount: 38, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten'], calories: 680 },
  { name: 'Menú Donner Box', slug: 'featured-menu-donner-box', category: 'Menús Destacados', categoryId: getCat('featured'), description: 'Caja Kebab con carne + patatas + bebida', imageUrl: '/images/menu/36-kebab-al-plato-de-ternera-o-pollo.webp', basePrice: 6.00, rating: 4.6, reviewCount: 56, isPopular: false, isActive: true, isNew: false, isFeatured: true, variants: [], modifiers: [], allergens: ['gluten', 'lactosa'], calories: 650 },
]
  const createdProducts = await Product.create(products)
  console.log(`✓ ${createdProducts.length} products created`)

  // ─── Promotions ────────────────────────────────
  await Promotion.create([
    { title: '20% OFF', subtitle: 'Oferta especial del fin de semana', imageUrl: 'https://images.unsplash.com/photo-1599979488031-49c145e8e279?w=800', badgeText: 'Fin de semana', sortOrder: 0 },
    { title: 'Combo Familiar', subtitle: '4 kebabs + 4 bebidas por 29,90€', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', badgeText: 'Ahorra 8€', sortOrder: 1 },
  ])
  console.log('✓ Promotions created')

  // ─── Coupon ────────────────────────────────────
  await Coupon.create({ code: 'BIITERI10', type: 'PERCENTAGE', value: 10, minOrderAmount: 15, isActive: true })
  console.log('✓ Coupon created')

  console.log('\n✅ Seed complete!')
  console.log('   Admin login: admin@kebabbiteri.com / admin123')
  console.log(`   Database: ${DB_URL}`)

  await mongoose.disconnect()
}

main().catch((e) => {
  console.error('❌ Seed error:', e)
  process.exit(1)
})
