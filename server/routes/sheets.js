const express = require('express');
const router = express.Router();
const GoogleSheetsService = require('../services/googleSheetsService');
const db = require('../models/database');

// Создание новой Google таблицы
router.post('/create', async (req, res) => {
  try {
    const { projectId, projectName, accessToken } = req.body;
    
    if (!projectId || !projectName || !accessToken) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, projectName, accessToken' 
      });
    }

    const sheetsService = new GoogleSheetsService();
    await sheetsService.initialize(accessToken);
    
    const result = await sheetsService.createProjectSpreadsheet(projectName, projectId);
    
    // Сохраняем ID таблицы в настройках проекта
    await db.run(
      'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
      [projectId, 'google_sheet_id', result.spreadsheetId]
    );
    
    await db.run(
      'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
      [projectId, 'google_sheet_url', result.url]
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating Google Sheets:', error);
    res.status(500).json({ 
      error: 'Failed to create Google Sheets',
      details: error.message 
    });
  }
});

// Подключение существующей таблицы
router.post('/connect', async (req, res) => {
  try {
    const { projectId, spreadsheetId, accessToken } = req.body;
    
    if (!projectId || !spreadsheetId || !accessToken) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, spreadsheetId, accessToken' 
      });
    }

    const sheetsService = new GoogleSheetsService();
    await sheetsService.initialize(accessToken);
    
    // Проверяем доступ к таблице
    const hasAccess = await sheetsService.checkAccess(spreadsheetId);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'No access to the specified spreadsheet' 
      });
    }
    
    // Получаем информацию о таблице
    const info = await sheetsService.getSpreadsheetInfo(spreadsheetId);
    
    // Сохраняем ID таблицы в настройках проекта
    await db.run(
      'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
      [projectId, 'google_sheet_id', spreadsheetId]
    );
    
    await db.run(
      'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
      [projectId, 'google_sheet_url', `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`]
    );

    res.json({
      success: true,
      data: {
        spreadsheetId,
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
        title: info.title,
        sheets: info.sheets
      }
    });
  } catch (error) {
    console.error('Error connecting to Google Sheets:', error);
    res.status(500).json({ 
      error: 'Failed to connect to Google Sheets',
      details: error.message 
    });
  }
});

// Получение информации о подключенной таблице
router.get('/info/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const sheetId = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_sheet_id']
    );
    
    const sheetUrl = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_sheet_url']
    );
    
    if (!sheetId) {
      return res.status(404).json({ 
        error: 'No Google Sheets connected to this project' 
      });
    }

    res.json({
      success: true,
      data: {
        spreadsheetId: sheetId.value,
        url: sheetUrl?.value,
        connected: true
      }
    });
  } catch (error) {
    console.error('Error getting sheets info:', error);
    res.status(500).json({ 
      error: 'Failed to get sheets info',
      details: error.message 
    });
  }
});

// Добавление данных в таблицу
router.post('/data/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sheetName, data, accessToken } = req.body;
    
    if (!sheetName || !data || !accessToken) {
      return res.status(400).json({ 
        error: 'Missing required fields: sheetName, data, accessToken' 
      });
    }

    // Получаем ID таблицы
    const sheetId = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_sheet_id']
    );
    
    if (!sheetId) {
      return res.status(404).json({ 
        error: 'No Google Sheets connected to this project' 
      });
    }

    const sheetsService = new GoogleSheetsService();
    await sheetsService.initialize(accessToken);
    
    await sheetsService.appendRow(sheetId.value, sheetName, data);

    res.json({
      success: true,
      message: 'Data added successfully'
    });
  } catch (error) {
    console.error('Error adding data to sheets:', error);
    res.status(500).json({ 
      error: 'Failed to add data to sheets',
      details: error.message 
    });
  }
});

// Чтение данных из таблицы
router.get('/data/:projectId/:sheetName', async (req, res) => {
  try {
    const { projectId, sheetName } = req.params;
    const { accessToken, range } = req.query;
    
    if (!accessToken) {
      return res.status(400).json({ 
        error: 'Missing accessToken parameter' 
      });
    }

    // Получаем ID таблицы
    const sheetId = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_sheet_id']
    );
    
    if (!sheetId) {
      return res.status(404).json({ 
        error: 'No Google Sheets connected to this project' 
      });
    }

    const sheetsService = new GoogleSheetsService();
    await sheetsService.initialize(accessToken);
    
    const readRange = range || `${sheetName}!A1:Z1000`;
    const data = await sheetsService.readRange(sheetId.value, readRange);

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error reading data from sheets:', error);
    res.status(500).json({ 
      error: 'Failed to read data from sheets',
      details: error.message 
    });
  }
});

module.exports = router;
