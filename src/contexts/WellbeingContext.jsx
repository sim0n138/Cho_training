/**
 * Wellbeing Context - Global state management for wellbeing data
 * Replaces window.location.reload() and provides reactive data updates
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import storageService from '../services/storageService';

const WellbeingContext = createContext(null);

/**
 * Hook to use wellbeing context
 * @returns {Object} Wellbeing context value
 */
export const useWellbeing = () => {
  const context = useContext(WellbeingContext);
  if (!context) {
    throw new Error('useWellbeing must be used within WellbeingProvider');
  }
  return context;
};

/**
 * Wellbeing Provider Component
 * Manages global state for wellbeing logs
 */
export function WellbeingProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [latestLog, setLatestLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load all wellbeing data from storage
   */
  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const allLogs = storageService.getAllLogs();
      setLogs(allLogs);
      setLatestLog(storageService.getLatestLog());
    } catch (error) {
      console.error('Error loading wellbeing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new wellbeing log entry
   * @param {Object} logEntry - New log entry
   * @returns {boolean} Success status
   */
  const addLog = useCallback((logEntry) => {
    const success = storageService.addLog(logEntry);
    if (success) {
      loadData(); // Refresh data after adding
    }
    return success;
  }, [loadData]);

  /**
   * Import logs from external data
   * @param {Array} newLogs - Array of log entries
   * @param {boolean} merge - Whether to merge or replace
   * @returns {boolean} Success status
   */
  const importLogs = useCallback((newLogs, merge = true) => {
    try {
      const currentLogs = merge ? storageService.getAllLogs() : [];
      const combined = merge ? [...currentLogs, ...newLogs] : newLogs;

      // Remove duplicates based on date
      const uniqueLogs = combined.reduce((acc, log) => {
        const exists = acc.find(l => l.date === log.date);
        if (!exists) {
          acc.push(log);
        }
        return acc;
      }, []);

      // Sort by date (newest first)
      uniqueLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

      localStorage.setItem('training_logs', JSON.stringify(uniqueLogs));
      loadData(); // Refresh data after import
      return true;
    } catch (error) {
      console.error('Error importing logs:', error);
      return false;
    }
  }, [loadData]);

  /**
   * Clear all logs
   */
  const clearAllLogs = useCallback(() => {
    try {
      localStorage.removeItem('training_logs');
      loadData();
      return true;
    } catch (error) {
      console.error('Error clearing logs:', error);
      return false;
    }
  }, [loadData]);

  /**
   * Get logs for a specific date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Filtered logs
   */
  const getLogsByDateRange = useCallback((startDate, endDate) => {
    return storageService.getLogsByDateRange(startDate, endDate);
  }, []);

  /**
   * Get statistics for logs
   * @param {Array} logsToAnalyze - Logs to analyze (optional)
   * @returns {Object} Statistics
   */
  const getStats = useCallback((logsToAnalyze = null) => {
    const logsForStats = logsToAnalyze || logs;
    return storageService.getStats(logsForStats);
  }, [logs]);

  const value = {
    // State
    logs,
    latestLog,
    isLoading,

    // Actions
    addLog,
    importLogs,
    clearAllLogs,
    loadData,

    // Queries
    getLogsByDateRange,
    getStats,
  };

  return (
    <WellbeingContext.Provider value={value}>
      {children}
    </WellbeingContext.Provider>
  );
}

WellbeingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WellbeingContext;
