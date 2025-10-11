# Примеры реализации рекомендаций из код-ревью

Этот документ содержит готовые к использованию примеры кода для реализации ключевых рекомендаций из [CODE_REVIEW_RU.md](./CODE_REVIEW_RU.md).

---

## 1. Validation Service (P0)

### Создайте новый файл: `src/services/validationService.js`

```javascript
/**
 * Service for validating user input data
 */

/**
 * Validates a wellbeing log entry
 * @param {Object} entry - The log entry to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
const validateLogEntry = (entry) => {
  const errors = {};

  // Validate sleepQuality
  if (!entry.sleepQuality) {
    errors.sleepQuality = 'Качество сна обязательно для заполнения';
  } else if (
    typeof entry.sleepQuality !== 'number' ||
    entry.sleepQuality < 1 ||
    entry.sleepQuality > 5
  ) {
    errors.sleepQuality = 'Качество сна должно быть числом от 1 до 5';
  }

  // Validate energyLevel
  if (!entry.energyLevel) {
    errors.energyLevel = 'Уровень энергии обязателен для заполнения';
  } else if (
    typeof entry.energyLevel !== 'number' ||
    entry.energyLevel < 1 ||
    entry.energyLevel > 5
  ) {
    errors.energyLevel = 'Уровень энергии должен быть числом от 1 до 5';
  }

  // Validate mood
  if (!entry.mood || typeof entry.mood !== 'string') {
    errors.mood = 'Настроение обязательно для заполнения';
  } else if (entry.mood.length > 100) {
    errors.mood = 'Настроение не должно превышать 100 символов';
  }

  // Validate date
  if (!entry.date) {
    errors.date = 'Дата обязательна';
  } else {
    const dateObj = new Date(entry.date);
    if (isNaN(dateObj.getTime())) {
      errors.date = 'Некорректный формат даты';
    }
  }

  // Validate musclePain
  if (!Array.isArray(entry.musclePain)) {
    errors.musclePain = 'musclePain должен быть массивом';
  } else if (entry.musclePain.length > 10) {
    errors.musclePain = 'Слишком много областей с болью';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates RPE value
 * @param {number} rpe - RPE value to validate
 * @returns {Object} - Validation result
 */
const validateRPE = (rpe) => {
  if (typeof rpe !== 'number' || rpe < 1 || rpe > 10) {
    return {
      isValid: false,
      error: 'RPE должно быть числом от 1 до 10',
    };
  }
  return { isValid: true };
};

/**
 * Validates pain areas
 * @param {Array} painAreas - Array of pain area strings
 * @returns {Object} - Validation result
 */
const validatePainAreas = (painAreas) => {
  if (!Array.isArray(painAreas)) {
    return {
      isValid: false,
      error: 'Области боли должны быть массивом',
    };
  }

  const validAreas = ['Ноги', 'Спина', 'Руки', 'Грудь', 'Всё тело'];
  const invalidAreas = painAreas.filter((area) => !validAreas.includes(area));

  if (invalidAreas.length > 0) {
    return {
      isValid: false,
      error: `Некорректные области: ${invalidAreas.join(', ')}`,
    };
  }

  return { isValid: true };
};

const validationService = {
  validateLogEntry,
  validateRPE,
  validatePainAreas,
};

export default validationService;
```

### Тесты для validation service: `src/services/validationService.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import validationService from './validationService';

describe('validationService', () => {
  describe('validateLogEntry', () => {
    it('should validate correct log entry', () => {
      const entry = {
        sleepQuality: 4,
        energyLevel: 5,
        mood: 'Отличное',
        date: new Date().toISOString(),
        musclePain: ['Ноги'],
      };

      const result = validationService.validateLogEntry(entry);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should reject invalid sleepQuality', () => {
      const entry = {
        sleepQuality: 6, // invalid
        energyLevel: 5,
        mood: 'Хорошее',
        date: new Date().toISOString(),
        musclePain: [],
      };

      const result = validationService.validateLogEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.sleepQuality).toBeDefined();
    });

    it('should reject invalid energyLevel', () => {
      const entry = {
        sleepQuality: 4,
        energyLevel: 0, // invalid
        mood: 'Хорошее',
        date: new Date().toISOString(),
        musclePain: [],
      };

      const result = validationService.validateLogEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.energyLevel).toBeDefined();
    });

    it('should reject missing required fields', () => {
      const entry = {
        sleepQuality: 4,
        // energyLevel missing
        mood: 'Хорошее',
        date: new Date().toISOString(),
        musclePain: [],
      };

      const result = validationService.validateLogEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.energyLevel).toBeDefined();
    });

    it('should reject invalid date', () => {
      const entry = {
        sleepQuality: 4,
        energyLevel: 5,
        mood: 'Хорошее',
        date: 'invalid-date',
        musclePain: [],
      };

      const result = validationService.validateLogEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.date).toBeDefined();
    });
  });

  describe('validateRPE', () => {
    it('should validate correct RPE', () => {
      expect(validationService.validateRPE(5).isValid).toBe(true);
      expect(validationService.validateRPE(1).isValid).toBe(true);
      expect(validationService.validateRPE(10).isValid).toBe(true);
    });

    it('should reject invalid RPE', () => {
      expect(validationService.validateRPE(0).isValid).toBe(false);
      expect(validationService.validateRPE(11).isValid).toBe(false);
      expect(validationService.validateRPE(-1).isValid).toBe(false);
    });
  });

  describe('validatePainAreas', () => {
    it('should validate correct pain areas', () => {
      const result = validationService.validatePainAreas(['Ноги', 'Спина']);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid pain areas', () => {
      const result = validationService.validatePainAreas([
        'Ноги',
        'InvalidArea',
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('InvalidArea');
    });

    it('should reject non-array input', () => {
      const result = validationService.validatePainAreas('not-an-array');
      expect(result.isValid).toBe(false);
    });
  });
});
```

### Использование в Log.jsx

```javascript
// В начале файла
import validationService from '../services/validationService';

// В компоненте Log
const handleSubmit = (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const selectedMusclePain = Object.keys(musclePain)
    .filter((key) => musclePain[key])
    .map((key) => {
      const labels = {
        legs: 'Ноги',
        back: 'Спина',
        arms: 'Руки',
        chest: 'Грудь',
        fullBody: 'Всё тело',
      };
      return labels[key];
    });

  const logEntry = {
    date: new Date().toISOString(),
    sleepQuality: parseInt(sleepQuality),
    energyLevel: parseInt(energyLevel),
    mood,
    musclePain: selectedMusclePain,
  };

  // НОВОЕ: Валидация перед сохранением
  const validation = validationService.validateLogEntry(logEntry);
  if (!validation.isValid) {
    console.error('Validation errors:', validation.errors);
    setErrors(validation.errors);
    return;
  }

  const success = addLog(logEntry);

  if (success) {
    navigate('/');
  } else {
    console.error('Failed to save log entry');
  }
};
```

---

## 2. Constants File (P1)

### Создайте файл: `src/constants/wellbeingThresholds.js`

```javascript
/**
 * Thresholds for wellbeing assessment and workout recommendations
 */

export const WELLBEING_THRESHOLDS = {
  SLEEP_QUALITY: {
    POOR: 2,
    MODERATE: 3,
    GOOD: 4,
    EXCELLENT: 5,
  },
  ENERGY_LEVEL: {
    LOW: 2,
    MODERATE: 3,
    HIGH: 4,
    VERY_HIGH: 5,
  },
  PAIN: {
    SIGNIFICANT_COUNT: 3,
  },
};

export const RPE_THRESHOLDS = {
  LOW: 3,
  HIGH: 7,
  MAX: 10,
};

export const TARGET_MINUTES = {
  HIGH_RPE: {
    stretch: 10,
    lfc: 15,
    meditation: 10,
  },
  LOW_RPE: {
    stretch: 20,
    lfc: 25,
    meditation: 10,
  },
  DEFAULT: {
    stretch: 15,
    lfc: 20,
    meditation: 10,
  },
};

export const PROGRAM_CONFIG = {
  MINUTES_TOLERANCE: 0.1, // 10% tolerance
  MAX_HISTORY_SIZE: 10,
  MIN_EXERCISES_PER_CATEGORY: 2,
};
```

### Использование в recommendationService.js

```javascript
import { WELLBEING_THRESHOLDS } from '../constants/wellbeingThresholds';

const getRecommendation = (latestLog) => {
  if (!latestLog) {
    return {
      type: 'rest',
      title: 'Начните отслеживать самочувствие',
      description:
        'Добавьте запись о вашем самочувствии, чтобы получить персонализированные рекомендации тренировок.',
      intensity: 'none',
    };
  }

  const { sleepQuality, energyLevel, musclePain } = latestLog;

  const hasSignificantPain =
    musclePain && musclePain.length >= WELLBEING_THRESHOLDS.PAIN.SIGNIFICANT_COUNT;

  // Low energy or poor sleep - recommend rest or light activity
  if (
    energyLevel <= WELLBEING_THRESHOLDS.ENERGY_LEVEL.LOW ||
    sleepQuality <= WELLBEING_THRESHOLDS.SLEEP_QUALITY.POOR
  ) {
    return {
      type: 'rest',
      title: 'Отдых и восстановление',
      description:
        'Ваш уровень энергии или качество сна низкие. Рекомендуется отдых, легкая растяжка или прогулка на свежем воздухе.',
      intensity: 'low',
      activities: ['Растяжка', 'Прогулка', 'Дыхательные упражнения'],
    };
  }

  if (hasSignificantPain) {
    return {
      type: 'recovery',
      title: 'Восстановительная тренировка',
      description:
        'У вас есть мышечная боль в нескольких зонах. Рекомендуется легкая восстановительная активность.',
      intensity: 'low',
      activities: [
        'Легкая растяжка',
        'Йога',
        'Плавание',
        'Массаж или самомассаж',
      ],
    };
  }

  if (
    energyLevel === WELLBEING_THRESHOLDS.ENERGY_LEVEL.MODERATE ||
    sleepQuality === WELLBEING_THRESHOLDS.SLEEP_QUALITY.MODERATE
  ) {
    const painAreas = musclePain || [];
    const avoidAreas =
      painAreas.length > 0
        ? ` Избегайте нагрузки на: ${painAreas.join(', ')}.`
        : '';

    return {
      type: 'moderate',
      title: 'Умеренная тренировка',
      description: `Ваше состояние позволяет провести умеренную тренировку.${avoidAreas}`,
      intensity: 'moderate',
      activities: [
        'Кардио средней интенсивности',
        'Функциональные упражнения',
        'Легкая силовая тренировка',
      ],
    };
  }

  if (
    energyLevel >= WELLBEING_THRESHOLDS.ENERGY_LEVEL.HIGH &&
    sleepQuality >= WELLBEING_THRESHOLDS.SLEEP_QUALITY.GOOD
  ) {
    const painAreas = musclePain || [];
    const recommendation =
      painAreas.length === 0
        ? 'Отличное состояние для интенсивной тренировки! Можете выполнять любые упражнения.'
        : `Хорошее состояние для интенсивной тренировки. Будьте осторожны с: ${painAreas.join(', ')}.`;

    return {
      type: 'intensive',
      title: 'Интенсивная тренировка',
      description: recommendation,
      intensity: 'high',
      activities: [
        'Силовая тренировка',
        'HIIT',
        'Интенсивное кардио',
        'Кроссфит',
      ],
    };
  }

  return {
    type: 'moderate',
    title: 'Умеренная активность',
    description:
      'Ваше состояние позволяет заниматься умеренными физическими упражнениями.',
    intensity: 'moderate',
    activities: ['Кардио', 'Функциональный тренинг', 'Растяжка'],
  };
};
```

---

## 3. Error Boundary (P1)

### Создайте файл: `src/components/ErrorBoundary.jsx`

```javascript
import { Component } from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Здесь можно отправить ошибку в систему мониторинга
    // например, Sentry, LogRocket и т.д.
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>😞 Что-то пошло не так</h1>
            <p className="error-message">
              Произошла непредвиденная ошибка. Попробуйте обновить страницу.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Детали ошибки (только для разработки)</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleReload} className="btn-primary">
                🔄 Обновить страницу
              </button>
              <button onClick={this.handleReset} className="btn-secondary">
                ↩️ Попробовать снова
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
```

### Создайте файл стилей: `src/components/ErrorBoundary.css`

```css
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.error-boundary-content {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.error-boundary-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.error-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-details {
  text-align: left;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  max-height: 300px;
  overflow: auto;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
}

.error-details pre {
  font-size: 0.85rem;
  color: #d63031;
  margin: 0.5rem 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.error-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.error-actions .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.error-actions .btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.error-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.error-actions button:active {
  transform: translateY(0);
}
```

### Использование в App.jsx

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Stats from './pages/Stats';
import Program from './pages/Program';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<Log />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/program" element={<Program />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
```

---

## 4. Code Splitting с Lazy Loading (P0)

### Обновите App.jsx

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load страниц для уменьшения размера бандла
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Log = lazy(() => import('./pages/Log'));
const Stats = lazy(() => import('./pages/Stats'));
const Program = lazy(() => import('./pages/Program'));

// Компонент для отображения во время загрузки
function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загрузка...</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<Log />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/program" element={<Program />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
```

### Добавьте стили для загрузки в App.css

```css
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: white;
  margin-top: 1rem;
  font-size: 1.1rem;
}
```

### Обновите vite.config.js для manual chunks

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
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
        statements: 80,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
});
```

---

## 5. localStorage Quota Check (P1)

### Обновите storageService.js

```javascript
// Storage service to encapsulate all localStorage operations
const STORAGE_KEY = 'training_logs';

/**
 * Check if localStorage has available quota
 * @returns {boolean} - true if storage is available
 */
const checkStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.error('localStorage is not available:', e);
    return false;
  }
};

/**
 * Check if we're approaching quota limit
 * @returns {boolean} - true if we have space
 */
const hasStorageSpace = () => {
  if (!checkStorageAvailable()) return false;

  try {
    // Try to estimate used space
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // If we're using more than 4MB (out of typical 5-10MB), warn
    const sizeMB = totalSize / (1024 * 1024);
    if (sizeMB > 4) {
      console.warn(
        `localStorage is using ${sizeMB.toFixed(2)}MB, approaching limit`
      );
    }

    return sizeMB < 4.5; // Leave some buffer
  } catch (e) {
    console.error('Error checking storage space:', e);
    return true; // Assume we have space if we can't check
  }
};

/**
 * Clean up old logs if storage is getting full
 */
const cleanupOldLogs = () => {
  try {
    const logs = storageService.getLogs();
    if (logs.length > 100) {
      // Keep only last 100 logs
      const recentLogs = logs.slice(-100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentLogs));
      console.log(`Cleaned up ${logs.length - 100} old logs`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error cleaning up logs:', error);
    return false;
  }
};

const storageService = {
  // Get all logs from localStorage
  getLogs: () => {
    try {
      const logs = localStorage.getItem(STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Get the latest log entry
  getLatestLog: () => {
    const logs = storageService.getLogs();
    return logs.length > 0 ? logs[logs.length - 1] : null;
  },

  // Add a new log entry
  addLog: (logEntry) => {
    try {
      // Check storage availability
      if (!hasStorageSpace()) {
        console.warn('Storage space low, attempting cleanup');
        cleanupOldLogs();

        // Check again after cleanup
        if (!hasStorageSpace()) {
          console.error('localStorage quota exceeded even after cleanup');
          return false;
        }
      }

      const logs = storageService.getLogs();
      logs.push(logEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Try to cleanup and retry once
        if (cleanupOldLogs()) {
          try {
            const logs = storageService.getLogs();
            logs.push(logEntry);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
            return true;
          } catch (retryError) {
            console.error('Failed to save even after cleanup:', retryError);
            return false;
          }
        }
      }
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  // Get logs from the last N days
  getLogsFromLastDays: (days) => {
    const logs = storageService.getLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return logs.filter((log) => new Date(log.date) >= cutoffDate);
  },

  // Get statistics from all logs
  getStatistics: () => {
    const logs = storageService.getLogs();
    const logsThisWeek = storageService.getLogsFromLastDays(7);

    if (logs.length === 0) {
      return {
        totalLogs: 0,
        avgSleep: 0,
        avgEnergy: 0,
        logsThisWeek: 0,
      };
    }

    const avgSleep =
      logs.reduce((sum, log) => sum + log.sleepQuality, 0) / logs.length;
    const avgEnergy =
      logs.reduce((sum, log) => sum + log.energyLevel, 0) / logs.length;

    return {
      totalLogs: logs.length,
      avgSleep: avgSleep.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      logsThisWeek: logsThisWeek.length,
    };
  },

  // Clear all logs (for testing/admin purposes)
  clearLogs: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Check if storage is available and has space
  isStorageHealthy: () => {
    return checkStorageAvailable() && hasStorageSpace();
  },
};

export default storageService;
```

---

## Следующие шаги

1. **Установите coverage tool**:
   ```bash
   npm install -D @vitest/coverage-v8
   ```

2. **Создайте файлы из примеров выше**

3. **Запустите тесты**:
   ```bash
   npm test
   ```

4. **Проверьте покрытие**:
   ```bash
   npm run test:coverage
   ```

5. **Соберите проект**:
   ```bash
   npm run build
   ```

6. **Проверьте размер бандла** - после code splitting он должен быть меньше 400KB

---

Эти примеры готовы к использованию и решают ключевые проблемы из код-ревью. Реализуйте их последовательно, начиная с критических (P0).
