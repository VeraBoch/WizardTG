const { google } = require('googleapis');
const path = require('path');

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.drive = null;
  }

  // Инициализация с OAuth токеном пользователя
  async initialize(accessToken, refreshToken = null) {
    try {
      this.auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // Устанавливаем токены пользователя
      const credentials = { access_token: accessToken };
      if (refreshToken) {
        credentials.refresh_token = refreshToken;
      }
      
      this.auth.setCredentials(credentials);
      
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      
      return true;
    } catch (error) {
      console.error('Error initializing Google Sheets service:', error);
      return false;
    }
  }

  // Получение URL для OAuth авторизации
  getAuthUrl() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent' // Принудительно запрашиваем refresh_token
    });
  }

  // Обмен кода авторизации на токены
  async getTokens(code) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const { tokens } = await oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  }

  // Создание новой Google таблицы с готовыми листами
  async createProjectSpreadsheet(projectName, projectId) {
    try {
      // Создаем новую таблицу
      const spreadsheet = await this.sheets.spreadsheets.create({
        resource: {
          properties: {
            title: `${projectName} - Telegram Bot Data`,
          },
        },
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId;
      
      // Создаем листы с заголовками
      await this.createSheetsWithHeaders(spreadsheetId);
      
      // Даем доступ боту к таблице
      await this.shareWithServiceAccount(spreadsheetId);
      
      return {
        spreadsheetId,
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
        sheets: this.getSheetNames()
      };
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  // Создание листов с заголовками
  async createSheetsWithHeaders(spreadsheetId) {
    const sheetNames = this.getSheetNames();
    
    // Удаляем лист по умолчанию
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [{
          deleteSheet: {
            sheetId: 0
          }
        }]
      }
    });

    // Создаем новые листы
    const requests = sheetNames.map((sheetName, index) => ({
      addSheet: {
        properties: {
          sheetId: index,
          title: sheetName,
          gridProperties: {
            rowCount: 1000,
            columnCount: 20
          }
        }
      }
    }));

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests }
    });

    // Добавляем заголовки для каждого листа
    for (const sheetName of sheetNames) {
      await this.addHeaders(spreadsheetId, sheetName);
    }
  }

  // Добавление заголовков для листов
  async addHeaders(spreadsheetId, sheetName) {
    const headers = this.getHeadersForSheet(sheetName);
    
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
      valueInputOption: 'RAW',
      resource: {
        values: [headers]
      }
    });
  }

  // Получение заголовков для каждого листа
  getHeadersForSheet(sheetName) {
    const headers = {
      'Payments': ['Дата', 'Ученик', 'Сумма', 'Период', 'Кружок', 'Способ оплаты', 'Примечания'],
      'Attendance': ['Дата', 'Кружок', 'Присутствующие', 'Отсутствующие', 'Всего', 'Комментарий'],
      'Leave': ['Сотрудник', 'Тип', 'Начало', 'Конец', 'Причина', 'Статус', 'Одобрил'],
      'Absence': ['Дата', 'Ученик', 'Кружок', 'Причина', 'Уважительная'],
      'KB': ['Вопрос', 'Ответ', 'Ключевые слова', 'Приоритет'],
      'Triage': ['ID', 'Чат', 'Пользователь', 'Вопрос', 'Ответ', 'Статус', 'Дата']
    };
    
    return headers[sheetName] || [];
  }

  // Получение списка листов
  getSheetNames() {
    return ['Payments', 'Attendance', 'Leave', 'Absence', 'KB', 'Triage'];
  }

  // Предоставление доступа service account
  async shareWithServiceAccount(spreadsheetId) {
    try {
      const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      
      await this.drive.permissions.create({
        fileId: spreadsheetId,
        resource: {
          role: 'writer',
          type: 'user',
          emailAddress: serviceAccountEmail
        }
      });
    } catch (error) {
      console.error('Error sharing with service account:', error);
    }
  }

  // Добавление строки в лист
  async appendRow(spreadsheetId, sheetName, row) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        resource: {
          values: [row]
        }
      });
    } catch (error) {
      console.error(`Error appending row to ${sheetName}:`, error);
      throw error;
    }
  }

  // Чтение данных из листа
  async readRange(spreadsheetId, range) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      });
      
      return response.data.values || [];
    } catch (error) {
      console.error(`Error reading range ${range}:`, error);
      throw error;
    }
  }

  // Проверка доступа к таблице
  async checkAccess(spreadsheetId) {
    try {
      await this.sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'properties.title'
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Получение информации о таблице
  async getSpreadsheetInfo(spreadsheetId) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'properties.title,sheets.properties'
      });
      
      return {
        title: response.data.properties.title,
        sheets: response.data.sheets.map(sheet => ({
          id: sheet.properties.sheetId,
          title: sheet.properties.title
        }))
      };
    } catch (error) {
      console.error('Error getting spreadsheet info:', error);
      throw error;
    }
  }
}

module.exports = GoogleSheetsService;
