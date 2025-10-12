# 🧪 Руководство по тестированию - Cho Training App

## 📋 Обзор

Это руководство предоставляет комплексную информацию об инфраструктуре тестирования и практиках для приложения Cho Training.

## 📑 Содержание

1. [Стек тестирования](#стек-тестирования)
2. [Запуск тестов](#запуск-тестов)
3. [Структура тестов](#структура-тестов)
4. [Написание тестов](#написание-тестов)
5. [Лучшие практики](#лучшие-практики)
6. [Покрытие кода](#покрытие-кода)

---

## 🛠️ Стек тестирования

Проект использует современные инструменты тестирования, оптимизированные для Vite и React:

- **Vitest**: Быстрый test runner, нативный для Vite
- **@testing-library/react**: Утилиты для тестирования React компонентов
- **@testing-library/jest-dom**: Кастомные матчеры Jest для проверок DOM
- **jsdom**: Симуляция браузерного окружения

### Почему Vitest?

- ⚡ **Быстрый**: Использует трансформационный pipeline Vite
- 🔧 **Нулевая конфигурация**: Работает из коробки с Vite
- 🎯 **Jest-совместимый**: Знакомый API, если вы знаете Jest
- 📊 **Встроенное покрытие**: Интегрированная отчётность о покрытии
- 🎨 **UI режим**: Интерактивный интерфейс test runner

---

## 🚀 Запуск тестов

### Базовые команды

```bash
# Запустить все тесты один раз
npm test -- --run

# Запустить тесты в режиме наблюдения (по умолчанию)
npm test

# Запустить тесты с UI интерфейсом
npm run test:ui

# Запустить тесты с покрытием (требуется @vitest/coverage-v8)
npm run test:coverage

# Запустить конкретный тестовый файл
npm test -- src/services/storageService.test.js

# Запустить тесты, соответствующие паттерну
npm test -- --grep "recommendation"
```

### Функции режима наблюдения

При запуске `npm test`, Vitest стартует в режиме наблюдения с этими функциями:

- **Авто-перезапуск**: Тесты перезапускаются при изменении файлов
- **Режим фильтрации**: Нажимайте клавиши для фильтрации тестов
  - `p`: Фильтр по паттерну имени файла
  - `t`: Фильтр по паттерну имени теста
  - `a`: Запустить все тесты
  - `f`: Запустить только проваленные тесты
- **Быстрая навигация**: Переход к тестовым файлам
- **Очистка вывода**: Нажмите `c` для очистки консоли

### UI режим

Запустите `npm run test:ui` для интерактивного веб-интерфейса:

- 📊 Визуальные результаты тестов
- 🔍 Фильтрация и поиск тестов
- 📈 Метрики производительности
- 🐛 Инспекция ошибок
- 📁 Навигация по дереву файлов

Доступ по адресу `http://localhost:51204/__vitest__/`

---

## 🏗️ Структура тестов

### Организация директорий

```
src/
├── services/
│   ├── recommendationService.js
│   ├── recommendationService.test.js      # 19 тестов
│   ├── storageService.js
│   ├── storageService.test.js             # 16 тестов
│   ├── programService.js
│   ├── programService.test.js             # 20 тестов
│   ├── validationService.js
│   ├── validationService.test.js          # 10 тестов
│   ├── exportService.js
│   └── exportService.test.js              # 10 тестов
├── pages/
│   ├── Program.jsx
│   └── Program.test.js                    # 22 теста
└── test/
    └── setup.js                           # Настройка тестов
```

### Соглашения об именовании

- **Тестовые файлы**: `[filename].test.js` рядом с исходным файлом
- **Describe блоки**: Имя модуля или компонента
- **Test cases**: Описательные предложения с "должен..."

**Пример:**
```javascript
describe('recommendationService', () => {
  describe('generateRecommendation', () => {
    it('должен возвращать рекомендацию отдыха для низкой энергии', () => {
      // ...
    });
  });
});
```

---

## ✍️ Написание тестов

### Анатомия теста

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { myFunction } from './myModule';

describe('MyModule', () => {
  // Настройка перед каждым тестом
  beforeEach(() => {
    // Инициализация
  });

  // Очистка после каждого теста
  afterEach(() => {
    // Очистка
  });

  it('должен делать что-то конкретное', () => {
    // Arrange (Подготовка)
    const input = { data: 'test' };

    // Act (Действие)
    const result = myFunction(input);

    // Assert (Проверка)
    expect(result).toBeDefined();
    expect(result.status).toBe('success');
  });
});
```

### Тестирование сервисов

**Пример: Тестирование recommendationService**

```javascript
import { describe, it, expect } from 'vitest';
import { generateRecommendation } from './recommendationService';

describe('recommendationService', () => {
  describe('generateRecommendation', () => {
    it('должен возвращать отдых для низкой энергии', () => {
      const log = {
        sleepQuality: 4,
        energyLevel: 2,  // Низкая энергия
        musclePain: []
      };

      const result = generateRecommendation(log);

      expect(result.type).toBe('rest');
      expect(result.intensity).toBe('none');
      expect(result.title).toContain('Отдых');
    });

    it('должен возвращать восстановление при значительной боли', () => {
      const log = {
        sleepQuality: 4,
        energyLevel: 4,
        musclePain: ['legs', 'back', 'arms']  // 3+ зоны
      };

      const result = generateRecommendation(log);

      expect(result.type).toBe('recovery');
      expect(result.activities).toContain('Лёгкая растяжка');
    });
  });
});
```

### Тестирование с localStorage

**Пример: Мок localStorage**

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addLog, getLogs } from './storageService';

describe('storageService', () => {
  // Мок localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
  };

  beforeEach(() => {
    global.localStorage = localStorageMock;
    vi.clearAllMocks();
  });

  it('должен сохранять лог в localStorage', () => {
    const log = {
      sleepQuality: 4,
      energyLevel: 3,
      musclePain: [],
      date: '2025-01-15T10:00:00.000Z'
    };

    addLog(log);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'training_logs',
      expect.any(String)
    );
  });
});
```

### Тестирование асинхронного кода

```javascript
it('должен обрабатывать асинхронные операции', async () => {
  const result = await fetchData();
  
  expect(result).toBeDefined();
  expect(result.status).toBe('success');
});
```

### Тестирование ошибок

```javascript
it('должен выбрасывать ошибку для невалидного ввода', () => {
  expect(() => {
    myFunction(null);
  }).toThrow('Требуется валидный ввод');
});
```

---

## 💡 Лучшие практики

### 1. Принцип AAA (Arrange-Act-Assert)

```javascript
it('должен вычислять сумму', () => {
  // Arrange: Настройка тестовых данных
  const a = 5;
  const b = 3;

  // Act: Выполнение тестируемой функции
  const result = add(a, b);

  // Assert: Проверка ожиданий
  expect(result).toBe(8);
});
```

### 2. Один концепт на тест

❌ **Плохо** (слишком много концептов):
```javascript
it('должен валидировать и обрабатывать данные', () => {
  expect(validate(data)).toBe(true);
  expect(process(data)).toBe('processed');
  expect(save(data)).toBe('saved');
});
```

✅ **Хорошо** (один концепт):
```javascript
it('должен валидировать данные', () => {
  expect(validate(data)).toBe(true);
});

it('должен обрабатывать валидные данные', () => {
  expect(process(data)).toBe('processed');
});
```

### 3. Описательные имена тестов

❌ **Плохо**:
```javascript
it('работает', () => { /* ... */ });
it('test 1', () => { /* ... */ });
```

✅ **Хорошо**:
```javascript
it('должен возвращать пустой массив для новых пользователей', () => { /* ... */ });
it('должен отфильтровывать упражнения с болевыми зонами', () => { /* ... */ });
```

### 4. Тестируйте поведение, а не реализацию

❌ **Плохо** (тестирование внутренностей):
```javascript
it('должен вызвать внутреннюю функцию helper', () => {
  const spy = vi.spyOn(module, '_internalHelper');
  myFunction();
  expect(spy).toHaveBeenCalled();
});
```

✅ **Хорошо** (тестирование поведения):
```javascript
it('должен вернуть корректный результат', () => {
  const result = myFunction(input);
  expect(result).toEqual(expectedOutput);
});
```

### 5. Изолируйте тесты

- Каждый тест должен быть независимым
- Используйте `beforeEach` для настройки
- Используйте `afterEach` для очистки
- Избегайте зависимостей между тестами

```javascript
describe('Counter', () => {
  let counter;

  beforeEach(() => {
    counter = new Counter(); // Свежий экземпляр для каждого теста
  });

  it('должен начинаться с 0', () => {
    expect(counter.value).toBe(0);
  });

  it('должен увеличиваться на 1', () => {
    counter.increment();
    expect(counter.value).toBe(1);
  });
});
```

### 6. Используйте матчеры подходящим образом

```javascript
// Примитивы
expect(value).toBe(5);              // Точное равенство (===)
expect(value).toEqual(5);           // Глубокое равенство

// Объекты/массивы
expect(obj).toEqual({ a: 1 });      // Глубокое равенство
expect(arr).toContain('item');      // Содержит элемент

// Булевы значения
expect(value).toBeTruthy();         // Истинно
expect(value).toBeFalsy();          // Ложно
expect(value).toBeDefined();        // Не undefined
expect(value).toBeNull();           // Null

// Числа
expect(value).toBeGreaterThan(5);   // >
expect(value).toBeLessThan(10);     // <
expect(value).toBeCloseTo(0.3);     // Приблизительно равно

// Строки
expect(str).toMatch(/pattern/);     // Регулярное выражение

// Исключения
expect(() => fn()).toThrow();       // Выбрасывает ошибку
```

---

## 📊 Покрытие кода

### Установка инструмента покрытия

```bash
npm install -D @vitest/coverage-v8
```

### Запуск тестов с покрытием

```bash
npm run test:coverage
```

### Конфигурация покрытия

В `vite.config.js`:

```javascript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.js',
        '**/*.config.js',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
```

### Интерпретация результатов покрытия

```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
storageService.js   |   95.00 |    88.89 |  100.00 |   95.00
recommendationSvc.js|   92.31 |    85.71 |  100.00 |   92.31
```

- **% Stmts**: Процент выполненных операторов
- **% Branch**: Процент выполненных веток (if/else)
- **% Funcs**: Процент вызванных функций
- **% Lines**: Процент выполненных строк кода

### Цели покрытия

| Уровень | Описание | Цель |
|---------|----------|------|
| 🔴 Низкое | < 60% | Неприемлемо |
| 🟡 Среднее | 60-79% | Требует улучшения |
| 🟢 Хорошее | 80-89% | Удовлетворительно |
| ✅ Отличное | 90%+ | Отлично |

**Текущее состояние**: 85% (Хорошее) ✅

---

## 🐛 Отладка тестов

### Console logs

```javascript
it('должен отлаживать значения', () => {
  const result = myFunction();
  console.log('Result:', result); // Видно в выводе теста
  expect(result).toBeDefined();
});
```

### VS Code Debugger

1. Добавить точку останова в тесте
2. Запустить "Debug: JavaScript Debug Terminal"
3. Выполнить `npm test`
4. Отладчик остановится на точке останова

### Vitest UI Debugger

```bash
npm run test:ui
```

- Кликнуть на провалившийся тест
- Проверить трассировку стека
- Проверить фактические vs ожидаемые значения

---

## 📚 Примеры тестов

### Пример 1: Простая функция

```javascript
// sum.js
export const sum = (a, b) => a + b;

// sum.test.js
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('должен возвращать сумму двух чисел', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('должен обрабатывать отрицательные числа', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});
```

### Пример 2: Функция с объектами

```javascript
// userService.js
export const createUser = (name, age) => {
  return { name, age, createdAt: new Date().toISOString() };
};

// userService.test.js
import { describe, it, expect, vi } from 'vitest';
import { createUser } from './userService';

describe('createUser', () => {
  it('должен создавать объект пользователя', () => {
    const user = createUser('Иван', 30);

    expect(user).toHaveProperty('name', 'Иван');
    expect(user).toHaveProperty('age', 30);
    expect(user).toHaveProperty('createdAt');
    expect(user.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });
});
```

### Пример 3: Асинхронная функция

```javascript
// api.js
export const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// api.test.js
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './api';

describe('fetchUser', () => {
  it('должен получать данные пользователя', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'Иван' })
      })
    );

    const user = await fetchUser(1);

    expect(user).toEqual({ id: 1, name: 'Иван' });
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });
});
```

---

## 🎯 Контрольный список тестирования

Перед коммитом кода, убедитесь:

- [ ] Все тесты проходят (`npm test -- --run`)
- [ ] Новый код имеет тесты
- [ ] Покрытие не уменьшилось
- [ ] Имена тестов описательные
- [ ] Тесты изолированы и независимы
- [ ] Нет console.log в production коде
- [ ] Граничные случаи протестированы
- [ ] Обработка ошибок протестирована

---

## 📖 Дополнительные ресурсы

### Документация

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

### Связанные документы проекта

- **[Резюме тестирования](./TESTING_SUMMARY_RU.md)** - Обзор реализации тестов
- **[Анализ кода](./CODE_ANALYSIS_RU.md)** - Оценка качества кода
- **[Код-ревью](./CODE_REVIEW_RU.md)** - Детальный анализ кода

---

## 🤝 Получение помощи

### Общие проблемы

**Проблема**: Тесты проходят локально, но падают в CI
- Проверьте зависимости от окружения
- Проверьте моки localStorage/fetch
- Проверьте таймзоны дат

**Проблема**: Медленные тесты
- Используйте `vi.useFakeTimers()` для таймеров
- Мокайте внешние API вызовы
- Избегайте реальных сетевых запросов

**Проблема**: Флакающие тесты (непостоянные)
- Избегайте зависимостей от времени
- Изолируйте тесты должным образом
- Используйте `beforeEach` для сброса состояния

---

<div align="center">

**Тестируйте с уверенностью! 🧪✨**

[🏠 На главную](../README.md) • [📊 Результаты тестов](./TESTING_SUMMARY_RU.md) • [🔍 Анализ кода](./CODE_ANALYSIS_RU.md)

</div>
