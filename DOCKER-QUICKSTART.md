# 🐳 Docker Quick Start - Audit ADES ISO 27001

## Prerequisites
- Docker Desktop installed (Windows/Mac) or Docker + Docker Compose (Linux)
- Git (optional, for cloning)

## Quick Start

### 1. Start the Application

**Windows:**
```batch
docker-start.bat
```

**Linux/Mac:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

**Or manually:**
```bash
docker-compose up -d
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8888
- **API Documentation**: http://localhost:8888/docs

### 3. Stop the Application

**Windows:**
```batch
docker-stop.bat
```

**Linux/Mac:**
```bash
docker-compose down
```

---

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart backend only
docker-compose restart backend
```

### Check Status
```bash
docker-compose ps
```

### Database Backup
```bash
# Create backup
docker cp audit-ades-backend:/app/data/audit.db ./backup-$(date +%Y%m%d).db

# Windows PowerShell
docker cp audit-ades-backend:/app/data/audit.db ./backup.db
```

### Database Restore
```bash
# Restore from backup
docker cp ./backup.db audit-ades-backend:/app/data/audit.db
docker-compose restart backend
```

### Reset Database
```bash
docker-compose exec backend python scripts/init_db.py
docker-compose restart backend
```

---

## Troubleshooting

### Port Already in Use

Edit `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "8889:8888"  # Change 8888 to 8889
  
  frontend:
    ports:
      - "3001:80"    # Change 3000 to 3001
```

### Rebuild Containers
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Complete Reset
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### View Container Shell
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

---

## Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start in production
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:8888
```

### Production
```env
VITE_API_URL=/api
```

---

## Data Persistence

Data is stored in Docker volumes:
- **Database**: `./backend/data/audit.db`
- **Logs**: `backend-logs` volume

To completely remove all data:
```bash
docker-compose down -v
```

---

## Next Steps

1. **Explore the Application**: Open http://localhost:3000
2. **Check API Documentation**: Visit http://localhost:8888/docs
3. **Review Logs**: Run `docker-compose logs -f`
4. **Read Full Documentation**: See [README.Docker.md](./README.Docker.md)

---

## Features Available

✅ ISO 27001:2022 Controls Management  
✅ ADES Risk Tracking  
✅ Compliance Dashboard  
✅ Evidence Upload  
✅ Audit History  
✅ Export/Import Data  
✅ Real-time Statistics  

---

## Support

- **Full Docker Guide**: [README.Docker.md](./README.Docker.md)
- **Main README**: [README.md](./README.md)
- **Manual Installation**: [QUICKSTART.md](./QUICKSTART.md)

Version: 2.0.0 | Last Updated: November 2025
