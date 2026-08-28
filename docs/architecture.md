# Kebab Biteri — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Customer PWA (Next.js)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Mobile   │  │  Desktop  │  │  Admin   │  │ Kitchen  │ │
│  │ Customer  │  │ Customer  │  │ Desktop  │  │ Display  │ │
│  └─────┬─────┘  └─────┬─────┘  └────┬─────┘  └────┬─────┘ │
│        └───────────────┴──────────────┴────────────┘       │
│                        TanStack Query                      │
└────────────────────────────┬────────────────────────────┘
                             │ REST + WebSocket
┌────────────────────────────▼────────────────────────────┐
│                    NestJS API Server                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Auth │ │ Menu │ │Order │ │Pay   │ │Admin │ │Socket│    │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘    │
│     └────────┴────────┴────────┴────────┴────────┘        │
│              Guards · Pipes · Interceptors · RBAC          │
└────────────────────────────┬────────────────────────────┘
                             │ Prisma ORM
┌────────────────────────────▼────────────────────────────┐
│                    PostgreSQL                              │
│  Users · Branches · Products · Orders · Payments · etc.   │
└───────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌───────────┐  ┌──────────┐  ┌──────┐
│     Redis         │  │ Cloudinary │  │   FCM    │  │Stripe│
│ Cache · Sessions  │  │  Images    │  │  Push    │  │  Pay │
└──────────────────┘  └───────────┘  └──────────┘  └──────┘
```

## Multi-Branch Architecture

```
Kebab Biteri
├── Madrid Branch (default)
├── Branch 2
├── Branch 3
└── Future Branches

Each branch:
- Address + coordinates
- Opening hours
- Delivery radius
- Delivery fee
- Min order amount
- Prep time
- Available products (BranchProduct join)
- Active/inactive status
```

## Order Flow

```
Customer → Browse Menu → Customize Product → Add to Cart
  → Checkout (Address → Summary → Payment)
  → POST /api/orders (server validates prices, discounts, delivery fee)
  → POST /api/payments/create (payment intent)
  → Payment provider (Stripe/Redsys/Bizum)
  → Webhook → /api/payments/webhook (server verifies signature)
  → Order confirmed → WebSocket push to customer
  → Kitchen Display updates (NEW column)
  → Kitchen [START] → status: PREPARING → WebSocket push
  → Kitchen [READY] → status: READY → driver assigned
  → Driver [OUT FOR DELIVERY] → WebSocket push
  → Delivered → Final push notification (FCM)
```

## Security Boundaries

```
Frontend (NEVER trusted)     │     Backend (ALWAYS validated)
─────────────────────────────┼──────────────────────────────
Product price display        │     Server recalculates total
Cart total (client)          │     Server validates coupon
Payment status (client)       │     Server verifies webhook sig
Discount amount (client)      │     Server validates coupon rules
Order total (client)          │     Server builds authoritative order
```
