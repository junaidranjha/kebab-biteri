# Kebab Biteri — Production Restaurant PWA

A production-ready Progressive Web App (PWA) for **Kebab Biteri**, a Spanish kebab restaurant. Built to feel like a native mobile app while being installable from any browser.

## 🍽️ Overview

```
Customer opens kebabbiteri.com
  → Mobile browser
  → Kebab Biteri PWA
  → Install to Home Screen
  → 📱 App-like experience
```

### Tech Stack

| Layer        | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| UI          | Custom shadcn-style components, Lucide icons    |
| State       | TanStack Query, Zustand (cart)                 |
| PWA         | Web Manifest, Service Worker, Offline support  |
| Backend     | NestJS, TypeScript, REST API, WebSockets      |
| Database    | MongoDB, Prisma ORM                         |
| Auth        | JWT + Refresh Tokens, RBAC                     |
| Infra       | Redis, FCM, Cloudinary, Stripe/Redsys, Google Maps |

## 📁 Project Structure

```
kebab-biteri/
├── apps/
│   ├── web/              # Next.js PWA (customer + admin)
│   └── api/              # NestJS REST API
├── packages/
│   ├── types/            # Shared TypeScript domain types
│   ├── config/           # Brand config, design tokens, utils
│   └── ui/               # Shared UI components (placeholder)
├── prisma/
│   └── schema.prisma     # Full database schema
└── docs/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- MongoDB (or use Docker)

### Install

```bash
pnpm install
```

### Environment

Create `.env` in the project root:

```env
# Database
DATABASE_URL="mongodb://user:pass@localhost:5432/kebab_biteri?schema=public"

# API
PORT=3001
JWT_SECRET="your-secret-here"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Integrations (optional for dev)
STRIPE_SECRET_KEY=""
CLOUDINARY_CLOUD_NAME=""
FCM_SERVER_KEY=""
GOOGLE_MAPS_API_KEY=""
REDIS_URL="redis://localhost:6379"
```

### Database

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
pnpm db:seed        # Seed with demo data
```

### Development

```bash
pnpm dev:web        # Next.js on :3000
pnpm dev:api        # NestJS on :3001
pnpm dev            # Both in parallel
```

## 📱 Customer Flow (Mobile PWA)

```
Home → Categories → Product → Customize → Cart → Checkout →
  Address → Payment → Order Confirmation → Live Tracking → Delivery
```

### Mobile Screens Implemented

- ✅ **Home** — Header, search, promo carousel, categories, popular items
- ✅ **Menu** — Category filtering, search, product list
- ✅ **Product Detail** — Image, variants, modifiers, quantity, add to cart
- ✅ **Cart** — Line items, quantities, totals, checkout entry
- ✅ **Checkout** — 3-step flow (address → summary → payment)
- ✅ **Order Tracking** — Real-time status timeline
- ✅ **Profile** — Account, settings, order history entry

### PWA Features

- ✅ Web App Manifest (installable, standalone display)
- ✅ Service Worker (offline app shell, cache strategies)
- ✅ Theme color, splash screen, app icons
- ✅ Install prompt support
- ✅ Offline fallback page
- ✅ Online/offline detection

## 🔒 Security

- Server-side price/discount/order validation (never trust frontend)
- JWT + refresh token authentication
- RBAC (CUSTOMER, ADMIN, MANAGER, KITCHEN, DELIVERY)
- Rate limiting (100 req/min default)
- Input validation (Zod frontend, class-validator backend)
- Security headers (Helmet, X-Frame-Options, etc.)
- Payment webhook verification

## 🇪🇸 Spain / EU

- Currency: EUR (€)
- Primary language: Spanish (es-ES)
- English support (architecture ready)
- GDPR-aware: privacy policy, consent, data export, account deletion

## 🗄️ Database Schema

Core entities: User, Restaurant, Branch, Address, Category, Product,
ProductVariant, ProductModifier, ModifierOption, Cart, CartItem, Order,
OrderItem, Payment, Coupon, Promotion, LoyaltyAccount, LoyaltyTransaction,
Review, Notification, Driver, Delivery, AuditLog, BranchProduct, OpeningHour,
RefreshToken.

## 📝 License

Proprietary — Kebab Biteri © 2026
