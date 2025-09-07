# Telegram Bot Wizard

Современная multi-tenant платформа для создания и управления Telegram ботами с красивым веб-интерфейсом.

## 🚀 Возможности

- **Multi-tenant архитектура** - до 5 проектов на пользователя
- **Современный UI** - стильный интерфейс в стиле tg-wizard.lovable.app
- **Интеграции** - Google Calendar, Google Sheets, OpenAI
- **Аналитика** - подробная статистика и отчеты
- **Управление проектами** - создание и настройка ботов
- **Календарь** - управление расписанием занятий
- **База знаний** - FAQ и автоматические ответы

## 🛠 Технологии

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Bot Framework**: aiogram (Python)
- **AI**: OpenAI API
- **Integrations**: Google APIs

## 📦 Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/VeraBoch/TelegramBotWizard.git
cd TelegramBotWizard
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp .env.example .env
# Отредактируйте .env файл
```

4. **Запустите в режиме разработки**
```bash
npm run dev
```

## 🏗 Структура проекта

```
TelegramBotWizard/
├── src/
│   ├── components/     # React компоненты
│   ├── pages/         # Страницы приложения
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API сервисы
│   ├── types/         # TypeScript типы
│   └── utils/         # Утилиты
├── server/            # Backend сервер
├── bot/               # Telegram бот (Python)
└── supabase/          # Database схемы
```

## 🎨 Дизайн

Интерфейс создан в современном стиле с:
- Градиентными фонами
- Стеклянными эффектами (glass morphism)
- Плавными анимациями
- Адаптивным дизайном
- Темной/светлой темой

## 📱 Функциональность

### Онбординг
- Пошаговое создание бота
- Подключение каналов
- Настройка календаря
- Создание базы знаний

### Управление проектами
- Создание до 5 проектов
- Настройка Telegram ботов
- Управление каналами
- Мониторинг активности

### Календарь
- Просмотр расписания
- Создание занятий
- Управление участниками
- Экспорт данных

### Аналитика
- Статистика сообщений
- Активность пользователей
- Популярные вопросы
- Производительность ботов

## 🔧 Настройка

### Supabase
1. Создайте проект в Supabase
2. Скопируйте URL и API ключ
3. Добавьте в `.env` файл

### Google APIs
1. Создайте проект в Google Cloud Console
2. Включите Calendar и Sheets API
3. Создайте OAuth 2.0 credentials
4. Добавьте в `.env` файл

### OpenAI
1. Получите API ключ от OpenAI
2. Добавьте в `.env` файл

## 🚀 Деплой

### Frontend (Vercel/Netlify)
```bash
npm run build
# Загрузите dist/ папку
```

### Backend (Railway/Render)
```bash
cd server
npm start
```

### Bot (Railway/Render)
```bash
cd bot
python main.py
```

## 📄 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📞 Поддержка

- Email: support@botwizard.com
- Telegram: @botwizard_support
- GitHub Issues: [Создать issue](https://github.com/VeraBoch/TelegramBotWizard/issues)
