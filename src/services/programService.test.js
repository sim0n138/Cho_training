import { describe, it, expect, beforeEach, vi } from 'vitest';
import programService from './programService';
import storageService from './storageService';

// Mock storageService
vi.mock('./storageService', () => ({
  default: {
    getLatestLog: vi.fn(),
  },
}));

describe('programService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('filterByPain', () => {
    it('should return all exercises when no pain areas', () => {
      const exercises = [
        { name: 'Ex1', areas: ['legs'] },
        { name: 'Ex2', areas: ['back'] },
      ];
      const result = programService.filterByPain(exercises, []);
      expect(result).toEqual(exercises);
    });

    it('should filter exercises conflicting with pain areas', () => {
      const exercises = [
        { name: 'Ex1', areas: ['legs'] },
        { name: 'Ex2', areas: ['back'] },
        { name: 'Ex3', areas: ['arms'] },
      ];
      const result = programService.filterByPain(exercises, ['Ноги']);
      expect(result.length).toBeLessThan(exercises.length);
    });
  });

  describe('packByMinutes', () => {
    it('should pack exercises to target minutes', () => {
      const exercises = [
        { name: 'Ex1', duration: 5 },
        { name: 'Ex2', duration: 5 },
        { name: 'Ex3', duration: 5 },
      ];
      const result = programService.packByMinutes(exercises, 10, 0.1);
      expect(result.length).toBeGreaterThan(0);
      const total = programService.getTotalMinutes(result);
      expect(total).toBeGreaterThanOrEqual(9);
      expect(total).toBeLessThanOrEqual(11);
    });

    it('should return empty array for empty exercises', () => {
      const result = programService.packByMinutes([], 10, 0.1);
      expect(result).toEqual([]);
    });
  });

  describe('getMostFrequentArea', () => {
    it('should return most frequent area', () => {
      const areas = [['legs', 'back'], ['legs', 'arms'], ['legs']];
      const result = programService.getMostFrequentArea(areas);
      expect(result).toBe('legs');
    });

    it('should return null for empty areas', () => {
      const result = programService.getMostFrequentArea([]);
      expect(result).toBeNull();
    });
  });

  describe('getTotalMinutes', () => {
    it('should calculate total minutes', () => {
      const exercises = [
        { duration: 5 },
        { duration: 10 },
        { duration: 3 },
      ];
      const result = programService.getTotalMinutes(exercises);
      expect(result).toBe(18);
    });

    it('should return 0 for empty array', () => {
      const result = programService.getTotalMinutes([]);
      expect(result).toBe(0);
    });
  });

  describe('getWellbeingRecommendations', () => {
    it('should return default recommendations when no log', () => {
      const result = programService.getWellbeingRecommendations(null);
      expect(result.suggestedRPE).toBe(5);
      expect(result.painAreas).toEqual([]);
    });

    it('should suggest lower RPE for poor sleep', () => {
      const log = {
        sleepQuality: 1,
        energyLevel: 3,
        musclePain: [],
      };
      const result = programService.getWellbeingRecommendations(log);
      expect(result.suggestedRPE).toBeLessThan(5);
    });

    it('should suggest higher RPE for excellent conditions', () => {
      const log = {
        sleepQuality: 5,
        energyLevel: 5,
        musclePain: [],
      };
      const result = programService.getWellbeingRecommendations(log);
      expect(result.suggestedRPE).toBeGreaterThan(5);
    });

    it('should consider muscle pain in recommendations', () => {
      const log = {
        sleepQuality: 3,
        energyLevel: 3,
        musclePain: ['Ноги', 'Спина', 'Руки'],
      };
      const result = programService.getWellbeingRecommendations(log);
      expect(result.suggestedRPE).toBeLessThan(5);
      expect(result.painAreas).toEqual(['Ноги', 'Спина', 'Руки']);
    });

    it('should clamp RPE to valid range', () => {
      const poorLog = {
        sleepQuality: 1,
        energyLevel: 1,
        musclePain: ['Ноги', 'Спина', 'Руки'],
      };
      const result = programService.getWellbeingRecommendations(poorLog);
      expect(result.suggestedRPE).toBeGreaterThanOrEqual(1);
      expect(result.suggestedRPE).toBeLessThanOrEqual(10);
    });
  });

  describe('generateProgram', () => {
    it('should generate program with valid structure', () => {
      storageService.getLatestLog.mockReturnValue(null);

      const result = programService.generateProgram(5, [], false);

      expect(result).toHaveProperty('rpe');
      expect(result).toHaveProperty('painAreas');
      expect(result).toHaveProperty('stretch');
      expect(result).toHaveProperty('lfc');
      expect(result).toHaveProperty('meditation');
      expect(result).toHaveProperty('totalMinutes');
      expect(result).toHaveProperty('focusArea');
      expect(result).toHaveProperty('timestamp');
    });

    it('should adjust targets based on high RPE', () => {
      storageService.getLatestLog.mockReturnValue(null);

      const highRPE = programService.generateProgram(9, [], false);
      const lowRPE = programService.generateProgram(2, [], false);

      // High RPE should have less total time
      expect(highRPE.totalMinutes).toBeLessThan(lowRPE.totalMinutes);
    });

    it('should include recommendations when useWellbeingData is true', () => {
      const mockLog = {
        sleepQuality: 4,
        energyLevel: 4,
        musclePain: ['Ноги'],
      };
      storageService.getLatestLog.mockReturnValue(mockLog);

      const result = programService.generateProgram(5, [], true);

      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.suggestedRPE).toBeDefined();
    });
  });

  describe('saveProgramToHistory', () => {
    it('should save program to localStorage', () => {
      const program = {
        rpe: 5,
        totalMinutes: 45,
        timestamp: new Date().toISOString(),
      };

      const result = programService.saveProgramToHistory(program);
      expect(result).toBe(true);

      const history = programService.getProgramHistory();
      expect(history).toHaveLength(1);
      expect(history[0].rpe).toBe(5);
    });

    it('should limit history size', () => {
      // Save more than MAX_HISTORY_SIZE programs
      for (let i = 0; i < 15; i++) {
        programService.saveProgramToHistory({
          rpe: i,
          timestamp: new Date().toISOString(),
        });
      }

      const history = programService.getProgramHistory();
      expect(history.length).toBeLessThanOrEqual(10); // MAX_HISTORY_SIZE is 10
    });
  });

  describe('getProgramHistory', () => {
    it('should return empty array when no history', () => {
      const result = programService.getProgramHistory();
      expect(result).toEqual([]);
    });

    it('should return saved programs', () => {
      const program = {
        rpe: 5,
        totalMinutes: 45,
      };
      programService.saveProgramToHistory(program);

      const history = programService.getProgramHistory();
      expect(history).toHaveLength(1);
    });
  });
});
