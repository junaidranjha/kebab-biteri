#!/bin/bash
# Kebab Biteri - Startup Script
# Starts both the backend (NestJS on :3001) and frontend (Next.js on :3000)

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "🚀 Starting Kebab Biteri PWA..."
echo ""

# Check if MongoDB is running
if ! pgrep -x mongod > /dev/null 2>&1; then
  echo "⚠️  MongoDB doesn't seem to be running. Starting it..."
  brew services start mongodb-community 2>/dev/null || mongod --dbpath /usr/local/var/mongodb --fork 2>/dev/null || {
    echo "❌ Could not start MongoDB. Please start it manually:"
    echo "   brew services start mongodb-community"
    echo "   or: mongod --dbpath /usr/local/var/mongodb"
    exit 1
  }
  echo "✅ MongoDB started"
  sleep 2
fi

# Seed the database (only if empty)
echo "🌱 Checking database seed..."
cd "$ROOT_DIR/apps/api"
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kebab-biteri').then(async () => {
  const count = await mongoose.connection.db.collection('categories').countDocuments();
  if (count === 0) {
    console.log('Database is empty, seeding...');
    require('child_process').execSync('node dist-seed/seed.js', { stdio: 'inherit', env: process.env });
  } else {
    console.log('Database already seeded (' + count + ' categories found), skipping seed.');
  }
  await mongoose.disconnect();
}).catch(e => {
  console.log('Cannot connect to MongoDB for seed check:', e.message);
  console.log('Continuing anyway - backend will connect when ready.');
});
" 2>&1 || true

echo ""
echo "📦 Starting Backend (NestJS) on :3001..."
cd "$ROOT_DIR/apps/api"
npm run dev &
API_PID=$!

echo "📦 Starting Frontend (Next.js) on :3000..."
cd "$ROOT_DIR/apps/web"
npm run dev &
WEB_PID=$!

echo ""
echo "✅ Kebab Biteri is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"
echo ""
echo "   Admin login: admin@kebabbiteri.com / admin123"
echo ""
echo "Press Ctrl+C to stop all servers."

# Trap Ctrl+C to kill both processes
trap "echo ''; echo 'Stopping servers...'; kill $API_PID 2>/dev/null; kill $WEB_PID 2>/dev/null; exit 0" INT TERM EXIT

wait
