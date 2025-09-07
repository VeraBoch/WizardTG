import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar, 
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const analyticsData = {
  overview: {
    totalUsers: 1234,
    activeUsers: 892,
    totalMessages: 15678,
    responseRate: 94.5,
    avgResponseTime: '2.3 мин'
  },
  messages: [
    { date: '2024-09-01', count: 45 },
    { date: '2024-09-02', count: 52 },
    { date: '2024-09-03', count: 38 },
    { date: '2024-09-04', count: 67 },
    { date: '2024-09-05', count: 43 },
    { date: '2024-09-06', count: 58 },
    { date: '2024-09-07', count: 41 }
  ],
  topQuestions: [
    { question: 'Во сколько занятие?', count: 23, percentage: 15.2 },
    { question: 'Сколько стоит абонемент?', count: 18, percentage: 11.9 },
    { question: 'Что нужно принести?', count: 15, percentage: 9.9 },
    { question: 'Как отменить занятие?', count: 12, percentage: 7.9 },
    { question: 'Есть ли пробное занятие?', count: 10, percentage: 6.6 }
  ],
  userActivity: [
    { hour: '09:00', users: 12 },
    { hour: '10:00', users: 18 },
    { hour: '11:00', users: 25 },
    { hour: '12:00', users: 15 },
    { hour: '13:00', users: 8 },
    { hour: '14:00', users: 22 },
    { hour: '15:00', users: 35 },
    { hour: '16:00', users: 42 },
    { hour: '17:00', users: 38 },
    { hour: '18:00', users: 28 },
    { hour: '19:00', users: 15 },
    { hour: '20:00', users: 8 }
  ]
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState('week')
  const [selectedProject, setSelectedProject] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600">Статистика и отчеты по вашим ботам</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">Все проекты</option>
            <option value="art">Школа рисования</option>
            <option value="english">Курсы английского</option>
            <option value="sports">Спортивная секция</option>
          </select>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Период:</span>
          </div>
          <div className="flex items-center space-x-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  timeRange === range 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === 'day' ? 'День' : 
                 range === 'week' ? 'Неделя' : 
                 range === 'month' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего пользователей</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Активных</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.activeUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Сообщений</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalMessages}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ответов</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.responseRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Время ответа</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.avgResponseTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Сообщения по дням</h3>
            <BarChart3 className="h-5 w-5 text-gray-600" />
          </div>
          
          <div className="space-y-3">
            {analyticsData.messages.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString('ru-RU', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(item.count / 70) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Активность по часам</h3>
            <PieChart className="h-5 w-5 text-gray-600" />
          </div>
          
          <div className="space-y-3">
            {analyticsData.userActivity.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-12">{item.hour}</span>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(item.users / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.users}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Questions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярные вопросы</h3>
        
        <div className="space-y-4">
          {analyticsData.topQuestions.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.question}</p>
                <p className="text-sm text-gray-600">{item.count} раз ({item.percentage}%)</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Производительность бота</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Время ответа</span>
              <span className="font-medium">2.3 сек</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Точность ответов</span>
              <span className="font-medium">94.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Эскалация к директору</span>
              <span className="font-medium">5.2%</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Удовлетворенность</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Положительные отзывы</span>
              <span className="font-medium text-green-600">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Нейтральные</span>
              <span className="font-medium text-gray-600">10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Отрицательные</span>
              <span className="font-medium text-red-600">3%</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Использование функций</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">FAQ</span>
              <span className="font-medium">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Календарь</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Запись на занятия</span>
              <span className="font-medium">32%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
