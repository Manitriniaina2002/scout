# Docker Deployment Guide

## Quick Start with Docker Compose

### Prerequisites
- Docker Desktop installed (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git (to clone the repository)

### Build and Run

1. **Build the containers:**
```bash
docker-compose build
```

2. **Start the application:**
```bash
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8888
- API Documentation: http://localhost:8888/docs

4. **View logs:**
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

5. **Stop the application:**
```bash
docker-compose down
```

6. **Stop and remove volumes (clears database):**
```bash
docker-compose down -v
```

## Manual Docker Commands

### Backend Only

```bash
# Build
cd backend
docker build -t audit-ades-backend .

# Run
docker run -d \
  --name audit-ades-backend \
  -p 8888:8888 \
  -v $(pwd)/data:/app/data \
  audit-ades-backend
```

### Frontend Only

```bash
# Build
cd frontend
docker build -t audit-ades-frontend .

# Run
docker run -d \
  --name audit-ades-frontend \
  -p 3000:80 \
  --link audit-ades-backend:backend \
  audit-ades-frontend
```

## Production Deployment

### Using Docker Compose in Production

1. **Update environment variables:**
```bash
cp .env.docker .env
# Edit .env with your production settings
```

2. **Build for production:**
```bash
docker-compose -f docker-compose.yml build --no-cache
```

3. **Start in production mode:**
```bash
docker-compose up -d
```

4. **Enable auto-restart:**
The containers are configured with `restart: unless-stopped` policy.

### Using Docker Stack (Swarm Mode)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml audit-ades

# List services
docker stack services audit-ades

# Remove stack
docker stack rm audit-ades
```

## Health Checks

Both services include health checks:

```bash
# Check backend health
curl http://localhost:8888/api/health

# Check frontend health
curl http://localhost:3000

# Docker health status
docker-compose ps
```

## Database Management

### Backup Database

```bash
# Create backup
docker-compose exec backend python -c "import shutil; shutil.copy('/app/data/audit.db', '/app/data/audit.db.backup')"

# Copy to host
docker cp audit-ades-backend:/app/data/audit.db.backup ./backup-$(date +%Y%m%d).db
```

### Restore Database

```bash
# Copy to container
docker cp ./backup.db audit-ades-backend:/app/data/audit.db

# Restart backend
docker-compose restart backend
```

### Reset Database

```bash
# Remove existing database
docker-compose exec backend rm -f /app/data/audit.db

# Reinitialize
docker-compose exec backend python scripts/init_db.py

# Restart
docker-compose restart backend
```

## Troubleshooting

### View Container Logs
```bash
docker-compose logs -f [service_name]
```

### Execute Commands in Container
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

### Rebuild Containers
```bash
# Rebuild all
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
```

### Port Conflicts
If ports 3000 or 8888 are already in use, modify `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8889:8888"  # Change host port
  
  frontend:
    ports:
      - "3001:80"    # Change host port
```

### Container Won't Start
```bash
# Check status
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend

# Recreate containers
docker-compose up -d --force-recreate
```

## Development with Docker

### Hot Reload for Backend

```yaml
# Add to docker-compose.yml backend service
volumes:
  - ./backend:/app
  - ./backend/data:/app/data
```

Then rebuild and restart.

### Development Override

Create `docker-compose.override.yml`:

```yaml
version: '3.8'

services:
  backend:
    volumes:
      - ./backend:/app
    environment:
      - DEBUG=true
    command: python -m uvicorn main:app --host 0.0.0.0 --port 8888 --reload

  frontend:
    build:
      context: ./frontend
      target: builder
    command: npm run dev
    ports:
      - "5173:5173"
```

## Resource Limits

Add resource constraints in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Security Recommendations

1. **Use secrets for sensitive data:**
```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

2. **Run as non-root user:**
Add to Dockerfile:
```dockerfile
RUN useradd -m -u 1000 appuser
USER appuser
```

3. **Update base images regularly:**
```bash
docker-compose pull
docker-compose up -d
```

4. **Scan for vulnerabilities:**
```bash
docker scan audit-ades-backend
docker scan audit-ades-frontend
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Push to registry
        run: |
          docker tag audit-ades-backend:latest myregistry/audit-ades-backend:latest
          docker push myregistry/audit-ades-backend:latest
```

## Monitoring

### Install Portainer (Optional)

```bash
docker volume create portainer_data

docker run -d \
  -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Access at: http://localhost:9000
