# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем build tools для компиляции нативных модулей
RUN apk add --no-cache python3 make g++ sqlite-dev

# Копируем package.json файлы
COPY package*.json ./
COPY server/package*.json ./server/

# Устанавливаем зависимости
RUN npm install
RUN cd server && npm install

# Очищаем build tools для уменьшения размера образа
RUN apk del python3 make g++

# Копируем исходный код
COPY . .

# Создаем директорию для статических файлов
RUN mkdir -p public

# Копируем HTML файлы в public
COPY demo.html public/
COPY onboarding.html public/
COPY faq-template.csv public/

# Создаем директорию для базы данных
RUN mkdir -p data

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "server/index.js"]