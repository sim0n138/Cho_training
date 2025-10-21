# Cho Training - Минималистичная Архитектура

## 🎯 Философия Минимализма

**Less is More** - фокус на главном, удаление всего лишнего.

### Принципы:
1. **Простота** - интуитивный интерфейс без обучения
2. **Чистота** - много белого пространства
3. **Фокус** - одна задача на экран
4. **Скорость** - моментальная загрузка
5. **Доступность** - работает везде

---

## 🏗️ Техническая Архитектура

### Стек (Современный и Минималистичный):

```
Frontend:
├── React 19        (Latest, но без излишеств)
├── TypeScript      (Статическая типизация)
├── Tailwind CSS    (Utility-first, минимализм)
├── Zustand         (Легковесный state management, 1kb)
└── React Router v7 (SPA навигация)

Build:
├── Vite            (Быстрая сборка)
└── ESLint/Prettier (Качество кода)

Deployment:
└── Vercel          (Zero-config, автодеплой)

Storage:
└── localStorage    (Локальное хранение, privacy-first)
```

**Что убрали**:
- ❌ Recharts (слишком тяжелый) → Простые SVG графики
- ❌ Сложные анимации → Subtle transitions
- ❌ Множество файлов → Монолитные компоненты
- ❌ Избыточные сервисы → Простые hooks

---

## 📐 Минималистичный Дизайн

### Цветовая Палитра (Монохром + Акцент):

```css
Primary:   #000000  (Черный)
Secondary: #FFFFFF  (Белый)
Accent:    #6366F1  (Индиго - единственный цвет)
Gray-50:   #F9FAFB
Gray-100:  #F3F4F6
Gray-900:  #111827
```

### Типографика (Одно семейство):

```css
Font: Inter (Google Fonts)
Sizes:
  - sm:  14px
  - base: 16px
  - lg:   20px
  - xl:   24px
  - 2xl:  32px
  - 3xl:  48px
```

### Spacing System:

```
4px, 8px, 16px, 24px, 32px, 48px, 64px
```

### Компоненты (Минимум):

1. **Button** - одна кнопка, разные состояния
2. **Input** - простое поле ввода
3. **Card** - белая карточка с тенью
4. **Modal** - overlay + content

---

## 🗂️ Структура Проекта (Упрощенная)

```
src/
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Modal.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Log.tsx
│   └── Stats.tsx
│
├── store/
│   └── wellbeing.ts  (Zustand store)
│
├── types/
│   └── index.ts
│
├── utils/
│   └── storage.ts
│
├── App.tsx
├── main.tsx
└── index.css (Tailwind)
```

**Итого**: ~15 файлов (vs 60+ сейчас)

---

## 📱 Страницы (Упрощенные)

### 1. Dashboard
```
┌─────────────────────────┐
│                         │
│   Cho Training          │
│                         │
│   [Последняя запись]    │
│                         │
│   [Быстрое действие]    │
│   [Быстрое действие]    │
│                         │
└─────────────────────────┘
```

### 2. Log (Форма)
```
┌─────────────────────────┐
│                         │
│   Как вы себя чувствуете?│
│                         │
│   Сон:     [1 2 3 4 5]  │
│   Энергия: [1 2 3 4 5]  │
│   Настроение: [____]    │
│                         │
│   [Сохранить]           │
│                         │
└─────────────────────────┘
```

### 3. Stats (Простая визуализация)
```
┌─────────────────────────┐
│                         │
│   Статистика            │
│                         │
│   Сон:     ▂▃▅▇▅▃      │
│   Энергия: ▃▅▇▅▃▂      │
│                         │
│   [7 дней] [30 дней]    │
│                         │
└─────────────────────────┘
```

---

## 🎨 Дизайн Система

### Spacing:
```tsx
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
}
```

### Colors:
```tsx
const colors = {
  black: '#000000',
  white: '#FFFFFF',
  accent: '#6366F1',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    900: '#111827',
  }
}
```

### Typography:
```tsx
const typography = {
  fontFamily: 'Inter, sans-serif',
  fontSize: {
    sm: '14px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
  }
}
```

---

## 🔄 State Management (Zustand)

```typescript
// store/wellbeing.ts
interface WellbeingStore {
  logs: Log[];
  addLog: (log: Log) => void;
  getLogs: () => Log[];
  getStats: () => Stats;
}

const useWellbeingStore = create<WellbeingStore>((set, get) => ({
  logs: [],
  addLog: (log) => set({ logs: [...get().logs, log] }),
  // ...
}))
```

**Почему Zustand?**
- ✅ 1KB (vs Redux 5KB)
- ✅ Простой API
- ✅ TypeScript-friendly
- ✅ Нет boilerplate

---

## 🚀 Performance

### Оптимизации:
1. **Lazy Loading** страниц
2. **Code Splitting** автоматом (Vite)
3. **Tree Shaking** неиспользуемого кода
4. **Minimal Dependencies** (только необходимые)

### Размер бандла (цель):
- **Initial**: < 50KB (gzipped)
- **Total**: < 150KB (vs 650KB сейчас)

---

## ♿ Accessibility

### Checklist:
- ✅ Semantic HTML
- ✅ ARIA labels где нужно
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Color contrast (WCAG AA)

---

## 📦 Deployment (Vercel)

### Конфигурация:

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Environment:
- Node: 20.x
- Auto deploy: main branch

---

## 🔮 Что убрали из старого проекта

### Удаляем:
- ❌ 340+ упражнений (слишком много)
- ❌ Генератор программ (overcomplicated)
- ❌ Множество страниц
- ❌ Сложные анимации
- ❌ Glassmorphism эффекты
- ❌ 60+ файлов
- ❌ Recharts (heavy)
- ❌ Multiple contexts
- ❌ i18n (пока только RU)

### Оставляем (минимум):
- ✅ Журнал самочувствия
- ✅ Простая статистика
- ✅ Dashboard
- ✅ localStorage
- ✅ Responsive design

---

## 📊 Сравнение

| Аспект | Старый | Новый (Минимализм) |
|--------|--------|---------------------|
| **Файлов** | 60+ | ~15 |
| **Страниц** | 5 | 3 |
| **Зависимостей** | 15+ | 5-7 |
| **Размер** | 650KB | <150KB |
| **Загрузка** | ~2s | <0.5s |
| **Сложность** | High | Low |

---

## ✅ Implementation Roadmap

### Phase 1: Setup (30 min)
1. Создать новый проект Vite + React + TS
2. Настроить Tailwind CSS
3. Установить Zustand
4. Базовая структура

### Phase 2: Core (1 hour)
1. Создать компоненты (Button, Input, Card)
2. Настроить роутинг
3. Создать store

### Phase 3: Features (1 hour)
1. Dashboard
2. Log форма
3. Stats (простая)

### Phase 4: Deploy (15 min)
1. Настроить Vercel
2. Деплой
3. Тестирование

**Total: ~2.5 hours**

---

## 🎯 Success Metrics

После релиза проверить:
- ✅ Lighthouse Score > 95
- ✅ Размер < 150KB
- ✅ Загрузка < 0.5s
- ✅ Mobile-friendly
- ✅ Accessibility > 90

---

**Готово к реализации?**

Это минималистичный подход. Фокус на главном - трекинг самочувствия без излишеств.
