# Delivery Architecture

## Overview

The delivery system is designed to support a separate **Driver PWA** that can be added later.
The backend is fully built to support driver assignment, status updates, and real-time tracking.

## Backend API (Ready)

| Method | Endpoint                    | Role     | Description                    |
|--------|----------------------------|----------|--------------------------------|
| GET    | /api/delivery/available-drivers/:branchId | ADMIN/MANAGER | List available drivers |
| PATCH  | /api/delivery/assign/:orderId | ADMIN/MANAGER | Assign driver to order |
| PATCH  | /api/delivery/pickup/:orderId | DELIVERY | Driver picks up order |
| PATCH  | /api/delivery/deliver/:orderId | DELIVERY | Mark as delivered |
| PATCH  | /api/delivery/eta/:orderId | DELIVERY | Update ETA |
| GET    | /api/delivery/my-deliveries | DELIVERY | Driver's active deliveries |
| PATCH  | /api/delivery/availability | DELIVERY | Toggle availability |

## Data Model

```
Driver
├── userId (FK → User)
├── branchId (FK → Branch)
├── isAvailable (boolean)
├── vehicle (motorbike | car | bicycle)

Delivery
├── orderId (FK → Order, unique)
├── driverId (FK → Driver, nullable)
├── status (UNASSIGNED → ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED)
├── pickedUpAt
├── deliveredAt
├── etaMinutes
```

## Flow

```
Order READY (kitchen)
  → Admin/Manager assigns driver
  → Delivery: ASSIGNED
  → Order: OUT_FOR_DELIVERY
  → WebSocket push to customer: "🛵 En reparto"
  → FCM notification to customer
  → Driver picks up
  → Delivery: PICKED_UP
  → Driver delivers
  → Delivery: DELIVERED
  → Order: DELIVERED
  → WebSocket + FCM: "🎉 Entregado"
```

## Future Driver PWA

A separate Next.js route group `(driver)` can be added:

```
apps/web/src/app/(driver)/
├── layout.tsx          # Driver app shell
├── page.tsx            # Active deliveries list
├── active/[id]/page.tsx # Delivery detail + navigation
├── earnings/page.tsx    # Earnings dashboard
└── settings/page.tsx    # Availability toggle, profile
```

The backend already supports all operations needed.
