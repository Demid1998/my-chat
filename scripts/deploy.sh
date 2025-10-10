#!/bin/bash

# Скрипт для деплоя приложения
set -e

echo "🚀 Начинаем деплой приложения..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Параметры
DEPLOY_TYPE=${1:-"dev"}
VERSION=${2:-"latest"}

log "Тип деплоя: $DEPLOY_TYPE"
log "Версия: $VERSION"

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    error "Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

# Функция для остановки контейнеров
stop_containers() {
    log "Остановка существующих контейнеров..."
    docker-compose down --remove-orphans || true
    log "✅ Контейнеры остановлены"
}

# Функция для очистки неиспользуемых образов
cleanup_images() {
    log "Очистка неиспользуемых образов..."
    docker image prune -f || true
    log "✅ Очистка завершена"
}

# Функция для проверки health check
wait_for_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    log "Ожидание готовности сервиса $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "$service.*Up"; then
            log "✅ Сервис $service готов"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    error "Сервис $service не запустился в течение 60 секунд"
    return 1
}

# Функция для деплоя разработки
deploy_dev() {
    log "Деплой для разработки..."
    
    # Проверяем наличие .env файла
    if [ ! -f "server/.env" ]; then
        warn "Файл server/.env не найден. Создайте его на основе env.example"
        cp server/env.example server/.env || true
    fi
    
    stop_containers
    docker-compose up -d --build
    wait_for_health "my-chat-server"
    wait_for_health "my-chat-client-dev"
    
    log "✅ Деплой для разработки завершен"
    info "Клиент доступен по адресу: http://localhost:3000"
    info "Сервер доступен по адресу: http://localhost:3001"
}

# Функция для деплоя продакшна
deploy_prod() {
    log "Деплой для продакшна..."
    
    # Проверяем наличие .env.prod файла
    if [ ! -f "server/.env.prod" ]; then
        warn "Файл server/.env.prod не найден. Создаем на основе env.prod.example..."
        cp server/env.prod.example server/.env.prod
        log "✅ Файл .env.prod создан. Не забудьте заполнить API ключи для продакшна!"
    fi
    
    # Проверяем наличие SSL сертификатов
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        warn "SSL сертификаты не найдены. Создаем самоподписанный сертификат..."
        mkdir -p nginx/ssl
        openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=RU/ST=State/L=City/O=Organization/CN=localhost"
    fi
    
    stop_containers
    docker-compose -f docker-compose.prod.yml up -d --build
    wait_for_health "my-chat-server-prod"
    wait_for_health "my-chat-client-prod"
    wait_for_health "my-chat-nginx-prod"
    
    log "✅ Деплой для продакшна завершен"
    info "Приложение доступно по адресу: https://localhost"
}

# Функция для отката
rollback() {
    warn "Откат к предыдущей версии..."
    stop_containers
    cleanup_images
    log "✅ Откат завершен"
}

# Функция для показа логов
show_logs() {
    local service=${1:-""}
    if [ -n "$service" ]; then
        docker-compose logs -f "$service"
    else
        docker-compose logs -f
    fi
}

# Функция для показа статуса
show_status() {
    log "Статус контейнеров:"
    docker-compose ps
    echo ""
    log "Использование ресурсов:"
    docker stats --no-stream
}

# Основная логика
case $DEPLOY_TYPE in
    "dev")
        deploy_dev
        ;;
    "prod")
        deploy_prod
        ;;
    "stop")
        stop_containers
        ;;
    "restart")
        stop_containers
        deploy_dev
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "rollback")
        rollback
        ;;
    "cleanup")
        cleanup_images
        ;;
    *)
        error "Неизвестный тип деплоя: $DEPLOY_TYPE"
        echo "Доступные команды:"
        echo "  dev      - Деплой для разработки"
        echo "  prod     - Деплой для продакшна"
        echo "  stop     - Остановить все контейнеры"
        echo "  restart  - Перезапустить в режиме разработки"
        echo "  logs     - Показать логи (опционально указать сервис)"
        echo "  status   - Показать статус контейнеров"
        echo "  rollback - Откатить изменения"
        echo "  cleanup  - Очистить неиспользуемые образы"
        exit 1
        ;;
esac

log "🎉 Деплой завершен успешно!"
