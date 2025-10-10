require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const https = require('https');

// Настройка для работы с GigaChat API
const { AUTH_URL, AUTH_KEY_PERS } = process.env;

// Отключаем проверку SSL сертификатов для работы с API Сбера
axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// Payload для авторизации
const payloadPers = { 'scope': 'GIGACHAT_API_PERS' };

// Создаем экземпляр axios с необходимыми заголовками
const axiosInstance = axios.create({
    maxBodyLength: Infinity,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': crypto.randomUUID(),
        'Authorization': `Basic ${AUTH_KEY_PERS}`
    },
});

/**
 * Функция для получения токена доступа к GigaChat API
 * @returns {Promise<string>} Токен доступа
 */
function oAuth() {
    return axiosInstance.post(AUTH_URL, payloadPers)
        .then(({ data }) => {
            console.log('Successfully authenticated with GigaChat API');
            return data;
        })
        .catch((error) => {
            console.error('Authentication error:', error.response?.data || error.message);
            throw error;
        });
}

module.exports = oAuth;
