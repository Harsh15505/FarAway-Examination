#!/bin/bash
# FortisExam — Demo Reset Script
# Resets everything to a clean demo-ready state.
# Must complete in < 30 seconds.

set -e

echo "🔄 FortisExam — Demo Reset"
echo "=========================="

# 1. Stop all containers
echo "🛑 Stopping containers..."
docker compose -f docker/docker-compose.yml down -v 2>/dev/null || true

# 2. Remove edge SQLite database
echo "🗃️ Removing edge database..."
rm -f data/edge.db data/edge.db-wal data/edge.db-shm

# 3. Restart containers
echo "🐳 Starting fresh containers..."
docker compose -f docker/docker-compose.yml up -d

# 4. Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 3

# 5. Run migrations
echo "🗃️ Running migrations..."
# TODO: alembic upgrade head

# 6. Re-generate keys
echo "🔑 Regenerating keys..."
rm -rf keys/
bash scripts/generate-keys.sh

# 7. Re-seed data
echo "🌱 Re-seeding demo data..."
python scripts/seed-demo-data.py

echo ""
echo "✅ Demo reset complete! Ready for presentation."
echo "   Cloud: http://localhost:8000/health"
echo "   Edge:  http://localhost:8001/health"
