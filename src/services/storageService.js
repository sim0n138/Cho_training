/**
 * Storage service to encapsulate all localStorage operations
 * @typedef {import('../types/index.js').WellbeingLog} WellbeingLog
 */
import { STORAGE_KEYS, STORAGE_CONFIG } from '../constants/index.js';
import validationService from './validationService.js';

const STORAGE_KEY = STORAGE_KEYS.TRAINING_LOGS;

/**
 * Check if localStorage has available quota
 * @returns {boolean} - true if storage is available
 */
const checkStorageAvailable = () => {
  try {
    const test = STORAGE_CONFIG.STORAGE_TEST_KEY;
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
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // If we're using more than configured MB (out of typical 5-10MB), warn
    const sizeMB = totalSize / (1024 * 1024);
    if (sizeMB > STORAGE_CONFIG.WARNING_SIZE_MB) {
      console.warn(
        `localStorage is using ${sizeMB.toFixed(2)}MB, approaching limit`
      );
    }

    return sizeMB < STORAGE_CONFIG.MAX_SIZE_MB; // Leave some buffer
  } catch (e) {
    console.error('Error checking storage space:', e);
    return true; // Assume we have space if we can't check
  }
};

/**
 * Clean up old logs if storage is getting full
 * @returns {boolean} - true if cleanup was performed
 */
const cleanupOldLogs = () => {
  try {
    const logs = storageService.getLogs();
    if (logs.length > STORAGE_CONFIG.MAX_LOGS_COUNT) {
      // Keep only last configured number of logs
      const recentLogs = logs.slice(-STORAGE_CONFIG.MAX_LOGS_COUNT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentLogs));
      console.log(
        `Cleaned up ${logs.length - STORAGE_CONFIG.MAX_LOGS_COUNT} old logs`
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error cleaning up logs:', error);
    return false;
  }
};

const storageService = {
  /**
   * Get all logs from localStorage
   * @returns {WellbeingLog[]} Массив записей о самочувствии
   */
  getLogs: () => {
    try {
      const logs = localStorage.getItem(STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  /**
   * Get the latest log entry
   * @returns {WellbeingLog|null} Последняя запись или null
   */
  getLatestLog: () => {
    const logs = storageService.getLogs();
    return logs.length > 0 ? logs[logs.length - 1] : null;
  },

  /**
   * Add a new log entry
   * @param {WellbeingLog} logEntry - Запись о самочувствии
   * @returns {boolean} true если успешно сохранено
   */
  addLog: (logEntry) => {
    try {
      // Sanitize and validate the log entry before storage
      const validation =
        validationService.sanitizeAndValidateLogEntry(logEntry);
      if (!validation.isValid) {
        console.error('Invalid log entry:', validation.errors);
        return false;
      }

      const sanitizedEntry = validation.sanitizedEntry;

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
      logs.push(sanitizedEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Try to cleanup and retry once
        if (cleanupOldLogs()) {
          try {
            const logs = storageService.getLogs();
            logs.push(sanitizedEntry);
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

  /**
   * Get logs from the last N days
   * @param {number} days - Количество дней
   * @returns {WellbeingLog[]} Отфильтрованные записи
   */
  getLogsFromLastDays: (days) => {
    const logs = storageService.getLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return logs.filter((log) => new Date(log.date) >= cutoffDate);
  },

  /**
   * Get statistics from all logs
   * @returns {Object} Статистика по записям
   */
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

  /**
   * Clear all logs (for testing/admin purposes)
   * @returns {boolean} true если успешно очищено
   */
  clearLogs: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Check if storage is available and has space
   * @returns {boolean} true если хранилище доступно и есть место
   */
  isStorageHealthy: () => {
    return checkStorageAvailable() && hasStorageSpace();
  },
};

export default storageService;
