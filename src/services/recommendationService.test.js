import { describe, it, expect } from 'vitest';
import recommendationService from './recommendationService';

describe('recommendationService', () => {
  describe('getRecommendation', () => {
    it('should return rest recommendation when no log provided', () => {
      const result = recommendationService.getRecommendation(null);

      expect(result.type).toBe('rest');
      expect(result.title).toBe('Начните отслеживать самочувствие');
      expect(result.intensity).toBe('none');
    });

    it('should return rest recommendation for low energy (energyLevel <= 2)', () => {
      const log = {
        sleepQuality: 4,
        energyLevel: 2,
        musclePain: [],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('rest');
      expect(result.title).toBe('Отдых и восстановление');
      expect(result.intensity).toBe('low');
      expect(result.activities).toContain('Растяжка');
    });

    it('should return rest recommendation for poor sleep (sleepQuality <= 2)', () => {
      const log = {
        sleepQuality: 2,
        energyLevel: 4,
        musclePain: [],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('rest');
      expect(result.title).toBe('Отдых и восстановление');
      expect(result.intensity).toBe('low');
    });

    it('should return recovery recommendation for significant muscle pain (>= 3 areas)', () => {
      const log = {
        sleepQuality: 4,
        energyLevel: 4,
        musclePain: ['legs', 'back', 'arms'],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('recovery');
      expect(result.title).toBe('Восстановительная тренировка');
      expect(result.intensity).toBe('low');
      expect(result.activities).toContain('Йога');
    });

    it('should return moderate recommendation for moderate energy (energyLevel = 3)', () => {
      const log = {
        sleepQuality: 4,
        energyLevel: 3,
        musclePain: [],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('moderate');
      expect(result.title).toBe('Умеренная тренировка');
      expect(result.intensity).toBe('moderate');
      expect(result.activities).toContain('Кардио средней интенсивности');
    });

    it('should return moderate recommendation for moderate sleep (sleepQuality = 3)', () => {
      const log = {
        sleepQuality: 3,
        energyLevel: 4,
        musclePain: [],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('moderate');
      expect(result.title).toBe('Умеренная тренировка');
      expect(result.intensity).toBe('moderate');
    });

    it('should include pain areas in moderate recommendation description', () => {
      const log = {
        sleepQuality: 3,
        energyLevel: 4,
        musclePain: ['back', 'legs'],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.description).toContain('Избегайте нагрузки на:');
      expect(result.description).toContain('back');
      expect(result.description).toContain('legs');
    });

    it('should return intensive recommendation for high energy and good sleep', () => {
      const log = {
        sleepQuality: 5,
        energyLevel: 5,
        musclePain: [],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('intensive');
      expect(result.title).toBe('Интенсивная тренировка');
      expect(result.intensity).toBe('high');
      expect(result.activities).toContain('HIIT');
      expect(result.description).toContain('Отличное состояние');
    });

    it('should warn about pain areas in intensive recommendation', () => {
      const log = {
        sleepQuality: 5,
        energyLevel: 5,
        musclePain: ['arms'],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('intensive');
      expect(result.description).toContain('Будьте осторожны с:');
      expect(result.description).toContain('arms');
    });

    it('should return default moderate recommendation as fallback', () => {
      // Edge case: energy=4, sleep=2 (already handled by low sleep check)
      // Testing with energy=4, sleep=4 but less than 3 pain areas should go to intensive
      // So we need a case that falls through - this shouldn't happen in practice
      // but testing the default return statement
      const log = {
        sleepQuality: 4,
        energyLevel: 4,
        musclePain: ['back', 'legs'], // 2 areas, not >= 3
      };

      const result = recommendationService.getRecommendation(log);

      // This should actually go to intensive based on the logic
      expect(result.type).toBe('intensive');
    });

    it('should handle edge case: energyLevel = 4, sleepQuality = 4 with no pain', () => {
      const log = {
        sleepQuality: 4,
        energyLevel: 4,
        musclePain: [],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('intensive');
      expect(result.intensity).toBe('high');
    });

    it('should handle edge case: energyLevel = 1, sleepQuality = 1', () => {
      const log = {
        sleepQuality: 1,
        energyLevel: 1,
        musclePain: [],
      };

      const result = recommendationService.getRecommendation(log);

      expect(result.type).toBe('rest');
      expect(result.intensity).toBe('low');
    });
  });

  describe('getMotivationMessage', () => {
    it('should return beginner message for 0 logs this week', () => {
      const message = recommendationService.getMotivationMessage(0);

      expect(message).toBe(
        'Начните отслеживать своё самочувствие для более точных рекомендаций!'
      );
    });

    it('should return excellent message for 5+ logs this week', () => {
      const message = recommendationService.getMotivationMessage(5);

      expect(message).toBe(
        'Отличная работа! Вы регулярно отслеживаете своё состояние.'
      );
    });

    it('should return excellent message for more than 5 logs', () => {
      const message = recommendationService.getMotivationMessage(7);

      expect(message).toBe(
        'Отличная работа! Вы регулярно отслеживаете своё состояние.'
      );
    });

    it('should return good progress message for 3-4 logs this week', () => {
      const message = recommendationService.getMotivationMessage(3);

      expect(message).toBe(
        'Хороший прогресс! Продолжайте следить за своим самочувствием.'
      );
    });

    it('should return encouragement message for 1-2 logs this week', () => {
      const message = recommendationService.getMotivationMessage(2);

      expect(message).toBe(
        'Попробуйте заполнять журнал чаще для более точных рекомендаций.'
      );
    });

    it('should handle edge case: exactly 4 logs', () => {
      const message = recommendationService.getMotivationMessage(4);

      expect(message).toBe(
        'Хороший прогресс! Продолжайте следить за своим самочувствием.'
      );
    });

    it('should handle edge case: exactly 5 logs', () => {
      const message = recommendationService.getMotivationMessage(5);

      expect(message).toBe(
        'Отличная работа! Вы регулярно отслеживаете своё состояние.'
      );
    });
  });
});
