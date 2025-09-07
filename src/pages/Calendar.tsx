import React, { useState } from 'react'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  MapPin,
  Edit,
  Trash2,
  Filter,
  Download
} from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'Занятие по рисованию',
    time: '16:50',
    date: '2024-09-07',
    duration: '90 мин',
    participants: 8,
    maxParticipants: 12,
    location: 'Студия А',
    instructor: 'Анна Петрова',
    status: 'scheduled'
  },
  {
    id: 2,
    title: 'Мастер-класс по акварели',
    time: '18:00',
    date: '2024-09-08',
    duration: '120 мин',
    participants: 15,
    maxParticipants: 15,
    location: 'Студия Б',
    instructor: 'Михаил Иванов',
    status: 'full'
  },
  {
    id: 3,
    title: 'Детская группа (5-7 лет)',
    time: '10:00',
    date: '2024-09-09',
    duration: '60 мин',
    participants: 6,
    maxParticipants: 10,
    location: 'Студия А',
    instructor: 'Елена Смирнова',
    status: 'scheduled'
  }
]

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
  '16:00', '16:50', '17:00', '18:00', '19:00', '20:00'
]

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState('2024-09-07')
  const [view, setView] = useState('week') // day, week, month
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800'
      case 'full': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Запланировано'
      case 'full': return 'Заполнено'
      case 'cancelled': return 'Отменено'
      default: return 'Неизвестно'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Календарь</h1>
          <p className="text-gray-600">Управление расписанием занятий</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить занятие
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">7 сентября 2024</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setView('day')}
                className={`px-3 py-1 text-sm rounded-lg ${
                  view === 'day' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                День
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-3 py-1 text-sm rounded-lg ${
                  view === 'week' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Неделя
              </button>
              <button 
                onClick={() => setView('month')}
                className={`px-3 py-1 text-sm rounded-lg ${
                  view === 'month' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Месяц
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Фильтр
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
          
          {/* Calendar days would go here */}
          {Array.from({ length: 35 }, (_, i) => (
            <div 
              key={i} 
              className={`p-2 text-center text-sm border border-gray-200 ${
                i === 6 ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
              }`}
            >
              {i >= 1 && i <= 30 ? i : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Events */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">События на сегодня</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time} ({event.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{event.participants}/{event.maxParticipants} участников</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{event.instructor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      Записано: <span className="font-medium text-gray-900">{event.participants}</span>
                    </span>
                    <span className="text-gray-600">
                      Свободно: <span className="font-medium text-gray-900">{event.maxParticipants - event.participants}</span>
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">
                      Участники
                    </button>
                    <button className="btn-primary text-sm">
                      Редактировать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h2>
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">На этой неделе</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Занятий:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Участников:</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Заполненность:</span>
                  <span className="font-medium">78%</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Популярные времена</h3>
              <div className="space-y-2">
                {timeSlots.slice(0, 5).map((time) => (
                  <div key={time} className="flex justify-between text-sm">
                    <span className="text-gray-600">{time}</span>
                    <span className="font-medium">3 занятия</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Добавить занятие</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название занятия
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Например: Занятие по рисованию"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата
                    </label>
                    <input
                      type="date"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Время
                    </label>
                    <input
                      type="time"
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Длительность (мин)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="90"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Макс. участников
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="12"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Место проведения
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Студия А"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Преподаватель
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Анна Петрова"
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
