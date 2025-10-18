import { describe, it, expect, beforeEach } from 'vitest';
import storageService from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getLogs', () => {
    it('should return empty array when no logs exist', () => {
      const logs = storageService.getLogs();

      expect(logs).toEqual([]);
    });

    it('should return stored logs', () => {
      const testLogs = [
        { date: '2024-01-01', sleepQuality: 4, energyLevel: 5, musclePain: [] },
        {
          date: '2024-01-02',
          sleepQuality: 3,
          energyLevel: 4,
          musclePain: ['back'],
        },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));
      const logs = storageService.getLogs();

      expect(logs).toEqual(testLogs);
      expect(logs.length).toBe(2);
    });

    it('should return empty array on parse error', () => {
      localStorage.setItem('training_logs', 'invalid json');
      const logs = storageService.getLogs();

      expect(logs).toEqual([]);
    });
  });

  describe('getLatestLog', () => {
    it('should return null when no logs exist', () => {
      const latest = storageService.getLatestLog();

      expect(latest).toBeNull();
    });

    it('should return the most recent log', () => {
      const testLogs = [
        { date: '2024-01-01', sleepQuality: 4, energyLevel: 5, musclePain: [] },
        { date: '2024-01-02', sleepQuality: 3, energyLevel: 4, musclePain: [] },
        { date: '2024-01-03', sleepQuality: 5, energyLevel: 5, musclePain: [] },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));
      const latest = storageService.getLatestLog();

      expect(latest).toEqual(testLogs[2]);
      expect(latest.date).toBe('2024-01-03');
    });
  });

  describe('addLog', () => {
    it('should add a new log to empty storage', () => {
      const newLog = {
        date: '2024-01-01',
        sleepQuality: 4,
        energyLevel: 5,
        mood: 'Хорошее',
        musclePain: [],
      };

      const result = storageService.addLog(newLog);

      expect(result).toBe(true);

      const logs = storageService.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0]).toEqual(newLog);
    });

    it('should append log to existing logs', () => {
      const existingLogs = [
        {
          date: '2024-01-01',
          sleepQuality: 4,
          energyLevel: 5,
          mood: 'Отличное',
          musclePain: [],
        },
      ];
      localStorage.setItem('training_logs', JSON.stringify(existingLogs));

      const newLog = {
        date: '2024-01-02',
        sleepQuality: 3,
        energyLevel: 4,
        mood: 'Нормальное',
        musclePain: ['back'],
      };

      const result = storageService.addLog(newLog);

      expect(result).toBe(true);

      const logs = storageService.getLogs();
      expect(logs.length).toBe(2);
      expect(logs[1]).toEqual(newLog);
    });
  });

  describe('getLogsFromLastDays', () => {
    it('should return logs from the last N days', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const fiveDaysAgo = new Date(now);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      const tenDaysAgo = new Date(now);
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const testLogs = [
        {
          date: tenDaysAgo.toISOString(),
          sleepQuality: 4,
          energyLevel: 5,
          musclePain: [],
        },
        {
          date: fiveDaysAgo.toISOString(),
          sleepQuality: 3,
          energyLevel: 4,
          musclePain: [],
        },
        {
          date: twoDaysAgo.toISOString(),
          sleepQuality: 5,
          energyLevel: 5,
          musclePain: [],
        },
        {
          date: now.toISOString(),
          sleepQuality: 4,
          energyLevel: 4,
          musclePain: [],
        },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));

      const last7Days = storageService.getLogsFromLastDays(7);

      expect(last7Days.length).toBe(3); // fiveDaysAgo, twoDaysAgo, now
    });

    it('should return empty array when no recent logs', () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const testLogs = [
        {
          date: tenDaysAgo.toISOString(),
          sleepQuality: 4,
          energyLevel: 5,
          musclePain: [],
        },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));

      const last3Days = storageService.getLogsFromLastDays(3);

      expect(last3Days.length).toBe(0);
    });

    it('should handle logs exactly at the cutoff date', () => {
      const now = new Date();
      const exactlySevenDaysAgo = new Date(now);
      exactlySevenDaysAgo.setDate(exactlySevenDaysAgo.getDate() - 7);

      const testLogs = [
        {
          date: exactlySevenDaysAgo.toISOString(),
          sleepQuality: 4,
          energyLevel: 5,
          musclePain: [],
        },
        {
          date: now.toISOString(),
          sleepQuality: 5,
          energyLevel: 5,
          musclePain: [],
        },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));

      const last7Days = storageService.getLogsFromLastDays(7);

      expect(last7Days.length).toBeGreaterThanOrEqual(1); // Should include at least today
    });
  });

  describe('getStatistics', () => {
    it('should return zero statistics for empty logs', () => {
      const stats = storageService.getStatistics();

      expect(stats).toEqual({
        totalLogs: 0,
        avgSleep: 0,
        avgEnergy: 0,
        logsThisWeek: 0,
      });
    });

    it('should calculate correct averages', () => {
      const testLogs = [
        {
          date: new Date().toISOString(),
          sleepQuality: 4,
          energyLevel: 5,
          musclePain: [],
        },
        {
          date: new Date().toISOString(),
          sleepQuality: 2,
          energyLevel: 3,
          musclePain: [],
        },
        {
          date: new Date().toISOString(),
          sleepQuality: 3,
          energyLevel: 4,
          musclePain: [],
        },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));

      const stats = storageService.getStatistics();

      expect(stats.totalLogs).toBe(3);
      expect(stats.avgSleep).toBe('3.0'); // (4 + 2 + 3) / 3 = 3.0
      expect(stats.avgEnergy).toBe('4.0'); // (5 + 3 + 4) / 3 = 4.0
      expect(stats.logsThisWeek).toBe(3);
    });

    it('should handle decimal averages correctly', () => {
      const testLogs = [
        {
          date: new Date().toISOString(),
          sleepQuality: 5,
          energyLevel: 5,
          musclePain: [],
        },
        {
          date: new Date().toISOString(),
          sleepQuality: 3,
          energyLevel: 3,
          musclePain: [],
        },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));

      const stats = storageService.getStatistics();

      expect(stats.avgSleep).toBe('4.0'); // (5 + 3) / 2 = 4.0
      expect(stats.avgEnergy).toBe('4.0'); // (5 + 3) / 2 = 4.0
    });

    it('should count logs from last 7 days correctly', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const tenDaysAgo = new Date(now);
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const testLogs = [
        {
          date: tenDaysAgo.toISOString(),
          sleepQuality: 4,
          energyLevel: 5,
          musclePain: [],
        },
        {
          date: threeDaysAgo.toISOString(),
          sleepQuality: 3,
          energyLevel: 4,
          musclePain: [],
        },
        {
          date: now.toISOString(),
          sleepQuality: 5,
          energyLevel: 5,
          musclePain: [],
        },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));

      const stats = storageService.getStatistics();

      expect(stats.totalLogs).toBe(3);
      expect(stats.logsThisWeek).toBe(2); // Only last 7 days
    });
  });

  describe('clearLogs', () => {
    it('should clear all logs from storage', () => {
      const testLogs = [
        { date: '2024-01-01', sleepQuality: 4, energyLevel: 5, musclePain: [] },
        { date: '2024-01-02', sleepQuality: 3, energyLevel: 4, musclePain: [] },
      ];

      localStorage.setItem('training_logs', JSON.stringify(testLogs));

      const result = storageService.clearLogs();

      expect(result).toBe(true);
      expect(localStorage.getItem('training_logs')).toBeNull();

      const logs = storageService.getLogs();
      expect(logs).toEqual([]);
    });

    it('should return true even if no logs exist', () => {
      const result = storageService.clearLogs();

      expect(result).toBe(true);
    });
  });
});
