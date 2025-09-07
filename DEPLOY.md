# Telegram Wizard - Деплой на Koyeb

## Подготовка к деплою

### 1. Создание репозитория на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VeraBoch/WizardTG.git
git push -u origin main
```

### 2. Настройка Koyeb

1. Зайдите на [koyeb.com](https://koyeb.com)
2. Создайте новый сервис
3. Выберите "GitHub" как источник
4. Подключите репозиторий `VeraBoch/WizardTG`
5. Настройте переменные окружения из `koyeb-env.txt`

### 3. Переменные окружения

Скопируйте переменные из `koyeb-env.txt` в настройки Koyeb:

- `NODE_ENV=production`
- `PORT=3000`
- `GOOGLE_CLIENT_ID=819148666788-inajit5sc8mcg0fv3ka0ud2uoe87lttj.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET=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`
- `GOOGLE_REDIRECT_URI=https://your-app-name.koyeb.app/auth/google/callback`
- `DATABASE_URL=sqlite:///app/data/telegram_wizard.db`
- `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production`
- `SESSION_SECRET=your-super-secret-session-key-change-this-in-production`

### 4. Настройка домена

После деплоя получите URL вида: `https://your-app-name.koyeb.app`

Обновите `GOOGLE_REDIRECT_URI` в настройках Koyeb и Google Cloud Console.

### 5. Структура приложения

```
/
├── public/           # Статические файлы
│   ├── demo.html
│   ├── onboarding.html
│   └── faq-template.csv
├── server/           # Backend API
│   ├── index.js
│   ├── routes/
│   └── services/
├── Dockerfile
├── .dockerignore
└── koyeb-env.txt
```

### 6. Проверка деплоя

После деплоя проверьте:
- `https://your-app-name.koyeb.app/` - главная страница
- `https://your-app-name.koyeb.app/onboarding` - процесс настройки
- `https://your-app-name.koyeb.app/api/health` - API health check

### 7. Следующие шаги

1. Добавить Telegram Bot интеграцию
2. Настроить OpenAI API
3. Добавить PWA манифест
4. Настроить кастомный домен
