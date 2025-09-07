const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      defaultSrc: ["'self'"]
    }
  }
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for Koyeb
app.set('trust proxy', 1);

// Import routes
const authRoutes = require('./routes/auth');
const sheetsRoutes = require('./routes/sheets');
const projectsRoutes = require('./routes/projects');
const botsRoutes = require('./routes/bots');
const analyticsRoutes = require('./routes/analytics');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/sheets', sheetsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Main page
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Onboarding page
app.get('/onboarding', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '../public/onboarding.html'));
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Telegram Wizard - Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .gradient-bg {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .glass-effect {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
        </style>
    </head>
    <body class="gradient-bg min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-white mb-4">
                    🎛️ Dashboard
                </h1>
                <p class="text-white/80 text-lg">Управление вашими ботами</p>
            </div>
            
            <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="glass-effect rounded-lg p-6 text-white">
                    <h2 class="text-xl font-semibold mb-4">🤖 Боты</h2>
                    <p class="mb-4">Управление вашими Telegram ботами</p>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Просмотреть ботов
                    </button>
                </div>
                
                <div class="glass-effect rounded-lg p-6 text-white">
                    <h2 class="text-xl font-semibold mb-4">📊 Аналитика</h2>
                    <p class="mb-4">Статистика и отчеты</p>
                    <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                        Просмотреть аналитику
                    </button>
                </div>
                
                <div class="glass-effect rounded-lg p-6 text-white">
                    <h2 class="text-xl font-semibold mb-4">⚙️ Настройки</h2>
                    <p class="mb-4">Настройки проекта</p>
                    <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
                        Открыть настройки
                    </button>
                </div>
            </div>
            
            <div class="text-center mt-8">
                <a href="/onboarding" class="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg">
                    Создать нового бота
                </a>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});