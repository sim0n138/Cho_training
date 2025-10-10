import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

// Custom hook to manage wellbeing data
const useWellbeingData = () => {
  const [logs, setLogs] = useState([]);
  const [latestLog, setLatestLog] = useState(null);
  const [stats, setStats] = useState({
    totalLogs: 0,
    avgSleep: 0,
    avgEnergy: 0,
    logsThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const allLogs = storageService.getLogs();
    const latest = storageService.getLatestLog();
    const statistics = storageService.getStatistics();

    setLogs(allLogs);
    setLatestLog(latest);
    setStats(statistics);
    setLoading(false);
  };

  const addLog = (logEntry) => {
    const success = storageService.addLog(logEntry);
    if (success) {
      loadData(); // Refresh data after adding
    }
    return success;
  };

  return {
    logs,
    latestLog,
    stats,
    loading,
    addLog,
    refreshData: loadData,
  };
};

export default useWellbeingData;
