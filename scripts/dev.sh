#!/bin/bash

# Скрипт для быстрого запуска в режиме разработки
set -e

echo "🚀 Быстрый запуск для разработки..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Проверяем наличие .env файла
if [ ! -f "server/.env" ]; then
    warn "Файл server/.env не найден. Создаем на основе env.example..."
    cp server/env.example server/.env
    log "✅ Файл .env создан. Не забудьте заполнить API ключи!"
fi

# Запускаем в режиме разработки
log "Запуск в режиме разработки..."
docker-compose up --build

log "🎉 Приложение запущено!"
log "Клиент: http://localhost:3000"
log "Сервер: http://localhost:3001"
