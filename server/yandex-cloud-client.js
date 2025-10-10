import dotenv from 'dotenv';
import axios from 'axios';
import { Agent } from 'node:https';

dotenv.config();

// Настройка HTTPS агента
const httpsAgent = new Agent({
  rejectUnauthorized: false
});

/**
 * Клиент для Yandex Cloud AI API
 */
export class YandexCloudClient {
  constructor() {
    this.apiKey = process.env.YANDEX_CLOUD_API_KEY;
    this.folderId = process.env.YANDEX_CLOUD_FOLDER_ID;
    this.baseURL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';
  }

  /**
   * Отправка сообщения в Yandex Cloud AI
   */
  async sendMessage(message, settings = {}, conversationHistory = []) {
    try {
      // Формируем сообщения для диалога
      const messages = [];
      
      // Добавляем системное сообщение если указано
      if (settings.systemMessage) {
        messages.push({
          role: 'system',
          text: settings.systemMessage
        });
      }
      
      // Добавляем историю диалога
      messages.push(...conversationHistory);
      
      // Добавляем текущее сообщение пользователя
      messages.push({
        role: 'user',
        text: message
      });

      // Параметры для запроса Yandex Cloud AI
      const requestData = {
        modelUri: `gpt://${this.folderId}/yandexgpt/latest`,
        completionOptions: {
          stream: settings.stream || false,
          temperature: settings.temperature || 0.7,
          maxTokens: settings.maxTokens || 1000
        },
        messages: messages.map(msg => ({
          role: msg.role,
          text: msg.text
        }))
      };

      console.log('Отправка запроса к Yandex Cloud AI:', {
        message: message.substring(0, 100) + '...',
        temperature: requestData.completionOptions.temperature,
        maxTokens: requestData.completionOptions.maxTokens,
        modelUri: requestData.modelUri
      });

      const response = await axios.post(this.baseURL, requestData, {
        headers: {
          'Authorization': `Api-Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        httpsAgent: httpsAgent,
        timeout: 30000
      });

      return {
        success: true,
        content: response.data.result.alternatives[0].message.text,
        usage: response.data.result.usage || null,
        model: 'Yandex GPT',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Ошибка при отправке сообщения в Yandex Cloud AI:', error);
      
      return {
        success: false,
        error: error.message,
        content: 'Извините, произошла ошибка при обработке вашего запроса.',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Получение доступных моделей Yandex Cloud
   */
  getAvailableModels() {
    return [
      {
        id: 'yandex-gpt',
        name: 'Yandex GPT',
        description: 'Основная модель Yandex Cloud AI',
        maxTokens: 4096,
        capabilities: ['text-generation', 'conversation', 'russian-language'],
        provider: 'Yandex Cloud'
      },
      {
        id: 'yandex-gpt-lite',
        name: 'Yandex GPT Lite',
        description: 'Облегченная версия Yandex GPT',
        maxTokens: 2048,
        capabilities: ['text-generation', 'conversation', 'russian-language'],
        provider: 'Yandex Cloud'
      }
    ];
  }
}

export default YandexCloudClient;
