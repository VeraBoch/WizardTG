import React from 'react'
import { 
  Bot, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Plus,
  Settings,
  Activity
} from 'lucide-react'

const stats = [
  {
    name: 'Активные боты',
    value: '3',
    change: '+1',
    changeType: 'positive',
    icon: Bot,
    color: 'bg-blue-500'
  },
  {
    name: 'Сообщения сегодня',
    value: '127',
    change: '+23%',
    changeType: 'positive',
    icon: MessageSquare,
    color: 'bg-green-500'
  },
  {
    name: 'Пользователи',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    name: 'Занятия сегодня',
    value: '8',
    change: '0%',
    changeType: 'neutral',
    icon: Calendar,
    color: 'bg-orange-500'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'message',
    message: 'Новый вопрос от родителя в чате "Школа рисования"',
    time: '2 минуты назад',
    icon: MessageSquare,
    color: 'text-blue-600'
  },
  {
    id: 2,
    type: 'bot_response',
    message: 'Бот ответил на вопрос о расписании',
    time: '5 минут назад',
    icon: Bot,
    color: 'text-green-600'
  },
  {
    id: 3,
    type: 'calendar',
    message: 'Добавлено новое занятие на завтра',
    time: '1 час назад',
    icon: Calendar,
    color: 'text-purple-600'
  },
  {
    id: 4,
    type: 'user',
    message: 'Новый пользователь присоединился к чату',
    time: '2 часа назад',
    icon: Users,
    color: 'text-orange-600'
  }
]

const quickActions = [
  {
    name: 'Создать бота',
    description: 'Добавить новый проект',
    icon: Plus,
    color: 'bg-primary-600',
    href: '/projects'
  },
  {
    name: 'Настроить календарь',
    description: 'Управление расписанием',
    icon: Calendar,
    color: 'bg-green-600',
    href: '/calendar'
  },
  {
    name: 'Просмотреть аналитику',
    description: 'Статистика и отчеты',
    icon: TrendingUp,
    color: 'bg-purple-600',
    href: '/analytics'
  },
  {
    name: 'Настройки',
    description: 'Конфигурация системы',
    icon: Settings,
    color: 'bg-gray-600',
    href: '/settings'
  }
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
          <p className="text-gray-600">Обзор ваших Telegram ботов и активности</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="h-4 w-4" />
          <span>Обновлено 2 минуты назад</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <div key={action.name} className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{action.name}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Последняя активность</h2>
          <div className="card">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Ваши проекты</h2>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Новый проект
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Школа рисования',
              status: 'active',
              users: 45,
              messages: 127,
              lastActivity: '2 минуты назад'
            },
            {
              name: 'Курсы английского',
              status: 'active',
              users: 32,
              messages: 89,
              lastActivity: '15 минут назад'
            },
            {
              name: 'Спортивная секция',
              status: 'inactive',
              users: 18,
              messages: 23,
              lastActivity: '2 часа назад'
            }
          ].map((project, index) => (
            <div key={index} className="card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'active' ? 'Активен' : 'Неактивен'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Пользователи:</span>
                  <span className="font-medium">{project.users}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Сообщения:</span>
                  <span className="font-medium">{project.messages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Активность:</span>
                  <span className="font-medium">{project.lastActivity}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full btn-secondary text-sm">
                  Управлять
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
