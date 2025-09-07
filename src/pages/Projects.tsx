import React, { useState } from 'react'
import { 
  Plus, 
  Bot, 
  Settings, 
  Trash2, 
  Play, 
  Pause,
  Users,
  MessageSquare,
  Calendar,
  MoreVertical
} from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'Школа рисования',
    description: 'Бот для управления занятиями по рисованию',
    status: 'active',
    users: 45,
    messages: 127,
    lastActivity: '2 минуты назад',
    channels: ['@art_school_parents', '@art_school_staff', '@art_school_news'],
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Курсы английского',
    description: 'Автоматизация курсов английского языка',
    status: 'active',
    users: 32,
    messages: 89,
    lastActivity: '15 минут назад',
    channels: ['@english_parents', '@english_teachers'],
    createdAt: '2024-02-01'
  },
  {
    id: 3,
    name: 'Спортивная секция',
    description: 'Управление спортивными занятиями',
    status: 'inactive',
    users: 18,
    messages: 23,
    lastActivity: '2 часа назад',
    channels: ['@sports_parents'],
    createdAt: '2024-02-10'
  }
]

export function Projects() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Проекты</h1>
          <p className="text-gray-600">Управляйте вашими Telegram ботами</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать проект
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Bot className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'active' ? 'Активен' : 'Неактивен'}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{project.users}</p>
                <p className="text-xs text-gray-600">Пользователи</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{project.messages}</p>
                <p className="text-xs text-gray-600">Сообщения</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">3</p>
                <p className="text-xs text-gray-600">Каналы</p>
              </div>
            </div>

            {/* Channels */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Подключенные каналы:</p>
              <div className="space-y-1">
                {project.channels.map((channel, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {channel}
                  </div>
                ))}
              </div>
            </div>

            {/* Last Activity */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Последняя активность: <span className="font-medium">{project.lastActivity}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 btn-secondary text-sm">
                <Settings className="h-4 w-4 mr-1" />
                Настройки
              </button>
              <button className={`flex-1 text-sm ${
                project.status === 'active' 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              } px-3 py-2 rounded-lg transition-colors`}>
                {project.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Запустить
                  </>
                )}
              </button>
              <button className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-2 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Создать новый проект</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название проекта
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Например: Школа танцев"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Краткое описание проекта..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Токен Telegram бота
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Отмена
                </button>
                <button className="flex-1 btn-primary">
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
