// server/openrouter-client.js
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function sendOpenRouterMessage(message, settings = {}, conversationHistory = []) {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is not configured.');
    }

    const messages = [];
    
    // Добавляем системное сообщение если есть
    if (settings.systemMessage) {
        messages.push({ role: 'system', content: settings.systemMessage });
    }
    
    // Добавляем историю разговора
    conversationHistory.forEach(msg => {
        messages.push({ 
            role: msg.role, 
            content: msg.content 
        });
    });
    
    // Добавляем текущее сообщение пользователя
    messages.push({ role: 'user', content: message });

    try {
        const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
            model: settings.model || 'openai/gpt-3.5-turbo',
            messages: messages,
            temperature: settings.temperature || 0.7,
            max_tokens: settings.maxTokens || 1000,
            top_p: settings.topP || 0.9,
            stream: settings.stream || false,
            // OpenRouter поддерживает дополнительные параметры
            frequency_penalty: settings.frequencyPenalty || 0.0,
            presence_penalty: settings.presencePenalty || 0.0,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000', // Для отслеживания использования
                'X-Title': 'My AI Chat App', // Название приложения
            },
        });

        const choice = response.data.choices[0];
        const usage = response.data.usage;

        return {
            success: true,
            content: choice.message.content,
            usage: {
                prompt_tokens: usage?.prompt_tokens || 0,
                completion_tokens: usage?.completion_tokens || 0,
                total_tokens: usage?.total_tokens || 0
            },
            model: response.data.model,
            finish_reason: choice.finish_reason,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error sending message to OpenRouter:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message,
            content: 'Извините, произошла ошибка при обработке вашего запроса через OpenRouter.',
            timestamp: new Date().toISOString(),
        };
    }
}

export function getOpenRouterModels() {
    // Популярные модели доступные через OpenRouter
    return [
        // OpenAI Models
        {
            id: 'openai/gpt-4o',
            name: 'GPT-4o',
            description: 'Самая продвинутая модель OpenAI с мультимодальными возможностями',
            maxTokens: 128000,
            capabilities: ['text-generation', 'conversation', 'multimodal', 'code-generation'],
            provider: 'OpenRouter',
            category: 'OpenAI',
            pricing: 'Premium'
        },
        {
            id: 'openai/gpt-4o-mini',
            name: 'GPT-4o Mini',
            description: 'Быстрая и эффективная модель OpenAI',
            maxTokens: 128000,
            capabilities: ['text-generation', 'conversation', 'multimodal'],
            provider: 'OpenRouter',
            category: 'OpenAI',
            pricing: 'Standard'
        },
        {
            id: 'openai/gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            description: 'Классическая модель OpenAI для общего использования',
            maxTokens: 16384,
            capabilities: ['text-generation', 'conversation'],
            provider: 'OpenRouter',
            category: 'OpenAI',
            pricing: 'Economy'
        },
        
        // Anthropic Models
        {
            id: 'anthropic/claude-3.5-sonnet',
            name: 'Claude 3.5 Sonnet',
            description: 'Продвинутая модель Anthropic с отличными возможностями рассуждения',
            maxTokens: 200000,
            capabilities: ['text-generation', 'conversation', 'reasoning', 'code-generation'],
            provider: 'OpenRouter',
            category: 'Anthropic',
            pricing: 'Premium'
        },
        {
            id: 'anthropic/claude-3-haiku',
            name: 'Claude 3 Haiku',
            description: 'Быстрая модель Anthropic для простых задач',
            maxTokens: 200000,
            capabilities: ['text-generation', 'conversation'],
            provider: 'OpenRouter',
            category: 'Anthropic',
            pricing: 'Economy'
        },
        
        // Google Models
        {
            id: 'google/gemini-pro-1.5',
            name: 'Gemini Pro 1.5',
            description: 'Модель Google с большим контекстным окном',
            maxTokens: 2000000,
            capabilities: ['text-generation', 'conversation', 'multimodal'],
            provider: 'OpenRouter',
            category: 'Google',
            pricing: 'Standard'
        },
        
        // Meta Models
        {
            id: 'meta-llama/llama-3.1-8b-instruct',
            name: 'Llama 3.1 8B',
            description: 'Открытая модель Meta для интерактивного использования',
            maxTokens: 131072,
            capabilities: ['text-generation', 'conversation'],
            provider: 'OpenRouter',
            category: 'Meta',
            pricing: 'Economy'
        },
        {
            id: 'meta-llama/llama-3.1-70b-instruct',
            name: 'Llama 3.1 70B',
            description: 'Мощная открытая модель Meta',
            maxTokens: 131072,
            capabilities: ['text-generation', 'conversation', 'reasoning'],
            provider: 'OpenRouter',
            category: 'Meta',
            pricing: 'Standard'
        },
        
        // Mistral Models
        {
            id: 'mistralai/mistral-7b-instruct',
            name: 'Mistral 7B',
            description: 'Эффективная модель Mistral для интерактивного использования',
            maxTokens: 32768,
            capabilities: ['text-generation', 'conversation'],
            provider: 'OpenRouter',
            category: 'Mistral',
            pricing: 'Economy'
        },
        
        // DeepSeek Models
        {
            id: 'deepseek/deepseek-chat',
            name: 'DeepSeek Chat',
            description: 'Модель DeepSeek с отличными возможностями программирования',
            maxTokens: 32768,
            capabilities: ['text-generation', 'conversation', 'code-generation'],
            provider: 'OpenRouter',
            category: 'DeepSeek',
            pricing: 'Economy'
        }
    ];
}

export function validateOpenRouterSettings(settings) {
    const errors = [];
    
    if (settings.temperature !== undefined && (settings.temperature < 0 || settings.temperature > 2)) {
        errors.push('Temperature должен быть от 0.0 до 2.0');
    }
    
    if (settings.maxTokens !== undefined && (settings.maxTokens < 1 || settings.maxTokens > 2000000)) {
        errors.push('Max tokens должен быть от 1 до 2,000,000');
    }
    
    if (settings.topP !== undefined && (settings.topP < 0 || settings.topP > 1)) {
        errors.push('Top P должен быть от 0.0 до 1.0');
    }
    
    if (settings.frequencyPenalty !== undefined && (settings.frequencyPenalty < -2 || settings.frequencyPenalty > 2)) {
        errors.push('Frequency penalty должен быть от -2.0 до 2.0');
    }
    
    if (settings.presencePenalty !== undefined && (settings.presencePenalty < -2 || settings.presencePenalty > 2)) {
        errors.push('Presence penalty должен быть от -2.0 до 2.0');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

export function isOpenRouterAvailable() {
    return !!OPENROUTER_API_KEY;
}
