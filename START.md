# Kebab Biteri — How to Start

## Quick Start

```bash
# 1. Make sure MongoDB is running
brew services start mongodb-community

# 2. Start everything (backend + frontend + auto-seed if empty)
./start.sh

# 3. Open the app
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# API Docs: http://localhost:3001/api/docs
```

## Manual Start

### Backend (NestJS on :3001)

```bash
cd apps/api
npm run dev
```

### Frontend (Next.js on :3000)

```bash
cd apps/web
npm run dev
```

### Seed Database

```bash
./seed.sh
# or
cd apps/api && npm run seed
```

## Admin Login
- Email: `admin@kebabbiteri.com`
- Password: `admin123`

## Environment Variables (.env)
```
DATABASE_URL="mongodb://localhost:27017/kebab-biteri"
JWT_SECRET="dev-secret-change-me"
PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand (cart), Lucide icons
- **Backend**: NestJS 10, TypeScript, Mongoose, Socket.io (WebSocket)
- **Database**: MongoDB

## API Endpoints (all real, no mocks)
- `POST /api/auth/login`, `POST /api/auth/register` — JWT auth
- `GET /api/profile` — current user (JWT required)
- `GET /api/menu`, `GET /api/menu/categories`, `GET /api/menu/products/popular`
- `GET /api/branches`, `GET /api/branches/:id`
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`
- `POST /api/payments/create`, `POST /api/payments/webhook`
- `POST /api/coupons/validate`
- `GET/POST/PATCH/DELETE /api/addresses` (JWT required)
- `GET/PATCH /api/admin/*` (ADMIN role)
- WebSocket `/ws` — real-time order status
