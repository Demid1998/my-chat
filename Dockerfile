# Multi-stage build для production
FROM node:18-alpine AS base

# Установка рабочей директории
WORKDIR /app

# Копирование package.json файлов
COPY server/package*.json ./
COPY client/package*.json ./client/

# Установка зависимостей сервера
RUN npm ci --only=production

# Установка зависимостей клиента
WORKDIR /app/client
RUN npm ci --only=production

# Build клиента
COPY client/ .
RUN npm run build

# Возврат в корень
WORKDIR /app

# Копирование исходного кода сервера
COPY server/ .

# Установка зависимостей для production
RUN npm ci --only=production

# Экспорт порта
EXPOSE 3001

# Запуск сервера
CMD ["npm", "start"]
