import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Components
const Home = () => (
  <div className="page">
    <h1>🏠 Главная</h1>
    <p>Добро пожаловать в WizardTG!</p>
    <div className="card">
      <h3>Статус системы</h3>
      <p>✅ Все системы работают</p>
      <p>🟢 Бот активен</p>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="page">
    <h1>📊 Панель управления</h1>
    <div className="dashboard-grid">
      <div className="card">
        <h3>Пользователи</h3>
        <p className="stat">1,234</p>
      </div>
      <div className="card">
        <h3>Сообщения</h3>
        <p className="stat">5,678</p>
      </div>
      <div className="card">
        <h3>Активные чаты</h3>
        <p className="stat">89</p>
      </div>
      <div className="card">
        <h3>Статус</h3>
        <p className="stat">🟢 Онлайн</p>
      </div>
    </div>
  </div>
);

const Settings = () => (
  <div className="page">
    <h1>⚙️ Настройки</h1>
    <div className="card">
      <h3>Конфигурация</h3>
      <p>Настройки системы будут здесь</p>
    </div>
  </div>
);

const App = () => {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="logo">🧙‍♂️</span>
          <span className="brand-text">WizardTG</span>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/dashboard" className="nav-link">Панель</Link>
          <Link to="/settings" className="nav-link">Настройки</Link>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
