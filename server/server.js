import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import UniversalAIClient from './universal-ai-client.js';
import { validateChatSettings } from './gigachat-client.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const aiClient = new UniversalAIClient();

// Получаем текущую директорию для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000', // React dev server
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Отдача статических файлов клиента в продакшне
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
    app.use(express.static(clientBuildPath));
    console.log(`📁 Статические файлы клиента: ${clientBuildPath}`);
}

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'AI Chat Server'
    });
});

// Основной endpoint для чата с настройками
app.post('/chat', async (req, res) => {
    try {
        const { 
            message, 
            settings = {}, 
            conversationHistory = [],
            conversationId = null,
            userId = null 
        } = req.body;

        // Валидация входных данных
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Сообщение не может быть пустым',
                response: 'Пожалуйста, введите ваше сообщение.'
            });
        }

        if (message.length > 4000) {
            return res.status(400).json({ 
                error: 'Сообщение слишком длинное',
                response: 'Пожалуйста, сократите ваше сообщение до 4000 символов.'
            });
        }

        // Валидация настроек
        const validation = validateChatSettings(settings);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Некорректные настройки чата',
                response: 'Пожалуйста, исправьте настройки: ' + validation.errors.join(', '),
                validationErrors: validation.errors
            });
        }

        console.log(`Processing message: ${message.substring(0, 100)}...`);
        console.log('Chat settings received:', JSON.stringify(settings, null, 2));

        // Добавляем дополнительные параметры
        const chatSettings = {
            ...settings,
            conversationId,
            userId,
            metadata: {
                session_id: req.sessionID || 'anonymous',
                user_agent: req.get('User-Agent') || 'MyApp/1.0',
                request_id: `req-${Date.now()}`,
                ...settings.metadata
            }
        };

        // Отправляем сообщение через универсальный клиент
        const result = await aiClient.sendMessage(message, chatSettings, conversationHistory);

        if (result.success) {
            console.log(`AI Response generated successfully`);
            return res.json({
                response: result.content,
                timestamp: result.timestamp,
                model: result.model,
                conversationId: result.conversationId,
                usage: result.usage,
                settings: chatSettings
            });
        } else {
            console.error('Chat error:', result.error);
            return res.status(500).json({
                error: result.error,
                response: result.content,
                timestamp: result.timestamp
            });
        }

    } catch (error) {
        console.error('Unexpected error:', error);

        return res.status(500).json({
            error: 'Внутренняя ошибка сервера',
            response: 'Произошла непредвиденная ошибка. Попробуйте позже.',
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint для получения информации о моделях
app.get('/model-info', (req, res) => {
    const models = aiClient.getAvailableModels();
    const availableProviders = {
        gigachat: aiClient.isProviderAvailable('gigachat'),
        yandex: aiClient.isProviderAvailable('yandex'),
        openrouter: aiClient.isProviderAvailable('openrouter')
    };
    
    res.json({
        models,
        availableProviders,
        defaultModel: 'GigaChat',
        timestamp: new Date().toISOString()
    });
});

// Endpoint для получения настроек по умолчанию
app.get('/settings/default', (req, res) => {
    const defaultSettings = {
        model: 'GigaChat',
        temperature: 0.7,
        maxTokens: 1000,
        topP: 0.9,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        systemMessage: 'Вы - полезный AI-ассистент. Отвечайте на русском языке дружелюбно и информативно. Помогайте пользователям с их вопросами и задачами.',
        stream: false,
        safetySettings: {
            harassment: 'BLOCK_MEDIUM_AND_HIGH',
            hate_speech: 'BLOCK_MEDIUM_AND_HIGH',
            dangerous_content: 'BLOCK_MEDIUM_AND_HIGH',
            sexual_content: 'BLOCK_MEDIUM_AND_HIGH',
            violence: 'BLOCK_MEDIUM_AND_HIGH',
            self_harm: 'BLOCK_MEDIUM_AND_HIGH'
        }
    };

    res.json({
        settings: defaultSettings,
        limits: {
            temperature: { min: 0.0, max: 2.0, step: 0.1 },
            maxTokens: { min: 1, max: 4096, step: 1 },
            topP: { min: 0.0, max: 1.0, step: 0.1 },
            frequencyPenalty: { min: -2.0, max: 2.0, step: 0.1 },
            presencePenalty: { min: -2.0, max: 2.0, step: 0.1 }
        },
        timestamp: new Date().toISOString()
    });
});

// Endpoint для валидации настроек
app.post('/settings/validate', (req, res) => {
    const { settings } = req.body;
    const validation = validateChatSettings(settings);
    
    res.json({
        isValid: validation.isValid,
        errors: validation.errors,
        timestamp: new Date().toISOString()
    });
});

// Обработка SPA роутинга в продакшне
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        const clientBuildPath = path.join(__dirname, '..', 'client', 'build', 'index.html');
        res.sendFile(clientBuildPath);
    });
} else {
    // Обработка несуществующих маршрутов в разработке
    app.use('*', (req, res) => {
        res.status(404).json({
            error: 'Маршрут не найден',
            availableEndpoints: ['/chat', '/health', '/model-info']
        });
    });
}

// Глобальная обработка ошибок
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        response: 'Произошла непредвиденная ошибка. Попробуйте позже.'
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 AI Chat Server запущен на порту ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 Chat endpoint: http://localhost:${PORT}/chat`);
    console.log(`ℹ️  Model info: http://localhost:${PORT}/model-info`);
    
    // Проверяем наличие необходимых переменных окружения
    if (!process.env.GIGACHAT_API_KEY) {
        console.warn('⚠️  ВНИМАНИЕ: GIGACHAT_API_KEY не установлен в .env файле');
    } else {
        console.log('✅ GIGACHAT_API_KEY настроен');
    }
    
    if (!process.env.YANDEX_CLOUD_API_KEY || !process.env.YANDEX_CLOUD_FOLDER_ID) {
        console.warn('⚠️  ВНИМАНИЕ: Yandex Cloud API ключи не установлены в .env файле');
    } else {
        console.log('✅ Yandex Cloud API ключи настроены');
    }
    
    if (!process.env.OPENROUTER_API_KEY) {
        console.warn('⚠️  ВНИМАНИЕ: OPENROUTER_API_KEY не установлен в .env файле');
    } else {
        console.log('✅ OpenRouter API ключ настроен');
    }
    
    // Показываем доступные провайдеры
    const availableProviders = {
        gigachat: aiClient.isProviderAvailable('gigachat'),
        yandex: aiClient.isProviderAvailable('yandex'),
        openrouter: aiClient.isProviderAvailable('openrouter')
    };
    console.log('📊 Доступные провайдеры AI:', availableProviders);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Получен сигнал SIGINT. Завершение работы сервера...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM. Завершение работы сервера...');
    process.exit(0);
});
