#!/bin/bash

echo "======================================"
echo "  Audit ADES ISO 27001 - Docker"
echo "======================================"
echo

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "[INFO] Docker is running"
echo

# Stop and remove existing containers
echo "[INFO] Stopping existing containers..."
docker-compose down 2>/dev/null

echo
echo "[INFO] Building Docker images..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed!"
    exit 1
fi

echo
echo "[INFO] Starting containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to start containers!"
    exit 1
fi

echo
echo "======================================"
echo "  Application Started Successfully!"
echo "======================================"
echo
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:8888"
echo "API Docs:  http://localhost:8888/docs"
echo
echo "[INFO] To view logs: docker-compose logs -f"
echo "[INFO] To stop: docker-compose down"
echo
