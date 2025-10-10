# 🐳 Docker для AI Chat Application

Полная Docker конфигурация для локальной разработки и продакшн деплоя.

## 🚀 Быстрый старт

```bash
# Разработка
make dev

# Продакшн
make prod
```

## 📋 Что включено

### ✅ Multi-stage Dockerfile'ы
- **Client**: React + Nginx для продакшна, hot reload для разработки
- **Server**: Node.js с оптимизациями безопасности

### ✅ Docker Compose конфигурации
- `docker-compose.yml` - для разработки
- `docker-compose.prod.yml` - для продакшна с Nginx reverse proxy

### ✅ Скрипты автоматизации
- `scripts/build.sh` - сборка образов
- `scripts/deploy.sh` - деплой и управление
- `scripts/dev.sh` - быстрый запуск для разработки

### ✅ Nginx конфигурация
- SSL/TLS поддержка
- Reverse proxy
- Rate limiting
- Безопасность

### ✅ Makefile команды
- `make dev` - разработка
- `make prod` - продакшн
- `make logs` - логи
- `make status` - статус
- `make health` - проверка здоровья

## 🌐 Доступ

### Разработка
- **Клиент**: http://localhost:3000
- **Сервер**: http://localhost:3001

### Продакшн
- **Приложение**: https://localhost
- **API**: https://localhost/api/

## 🔧 Основные команды

```bash
# Показать все команды
make help

# Разработка
make dev
make stop
make restart

# Продакшн
make prod
make ssl-setup
make env-setup

# Мониторинг
make logs
make status
make health

# Очистка
make clean
make rollback
```

## 📚 Подробная документация

См. [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) для полного руководства.

## 🆘 Поддержка

```bash
# Проверка состояния
make health

# Просмотр логов
make logs

# Отладка
make debug
```
