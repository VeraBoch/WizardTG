const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const GoogleSheetsService = require('../services/googleSheetsService');
const db = require('../models/database');

// Получение URL для OAuth авторизации Google
router.get('/google/url', (req, res) => {
  try {
    const sheetsService = new GoogleSheetsService();
    const authUrl = sheetsService.getAuthUrl();
    
    res.json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate auth URL',
      details: error.message 
    });
  }
});

// Обработка callback от Google OAuth
router.post('/google/callback', async (req, res) => {
  try {
    const { code, projectId } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Missing authorization code' 
      });
    }

    const sheetsService = new GoogleSheetsService();
    const tokens = await sheetsService.getTokens(code);
    
    // Сохраняем токены в базе данных
    if (projectId) {
      await db.run(
        'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
        [projectId, 'google_access_token', tokens.access_token]
      );
      
      if (tokens.refresh_token) {
        await db.run(
          'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
          [projectId, 'google_refresh_token', tokens.refresh_token]
        );
      }
      
      await db.run(
        'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
        [projectId, 'google_token_expires', tokens.expiry_date?.toString()]
      );
    }

    res.json({
      success: true,
      message: 'Google authorization successful',
      tokens: {
        access_token: tokens.access_token,
        expires_in: tokens.expiry_date
      }
    });
  } catch (error) {
    console.error('Error processing OAuth callback:', error);
    res.status(500).json({ 
      error: 'Failed to process OAuth callback',
      details: error.message 
    });
  }
});

// Получение сохраненных токенов для проекта
router.get('/tokens/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const accessToken = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_access_token']
    );
    
    const refreshToken = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_refresh_token']
    );
    
    const expiresAt = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_token_expires']
    );

    if (!accessToken) {
      return res.status(404).json({ 
        error: 'No Google tokens found for this project' 
      });
    }

    res.json({
      success: true,
      tokens: {
        access_token: accessToken.value,
        refresh_token: refreshToken?.value,
        expires_at: expiresAt?.value
      }
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).json({ 
      error: 'Failed to get tokens',
      details: error.message 
    });
  }
});

// Обновление токенов (refresh)
router.post('/refresh/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const refreshToken = await db.get(
      'SELECT value FROM settings WHERE project_id = ? AND key = ?',
      [projectId, 'google_refresh_token']
    );
    
    if (!refreshToken) {
      return res.status(404).json({ 
        error: 'No refresh token found for this project' 
      });
    }

    const sheetsService = new GoogleSheetsService();
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken.value
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Обновляем токены в базе данных
    await db.run(
      'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
      [projectId, 'google_access_token', credentials.access_token]
    );
    
    await db.run(
      'INSERT OR REPLACE INTO settings (project_id, key, value) VALUES (?, ?, ?)',
      [projectId, 'google_token_expires', credentials.expiry_date?.toString()]
    );

    res.json({
      success: true,
      tokens: {
        access_token: credentials.access_token,
        expires_at: credentials.expiry_date
      }
    });
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    res.status(500).json({ 
      error: 'Failed to refresh tokens',
      details: error.message 
    });
  }
});

module.exports = router;