# AI Chat Server

Node.js сервер для AI чата с интеграцией GigaChat API.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `config.example.js`:
```bash
cp config.example.js .env
```

3. Заполните переменные окружения в `.env` файле:
```
AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
AI_URL=https://gigachat.devices.sberbank.ru/api/v1/chat/completions
AUTH_KEY_PERS=your_base64_encoded_credentials_here
PORT=3001
NODE_ENV=development
```

## Запуск

### Разработка
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

## API Endpoints

### POST /chat
Отправка сообщения в чат.

**Запрос:**
```json
{
  "message": "Привет, как дела?"
}
```

**Ответ:**
```json
{
  "response": "Привет! У меня все хорошо, спасибо! Чем могу помочь?",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "model": "GigaChat"
}
```

### GET /health
Проверка состояния сервера.

### GET /model-info
Информация о используемой модели.

## Переменные окружения

- `AUTH_URL` - URL для авторизации в GigaChat API
- `AI_URL` - URL для отправки запросов к GigaChat API
- `AUTH_KEY_PERS` - Base64 кодированные учетные данные
- `PORT` - Порт сервера (по умолчанию 3001)
- `NODE_ENV` - Окружение (development/production)

## Получение API ключей GigaChat

1. Зарегистрируйтесь на [GigaChat Developer Portal](https://developers.sber.ru/portal/products/gigachat)
2. Создайте приложение
3. Получите Client ID и Client Secret
4. Закодируйте их в Base64: `btoa(clientId + ':' + clientSecret)`
5. Добавьте результат в `AUTH_KEY_PERS`
