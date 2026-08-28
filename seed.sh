#!/bin/bash
# Kebab Biteri - Database Seed Script
# Populates MongoDB with admin user, categories, products, promotions, and coupon

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR/apps/api"

echo "🌱 Seeding Kebab Biteri MongoDB..."
echo "   Database: mongodb://localhost:27017/kebab-biteri"
echo ""

# Compile and run the seed
node node_modules/typescript/bin/tsc --outDir dist-seed --module commonjs --moduleResolution node --target ES2022 --esModuleInterop --skipLibCheck prisma/seed.ts
node dist-seed/seed.js

echo ""
echo "✅ Seed complete!"
echo "   Admin login: admin@kebabbiteri.com / admin123"
