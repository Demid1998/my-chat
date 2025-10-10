#!/bin/bash

# Скрипт для сборки Docker образов
set -e

echo "🚀 Начинаем сборку Docker образов..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Параметры
BUILD_TYPE=${1:-"dev"}
VERSION=${2:-"latest"}

log "Тип сборки: $BUILD_TYPE"
log "Версия: $VERSION"

# Функция для сборки сервера
build_server() {
    log "Сборка сервера..."
    docker build -t my-chat-server:$VERSION -f server/Dockerfile server/
    log "✅ Сервер собран успешно"
}

# Функция для сборки клиента
build_client() {
    log "Сборка клиента..."
    docker build -t my-chat-client:$VERSION -f client/Dockerfile client/
    log "✅ Клиент собран успешно"
}

# Функция для сборки клиента для разработки
build_client_dev() {
    log "Сборка клиента для разработки..."
    docker build -t my-chat-client-dev:$VERSION -f client/Dockerfile.dev client/
    log "✅ Клиент для разработки собран успешно"
}

# Основная логика
case $BUILD_TYPE in
    "dev")
        log "Сборка для разработки..."
        build_server
        build_client_dev
        ;;
    "prod")
        log "Сборка для продакшна..."
        build_server
        build_client
        ;;
    "server")
        build_server
        ;;
    "client")
        build_client
        ;;
    "client-dev")
        build_client_dev
        ;;
    "all")
        log "Сборка всех компонентов..."
        build_server
        build_client
        build_client_dev
        ;;
    *)
        error "Неизвестный тип сборки: $BUILD_TYPE"
        echo "Доступные типы: dev, prod, server, client, client-dev, all"
        exit 1
        ;;
esac

log "🎉 Сборка завершена успешно!"

# Показать собранные образы
echo ""
log "Собранные образы:"
docker images | grep my-chat
