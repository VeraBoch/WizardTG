# Настройка Google Cloud Console для создания таблиц

## 🚀 Пошаговая инструкция

### 1. Создание проекта в Google Cloud Console

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Запомните **Project ID**

### 2. Включение необходимых API

В разделе "APIs & Services" → "Library" включите:

- **Google Sheets API**
- **Google Drive API** 
- **Google Calendar API**

### 3. Настройка OAuth 2.0

1. Перейдите в "APIs & Services" → "Credentials"
2. Нажмите "Create Credentials" → "OAuth 2.0 Client ID"
3. Выберите "Web application"
4. Настройте:
   - **Name**: Telegram Bot Wizard
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (для разработки)
     - `https://yourdomain.com` (для продакшена)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/google/callback` (для разработки)
     - `https://yourdomain.com/auth/google/callback` (для продакшена)

### 4. Получение учетных данных

После создания OAuth 2.0 Client ID вы получите:
- **Client ID**
- **Client Secret**

### 5. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Для продакшена
# GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

### 6. Установка зависимостей

```bash
npm install googleapis
```

## 🔐 Как это работает

### Процесс авторизации:

1. **Пользователь нажимает "Создать таблицу"**
2. **Открывается OAuth окно Google** с запросом разрешений
3. **Пользователь авторизуется** и дает разрешения
4. **Google возвращает код авторизации**
5. **Сервер обменивает код на токены** (access_token, refresh_token)
6. **Создается таблица от имени пользователя** с использованием его токенов
7. **Таблица сохраняется в Google Drive пользователя**

### Разрешения (Scopes):

- `https://www.googleapis.com/auth/spreadsheets` - создание и редактирование таблиц
- `https://www.googleapis.com/auth/drive.file` - создание файлов в Drive
- `https://www.googleapis.com/auth/calendar.readonly` - чтение календаря

## 📊 Что создается

После авторизации в Google Drive пользователя создается таблица с листами:

- **Payments** - оплаты и платежи
- **Attendance** - посещаемость занятий  
- **Leave** - отпуска и больничные
- **Absence** - отсутствия учеников
- **KB** - база знаний (FAQ)
- **Triage** - эскалации и вопросы

## 🔒 Безопасность

- ✅ **Токены хранятся зашифрованными** в базе данных
- ✅ **Refresh token** автоматически обновляет access_token
- ✅ **Данные остаются у пользователя** - мы не имеем к ним доступа
- ✅ **OAuth 2.0** - стандарт безопасности Google

## 🚨 Важные моменты

1. **Refresh token** выдается только при первом запросе с `prompt=consent`
2. **Access token** действует 1 час, затем обновляется автоматически
3. **Пользователь может отозвать доступ** в настройках Google аккаунта
4. **Нужно настроить домен** для продакшена в Google Cloud Console

## 🧪 Тестирование

Для тестирования используйте:
- `http://localhost:3000` в Authorized JavaScript origins
- `http://localhost:3000/auth/google/callback` в Authorized redirect URIs

## 📝 Пример использования

```javascript
// Получение URL для авторизации
const response = await fetch('/api/auth/google/url');
const { authUrl } = await response.json();

// Открытие OAuth окна
const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');

// После авторизации создание таблицы
const createResponse = await fetch('/api/sheets/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'project_123',
    projectName: 'Моя школа',
    accessToken: 'ya29.a0AfH6SMC...'
  })
});
```

## 🆘 Решение проблем

### Ошибка "redirect_uri_mismatch"
- Проверьте, что redirect URI в коде совпадает с настройками в Google Cloud Console

### Ошибка "access_denied"
- Пользователь отклонил разрешения
- Нужно повторить авторизацию

### Ошибка "invalid_client"
- Проверьте Client ID и Client Secret
- Убедитесь, что проект активен в Google Cloud Console

### Таблица не создается
- Проверьте, что включены Google Sheets API и Google Drive API
- Убедитесь, что токены действительны
