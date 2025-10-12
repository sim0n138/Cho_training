/**
 * Service for exporting and importing application data in JSON format
 */
import storageService from './storageService.js';
import { sanitizeJSON, sanitizeObject } from '../utils/sanitize.js';
import validationService from './validationService.js';

/**
 * Export all training logs to JSON format
 * @returns {string} JSON string containing all logs
 */
export const exportLogsToJSON = () => {
  try {
    const logs = storageService.getLogs();
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      logs: logs,
      totalCount: logs.length,
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting logs:', error);
    throw new Error('Не удалось экспортировать данные');
  }
};

/**
 * Download logs as a JSON file
 */
export const downloadLogsAsJSON = () => {
  try {
    const jsonData = exportLogsToJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `training_logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading logs:', error);
    throw new Error('Не удалось скачать данные');
  }
};

/**
 * Import logs from JSON string
 * @param {string} jsonString - JSON string containing logs
 * @param {boolean} merge - If true, merge with existing data; if false, replace
 * @returns {Object} Result with success status and message
 */
export const importLogsFromJSON = (jsonString, merge = true) => {
  try {
    // First, sanitize and validate the JSON string
    const sanitizedResult = sanitizeJSON(jsonString);
    if (!sanitizedResult.isValid) {
      throw new Error(sanitizedResult.error);
    }

    const importData = sanitizedResult.data;

    // Validate import data structure
    if (!importData.logs || !Array.isArray(importData.logs)) {
      throw new Error('Некорректный формат данных');
    }

    // Sanitize and validate each log entry
    const validLogs = [];
    for (const log of importData.logs) {
      // Sanitize the entire log object
      const sanitizedLog = sanitizeObject(log, 100);

      // Basic structure validation
      if (
        sanitizedLog.date &&
        typeof sanitizedLog.sleepQuality === 'number' &&
        typeof sanitizedLog.energyLevel === 'number' &&
        sanitizedLog.mood &&
        Array.isArray(sanitizedLog.musclePain)
      ) {
        // Use validation service to fully validate
        const validation =
          validationService.sanitizeAndValidateLogEntry(sanitizedLog);
        if (validation.isValid) {
          validLogs.push(validation.sanitizedEntry);
        }
      }
    }

    if (validLogs.length === 0) {
      throw new Error('Не найдено корректных записей для импорта');
    }

    // Get existing logs if merging
    let finalLogs = validLogs;
    if (merge) {
      const existingLogs = storageService.getLogs();
      // Merge and remove duplicates based on date
      const logsMap = new Map();
      [...existingLogs, ...validLogs].forEach((log) => {
        logsMap.set(log.date, log);
      });
      finalLogs = Array.from(logsMap.values()).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    }

    // Clear and save new logs
    storageService.clearLogs();
    finalLogs.forEach((log) => {
      storageService.addLog(log);
    });

    return {
      success: true,
      message: `Успешно импортировано ${validLogs.length} записей`,
      importedCount: validLogs.length,
      totalCount: finalLogs.length,
    };
  } catch (error) {
    console.error('Error importing logs:', error);
    return {
      success: false,
      message: error.message || 'Ошибка при импорте данных',
    };
  }
};

/**
 * Import logs from a file
 * @param {File} file - File object containing JSON data
 * @param {boolean} merge - If true, merge with existing data
 * @returns {Promise<Object>} Promise resolving to import result
 */
export const importLogsFromFile = (file, merge = true) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Файл не выбран'));
      return;
    }

    if (!file.name.endsWith('.json')) {
      reject(new Error('Пожалуйста, выберите JSON файл'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = importLogsFromJSON(e.target.result, merge);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error('Ошибка при чтении файла'));
    };
    reader.readAsText(file);
  });
};

const exportService = {
  exportLogsToJSON,
  downloadLogsAsJSON,
  importLogsFromJSON,
  importLogsFromFile,
};

export default exportService;
