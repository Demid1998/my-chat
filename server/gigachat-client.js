import dotenv from 'dotenv';
import GigaChat from 'gigachat';
import { Agent } from 'node:https';

dotenv.config();

// Настройка HTTPS агента для работы с GigaChat API
const httpsAgent = new Agent({
  rejectUnauthorized: false
});

// Создание клиента GigaChat
const client = new GigaChat({
  timeout: 600,
  model: 'GigaChat',
  credentials: process.env.GIGACHAT_API_KEY,
  httpsAgent: httpsAgent,
});

/**
 * Отправка сообщения в чат с настройками
 * @param {string} message - Сообщение пользователя
 * @param {Object} settings - Настройки чата
 * @param {Array} conversationHistory - История диалога
 * @returns {Promise<Object>} Ответ от AI
 */
export async function sendChatMessage(message, settings = {}, conversationHistory = []) {
  try {
    // Формируем сообщения для диалога
    const messages = [];
    
    // Добавляем системное сообщение если указано
    if (settings.systemMessage) {
      messages.push({ 
        role: 'system', 
        content: settings.systemMessage 
      });
    }
    
    // Добавляем историю диалога
    messages.push(...conversationHistory);
    
    // Добавляем текущее сообщение пользователя
    messages.push({ 
      role: 'user', 
      content: message 
    });

    // Параметры для запроса (согласно документации GigaChat API)
    const chatParams = {
      model: settings.model || 'GigaChat',
      messages,
      temperature: settings.temperature || 0.7,
      max_tokens: settings.maxTokens || 1000,
      top_p: settings.topP || 0.9,
      stream: settings.stream || false,
    };

    // Добавляем repetition_penalty если указан (вместо frequency_penalty)
    if (settings.frequencyPenalty !== undefined) {
      chatParams.repetition_penalty = 1.0 + (settings.frequencyPenalty / 2.0); // Конвертируем -2..2 в 0..2
    }

    // Добавляем дополнительные параметры если они указаны
    if (settings.conversationId) {
      chatParams.conversation_id = settings.conversationId;
    }
    
    if (settings.userId) {
      chatParams.user_id = settings.userId;
    }
    
    if (settings.stop && settings.stop.length > 0) {
      chatParams.stop = settings.stop;
    }
    
    if (settings.responseFormat) {
      chatParams.response_format = settings.responseFormat;
    }
    
    if (settings.logitBias) {
      chatParams.logit_bias = settings.logitBias;
    }
    
    if (settings.metadata) {
      chatParams.metadata = settings.metadata;
    }

    // Настройки безопасности (если поддерживаются)
    if (settings.safetySettings) {
      chatParams.safety_settings = settings.safetySettings;
    }

    console.log('Отправка запроса к GigaChat с параметрами:', {
      message: message.substring(0, 100) + '...',
      temperature: chatParams.temperature,
      max_tokens: chatParams.max_tokens,
      top_p: chatParams.top_p,
      repetition_penalty: chatParams.repetition_penalty,
      settings_received: settings,
      full_chat_params: chatParams
    });

    const response = await client.chat(chatParams);
    
    return {
      success: true,
      content: response.choices[0]?.message?.content || 'Не удалось получить ответ',
      usage: response.usage || null,
      model: response.model || 'GigaChat',
      conversationId: response.conversation_id || null,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Ошибка при отправке сообщения в GigaChat:', error);
    
    return {
      success: false,
      error: error.message,
      content: 'Извините, произошла ошибка при обработке вашего запроса.',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Получение доступных моделей
 */
export function getAvailableModels() {
  return [
    {
      id: 'GigaChat',
      name: 'GigaChat',
      description: 'Основная модель GigaChat для общего использования',
      maxTokens: 4096,
      capabilities: ['text-generation', 'conversation', 'russian-language'],
      provider: 'Sberbank'
    },
    {
      id: 'GigaChat-Pro',
      name: 'GigaChat Pro',
      description: 'Продвинутая модель GigaChat с улучшенными возможностями',
      maxTokens: 8192,
      capabilities: ['text-generation', 'conversation', 'russian-language', 'code-generation'],
      provider: 'Sberbank'
    },
    {
      id: 'GigaChat-Pro-preview',
      name: 'GigaChat Pro (Preview)',
      description: 'Экспериментальная версия GigaChat Pro в раннем доступе',
      maxTokens: 8192,
      capabilities: ['text-generation', 'conversation', 'russian-language', 'code-generation'],
      provider: 'Sberbank',
      isPreview: true
    }
  ];
}

/**
 * Валидация настроек чата согласно документации GigaChat API
 */
export function validateChatSettings(settings) {
  const errors = [];
  
  // Temperature: 0-2 (согласно документации)
  if (settings.temperature !== undefined && (settings.temperature < 0 || settings.temperature > 2)) {
    errors.push('Temperature должен быть от 0.0 до 2.0');
  }
  
  // Max tokens: положительное число
  if (settings.maxTokens !== undefined && (settings.maxTokens < 1)) {
    errors.push('Max tokens должен быть больше 0');
  }
  
  // Top P: 0-1 (согласно документации)
  if (settings.topP !== undefined && (settings.topP < 0 || settings.topP > 1)) {
    errors.push('Top P должен быть от 0.0 до 1.0');
  }
  
  // Frequency penalty: -2 до 2 (конвертируется в repetition_penalty)
  if (settings.frequencyPenalty !== undefined && (settings.frequencyPenalty < -2 || settings.frequencyPenalty > 2)) {
    errors.push('Frequency penalty должен быть от -2.0 до 2.0');
  }
  
  // Presence penalty не поддерживается в GigaChat API
  if (settings.presencePenalty !== undefined) {
    console.warn('Presence penalty не поддерживается в GigaChat API');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default client;
