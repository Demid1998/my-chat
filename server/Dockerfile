# Multi-stage build для Node.js сервера
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости (включая dev dependencies для сборки)
RUN npm ci --silent

# Копируем исходный код
COPY . .

# Stage 2: Production stage
FROM node:18-alpine AS production

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production --silent && npm cache clean --force

# Копируем исходный код из builder stage
COPY --from=builder --chown=nodejs:nodejs /app ./

# Переключаемся на пользователя nodejs
USER nodejs

# Открываем порт
EXPOSE 3001

# Проверка здоровья контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Запускаем приложение
CMD ["npm", "start"]
