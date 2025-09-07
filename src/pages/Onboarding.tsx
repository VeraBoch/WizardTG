import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bot, 
  Calendar, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Создайте Telegram бота',
    description: 'Получите токен от @BotFather и настройте базовые параметры',
    icon: Bot,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Подключите каналы',
    description: 'Добавьте каналы для родителей, сотрудников и объявлений',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Настройте календарь',
    description: 'Подключите Google Calendar для управления расписанием',
    icon: Calendar,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Создайте базу знаний',
    description: 'Добавьте FAQ и настройте автоматические ответы',
    icon: FileText,
    color: 'bg-orange-500'
  }
]

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [botToken, setBotToken] = useState('')
  const [projectName, setProjectName] = useState('')
  const navigate = useNavigate()

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Завершение онбординга
      navigate('/')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Bot className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Создайте Telegram бота
              </h2>
              <p className="text-gray-600">
                Перейдите к @BotFather в Telegram и создайте нового бота
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название проекта
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="input-field"
                  placeholder="Например: Школа рисования"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Токен бота
                </label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="input-field"
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Подключите каналы
              </h2>
              <p className="text-gray-600">
                Добавьте каналы для разных типов общения
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Родители</h3>
                <p className="text-sm text-gray-600">Чат с родителями</p>
                <input
                  type="text"
                  className="input-field mt-2"
                  placeholder="@parents_chat"
                />
              </div>
              
              <div className="card text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Сотрудники</h3>
                <p className="text-sm text-gray-600">Чат с сотрудниками</p>
                <input
                  type="text"
                  className="input-field mt-2"
                  placeholder="@staff_chat"
                />
              </div>
              
              <div className="card text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Объявления</h3>
                <p className="text-sm text-gray-600">Канал объявлений</p>
                <input
                  type="text"
                  className="input-field mt-2"
                  placeholder="@announcements"
                />
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Подключите календарь
              </h2>
              <p className="text-gray-600">
                Интегрируйте Google Calendar для управления расписанием
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-12 w-12 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Google Calendar
                  </h3>
                  <p className="text-gray-600">
                    Подключите свой Google аккаунт для синхронизации расписания
                  </p>
                </div>
                <button className="btn-primary">
                  Подключить
                </button>
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Создайте базу знаний
              </h2>
              <p className="text-gray-600">
                Добавьте часто задаваемые вопросы и ответы
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Примеры вопросов:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Во сколько начинается занятие?</li>
                  <li>• Сколько стоит абонемент?</li>
                  <li>• Что нужно принести на занятие?</li>
                  <li>• Как отменить занятие?</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вопрос
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Во сколько занятие?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ответ
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Занятие начинается в 16:50"
                  />
                </div>
              </div>
              
              <button className="btn-secondary w-full">
                Добавить вопрос
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Bot Wizard</span>
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать!
          </h1>
          <p className="text-gray-600">
            Настроим вашего Telegram бота за несколько минут
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              Шаг {currentStep} из {steps.length}
            </p>
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-2xl mx-auto">
          <div className="card">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>
          
          <button
            onClick={handleNext}
            className="btn-primary flex items-center space-x-2"
          >
            <span>
              {currentStep === steps.length ? 'Завершить' : 'Далее'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
