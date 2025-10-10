# ⚡ Быстрый деплой на Render.com

## 🚀 За 5 минут

### 1. Загрузите проект в GitHub
```bash
# Если у вас еще нет Git репозитория
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/my-chat.git
git push -u origin main
```

### 2. Создайте сервис на Render
1. Идите на [render.com](https://render.com/)
2. **"New +"** → **"Web Service"**
3. Подключите ваш GitHub репозиторий

### 3. Настройки
```
Name: my-chat-app
Environment: Node
Build Command: chmod +x build.sh && ./build.sh
Start Command: chmod +x start.sh && ./start.sh
```

### 4. Добавьте API ключи
В разделе **Environment Variables**:
```
GIGACHAT_API_KEY = ваш_ключ
OPENROUTER_API_KEY = ваш_ключ
NODE_ENV = production
```

### 5. Нажмите "Create Web Service" 🎉

## ✅ Готово!
Ваше приложение будет доступно по адресу: `https://my-chat-app.onrender.com`

## 📖 Подробная инструкция
См. [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)
