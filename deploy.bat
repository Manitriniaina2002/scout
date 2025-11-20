@echo off
REM SMSI Deployment Script for Windows
REM Usage: deploy.bat [dev|prod|stop|logs|cleanup]

setlocal enabledelayedexpansion

set "PROJECT_NAME=sms-audit"
set "COMPOSE_FILE=docker-compose.yml"
set "PROD_COMPOSE_FILE=docker-compose.prod.yml"

REM Colors (Windows CMD doesn't support ANSI colors well, using simple text)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

:log_info
echo %INFO% %~1
goto :eof

:log_success
echo %SUCCESS% %~1
goto :eof

:log_warning
echo %WARNING% %~1
goto :eof

:log_error
echo %ERROR% %~1
goto :eof

:check_dependencies
where docker >nul 2>nul
if %errorlevel% neq 0 (
    call :log_error "Docker is not installed. Please install Docker first."
    exit /b 1
)

docker-compose --version >nul 2>nul
if %errorlevel% neq 0 (
    call :log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit /b 1
)

call :log_success "Dependencies check passed"
goto :eof

:create_directories
call :log_info "Creating necessary directories..."
if not exist "backend\data" mkdir "backend\data"
if not exist "backend\logs" mkdir "backend\logs"
call :log_success "Directories created"
goto :eof

:setup_environment
if not exist ".env" (
    call :log_warning ".env file not found. Creating from template..."
    if exist ".env.prod" (
        copy ".env.prod" ".env" >nul
        call :log_warning "Please edit .env file with your production values before deploying!"
    ) else (
        call :log_error ".env.prod template not found!"
        exit /b 1
    )
)
goto :eof

:deploy_dev
call :log_info "Deploying development environment..."
call :check_dependencies
call :create_directories

docker-compose -f %COMPOSE_FILE% up -d --build
call :log_success "Development environment deployed successfully!"
call :log_info "Frontend: http://localhost:3000"
call :log_info "Backend API: http://localhost:8888"
call :log_info "API Docs: http://localhost:8888/docs"
goto :eof

:deploy_prod
call :log_info "Deploying production environment..."
call :check_dependencies
call :create_directories
call :setup_environment

if not exist ".env" (
    call :log_error "Environment file .env not found. Please create it from .env.prod template."
    exit /b 1
)

docker-compose -f %PROD_COMPOSE_FILE% up -d --build
call :log_success "Production environment deployed successfully!"
call :log_info "Application: http://localhost"
call :log_info "Backend API: http://localhost:8888"
call :log_info "API Docs: http://localhost:8888/docs"
goto :eof

:stop_services
call :log_info "Stopping all services..."
docker-compose -f %COMPOSE_FILE% -f %PROD_COMPOSE_FILE% down 2>nul
call :log_success "All services stopped"
goto :eof

:show_logs
echo Select service to view logs:
echo 1^) All services
echo 2^) Backend only
echo 3^) Frontend only
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    docker-compose -f %COMPOSE_FILE% -f %PROD_COMPOSE_FILE% logs -f
) else if "%choice%"=="2" (
    docker-compose -f %COMPOSE_FILE% -f %PROD_COMPOSE_FILE% logs -f backend
) else if "%choice%"=="3" (
    docker-compose -f %COMPOSE_FILE% -f %PROD_COMPOSE_FILE% logs -f frontend
) else (
    call :log_error "Invalid choice"
    exit /b 1
)
goto :eof

:cleanup
call :log_warning "This will remove all containers, volumes, and networks for this project."
set /p confirm="Are you sure? (y/N): "

if /i "%confirm%"=="y" (
    call :log_info "Cleaning up Docker resources..."
    docker-compose -f %COMPOSE_FILE% -f %PROD_COMPOSE_FILE% down -v --remove-orphans
    docker system prune -f
    call :log_success "Cleanup completed"
) else (
    call :log_info "Cleanup cancelled"
)
goto :eof

:show_status
call :log_info "Service Status:"
docker-compose -f %COMPOSE_FILE% -f %PROD_COMPOSE_FILE% ps
goto :eof

:main
if "%1"=="dev" goto deploy_dev
if "%1"=="prod" goto deploy_prod
if "%1"=="stop" goto stop_services
if "%1"=="logs" goto show_logs
if "%1"=="cleanup" goto cleanup
if "%1"=="status" goto show_status

REM Help / Default
echo SMSI Deployment Script for Windows
echo.
echo Usage: %0 [command]
echo.
echo Commands:
echo   dev      Deploy development environment
echo   prod     Deploy production environment
echo   stop     Stop all services
echo   logs     Show service logs
echo   status   Show service status
echo   cleanup  Remove all containers and volumes
echo   help     Show this help message
echo.
echo Examples:
echo   %0 dev          # Start development environment
echo   %0 prod         # Start production environment
echo   %0 logs         # View logs
echo   %0 stop         # Stop all services
echo.

goto :eof