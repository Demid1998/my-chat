# Примеры настроек чата

## Творческий писатель
```json
{
  "temperature": 1.2,
  "maxTokens": 1500,
  "topP": 0.9,
  "frequencyPenalty": 0.3,
  "presencePenalty": 0.1,
  "systemMessage": "Ты - творческий писатель и поэт. Отвечай красивым, образным языком, используй метафоры и аллегории. Помогай с созданием историй, стихов и художественных текстов."
}
```

## Технический эксперт
```json
{
  "temperature": 0.3,
  "maxTokens": 2000,
  "topP": 0.7,
  "frequencyPenalty": 0.1,
  "presencePenalty": 0.0,
  "systemMessage": "Ты - технический эксперт по программированию и IT. Давай точные, структурированные ответы с примерами кода. Объясняй сложные концепции простым языком."
}
```

## Веселый собеседник
```json
{
  "temperature": 1.5,
  "maxTokens": 800,
  "topP": 0.95,
  "frequencyPenalty": 0.5,
  "presencePenalty": 0.3,
  "systemMessage": "Ты - веселый и дружелюбный собеседник. Отвечай с юмором, используй эмодзи, шути и поднимай настроение. Будь позитивным и энергичным."
}
```

## Строгий преподаватель
```json
{
  "temperature": 0.2,
  "maxTokens": 1200,
  "topP": 0.6,
  "frequencyPenalty": 0.0,
  "presencePenalty": -0.5,
  "systemMessage": "Ты - строгий, но справедливый преподаватель. Давай точные, проверенные факты. Задавай уточняющие вопросы и помогай ученикам думать самостоятельно."
}
```

## Переводчик и лингвист
```json
{
  "temperature": 0.4,
  "maxTokens": 1000,
  "topP": 0.8,
  "frequencyPenalty": 0.2,
  "presencePenalty": 0.1,
  "systemMessage": "Ты - профессиональный переводчик и лингвист. Помогай с переводами, объясняй грамматику, предоставляй синонимы и антонимы. Работай с множеством языков."
}
```

## Настройки безопасности

### Максимальная безопасность
```json
{
  "safetySettings": {
    "harassment": "BLOCK_MEDIUM_AND_HIGH",
    "hate_speech": "BLOCK_MEDIUM_AND_HIGH",
    "dangerous_content": "BLOCK_MEDIUM_AND_HIGH",
    "sexual_content": "BLOCK_MEDIUM_AND_HIGH",
    "violence": "BLOCK_MEDIUM_AND_HIGH",
    "self_harm": "BLOCK_MEDIUM_AND_HIGH"
  }
}
```

### Умеренная фильтрация
```json
{
  "safetySettings": {
    "harassment": "BLOCK_ONLY_HIGH",
    "hate_speech": "BLOCK_ONLY_HIGH",
    "dangerous_content": "BLOCK_MEDIUM_AND_HIGH",
    "sexual_content": "BLOCK_ONLY_HIGH",
    "violence": "BLOCK_ONLY_HIGH",
    "self_harm": "BLOCK_MEDIUM_AND_HIGH"
  }
}
```

### Минимальная фильтрация
```json
{
  "safetySettings": {
    "harassment": "BLOCK_NONE",
    "hate_speech": "BLOCK_ONLY_HIGH",
    "dangerous_content": "BLOCK_ONLY_HIGH",
    "sexual_content": "BLOCK_NONE",
    "violence": "BLOCK_ONLY_HIGH",
    "self_harm": "BLOCK_MEDIUM_AND_HIGH"
  }
}
```

## Как применить настройки

1. Откройте настройки чата (кнопка ⚙️)
2. Скопируйте нужные значения из примеров выше
3. Вставьте в соответствующие поля
4. Нажмите "Сохранить"

## Эксперименты с параметрами

### Temperature
- **0.0** - Детерминированные, предсказуемые ответы
- **0.7** - Баланс между творчеством и точностью (по умолчанию)
- **1.0** - Креативные, но логичные ответы
- **1.5+** - Очень креативные, иногда неожиданные ответы

### Max Tokens
- **500** - Короткие ответы
- **1000** - Средние ответы (по умолчанию)
- **2000** - Длинные, подробные ответы
- **4000** - Максимально подробные ответы

### Frequency Penalty
- **-1.0** - Поощряет повторения
- **0.0** - Нейтрально (по умолчанию)
- **1.0** - Избегает повторений
- **2.0** - Максимально избегает повторений

### Presence Penalty
- **-1.0** - Поощряет новые темы
- **0.0** - Нейтрально (по умолчанию)
- **1.0** - Остается в рамках темы
- **2.0** - Максимально фокусируется на теме
