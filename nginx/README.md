# Nginx Configuration

Эта директория содержит конфигурацию Nginx для продакшн деплоя.

## Структура

- `nginx.conf` - основная конфигурация Nginx с SSL поддержкой
- `ssl/` - директория для SSL сертификатов

## SSL Сертификаты

Для работы HTTPS необходимо поместить SSL сертификаты в директорию `ssl/`:

- `cert.pem` - SSL сертификат
- `key.pem` - приватный ключ

### Получение SSL сертификатов

#### Для разработки (самоподписанный сертификат):

```bash
mkdir -p nginx/ssl
openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=RU/ST=State/L=City/O=Organization/CN=localhost"
```

#### Для продакшна:

1. Используйте Let's Encrypt с Certbot
2. Или получите сертификат от коммерческого CA
3. Поместите файлы в `nginx/ssl/`

## Особенности конфигурации

- Автоматический редирект с HTTP на HTTPS
- Rate limiting для API endpoints
- Gzip сжатие
- Заголовки безопасности
- Проксирование API запросов к Node.js серверу
- Кэширование статических файлов
- Health check endpoint

## Переменные окружения

Убедитесь, что в вашем `.env.prod` файле настроены правильные URL для API:

```env
REACT_APP_API_URL=https://yourdomain.com/api
```
