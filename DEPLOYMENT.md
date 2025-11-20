# 🚀 SMSI Deployment Guide

## Overview

This guide covers deploying the SMSI (Système de Management de la Sécurité de l'Information) application using Docker Compose for both development and production environments.

## 📋 Prerequisites

- **Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
- **Docker Compose** V2.0+
- **Git** (for cloning the repository)
- **At least 4GB RAM** available for containers

## 🏗️ Project Structure

```
sms-audit/
├── backend/                 # FastAPI backend
│   ├── Dockerfile          # Backend container config
│   ├── requirements.txt    # Python dependencies
│   └── data/               # SQLite database (created at runtime)
├── frontend/               # React frontend
│   ├── Dockerfile          # Frontend container config
│   ├── nginx.conf          # Nginx configuration
│   └── src/                # React application
├── docker-compose.yml      # Development configuration
├── docker-compose.prod.yml # Production configuration
├── docker-compose.override.yml # Dev overrides
├── .env.prod               # Production environment template
├── deploy.sh               # Linux/Mac deployment script
├── deploy.bat              # Windows deployment script
└── .dockerignore          # Docker build exclusions
```

## 🚀 Quick Start

### Development Deployment

```bash
# Linux/Mac
./deploy.sh dev

# Windows
deploy.bat dev
```

**Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8888
- API Documentation: http://localhost:8888/docs

### Production Deployment

1. **Configure environment:**
   ```bash
   cp .env.prod .env
   # Edit .env with your production values
   ```

2. **Deploy:**
   ```bash
   # Linux/Mac
   ./deploy.sh prod

   # Windows
   deploy.bat prod
   ```

**Access URLs:**
- Application: http://localhost
- Backend API: http://localhost:8888
- API Documentation: http://localhost:8888/docs

## ⚙️ Configuration

### Environment Variables

Copy `.env.prod` to `.env` and configure:

```bash
# Application
APP_NAME=SMSI - Évaluation de conformité
APP_ENV=production
APP_DEBUG=false

# Backend
BACKEND_PORT=8888
DATABASE_URL=sqlite:///./data/audit.db

# Frontend
FRONTEND_PORT=80
VITE_API_URL=/api

# Security
SECRET_KEY=your-secret-key-here-change-in-production
CORS_ORIGINS=["http://localhost:80", "https://yourdomain.com"]

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log
```

### Docker Compose Files

- **`docker-compose.yml`**: Base development configuration
- **`docker-compose.override.yml`**: Development overrides (hot reload)
- **`docker-compose.prod.yml`**: Production configuration

## 🛠️ Deployment Scripts

### Linux/Mac (`deploy.sh`)

```bash
# Development
./deploy.sh dev

# Production
./deploy.sh prod

# Management
./deploy.sh stop      # Stop all services
./deploy.sh logs      # View logs
./deploy.sh status    # Show service status
./deploy.sh cleanup   # Remove containers and volumes
```

### Windows (`deploy.bat`)

```cmd
REM Development
deploy.bat dev

REM Production
deploy.bat prod

REM Management
deploy.bat stop
deploy.bat logs
deploy.bat status
deploy.bat cleanup
```

## 🔧 Manual Docker Commands

### Development

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Production

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Backend**: `http://localhost:8888/api/health`
- **Frontend**: `http://localhost/health` (serves 200 OK)

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Check Status

```bash
docker-compose ps
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Change `SECRET_KEY` in `.env`
- [ ] Configure proper `CORS_ORIGINS`
- [ ] Set `APP_DEBUG=false`
- [ ] Use strong passwords
- [ ] Enable HTTPS in production (nginx SSL configuration)
- [ ] Regular security updates of base images
- [ ] Monitor logs for security events

### SSL/HTTPS Configuration (Optional)

For HTTPS in production, modify `frontend/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    # ... rest of configuration
}
```

## 🗄️ Database Management

### SQLite Database Location

- **Development**: `./backend/data/audit.db`
- **Production**: Mounted volume in container

### Backup Database

```bash
# Copy from running container
docker cp sms-audit-backend-prod:/app/data/audit.db ./backup/audit-$(date +%Y%m%d).db
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm sms-audit_backend-data

# Restart services (will recreate database)
docker-compose up -d
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using ports
   netstat -tulpn | grep :8888
   netstat -tulpn | grep :80

   # Change ports in docker-compose files
   ```

2. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Database issues**
   ```bash
   # Check database file
   ls -la backend/data/

   # Reinitialize database
   docker-compose exec backend python scripts/init_db.py
   ```

4. **Build failures**
   ```bash
   # Clear Docker cache
   docker system prune -a

   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Check container status
docker-compose ps

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

## 📈 Performance Optimization

### Resource Limits

Production containers have resource limits configured:
- **Backend**: 1 CPU, 512MB RAM
- **Frontend**: 0.5 CPU, 256MB RAM

### Scaling (Future)

For high-traffic deployments, consider:
- Load balancer (nginx, traefik)
- Redis for session storage
- PostgreSQL instead of SQLite
- Container orchestration (Kubernetes, Docker Swarm)

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Update Dependencies

```bash
# Backend
cd backend
pip install --upgrade -r requirements.txt

# Frontend
cd frontend
npm update

# Rebuild containers
docker-compose build --no-cache
```

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify configuration in `.env`
3. Ensure all prerequisites are met
4. Check Docker and Docker Compose versions

---

**Version**: 2.1.0
**Last Updated**: November 2025

**Stop:**
```bash
docker-compose down
```

### Option 2: Manual Deployment

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/init_db.py
uvicorn main:app --host 0.0.0.0 --port 8888
```

**Frontend:**
```bash
cd frontend
npm install
npm run build  # For production
npm run dev    # For development
```

### Option 3: Production with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Current Status

### Backend ✅
- [x] FastAPI application configured
- [x] SQLAlchemy models defined
- [x] Database initialization script
- [x] CORS middleware configured
- [x] API endpoints implemented
- [x] Health check endpoint
- [x] Dockerfile created
- [x] Data persistence configured

### Frontend ✅
- [x] React application with Vite
- [x] shadcn/ui components
- [x] Toast notifications (Sonner)
- [x] API service configured
- [x] Environment variables setup
- [x] Production build configuration
- [x] Nginx configuration
- [x] Dockerfile created

### Database ✅
- [x] SQLite database created
- [x] Tables initialized
- [x] Sample data loaded (15 audit results, 6 risks)
- [x] Backup strategy documented

### Docker ✅
- [x] Docker Compose files
- [x] Dockerfiles for backend and frontend
- [x] Health checks configured
- [x] Network configuration
- [x] Volume persistence
- [x] Start/stop scripts
- [x] Documentation

---

## 📁 Important Files

### Configuration
- `docker-compose.yml` - Development setup
- `docker-compose.prod.yml` - Production setup
- `frontend/.env` - Frontend environment (API URL: http://localhost:8888)
- `frontend/.env.production` - Production environment (API URL: /api)
- `.env.docker` - Docker environment template

### Scripts
- `docker-start.bat` / `docker-start.sh` - Start with Docker
- `docker-stop.bat` - Stop Docker containers
- `start.bat` - Manual start (Windows)
- `build.bat` - Build for production (Windows)

### Documentation
- `README.md` - Main documentation
- `README.Docker.md` - Complete Docker guide
- `DOCKER-QUICKSTART.md` - Quick Docker start guide
- `QUICKSTART.md` - Manual installation guide
- `MIGRATION-COMPLETE.md` - Migration history
- `RISK-MAPPING.md` - ADES risk analysis

### Docker Files
- `backend/Dockerfile` - Backend container
- `frontend/Dockerfile` - Frontend container with Nginx
- `frontend/nginx.conf` - Nginx configuration
- `backend/.dockerignore` - Backend ignore patterns
- `frontend/.dockerignore` - Frontend ignore patterns

---

## 🔧 Environment Configuration

### Development
```env
# Frontend
VITE_API_URL=http://localhost:8888

# Backend
DATABASE_PATH=./data/audit.db
ENV=development
```

### Production
```env
# Frontend
VITE_API_URL=/api

# Backend
DATABASE_PATH=/app/data/audit.db
ENV=production
```

---

## 📦 Dependencies

### Backend
- fastapi>=0.104.1
- uvicorn[standard]>=0.24.0
- sqlalchemy>=2.0.23
- pydantic>=2.5.2
- pydantic-settings>=2.1.0
- python-multipart>=0.0.6
- python-dateutil>=2.8.2

### Frontend
- react@18.2.0
- vite@5.0.8
- react-router-dom@6.20.0
- axios@1.6.2
- sonner@2.0.7
- lucide-react@0.554.0
- tailwindcss@3.4.18
- shadcn/ui components

---

## 🎯 Features Implemented

### Dashboard
- ✅ Compliance statistics
- ✅ Trend charts (Chart.js & Recharts)
- ✅ Progress tracking
- ✅ Critical risk alerts

### Controls Management
- ✅ Full CRUD operations
- ✅ Inline editing
- ✅ Bulk operations (delete, export, import)
- ✅ Advanced filtering (category, status, search)
- ✅ Evidence file upload UI
- ✅ Responsible person assignment
- ✅ Priority levels
- ✅ Implementation cost tracking
- ✅ Timeline management

### Risk Management
- ✅ ADES-specific risks
- ✅ Control linkage
- ✅ Severity tracking (CRITICAL, HIGH, MEDIUM, LOW)
- ✅ Status updates (open, resolved)

### UI/UX
- ✅ shadcn/ui components
- ✅ Toast notifications (Sonner)
- ✅ Brand colors (#4B8B32, #2196F3, #009688)
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Smooth animations

---

## 🔍 API Endpoints

### Audit Results
- `GET /api/audit-results` - List all results
- `GET /api/audit-results/{control_id}` - Get specific result
- `POST /api/audit-results` - Create result
- `PUT /api/audit-results/{control_id}` - Update result
- `DELETE /api/audit-results/{control_id}` - Delete result

### Risks
- `GET /api/risks` - List all risks
- `GET /api/risks/{risk_id}` - Get specific risk
- `PUT /api/risks/{risk_id}/status` - Update risk status

### Statistics
- `GET /api/statistics` - Get compliance statistics

### History
- `GET /api/history` - Get all history
- `GET /api/history/{control_id}` - Get control history

### Health
- `GET /api/health` - Health check

---

## 🚨 Known Issues

### Resolved ✅
- ~~Port permission issues on Windows~~ - Using port 8888
- ~~Database schema issues~~ - Database recreated and initialized
- ~~CORS errors~~ - CORS configured for all development ports
- ~~JSX closing tag errors~~ - Fixed Select component tags
- ~~Toast positioning~~ - Centered with backdrop blur

### None Currently

---

## 🔐 Security Considerations

For production deployment:
1. Add authentication/authorization
2. Use HTTPS (configure SSL in Nginx)
3. Set proper CORS origins
4. Use environment variables for sensitive data
5. Regular database backups
6. Update dependencies regularly
7. Scan Docker images for vulnerabilities

---

## 📈 Next Steps

1. **Deploy to Production Server**
   - Use `docker-compose.prod.yml`
   - Configure SSL certificates
   - Set up domain name
   - Configure firewall

2. **Add Authentication**
   - User login system
   - Role-based access control
   - JWT tokens

3. **Monitoring**
   - Application logs
   - Error tracking
   - Performance monitoring

4. **Backups**
   - Automated database backups
   - Backup retention policy
   - Disaster recovery plan

---

## 📞 Support & Documentation

- **Quick Start**: See `DOCKER-QUICKSTART.md`
- **Full Docker Guide**: See `README.Docker.md`
- **Manual Setup**: See `QUICKSTART.md`
- **Main README**: See `README.md`

---

## ✨ Summary

The Audit ADES ISO 27001 application is fully configured and ready for deployment using:

1. **Docker Compose** (Recommended) - Single command deployment
2. **Manual Deployment** - For development or custom setups
3. **Production Docker** - Optimized for production environments

All features are working with SQLite database, no mock data is used. The application is containerized, documented, and ready for deployment.

**Version**: 2.0.0  
**Status**: ✅ Ready for Deployment  
**Last Updated**: November 19, 2025
