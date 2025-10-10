import { sendChatMessage as gigachatSendMessage, getAvailableModels as gigachatGetModels } from './gigachat-client.js';
import { YandexCloudClient } from './yandex-cloud-client.js';
import { sendOpenRouterMessage, getOpenRouterModels, validateOpenRouterSettings, isOpenRouterAvailable } from './openrouter-client.js';

/**
 * Универсальный AI клиент для работы с разными провайдерами
 */
export class UniversalAIClient {
  constructor() {
    this.yandexClient = new YandexCloudClient();
  }

  /**
   * Отправка сообщения через выбранный провайдер
   */
  async sendMessage(message, settings = {}, conversationHistory = []) {
    const provider = this.getProviderFromModel(settings.model);
    
    // Проверяем доступность провайдера перед отправкой
    if (!this.isProviderAvailable(provider)) {
      return {
        success: false,
        error: `Провайдер ${provider} недоступен. Проверьте настройки API ключей.`,
        content: `Извините, провайдер ${provider} недоступен. Пожалуйста, выберите другую модель или проверьте настройки API ключей.`,
        timestamp: new Date().toISOString(),
      };
    }
    
    switch (provider) {
      case 'yandex':
        return await this.yandexClient.sendMessage(message, settings, conversationHistory);
      
      case 'openrouter':
        return await sendOpenRouterMessage(message, settings, conversationHistory);
      
      case 'gigachat':
      default:
        return await gigachatSendMessage(message, settings, conversationHistory);
    }
  }

  /**
   * Получение всех доступных моделей от всех провайдеров
   */
  getAvailableModels() {
    const gigachatModels = gigachatGetModels();
    const yandexModels = this.yandexClient.getAvailableModels();
    const openrouterModels = getOpenRouterModels();
    
    return [...gigachatModels, ...yandexModels, ...openrouterModels];
  }

  /**
   * Определение провайдера по названию модели
   */
  getProviderFromModel(modelId) {
    if (!modelId) return 'gigachat';
    
    // OpenRouter модели имеют формат "provider/model"
    if (modelId.includes('/')) {
      return 'openrouter';
    }
    
    // Yandex модели
    if (modelId.startsWith('yandex')) {
      return 'yandex';
    }
    
    // GigaChat модели (по умолчанию)
    return 'gigachat';
  }

  /**
   * Проверка доступности провайдера
   */
  isProviderAvailable(provider) {
    switch (provider) {
      case 'yandex':
        return !!(process.env.YANDEX_CLOUD_API_KEY && process.env.YANDEX_CLOUD_FOLDER_ID);
      case 'openrouter':
        return isOpenRouterAvailable();
      case 'gigachat':
        return !!process.env.GIGACHAT_API_KEY;
      default:
        return false;
    }
  }
}

export default UniversalAIClient;
