// Пример конфигурации для GigaChat API
// Скопируйте этот файл в .env и заполните вашими данными

module.exports = {
  AUTH_URL: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
  AI_URL: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
  AUTH_KEY_PERS: 'your_base64_encoded_credentials_here', // Замените на ваши реальные данные
  PORT: 3001,
  NODE_ENV: 'development'
};
