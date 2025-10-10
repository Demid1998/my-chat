# Docker Guide для AI Chat Application

Полное руководство по использованию Docker для локальной разработки и продакшн деплоя.

## 🚀 Быстрый старт

### Локальная разработка
```bash
# Запуск в режиме разработки
make dev
# или
./scripts/dev.sh
```

### Продакшн деплой
```bash
# Запуск в режиме продакшна
make prod
# или
./scripts/deploy.sh prod
```

## 📋 Предварительные требования

- Docker 20.10+
- Docker Compose 2.0+
- Make (опционально, для удобства)

## 🏗️ Архитектура

### Режим разработки
- **client-dev**: React приложение с hot reload (порт 3000)
- **server**: Node.js сервер с автоперезагрузкой (порт 3001)

### Режим продакшна
- **client**: React приложение с Nginx (порт 80/443)
- **server**: Node.js сервер (внутренний порт 3001)
- **nginx**: Reverse proxy с SSL (порт 80/443)

## 📁 Структура Docker файлов

```
my-chat/
├── client/
│   ├── Dockerfile          # Продакшн сборка
│   ├── Dockerfile.dev      # Разработка
│   ├── nginx.conf          # Nginx конфигурация
│   └── .dockerignore
├── server/
│   ├── Dockerfile          # Node.js сервер
│   └── .dockerignore
├── nginx/
│   ├── nginx.conf          # Основная конфигурация
│   └── ssl/                # SSL сертификаты
├── scripts/
│   ├── build.sh            # Скрипт сборки
│   ├── deploy.sh           # Скрипт деплоя
│   └── dev.sh              # Быстрый запуск для разработки
├── docker-compose.yml      # Конфигурация для разработки
├── docker-compose.prod.yml # Конфигурация для продакшна
├── Makefile                # Команды для удобства
└── DOCKER_GUIDE.md         # Это руководство
```

## 🔧 Команды Make

### Основные команды
```bash
make help          # Показать справку
make dev           # Запуск для разработки
make prod          # Запуск для продакшна
make stop          # Остановить все контейнеры
make restart       # Перезапустить в режиме разработки
```

### Сборка
```bash
make build         # Собрать все образы
make build-dev     # Собрать для разработки
make build-prod    # Собрать для продакшна
```

### Мониторинг
```bash
make logs          # Показать логи всех сервисов
make logs-server   # Логи сервера
make logs-client   # Логи клиента
make status        # Статус контейнеров
make health        # Проверка состояния
```

### Настройка
```bash
make env-setup     # Создать .env файлы
make ssl-setup     # Настроить SSL сертификаты
make install       # Установить зависимости локально
```

### Очистка
```bash
make clean         # Очистить неиспользуемые образы
make rollback      # Откатить изменения
```

## 🛠️ Ручные команды Docker

### Сборка образов
```bash
# Сборка всех образов
./scripts/build.sh all

# Сборка для разработки
./scripts/build.sh dev

# Сборка для продакшна
./scripts/build.sh prod

# Сборка отдельных компонентов
./scripts/build.sh server
./scripts/build.sh client
./scripts/build.sh client-dev
```

### Деплой
```bash
# Разработка
./scripts/deploy.sh dev

# Продакшн
./scripts/deploy.sh prod

# Остановка
./scripts/deploy.sh stop

# Перезапуск
./scripts/deploy.sh restart
```

### Docker Compose команды
```bash
# Разработка
docker-compose up -d --build
docker-compose down

# Продакшн
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml down
```

## ⚙️ Настройка

### Переменные окружения

#### Для разработки
Создайте файл `server/.env` на основе `server/env.example`:

```env
# GigaChat API
GIGACHAT_API_KEY=your_gigachat_api_key_here

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Yandex Cloud AI
YANDEX_CLOUD_API_KEY=your_yandex_cloud_api_key_here
YANDEX_CLOUD_FOLDER_ID=your_yandex_cloud_folder_id_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Для продакшна
Создайте файл `server/.env.prod`:

```env
# Те же переменные, но с продакшн значениями
NODE_ENV=production
# ... остальные переменные
```

### SSL Сертификаты

#### Для разработки
Самоподписанный сертификат создается автоматически при первом запуске продакшна.

#### Для продакшна
Поместите SSL сертификаты в `nginx/ssl/`:
- `cert.pem` - SSL сертификат
- `key.pem` - приватный ключ

```bash
# Создание самоподписанного сертификата
make ssl-setup
```

## 🌐 Доступ к приложению

### Разработка
- **Клиент**: http://localhost:3000
- **Сервер**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Продакшн
- **Приложение**: https://localhost
- **HTTP редирект**: http://localhost → https://localhost
- **Health Check**: https://localhost/health

## 🔍 Отладка

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f server
docker-compose logs -f client-dev

# Последние 100 строк
docker-compose logs --tail=100 server
```

### Вход в контейнер
```bash
# Сервер
docker-compose exec server sh

# Клиент
docker-compose exec client-dev sh
```

### Проверка состояния
```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Информация об образах
docker images | grep my-chat
```

### Health Check
```bash
# Проверка сервера
curl http://localhost:3001/health

# Проверка клиента
curl http://localhost:3000

# Автоматическая проверка
make health
```

## 🚨 Устранение неполадок

### Контейнеры не запускаются
```bash
# Проверьте логи
docker-compose logs

# Проверьте статус
docker-compose ps

# Пересоберите образы
docker-compose build --no-cache
```

### Проблемы с портами
```bash
# Проверьте занятые порты
lsof -i :3000
lsof -i :3001

# Остановите все контейнеры
docker-compose down
```

### Проблемы с зависимостями
```bash
# Очистите кэш Docker
docker system prune -f

# Пересоберите без кэша
docker-compose build --no-cache
```

### Проблемы с SSL
```bash
# Пересоздайте SSL сертификаты
rm -rf nginx/ssl/*
make ssl-setup
```

## 🔄 CI/CD интеграция

### GitHub Actions пример
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: ./scripts/build.sh prod
        
      - name: Deploy to production
        run: ./scripts/deploy.sh prod
```

### Локальный деплой
```bash
# Сборка и деплой одной командой
make build-prod && make prod
```

## 📊 Мониторинг

### Логирование
Все контейнеры настроены на ротацию логов:
- Максимальный размер: 10MB
- Максимальное количество файлов: 3

### Health Checks
- **Сервер**: Проверка каждые 30 секунд
- **Клиент**: Проверка доступности
- **Nginx**: Проверка конфигурации

### Метрики
```bash
# Использование ресурсов
docker stats

# Размер образов
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Использование диска
docker system df
```

## 🔒 Безопасность

### Безопасность контейнеров
- Запуск от непривилегированного пользователя
- Минимальные базовые образы (alpine)
- Регулярное обновление зависимостей

### Сетевая безопасность
- Изолированная Docker сеть
- Ограничение доступа к портам
- SSL/TLS шифрование

### Секреты
- Переменные окружения для API ключей
- Исключение .env файлов из Docker образов
- Использование Docker secrets в продакшне

## 📚 Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Docker Best Practices](https://create-react-app.dev/docs/deployment/#docker)

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи: `make logs`
2. Проверьте статус: `make status`
3. Проверьте health: `make health`
4. Перезапустите: `make restart`
5. Очистите и пересоберите: `make clean && make build`
