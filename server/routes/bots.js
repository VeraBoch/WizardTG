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

// Get bot status
router.get('/:projectId/status', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get bot statistics
    const stats = await db.get(
      `SELECT 
        COUNT(DISTINCT m.user_id) as unique_users,
        COUNT(m.id) as total_messages,
        AVG(m.response_time) as avg_response_time,
        COUNT(CASE WHEN m.is_escalated = 1 THEN 1 END) as escalated_count
       FROM messages m
       WHERE m.project_id = ? AND m.created_at >= datetime('now', '-24 hours')`,
      [projectId]
    );

    res.json({
      status: project.status,
      bot_token: project.bot_token ? '***' + project.bot_token.slice(-4) : null,
      stats: {
        unique_users: stats.unique_users || 0,
        total_messages: stats.total_messages || 0,
        avg_response_time: Math.round(stats.avg_response_time || 0),
        escalated_count: stats.escalated_count || 0
      }
    });
  } catch (error) {
    console.error('Get bot status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start/Stop bot
router.post('/:projectId/control', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { action } = req.body; // 'start' or 'stop'

    if (!['start', 'stop'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Use "start" or "stop"' });
    }

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (action === 'start' && !project.bot_token) {
      return res.status(400).json({ error: 'Bot token is required to start the bot' });
    }

    // Update bot status
    const newStatus = action === 'start' ? 'active' : 'inactive';
    await db.run(
      'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, projectId]
    );

    // TODO: Here you would integrate with the actual bot service
    // For now, we just update the database status

    res.json({
      message: `Bot ${action === 'start' ? 'started' : 'stopped'} successfully`,
      status: newStatus
    });
  } catch (error) {
    console.error('Bot control error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bot logs
router.get('/:projectId/logs', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get recent messages
    const messages = await db.all(
      `SELECT 
        m.*,
        c.chat_title,
        c.type as chat_type
       FROM messages m
       LEFT JOIN channels c ON m.chat_id = c.chat_id AND c.project_id = ?
       WHERE m.project_id = ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [projectId, projectId, limit, offset]
    );

    // Get total count
    const totalCount = await db.get(
      'SELECT COUNT(*) as count FROM messages WHERE project_id = ?',
      [projectId]
    );

    res.json({
      messages,
      pagination: {
        total: totalCount.count,
        limit,
        offset,
        hasMore: offset + limit < totalCount.count
      }
    });
  } catch (error) {
    console.error('Get bot logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test bot connection
router.post('/:projectId/test', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.bot_token) {
      return res.status(400).json({ error: 'Bot token is required' });
    }

    // TODO: Here you would test the actual bot connection
    // For now, we simulate a test
    const testResult = {
      success: true,
      message: 'Bot connection successful',
      bot_info: {
        username: 'test_bot',
        first_name: 'Test Bot',
        can_join_groups: true,
        can_read_all_group_messages: false
      }
    };

    res.json(testResult);
  } catch (error) {
    console.error('Test bot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update bot settings
router.put('/:projectId/settings', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const settings = req.body;

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update settings
    for (const [key, value] of Object.entries(settings)) {
      await db.run(
        `INSERT OR REPLACE INTO settings (project_id, key, value, updated_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [projectId, key, value]
      );
    }

    res.json({ message: 'Bot settings updated successfully' });
  } catch (error) {
    console.error('Update bot settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
