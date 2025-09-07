import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Key,
  Database,
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showApiKey, setShowApiKey] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: User },
    { id: 'notifications', name: 'Уведомления', icon: Bell },
    { id: 'security', name: 'Безопасность', icon: Shield },
    { id: 'billing', name: 'Оплата', icon: CreditCard },
    { id: 'integrations', name: 'Интеграции', icon: Database },
    { id: 'api', name: 'API', icon: Key }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Личная информация</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue="Вера Бочкарева"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    defaultValue="vera@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    defaultValue="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Организация
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue="Школа рисования"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки аккаунта</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Язык интерфейса</p>
                    <p className="text-sm text-gray-600">Выберите язык для интерфейса</p>
                  </div>
                  <select className="input-field w-auto">
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Часовой пояс</p>
                    <p className="text-sm text-gray-600">Время для отображения событий</p>
                  </div>
                  <select className="input-field w-auto">
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/London">Лондон (UTC+0)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Уведомления по email</h3>
              <div className="space-y-4">
                {[
                  { name: 'Новые сообщения', description: 'Уведомления о новых сообщениях в чатах', enabled: true },
                  { name: 'Эскалация к директору', description: 'Когда бот не может ответить на вопрос', enabled: true },
                  { name: 'Ошибки системы', description: 'Критические ошибки и проблемы', enabled: true },
                  { name: 'Еженедельные отчеты', description: 'Сводка активности за неделю', enabled: false },
                  { name: 'Обновления системы', description: 'Новые функции и улучшения', enabled: true }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{notification.name}</p>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={notification.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Безопасность аккаунта</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Двухфакторная аутентификация</p>
                    <p className="text-sm text-gray-600">Дополнительная защита аккаунта</p>
                  </div>
                  <button className="btn-secondary">Включить</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Смена пароля</p>
                    <p className="text-sm text-gray-600">Обновите пароль для безопасности</p>
                  </div>
                  <button className="btn-secondary">Изменить</button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Активные сессии</h3>
              <div className="space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'Москва, Россия', lastActive: 'Сейчас', current: true },
                  { device: 'iPhone 14', location: 'Москва, Россия', lastActive: '2 часа назад', current: false },
                  { device: 'Chrome на Windows', location: 'Санкт-Петербург, Россия', lastActive: '1 день назад', current: false }
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{session.device}</p>
                      <p className="text-sm text-gray-600">{session.location} • {session.lastActive}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.current && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Текущая
                        </span>
                      )}
                      {!session.current && (
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Завершить
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Текущий план</h3>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Бесплатный план</h4>
                    <p className="text-sm text-gray-600">До 5 проектов, базовые функции</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    Активен
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-gray-600">Проектов</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-sm text-gray-600">Пользователей</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">∞</p>
                    <p className="text-sm text-gray-600">Сообщений</p>
                  </div>
                </div>
                
                <button className="w-full btn-primary">
                  Перейти на Pro план
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">История платежей</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Pro план - Сентябрь 2024</p>
                    <p className="text-sm text-gray-600">2 сентября 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₽2,990</p>
                    <p className="text-sm text-green-600">Оплачено</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Подключенные сервисы</h3>
              <div className="space-y-4">
                {[
                  { 
                    name: 'Google Calendar', 
                    description: 'Синхронизация расписания занятий',
                    connected: true,
                    icon: '📅'
                  },
                  { 
                    name: 'Google Sheets', 
                    description: 'Управление данными пользователей',
                    connected: true,
                    icon: '📊'
                  },
                  { 
                    name: 'OpenAI', 
                    description: 'ИИ для ответов на вопросы',
                    connected: true,
                    icon: '🤖'
                  },
                  { 
                    name: 'Telegram Bot API', 
                    description: 'Основной функционал бота',
                    connected: true,
                    icon: '📱'
                  }
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{integration.name}</p>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        integration.connected 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.connected ? 'Подключено' : 'Не подключено'}
                      </span>
                      <button className="btn-secondary text-sm">
                        {integration.connected ? 'Настроить' : 'Подключить'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API ключи</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">Основной API ключ</p>
                    <button 
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value="sk-1234567890abcdef..."
                      readOnly
                      className="input-field flex-1 font-mono text-sm"
                    />
                    <button className="btn-secondary">Копировать</button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Используйте этот ключ для доступа к API
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Документация API</h3>
              <div className="card">
                <p className="text-gray-600 mb-4">
                  Полная документация по использованию API доступна по ссылке:
                </p>
                <a 
                  href="#" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  https://api.botwizard.com/docs
                </a>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600">Управление аккаунтом и конфигурацией</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderTabContent()}
            
            {activeTab !== 'api' && (
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
