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

// Get overview analytics
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const timeRange = req.query.range || '7d'; // 1d, 7d, 30d, 90d
    const projectId = req.query.project_id;

    // Calculate date range
    const dateRange = getDateRange(timeRange);
    
    let whereClause = 'WHERE m.created_at >= ?';
    let params = [dateRange];

    if (projectId) {
      whereClause += ' AND m.project_id = ?';
      params.push(projectId);
    } else {
      // Get all user's projects
      const userProjects = await db.all(
        'SELECT id FROM projects WHERE user_id = ?',
        [req.user.userId]
      );
      
      if (userProjects.length > 0) {
        const projectIds = userProjects.map(p => p.id);
        whereClause += ` AND m.project_id IN (${projectIds.map(() => '?').join(',')})`;
        params.push(...projectIds);
      } else {
        return res.json({
          totalUsers: 0,
          totalMessages: 0,
          avgResponseTime: 0,
          escalationRate: 0,
          topQuestions: [],
          messageTrend: []
        });
      }
    }

    // Get overview stats
    const stats = await db.get(
      `SELECT 
        COUNT(DISTINCT m.user_id) as total_users,
        COUNT(m.id) as total_messages,
        AVG(m.response_time) as avg_response_time,
        COUNT(CASE WHEN m.is_escalated = 1 THEN 1 END) as escalated_count
       FROM messages m
       ${whereClause}`,
      params
    );

    // Get message trend
    const messageTrend = await db.all(
      `SELECT 
        DATE(m.created_at) as date,
        COUNT(*) as count
       FROM messages m
       ${whereClause}
       GROUP BY DATE(m.created_at)
       ORDER BY date`,
      params
    );

    // Get top questions (simplified)
    const topQuestions = await db.all(
      `SELECT 
        m.message_text,
        COUNT(*) as count
       FROM messages m
       ${whereClause}
       WHERE m.message_text IS NOT NULL
       GROUP BY m.message_text
       ORDER BY count DESC
       LIMIT 10`,
      params
    );

    const escalationRate = stats.total_messages > 0 
      ? (stats.escalated_count / stats.total_messages * 100).toFixed(1)
      : 0;

    res.json({
      totalUsers: stats.total_users || 0,
      totalMessages: stats.total_messages || 0,
      avgResponseTime: Math.round(stats.avg_response_time || 0),
      escalationRate: parseFloat(escalationRate),
      topQuestions: topQuestions.map(q => ({
        question: q.message_text,
        count: q.count
      })),
      messageTrend: messageTrend.map(t => ({
        date: t.date,
        count: t.count
      }))
    });
  } catch (error) {
    console.error('Get overview analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project-specific analytics
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const timeRange = req.query.range || '7d';

    // Check if project exists and belongs to user
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const dateRange = getDateRange(timeRange);

    // Get project stats
    const stats = await db.get(
      `SELECT 
        COUNT(DISTINCT m.user_id) as unique_users,
        COUNT(m.id) as total_messages,
        AVG(m.response_time) as avg_response_time,
        COUNT(CASE WHEN m.is_escalated = 1 THEN 1 END) as escalated_count
       FROM messages m
       WHERE m.project_id = ? AND m.created_at >= ?`,
      [projectId, dateRange]
    );

    // Get channel breakdown
    const channelStats = await db.all(
      `SELECT 
        c.type,
        c.chat_title,
        COUNT(m.id) as message_count,
        COUNT(DISTINCT m.user_id) as unique_users
       FROM channels c
       LEFT JOIN messages m ON c.chat_id = m.chat_id AND m.created_at >= ?
       WHERE c.project_id = ? AND c.is_active = 1
       GROUP BY c.id, c.type, c.chat_title`,
      [dateRange, projectId]
    );

    // Get hourly activity
    const hourlyActivity = await db.all(
      `SELECT 
        strftime('%H', m.created_at) as hour,
        COUNT(*) as count
       FROM messages m
       WHERE m.project_id = ? AND m.created_at >= ?
       GROUP BY strftime('%H', m.created_at)
       ORDER BY hour`,
      [projectId, dateRange]
    );

    // Get FAQ effectiveness
    const faqStats = await db.all(
      `SELECT 
        f.question,
        f.answer,
        COUNT(m.id) as usage_count
       FROM faq f
       LEFT JOIN messages m ON m.bot_response LIKE '%' || f.answer || '%' AND m.created_at >= ?
       WHERE f.project_id = ? AND f.is_active = 1
       GROUP BY f.id, f.question, f.answer
       ORDER BY usage_count DESC`,
      [dateRange, projectId]
    );

    res.json({
      project: {
        id: projectId,
        name: project.name
      },
      stats: {
        uniqueUsers: stats.unique_users || 0,
        totalMessages: stats.total_messages || 0,
        avgResponseTime: Math.round(stats.avg_response_time || 0),
        escalationRate: stats.total_messages > 0 
          ? (stats.escalated_count / stats.total_messages * 100).toFixed(1)
          : 0
      },
      channels: channelStats,
      hourlyActivity: hourlyActivity.map(h => ({
        hour: h.hour,
        count: h.count
      })),
      faqEffectiveness: faqStats.map(f => ({
        question: f.question,
        answer: f.answer,
        usageCount: f.usage_count
      }))
    });
  } catch (error) {
    console.error('Get project analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user activity
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const timeRange = req.query.range || '7d';
    const projectId = req.query.project_id;
    const limit = parseInt(req.query.limit) || 50;

    const dateRange = getDateRange(timeRange);
    
    let whereClause = 'WHERE m.created_at >= ?';
    let params = [dateRange];

    if (projectId) {
      whereClause += ' AND m.project_id = ?';
      params.push(projectId);
    } else {
      // Get all user's projects
      const userProjects = await db.all(
        'SELECT id FROM projects WHERE user_id = ?',
        [req.user.userId]
      );
      
      if (userProjects.length > 0) {
        const projectIds = userProjects.map(p => p.id);
        whereClause += ` AND m.project_id IN (${projectIds.map(() => '?').join(',')})`;
        params.push(...projectIds);
      }
    }

    params.push(limit);

    const userActivity = await db.all(
      `SELECT 
        m.user_id,
        COUNT(m.id) as message_count,
        MIN(m.created_at) as first_message,
        MAX(m.created_at) as last_message,
        AVG(m.response_time) as avg_response_time
       FROM messages m
       ${whereClause}
       GROUP BY m.user_id
       ORDER BY message_count DESC
       LIMIT ?`,
      params
    );

    res.json({
      users: userActivity.map(user => ({
        userId: user.user_id,
        messageCount: user.message_count,
        firstMessage: user.first_message,
        lastMessage: user.last_message,
        avgResponseTime: Math.round(user.avg_response_time || 0)
      }))
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to get date range
function getDateRange(range) {
  const now = new Date();
  const ranges = {
    '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
    '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  };
  
  return ranges[range] || ranges['7d'];
}

module.exports = router;
