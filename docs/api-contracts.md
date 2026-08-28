# API Contracts

## Auth
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | /api/auth/register    | Register new user    |
| POST   | /api/auth/login       | Login (email/phone)  |
| POST   | /api/auth/refresh     | Refresh access token |

## Menu
| Method | Endpoint                | Description              |
|--------|--------------------------|--------------------------|
| GET    | /api/menu                | Full menu (categories+products+promos) |
| GET    | /api/menu/categories     | Categories only          |
| GET    | /api/menu/products/popular| Popular products        |
| GET    | /api/menu/products/:slug | Single product detail   |

## Branches
| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | /api/branches     | All active branches   |
| GET    | /api/branches/:id| Single branch detail  |

## Cart (authenticated)
| Method | Endpoint                | Description           |
|--------|--------------------------|-----------------------|
| GET    | /api/cart                | Get user cart         |
| POST   | /api/cart/items          | Add item to cart      |
| PATCH  | /api/cart/items/:id      | Update quantity/notes |
| DELETE | /api/cart/items/:id      | Remove item           |

## Orders (authenticated)
| Method | Endpoint                  | Description            |
|--------|----------------------------|------------------------|
| POST   | /api/orders                | Create order           |
| GET    | /api/orders                | List user orders       |
| GET    | /api/orders/:id            | Order detail + status  |
| POST   | /api/orders/:id/cancel     | Cancel order           |

## Payments
| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| POST   | /api/payments/create    | Create payment intent    |
| POST   | /api/payments/verify     | Verify payment status    |
| POST   | /api/payments/webhook    | Payment webhook (Stripe) |

## Addresses (authenticated)
| Method | Endpoint             | Description        |
|--------|----------------------|---------------------|
| GET    | /api/addresses        | List addresses     |
| POST   | /api/addresses         | Add address        |
| PATCH  | /api/addresses/:id    | Update address     |
| DELETE | /api/addresses/:id     | Delete address     |

## Coupons
| Method | Endpoint                | Description          |
|--------|------------------------|----------------------|
| POST   | /api/coupons/validate  | Validate coupon code |

## Admin (RBAC: ADMIN, MANAGER)
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/admin/orders                | All orders               |
| PATCH  | /api/admin/orders/:id/status     | Update order status      |
| POST   | /api/admin/products               | Create product           |
| PATCH  | /api/admin/products/:id           | Update product/price     |
| DELETE | /api/admin/products/:id           | Delete product (soft)    |
| POST   | /api/admin/categories              | Create category          |
| POST   | /api/admin/coupons                | Create coupon            |
| POST   | /api/admin/branches               | Create branch            |
| GET    | /api/admin/analytics               | Analytics dashboard     |

## WebSocket Events
| Event              | Direction | Payload           |
|--------------------|-----------|-------------------|
| order:status       | Server→Client | {orderId, status, timestamp} |
| kitchen:new_order  | Server→Kitchen | {order, items}   |
| order:ready        | Server→Client | {orderId}        |
| delivery:update    | Server→Client | {orderId, eta}   |
