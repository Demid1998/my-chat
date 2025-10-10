# AI Chat Application

Полнофункциональное веб-приложение для чата с AI, поддерживающее множественные провайдеры через универсальный интерфейс.

## Возможности

- 💬 **Интерактивный чат** с AI-моделями
- ⚙️ **Настройки чата** - температура, максимальные токены, системные сообщения
- 🤖 **Множество моделей**:
  - **GigaChat** (Сбербанк) - российские языковые модели
  - **OpenRouter** - доступ к 60+ провайдерам и 500+ моделям (GPT-4, Claude, Gemini, Llama и др.)
  - **Yandex Cloud AI** - модели Яндекса
- 📱 **Адаптивный интерфейс** для мобильных и десктопных устройств
- 💾 **Сохранение настроек** в локальном хранилище
- 🔄 **История разговоров** с контекстом
- 🎨 **Современный UI** с темной темой

## Архитектура

- **Client** - React приложение с современным UI
- **Server** - Node.js сервер с Express и интеграцией GigaChat API

## Структура проекта

```
my-chat/
├── client/          # React приложение
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatInterface.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── server/          # Node.js сервер
│   ├── auth.js      # Авторизация GigaChat API
│   ├── server.js    # Основной сервер
│   ├── package.json
│   └── README.md
└── README.md
```

## Быстрый старт

### 1. Настройка сервера

```bash
cd server
npm install

# Создайте .env файл с вашими данными GigaChat API
# Скопируйте данные из config.example.js
```

### 2. Настройка клиента

```bash
cd client
npm install
```

### 3. Запуск

**Терминал 1 - Сервер:**
```bash
cd server
npm start
```

**Терминал 2 - Клиент:**
```bash
cd client
npm start
```

## Настройка API ключей

### GigaChat API
1. Зарегистрируйтесь на [GigaChat Developer Portal](https://developers.sber.ru/portal/products/gigachat)
2. Создайте приложение и получите API ключ

### OpenRouter API
1. Зарегистрируйтесь на [OpenRouter](https://openrouter.ai/)
2. Получите API ключ для доступа к множеству моделей
3. Пополните баланс для использования платных моделей

### Yandex Cloud AI (опционально)
1. Зарегистрируйтесь на [Yandex Cloud](https://yandex.cloud/)
2. Создайте папку и получите API ключ

### Создание .env файла

Создайте файл `server/.env`:

```env
# GigaChat API
GIGACHAT_API_KEY=your_gigachat_api_key_here

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Yandex Cloud AI (опционально)
YANDEX_CLOUD_API_KEY=your_yandex_cloud_api_key_here
YANDEX_CLOUD_FOLDER_ID=your_yandex_cloud_folder_id_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Настройки чата

Приложение поддерживает полный набор настроек GigaChat API:

### Основные параметры
- **Temperature** (0.0-2.0) - Креативность ответов
- **Max Tokens** (1-4096) - Максимальная длина ответа
- **Top P** (0.0-1.0) - Ядерная выборка для разнообразия
- **Frequency Penalty** (-2.0-2.0) - Штраф за повторения
- **Presence Penalty** (-2.0-2.0) - Штраф за новые темы

### Дополнительные настройки
- **System Message** - Определяет поведение AI
- **Stream** - Потоковый ответ
- **Safety Settings** - Настройки безопасности контента
- **Conversation ID** - Идентификатор диалога
- **User ID** - Идентификатор пользователя

### Интерфейс настроек
- Откройте настройки через кнопку ⚙️ в заголовке чата
- Все настройки сохраняются автоматически в localStorage
- Можно сбросить настройки к значениям по умолчанию

## Особенности

### Клиент (React)
- ✅ Современный responsive дизайн
- ✅ Автоматическая прокрутка к новым сообщениям
- ✅ Индикатор печати AI
- ✅ Автоматическое изменение размера поля ввода
- ✅ Отправка сообщений по Enter
- ✅ Обработка ошибок подключения
- ✅ **Полнофункциональные настройки чата**
- ✅ **Управление историей диалога**
- ✅ **Сохранение настроек в localStorage**

### Сервер (Node.js)
- ✅ Интеграция с GigaChat API (библиотека gigachat)
- ✅ Автоматическая авторизация
- ✅ Обработка ошибок
- ✅ Валидация входных данных
- ✅ CORS настройки
- ✅ Health check endpoint
- ✅ Graceful shutdown
- ✅ **Поддержка всех параметров GigaChat API**
- ✅ **Валидация настроек чата**
- ✅ **Контекст диалога**

## API Endpoints

- `POST /chat` - Отправка сообщения в чат с настройками
- `GET /health` - Проверка состояния сервера
- `GET /model-info` - Информация о доступных моделях
- `GET /settings/default` - Получение настроек по умолчанию
- `POST /settings/validate` - Валидация настроек чата

## Технологии

### Frontend
- React 18
- CSS3 с современными возможностями
- Fetch API для HTTP запросов

### Backend
- Node.js
- Express.js
- **Универсальный AI клиент** для работы с множественными провайдерами
- GigaChat SDK для интеграции с API Сбербанка
- OpenRouter API для доступа к множеству моделей
- Yandex Cloud AI SDK (опционально)
- dotenv для переменных окружения
- CORS для кросс-доменных запросов

## Разработка

### Запуск в режиме разработки

**Сервер:**
```bash
cd server
npm run dev  # с nodemon для автоперезагрузки
```

**Клиент:**
```bash
cd client
npm start    # React dev server с hot reload
```

### Сборка для продакшна

**Клиент:**
```bash
cd client
npm run build
```

**Сервер:**
```bash
cd server
npm start
```

## Устранение неполадок

### Сервер не запускается
- Проверьте, что порт 3001 свободен
- Убедитесь, что все переменные в `.env` заполнены
- Проверьте правильность API ключей GigaChat

### Клиент не подключается к серверу
- Убедитесь, что сервер запущен на порту 3001
- Проверьте CORS настройки в server.js
- Откройте Developer Tools и проверьте Network tab

### Ошибки API
- **GigaChat**: Проверьте правильность GIGACHAT_API_KEY
- **OpenRouter**: Убедитесь, что у вас есть баланс и правильный OPENROUTER_API_KEY
- **Yandex Cloud**: Проверьте YANDEX_CLOUD_API_KEY и YANDEX_CLOUD_FOLDER_ID
- Проверьте лимиты запросов для каждого провайдера

## Лицензия

MIT License
