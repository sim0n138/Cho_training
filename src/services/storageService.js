// Storage service to encapsulate all localStorage operations
const STORAGE_KEY = 'training_logs';

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
      const logs = storageService.getLogs();
      logs.push(logEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return true;
    } catch (error) {
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
};

export default storageService;
