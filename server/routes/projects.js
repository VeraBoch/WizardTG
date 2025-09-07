const express = require('express');
const db = require('../models/database');

const router = express.Router();

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Get all projects for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await db.all(
      `SELECT p.*, 
              COUNT(c.id) as channel_count,
              COUNT(e.id) as event_count
       FROM projects p
       LEFT JOIN channels c ON p.id = c.project_id AND c.is_active = 1
       LEFT JOIN events e ON p.id = e.project_id
       WHERE p.user_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.user.userId]
    );

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Get project
    const project = await db.get(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get channels
    const channels = await db.all(
      'SELECT * FROM channels WHERE project_id = ? AND is_active = 1',
      [projectId]
    );

    // Get FAQ
    const faq = await db.all(
      'SELECT * FROM faq WHERE project_id = ? AND is_active = 1 ORDER BY priority DESC',
      [projectId]
    );

    // Get recent events
    const events = await db.all(
      `SELECT * FROM events 
       WHERE project_id = ? 
       ORDER BY start_time DESC 
       LIMIT 10`,
      [projectId]
    );

    // Get settings
    const settings = await db.all(
      'SELECT key, value FROM settings WHERE project_id = ?',
      [projectId]
    );

    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json({
      project: {
        ...project,
        channels,
        faq,
        events,
        settings: settingsObj
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, bot_token } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Check project limit (5 projects per user)
    const existingProjects = await db.get(
      'SELECT COUNT(*) as count FROM projects WHERE user_id = ?',
      [req.user.userId]
    );

    if (existingProjects.count >= 5) {
      return res.status(400).json({ error: 'Maximum 5 projects allowed per user' });
    }

    // Create project
    const result = await db.run(
      'INSERT INTO projects (user_id, name, description, bot_token) VALUES (?, ?, ?, ?)',
      [req.user.userId, name, description || '', bot_token || '']
    );

    // Create default settings
    const defaultSettings = [
      ['director_chat_id', ''],
      ['director_user_id', ''],
      ['openai_api_key', ''],
      ['google_calendar_id', ''],
      ['google_sheets_id', ''],
      ['auto_escalate', 'true'],
      ['response_timeout', '30000']
    ];

    for (const [key, value] of defaultSettings) {
      await db.run(
        'INSERT INTO settings (project_id, key, value) VALUES (?, ?, ?)',
        [result.id, key, value]
      );
    }

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: result.id,
        name,
        description,
        status: 'inactive'
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, bot_token, status } = req.body;

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update project
    await db.run(
      'UPDATE projects SET name = ?, description = ?, bot_token = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, bot_token, status, projectId]
    );

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete related data
    await db.run('DELETE FROM channels WHERE project_id = ?', [projectId]);
    await db.run('DELETE FROM faq WHERE project_id = ?', [projectId]);
    await db.run('DELETE FROM events WHERE project_id = ?', [projectId]);
    await db.run('DELETE FROM messages WHERE project_id = ?', [projectId]);
    await db.run('DELETE FROM settings WHERE project_id = ?', [projectId]);
    
    // Delete project
    await db.run('DELETE FROM projects WHERE id = ?', [projectId]);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add channel to project
router.post('/:id/channels', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { type, chat_id, chat_title } = req.body;

    if (!type || !chat_id) {
      return res.status(400).json({ error: 'Type and chat_id are required' });
    }

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create channel
    const result = await db.run(
      'INSERT INTO channels (project_id, type, chat_id, chat_title) VALUES (?, ?, ?, ?)',
      [projectId, type, chat_id, chat_title || '']
    );

    res.status(201).json({
      message: 'Channel added successfully',
      channel: {
        id: result.id,
        type,
        chat_id,
        chat_title
      }
    });
  } catch (error) {
    console.error('Add channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add FAQ item
router.post('/:id/faq', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { question, answer, keywords, priority } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create FAQ item
    const result = await db.run(
      'INSERT INTO faq (project_id, question, answer, keywords, priority) VALUES (?, ?, ?, ?, ?)',
      [projectId, question, answer, JSON.stringify(keywords || []), priority || 0]
    );

    res.status(201).json({
      message: 'FAQ item added successfully',
      faq: {
        id: result.id,
        question,
        answer,
        keywords: keywords || [],
        priority: priority || 0
      }
    });
  } catch (error) {
    console.error('Add FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
