#!/bin/bash

echo "🚀 Запускаем приложение..."

# Устанавливаем порт для Render
export PORT=${PORT:-3001}

# Запускаем сервер
echo "🌐 Запускаем сервер на порту $PORT..."
npm start