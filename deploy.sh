#!/bin/bash

# SMSI Deployment Script
# Usage: ./deploy.sh [dev|prod|stop|logs|cleanup]

set -e

PROJECT_NAME="sms-audit"
COMPOSE_FILE="docker-compose.yml"
PROD_COMPOSE_FILE="docker-compose.prod.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    log_success "Dependencies check passed"
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."
    mkdir -p backend/data
    mkdir -p backend/logs
    log_success "Directories created"
}

# Setup environment files
setup_environment() {
    if [ ! -f .env ]; then
        log_warning ".env file not found. Creating from template..."
        if [ -f .env.prod ]; then
            cp .env.prod .env
            log_warning "Please edit .env file with your production values before deploying!"
        else
            log_error ".env.prod template not found!"
            exit 1
        fi
    fi
}

# Deploy development environment
deploy_dev() {
    log_info "Deploying development environment..."
    check_dependencies
    create_directories

    docker-compose -f $COMPOSE_FILE up -d --build
    log_success "Development environment deployed successfully!"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend API: http://localhost:8888"
    log_info "API Docs: http://localhost:8888/docs"
}

# Deploy production environment
deploy_prod() {
    log_info "Deploying production environment..."
    check_dependencies
    create_directories
    setup_environment

    # Validate environment file exists
    if [ ! -f .env ]; then
        log_error "Environment file .env not found. Please create it from .env.prod template."
        exit 1
    fi

    docker-compose -f $PROD_COMPOSE_FILE up -d --build
    log_success "Production environment deployed successfully!"
    log_info "Application: http://localhost"
    log_info "Backend API: http://localhost:8888"
    log_info "API Docs: http://localhost:8888/docs"
}

# Stop all services
stop_services() {
    log_info "Stopping all services..."
    docker-compose -f $COMPOSE_FILE -f $PROD_COMPOSE_FILE down 2>/dev/null || true
    log_success "All services stopped"
}

# Show logs
show_logs() {
    echo "Select service to view logs:"
    echo "1) All services"
    echo "2) Backend only"
    echo "3) Frontend only"
    read -p "Enter choice (1-3): " choice

    case $choice in
        1)
            docker-compose -f $COMPOSE_FILE -f $PROD_COMPOSE_FILE logs -f
            ;;
        2)
            docker-compose -f $COMPOSE_FILE -f $PROD_COMPOSE_FILE logs -f backend
            ;;
        3)
            docker-compose -f $COMPOSE_FILE -f $PROD_COMPOSE_FILE logs -f frontend
            ;;
        *)
            log_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Cleanup Docker resources
cleanup() {
    log_warning "This will remove all containers, volumes, and networks for this project."
    read -p "Are you sure? (y/N): " confirm

    if [[ $confirm =~ ^[Yy]$ ]]; then
        log_info "Cleaning up Docker resources..."
        docker-compose -f $COMPOSE_FILE -f $PROD_COMPOSE_FILE down -v --remove-orphans
        docker system prune -f
        log_success "Cleanup completed"
    else
        log_info "Cleanup cancelled"
    fi
}

# Show status
show_status() {
    log_info "Service Status:"
    docker-compose -f $COMPOSE_FILE -f $PROD_COMPOSE_FILE ps
}

# Main script logic
case "${1:-help}" in
    dev)
        deploy_dev
        ;;
    prod)
        deploy_prod
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs
        ;;
    cleanup)
        cleanup
        ;;
    status)
        show_status
        ;;
    help|*)
        echo "SMSI Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  dev      Deploy development environment"
        echo "  prod     Deploy production environment"
        echo "  stop     Stop all services"
        echo "  logs     Show service logs"
        echo "  status   Show service status"
        echo "  cleanup  Remove all containers and volumes"
        echo "  help     Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 dev          # Start development environment"
        echo "  $0 prod         # Start production environment"
        echo "  $0 logs         # View logs"
        echo "  $0 stop         # Stop all services"
        ;;
esac