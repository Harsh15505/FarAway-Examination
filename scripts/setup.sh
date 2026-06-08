#!/bin/bash
# FortisExam — First-Time Setup Script
# Run once after cloning the repository.

set -e

echo "🔧 FortisExam — Setup"
echo "====================="

# 1. Check prerequisites
echo "📋 Checking prerequisites..."
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3.11+ required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js 18+ required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }
echo "✅ All prerequisites found"

# 2. Create environment file
echo "📄 Creating .env file..."
if [ ! -f .env ]; then
    cp docker/.env.example .env
    echo "✅ .env created — EDIT IT with your Clerk keys!"
else
    echo "⚠️ .env already exists, skipping"
fi

# 3. Generate RSA key pairs
echo "🔑 Generating RSA keys..."
bash scripts/generate-keys.sh

# 4. Install Python dependencies
echo "🐍 Installing server dependencies..."
pip install -r server/requirements.txt

# 5. Install web dependencies
echo "📦 Installing web dependencies..."
cd web && npm install && cd ..

# 6. Install desktop dependencies
echo "📦 Installing desktop dependencies..."
cd desktop && npm install && cd ..

# 7. Start Docker services
echo "🐳 Starting Docker services..."
docker compose -f docker/docker-compose.yml up -d

# 8. Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# 9. Run migrations
echo "🗃️ Running database migrations..."
# TODO: alembic upgrade head

# 10. Seed demo data
echo "🌱 Seeding demo data..."
python scripts/seed-demo-data.py

echo ""
echo "✅ Setup complete!"
echo "   Cloud server: http://localhost:8000"
echo "   Edge server:  http://localhost:8001"
echo "   Admin portal: cd web && npm run dev"
echo "   Desktop app:  cd desktop && npm run dev"
