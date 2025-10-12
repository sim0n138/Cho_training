import { describe, it, expect, beforeEach, vi } from 'vitest';
import exportService from './exportService';
import storageService from './storageService';

// Mock storageService
vi.mock('./storageService', () => ({
  default: {
    getLogs: vi.fn(),
    addLog: vi.fn(),
    clearLogs: vi.fn(),
  },
}));

describe('exportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe('exportLogsToJSON', () => {
    it('should export logs to JSON format', () => {
      const mockLogs = [
        {
          date: '2025-01-01T00:00:00.000Z',
          sleepQuality: 4,
          energyLevel: 5,
          mood: 'Отличное',
          musclePain: ['Ноги'],
        },
      ];

      storageService.getLogs.mockReturnValue(mockLogs);

      const result = exportService.exportLogsToJSON();
      const parsed = JSON.parse(result);

      expect(parsed.version).toBe('1.0');
      expect(parsed.logs).toEqual(mockLogs);
      expect(parsed.totalCount).toBe(1);
      expect(parsed.exportDate).toBeDefined();
    });

    it('should handle empty logs', () => {
      storageService.getLogs.mockReturnValue([]);

      const result = exportService.exportLogsToJSON();
      const parsed = JSON.parse(result);

      expect(parsed.logs).toEqual([]);
      expect(parsed.totalCount).toBe(0);
    });
  });

  describe('importLogsFromJSON', () => {
    it('should import valid logs', () => {
      const jsonData = JSON.stringify({
        version: '1.0',
        exportDate: '2025-01-01T00:00:00.000Z',
        logs: [
          {
            date: '2025-01-01T00:00:00.000Z',
            sleepQuality: 4,
            energyLevel: 5,
            mood: 'Отличное',
            musclePain: ['Ноги'],
          },
        ],
      });

      storageService.getLogs.mockReturnValue([]);

      const result = exportService.importLogsFromJSON(jsonData, false);

      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(1);
      expect(storageService.clearLogs).toHaveBeenCalled();
      expect(storageService.addLog).toHaveBeenCalledTimes(1);
    });

    it('should merge logs when merge is true', () => {
      const existingLogs = [
        {
          date: '2025-01-01T00:00:00.000Z',
          sleepQuality: 3,
          energyLevel: 4,
          mood: 'Хорошее',
          musclePain: [],
        },
      ];

      const jsonData = JSON.stringify({
        logs: [
          {
            date: '2025-01-02T00:00:00.000Z',
            sleepQuality: 5,
            energyLevel: 5,
            mood: 'Отличное',
            musclePain: ['Спина'],
          },
        ],
      });

      storageService.getLogs.mockReturnValue(existingLogs);

      const result = exportService.importLogsFromJSON(jsonData, true);

      expect(result.success).toBe(true);
      expect(result.totalCount).toBe(2);
      expect(storageService.addLog).toHaveBeenCalledTimes(2);
    });

    it('should reject invalid JSON', () => {
      const result = exportService.importLogsFromJSON('invalid json');

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should reject data without logs array', () => {
      const jsonData = JSON.stringify({
        version: '1.0',
        data: 'something',
      });

      const result = exportService.importLogsFromJSON(jsonData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Некорректный формат');
    });

    it('should filter out invalid log entries', () => {
      const jsonData = JSON.stringify({
        logs: [
          {
            date: '2025-01-01T00:00:00.000Z',
            sleepQuality: 4,
            energyLevel: 5,
            mood: 'Отличное',
            musclePain: ['Ноги'],
          },
          {
            // Invalid - missing required fields
            date: '2025-01-02T00:00:00.000Z',
            sleepQuality: 'invalid',
          },
        ],
      });

      storageService.getLogs.mockReturnValue([]);

      const result = exportService.importLogsFromJSON(jsonData, false);

      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(1);
      expect(storageService.addLog).toHaveBeenCalledTimes(1);
    });

    it('should handle duplicate dates when merging', () => {
      const existingLogs = [
        {
          date: '2025-01-01T00:00:00.000Z',
          sleepQuality: 3,
          energyLevel: 4,
          mood: 'Хорошее',
          musclePain: [],
        },
      ];

      const jsonData = JSON.stringify({
        logs: [
          {
            date: '2025-01-01T00:00:00.000Z',
            sleepQuality: 5,
            energyLevel: 5,
            mood: 'Отличное',
            musclePain: ['Спина'],
          },
        ],
      });

      storageService.getLogs.mockReturnValue(existingLogs);

      const result = exportService.importLogsFromJSON(jsonData, true);

      expect(result.success).toBe(true);
      expect(result.totalCount).toBe(1); // Should be 1, not 2 (duplicate removed)
    });
  });

  describe('importLogsFromFile', () => {
    it('should reject if no file provided', async () => {
      await expect(exportService.importLogsFromFile(null)).rejects.toThrow(
        'Файл не выбран'
      );
    });

    it('should reject non-JSON files', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      await expect(exportService.importLogsFromFile(file)).rejects.toThrow(
        'Пожалуйста, выберите JSON файл'
      );
    });
  });
});
