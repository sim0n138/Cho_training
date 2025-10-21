
# 🏋️ Cho Training

### Персональный трекер тренировок и самочувствия

[![Bundle Size](https://img.shields.io/badge/bundle%20size-81KB%20gzipped-success)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](tsconfig.json)
[![Minimalist](https://img.shields.io/badge/architecture-minimalist-purple)](docs/MINIMAL_ARCHITECTURE.md)

**Веб-приложение для систематизации тренировок, отслеживания самочувствия и мониторинга прогресса**

[📖 Документация](#-документация) • [🚀 Быстрый старт](#-быстрый-старт) • [✨ Возможности](#-возможности)

---

## 🎯 О проекте

**Cho Training** — это минималистичное приложение для отслеживания тренировок и самочувствия, которое:

- ⚡ **Быстрое** — 81KB gzipped, мгновенная загрузка
- 🎯 **Простое** — фокус на главном без лишних функций
- 📊 **Визуализирует** ваш прогресс
- 🔒 **Защищает** ваши данные (всё хранится локально)
- 🎨 **Минималистичное** — монохромный дизайн

### Версия 2.0 - Minimalist Redesign

✨ **Полностью переписано** с фокусом на простоту, скорость и современные технологии

## 📚 Документация

- **[🏗️ Минималистичная архитектура](docs/MINIMAL_ARCHITECTURE.md)** - Документация архитектуры v2.0

---

## ✨ Возможности

### 🏠 Dashboard (Главная панель)
- 📊 Обзор статистики: общее количество логов, упражнений, средний mood
- 📝 Последний лог с полной информацией
- 💾 Экспорт/импорт данных (JSON формат)
- 🚀 Быстрый доступ к созданию нового лога

### 📝 Log (Журнал)
- 📅 **Дата** тренировки
- 🏋️ **Упражнения** (comma-separated список)
- 😊 **Настроение** (шкала 1-10)
- ⚡ **Энергия** (шкала 1-10)
- 📝 **Заметки** (опциональное текстовое поле)
- ✅ Валидация формы

### 📊 Stats (Статистика)
- 📈 Топ-10 дней с агрегированной статистикой
- 📋 Полный список всех логов
- 🔍 Детальный просмотр каждого лога в модальном окне
- 🗑️ Удаление логов

### 🎨 UI/UX
- ⚡ **Минималистичный дизайн**: монохромная палитра (black/white + indigo accent)
- 📱 **Адаптивный**: отлично работает на мобильных
- ⌨️ **Keyboard-first**: полная поддержка клавиатурной навигации
- 🎭 **Subtle animations**: fade-in, slide-up эффекты
- ♿ **Accessible**: ARIA attributes, focus management

### ⚡ Производительность
- 📦 **Bundle size**: 255KB total (81KB gzipped)
- 🚀 **Мгновенная загрузка**: оптимизированный code splitting
- 💾 **localStorage**: все данные хранятся локально с persistence
- 🔄 **Zero dependencies**: только необходимый минимум (React, Zustand, Router)

---

## 🛠️ Технологический стек

| Категория | Технология | Версия |
|-----------|-----------|--------|
| **Frontend** | React | 19.0 |
| **Language** | TypeScript | 5.5 |
| **Build Tool** | Vite | 6.0 |
| **Роутинг** | React Router DOM | 7.0 |
| **Стили** | Tailwind CSS | 3.4 |
| **State Management** | Zustand | 5.0 (1KB) |
| **Качество** | ESLint + Prettier | Настроено |

## 🚀 Быстрый старт

### Требования

- 📦 **Node.js** 20.x или выше
- 🔧 **npm** 10.x или выше

### Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/sim0n138/Cho_training.git
cd Cho_training

# Установить зависимости
npm install

# Запустить сервер разработки
npm run dev

# Собрать для продакшена
npm run build

# Запустить линтер
npm run lint

# Форматировать код с Prettier
npm run format

# Предпросмотр production сборки
npm run preview
```

### 💻 Разработка

Приложение запускается по адресу `http://localhost:5173/` по умолчанию.

### 🎯 Основные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск сервера разработки |
| `npm run build` | Продакшен сборка |
| `npm run preview` | Предпросмотр production сборки |
| `npm run lint` | Проверка кода (ESLint) |
| `npm run format` | Форматирование кода (Prettier) |

---

## 📁 Структура проекта

```
src/
├── components/              # UI компоненты (5 файлов)
│   ├── Button.tsx          # Универсальная кнопка с вариантами
│   ├── Card.tsx            # Контейнер для контента
│   ├── Input.tsx           # Форма input с label и ошибками
│   ├── Modal.tsx           # Модальное окно с overlay
│   └── Layout.tsx          # Layout с навигацией
├── pages/                   # Страницы (3 файла)
│   ├── Dashboard.tsx       # Главная панель с overview
│   ├── Log.tsx             # Форма создания лога
│   └── Stats.tsx           # Статистика и все логи
├── store/                   # State management
│   └── wellbeing.ts        # Zustand store с localStorage persistence
├── types/                   # TypeScript types
│   └── index.ts            # Интерфейсы WellbeingLog, DailyStats, WellbeingStore
├── App.tsx                 # Роутинг приложения
├── main.tsx                # Точка входа
└── index.css               # Tailwind CSS с кастомными стилями

Конфигурация:
├── tsconfig.json           # TypeScript конфиг
├── tailwind.config.js      # Tailwind с кастомными цветами
├── vite.config.ts          # Vite + React + path aliases
├── postcss.config.js       # PostCSS с autoprefixer
└── vercel.json             # Vercel deployment конфиг
```

**Всего:** 15 core файлов (вместо 60+) - **75% reduction**

---

## 💾 Хранение данных

Приложение использует **localStorage** браузера для сохранения журналов самочувствия. Данные хранятся под ключом `training_logs` в виде JSON массива.

### Безопасность данных
- 🔒 Все данные хранятся локально
- 🛡️ Валидация перед сохранением
- 🧹 Автоочистка старых данных
- 📊 Мониторинг квоты хранилища

---

## 🚀 Будущие возможности

### ✅ Version 2.0 - Minimalist Redesign (Released)
- ✅ TypeScript migration
- ✅ Tailwind CSS
- ✅ Zustand state management
- ✅ 75% bundle size reduction
- ✅ Simplified architecture (60+ files → 15 files)

### 📋 Planned Features

#### Short-term
- 📱 PWA support (offline capability)
- 🌙 Dark mode
- 🎨 Enhanced charts/visualizations
- 📊 Weekly/monthly summary reports

#### Medium-term
- 🌍 i18n (Russian/English)
- 📈 Trend analysis and predictions
- 🔔 Browser notifications/reminders
- 📤 Data sync across devices

#### Long-term
- 🤖 AI-powered insights
- 📸 Exercise photos/videos
- 🤝 Social features (share workouts)
- ⌚ Wearable device integration

---

## 👨‍💻 Руководство для разработчиков

### Правила разработки

- ✅ Используйте TypeScript для всех новых файлов
- ✅ Следуйте существующей структуре и соглашениям об именовании
- ✅ Используйте Tailwind CSS для стилизации
- ✅ Запускайте `npm run format` перед коммитом
- ✅ Убедитесь, что `npm run lint` проходит без ошибок
- ✅ Убедитесь, что `npm run build` завершается успешно
- ✅ Тестируйте адаптивный дизайн на разных экранах
- ✅ Используйте семантичный HTML и ARIA-атрибуты

### Workflow разработки

```bash
# 1. Создать ветку для фичи
git checkout -b feature/new-feature

# 2. Разработать и проверить код
npm run lint
npm run format

# 4. Собрать и протестировать
npm run build

# 5. Закоммитить изменения
git add .
git commit -m "feat: описание фичи"

# 6. Создать pull request
git push origin feature/new-feature
```

### Полезные ссылки

- [Минималистичная архитектура](docs/MINIMAL_ARCHITECTURE.md) — документация архитектуры v2.0

---

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей

---

<div align="center">

### 🌟 Сделано с ❤️ для здоровья и благополучия

**[⬆ Наверх](#-cho-training)**

[![GitHub](https://img.shields.io/badge/GitHub-sim0n138/Cho__training-blue?logo=github)](https://github.com/sim0n138/Cho_training)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

</div>
