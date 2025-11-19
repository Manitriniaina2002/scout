@echo off
echo ======================================
echo   Audit ADES ISO 27001 - Docker
echo ======================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [INFO] Docker is running
echo.

REM Stop and remove existing containers
echo [INFO] Stopping existing containers...
docker-compose down 2>nul

echo.
echo [INFO] Building Docker images...
docker-compose build

if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [INFO] Starting containers...
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start containers!
    pause
    exit /b 1
)

echo.
echo ======================================
echo   Application Started Successfully!
echo ======================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8888
echo API Docs:  http://localhost:8888/docs
echo.
echo [INFO] To view logs: docker-compose logs -f
echo [INFO] To stop: docker-compose down
echo.
pause
