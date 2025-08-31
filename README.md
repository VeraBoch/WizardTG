# WizardTG

Современная панель управления для Telegram ботов с красивым UI.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm start
```

### Сборка для продакшена
```bash
npm run build
```

### Деплой на GitHub Pages
```bash
npm run deploy
```

## 🔧 Настройка GitHub Pages

Проект настроен для работы с GitHub Pages:

1. **SPA Fallback**: `public/404.html` обрабатывает клиентскую маршрутизацию
2. **Basename**: Роутер настроен на `/WizardTG` 
3. **Homepage**: В `package.json` указан правильный URL

## 📁 Структура проекта

```
WizardTG/
├── public/
│   ├── index.html
│   └── 404.html          # SPA fallback для GitHub Pages
├── src/
│   ├── App.js            # Главный компонент с роутингом
│   ├── App.css           # Стили приложения
│   ├── index.js          # Точка входа с настройкой роутера
│   └── index.css         # Глобальные стили
├── package.json          # Зависимости и скрипты
└── README.md
```

## 🎨 Особенности

- ✨ Современный UI с градиентами и анимациями
- 📱 Адаптивный дизайн
- 🔄 Клиентская маршрутизация
- 🚀 Оптимизировано для GitHub Pages
- 🎯 Готово к продакшену

## 🔗 Ссылки

- **GitHub Pages**: https://veraboch.github.io/WizardTG/
- **Главная**: https://veraboch.github.io/WizardTG/
- **Панель**: https://veraboch.github.io/WizardTG/dashboard
- **Настройки**: https://veraboch.github.io/WizardTG/settings
