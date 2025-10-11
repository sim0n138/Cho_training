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
