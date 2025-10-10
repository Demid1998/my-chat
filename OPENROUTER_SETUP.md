# Инструкция по добавлению OpenRouter API ключа

## Шаг 1: Получение API ключа OpenRouter

1. **Регистрация на OpenRouter**
   - Перейдите на [https://openrouter.ai/](https://openrouter.ai/)
   - Нажмите "Sign up" и зарегистрируйтесь через Google, GitHub или MetaMask

2. **Создание API ключа**
   - Войдите в личный кабинет
   - Перейдите в раздел "API Keys" (или "Keys")
   - Нажмите "Create Key"
   - Дайте ключу имя (например, "My AI Chat App")
   - Опционально установите лимит расходов
   - Скопируйте созданный API ключ

3. **Пополнение баланса**
   - Перейдите в раздел "Credits"
   - Пополните баланс минимум на $1
   - Выберите подходящий план

## Шаг 2: Добавление ключа в проект

### Вариант 1: Через файл .env (рекомендуется)

1. Откройте файл `server/.env` в текстовом редакторе
2. Добавьте строку с вашим OpenRouter API ключом:

```env
# GigaChat API Configuration
GIGACHAT_API_KEY=MDE5OWM0M2YtZDRmOS03Y2VlLWE3ZDAtOWMxNjNiZDA0OTBjOmQ4YjI5ODI4LWYzNmMtNDE4ZS04ZTQyLWRkOTU5MmM4ZGM4MQ==

# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-your_actual_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

3. Сохраните файл

### Вариант 2: Через переменные окружения

```bash
export OPENROUTER_API_KEY="sk-or-v1-your_actual_api_key_here"
```

## Шаг 3: Перезапуск сервера

После добавления API ключа перезапустите сервер:

```bash
cd server
# Остановите текущий сервер (Ctrl+C)
npm start
```

## Шаг 4: Проверка работы

1. **Проверьте статус провайдеров:**
```bash
curl -s http://localhost:3001/model-info | jq '.availableProviders'
```

Должно показать:
```json
{
  "gigachat": true,
  "yandex": false,
  "openrouter": true
}
```

2. **Протестируйте модель OpenRouter:**
```bash
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Привет! Расскажи коротко о себе",
    "settings": {
      "model": "openai/gpt-3.5-turbo",
      "temperature": 0.7,
      "maxTokens": 100
    }
  }'
```

## Шаг 5: Использование в интерфейсе

1. Откройте приложение в браузере
2. Нажмите кнопку ⚙️ (настройки)
3. В разделе "Модель AI" выберите любую модель из группы "OpenRouter - Множество моделей"
4. Сохраните настройки
5. Начните чат с выбранной моделью

## Доступные модели OpenRouter

После добавления API ключа вы сможете использовать:

- **GPT-4o** (`openai/gpt-4o`) - Самая продвинутая модель OpenAI
- **GPT-4o Mini** (`openai/gpt-4o-mini`) - Быстрая модель OpenAI
- **GPT-3.5 Turbo** (`openai/gpt-3.5-turbo`) - Классическая модель OpenAI
- **Claude 3.5 Sonnet** (`anthropic/claude-3.5-sonnet`) - Продвинутая модель Anthropic
- **Claude 3 Haiku** (`anthropic/claude-3-haiku`) - Быстрая модель Anthropic
- **Gemini Pro 1.5** (`google/gemini-pro-1.5`) - Модель Google с большим контекстом
- **Llama 3.1 8B** (`meta-llama/llama-3.1-8b-instruct`) - Открытая модель Meta
- **Llama 3.1 70B** (`meta-llama/llama-3.1-70b-instruct`) - Мощная модель Meta
- **Mistral 7B** (`mistralai/mistral-7b-instruct`) - Эффективная модель Mistral
- **DeepSeek Chat** (`deepseek/deepseek-chat`) - Модель для программирования

## Устранение неполадок

### Ошибка "OPENROUTER_API_KEY не установлен"
- Убедитесь, что добавили ключ в файл `.env`
- Проверьте правильность синтаксиса (без пробелов вокруг `=`)
- Перезапустите сервер

### Ошибка "Insufficient credits"
- Пополните баланс на OpenRouter
- Проверьте лимиты расходов для ключа

### Ошибка "Invalid API key"
- Проверьте правильность скопированного ключа
- Убедитесь, что ключ активен в личном кабинете OpenRouter

### Модель недоступна
- Некоторые модели могут требовать специального доступа
- Попробуйте другую модель из списка
- Проверьте статус модели на сайте OpenRouter

## Безопасность

⚠️ **Важно:**
- Никогда не коммитьте файл `.env` в репозиторий
- Не делитесь API ключами с другими
- Используйте лимиты расходов для контроля затрат
- Регулярно проверяйте использование в личном кабинете OpenRouter

## Поддержка

- [Документация OpenRouter](https://openrouter.ai/docs)
- [Discord сообщество](https://discord.gg/openrouter)
- [GitHub репозиторий](https://github.com/openrouter-ai/openrouter)
