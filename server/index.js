const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const botRoutes = require('./routes/bots');
const analyticsRoutes = require('./routes/analytics');
const sheetsRoutes = require('./routes/sheets');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sheets', sheetsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve main pages
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Temporary route to test if updates work
app.get('/temp', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`
    <html>
      <body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: Arial; text-align: center; padding: 50px;">
        <h1>🎉 ОБНОВЛЕНИЯ РАБОТАЮТ! v3.0</h1>
        <p>Если вы видите эту страницу - сервер обновился!</p>
        <a href="/onboarding" style="color: white; text-decoration: underline;">Перейти к onboarding</a>
      </body>
    </html>
  `);
});

app.get('/onboarding', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.sendFile(path.join(__dirname, '../public/onboarding.html'));
});

app.get('/onboarding-v5', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.send(`
        <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1>🚀 ОБНОВЛЕНО v5.0! 🚀</h1>
                <p>Это тест нового маршрута</p>
                <a href="/onboarding">Вернуться к onboarding</a>
            </body>
        </html>
    `);
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

app.get('/new', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '../public/demo-new.html'));
});

app.get('/version', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, '../public/version.txt'));
});

app.get('/google-test', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, '../public/google-test.html'));
});

// Временный тест для проверки обновления
app.get('/test-callback', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>✅ Сервер обновился!</h1>
        <p>Время: ${new Date().toISOString()}</p>
        <p>Google OAuth callback должен работать</p>
        <a href="/onboarding">Вернуться к onboarding</a>
      </body>
    </html>
  `);
});

app.get('/test-v5', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>🚀 ОБНОВЛЕНО v5.0! 🚀</h1>
        <p>Это тест нового маршрута</p>
        <p>Время: ${new Date().toISOString()}</p>
        <a href="/onboarding">Вернуться к onboarding</a>
      </body>
    </html>
  `);
});

// Serve static files (after specific routes)
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
