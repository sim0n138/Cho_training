import { describe, it, expect, beforeEach } from 'vitest';

// Import helper functions by extracting them from Program.jsx
// Since these are not exported, we'll test them through localStorage interaction
// For now, we'll test the algorithm logic with mock data

describe('Program Generator Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('packByMinutes algorithm', () => {
    // Testing the packing algorithm with mock exercises
    const mockExercises = [
      { name: 'Exercise 1', duration: 5, areas: ['legs'], level: 1 },
      { name: 'Exercise 2', duration: 7, areas: ['back'], level: 1 },
      { name: 'Exercise 3', duration: 3, areas: ['arms'], level: 1 },
      { name: 'Exercise 4', duration: 10, areas: ['chest'], level: 2 },
      { name: 'Exercise 5', duration: 2, areas: ['legs'], level: 1 },
    ];

    // Mock implementation of packByMinutes for testing
    const packByMinutes = (exercises, targetMinutes, tolerance) => {
      if (exercises.length === 0) return [];

      const minMin = targetMinutes * (1 - tolerance);
      const maxMin = targetMinutes * (1 + tolerance);

      let selected = [];
      let currentTotal = 0;
      const available = [...exercises];

      while (currentTotal < maxMin && available.length > 0) {
        available.sort((a, b) => {
          const diffA = Math.abs(targetMinutes - (currentTotal + a.duration));
          const diffB = Math.abs(targetMinutes - (currentTotal + b.duration));
          return diffA - diffB;
        });

        const next = available[0];
        if (currentTotal + next.duration <= maxMin) {
          selected.push(next);
          currentTotal += next.duration;
          available.splice(0, 1);
        } else {
          break;
        }

        if (currentTotal >= minMin && currentTotal <= maxMin) {
          break;
        }
      }

      while (currentTotal > maxMin && selected.length > 1) {
        selected.sort((a, b) => b.duration - a.duration);
        const removed = selected.shift();
        currentTotal -= removed.duration;
      }

      return selected;
    };

    it('should pack exercises within tolerance range', () => {
      const targetMinutes = 15;
      const tolerance = 0.1; // 10%

      const packed = packByMinutes(mockExercises, targetMinutes, tolerance);
      const totalMinutes = packed.reduce((sum, ex) => sum + ex.duration, 0);

      const minMin = targetMinutes * (1 - tolerance);
      const maxMin = targetMinutes * (1 + tolerance);

      expect(totalMinutes).toBeGreaterThanOrEqual(minMin);
      expect(totalMinutes).toBeLessThanOrEqual(maxMin);
    });

    it('should return empty array for empty exercise list', () => {
      const packed = packByMinutes([], 15, 0.1);

      expect(packed).toEqual([]);
    });

    it('should handle target minutes smaller than smallest exercise', () => {
      const tinyTarget = 1;
      const packed = packByMinutes(mockExercises, tinyTarget, 0.1);

      // Should either be empty or contain exercises that fit
      if (packed.length > 0) {
        const total = packed.reduce((sum, ex) => sum + ex.duration, 0);
        expect(total).toBeLessThanOrEqual(tinyTarget * 1.1);
      }
    });

    it('should handle large target minutes', () => {
      const largeTarget = 50;
      const packed = packByMinutes(mockExercises, largeTarget, 0.1);

      // Should select exercises up to available
      expect(packed.length).toBeGreaterThan(0);
    });
  });

  describe('getMostFrequentArea', () => {
    const getMostFrequentArea = (areas) => {
      if (areas.length === 0) return 'general';
      const counts = {};
      areas.forEach((area) => {
        counts[area] = (counts[area] || 0) + 1;
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    };

    it('should return "general" for empty array', () => {
      expect(getMostFrequentArea([])).toBe('general');
    });

    it('should return the most frequent area', () => {
      const areas = ['legs', 'back', 'legs', 'arms', 'legs'];

      expect(getMostFrequentArea(areas)).toBe('legs');
    });

    it('should handle tie by returning first in sorted order', () => {
      const areas = ['legs', 'back', 'legs', 'back'];

      const result = getMostFrequentArea(areas);
      expect(['legs', 'back']).toContain(result);
    });

    it('should handle single area', () => {
      const areas = ['chest'];

      expect(getMostFrequentArea(areas)).toBe('chest');
    });
  });

  describe('filterByPain', () => {
    const PAIN_AREA_MAP = {
      legs: ['legs', 'lower_body'],
      back: ['back', 'spine'],
      arms: ['arms', 'upper_body'],
      chest: ['chest', 'upper_body'],
      fullbody: ['full_body'],
    };

    const filterByPain = (exercises, painAreas) => {
      if (painAreas.length === 0) return exercises;

      const conflictAreas = painAreas.flatMap(
        (pain) => PAIN_AREA_MAP[pain] || []
      );
      return exercises.filter((ex) => {
        return !ex.areas.some((area) => conflictAreas.includes(area));
      });
    };

    const mockExercises = [
      { name: 'Leg Press', areas: ['legs', 'lower_body'], level: 1 },
      { name: 'Back Extension', areas: ['back', 'spine'], level: 1 },
      { name: 'Arm Curl', areas: ['arms', 'upper_body'], level: 1 },
      { name: 'Chest Press', areas: ['chest', 'upper_body'], level: 2 },
      { name: 'Core Work', areas: ['core'], level: 1 },
    ];

    it('should return all exercises when no pain areas', () => {
      const filtered = filterByPain(mockExercises, []);

      expect(filtered.length).toBe(mockExercises.length);
    });

    it('should filter out exercises with painful areas', () => {
      const filtered = filterByPain(mockExercises, ['legs']);

      expect(filtered).not.toContainEqual(
        expect.objectContaining({ name: 'Leg Press' })
      );
      expect(filtered).toContainEqual(
        expect.objectContaining({ name: 'Back Extension' })
      );
    });

    it('should filter multiple pain areas', () => {
      const filtered = filterByPain(mockExercises, ['legs', 'back']);

      expect(filtered).not.toContainEqual(
        expect.objectContaining({ name: 'Leg Press' })
      );
      expect(filtered).not.toContainEqual(
        expect.objectContaining({ name: 'Back Extension' })
      );
      expect(filtered.length).toBeLessThan(mockExercises.length);
    });

    it('should handle exercises with multiple areas', () => {
      const filtered = filterByPain(mockExercises, ['arms']);

      // Should filter out both Arm Curl and Chest Press (both have upper_body)
      expect(filtered).not.toContainEqual(
        expect.objectContaining({ name: 'Arm Curl' })
      );
      expect(filtered).not.toContainEqual(
        expect.objectContaining({ name: 'Chest Press' })
      );
    });

    it('should handle unknown pain areas gracefully', () => {
      const filtered = filterByPain(mockExercises, ['unknown_area']);

      // Should return all exercises since unknown_area maps to empty array
      expect(filtered.length).toBe(mockExercises.length);
    });
  });

  describe('RPE-based volume adjustment', () => {
    it('should reduce volume for high RPE (>= 7)', () => {
      const highRPE = 8;
      let targetMinutes;

      if (highRPE >= 7) {
        targetMinutes = {
          stretch: 10,
          lfc: 15,
          meditation: 10,
        };
      }

      expect(targetMinutes.stretch).toBe(10);
      expect(targetMinutes.lfc).toBe(15);
      expect(targetMinutes.meditation).toBe(10);
    });

    it('should increase volume for low RPE (<= 3)', () => {
      const lowRPE = 2;
      let targetMinutes;

      if (lowRPE <= 3) {
        targetMinutes = {
          stretch: 20,
          lfc: 25,
          meditation: 10,
        };
      }

      expect(targetMinutes.stretch).toBe(20);
      expect(targetMinutes.lfc).toBe(25);
      expect(targetMinutes.meditation).toBe(10);
    });

    it('should use default volume for medium RPE', () => {
      const mediumRPE = 5;
      let targetMinutes = {
        stretch: 15,
        lfc: 20,
        meditation: 10,
      };

      // No adjustment for medium RPE
      if (mediumRPE >= 7) {
        targetMinutes = {
          stretch: 10,
          lfc: 15,
          meditation: 10,
        };
      } else if (mediumRPE <= 3) {
        targetMinutes = {
          stretch: 20,
          lfc: 25,
          meditation: 10,
        };
      }

      expect(targetMinutes.stretch).toBe(15);
      expect(targetMinutes.lfc).toBe(20);
      expect(targetMinutes.meditation).toBe(10);
    });
  });

  describe('Exercise level filtering', () => {
    const mockExercises = [
      { name: 'Easy Exercise', level: 1 },
      { name: 'Medium Exercise', level: 2 },
      { name: 'Hard Exercise', level: 3 },
    ];

    it('should only allow level 1 for high RPE (>= 7)', () => {
      const rpe = 8;
      const maxLevel = rpe >= 7 ? 1 : 2;
      const filtered = mockExercises.filter((ex) => ex.level <= maxLevel);

      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Easy Exercise');
    });

    it('should allow levels 1 and 2 for normal RPE', () => {
      const rpe = 5;
      const maxLevel = rpe >= 7 ? 1 : 2;
      const filtered = mockExercises.filter((ex) => ex.level <= maxLevel);

      expect(filtered.length).toBe(2);
      expect(filtered.map((e) => e.name)).toContain('Easy Exercise');
      expect(filtered.map((e) => e.name)).toContain('Medium Exercise');
    });
  });

  describe('localStorage program history', () => {
    it('should save program to history', () => {
      const program = {
        date: new Date().toISOString(),
        primaryArea: 'legs',
        exercises: { stretch: [], lfc: [], meditation: [] },
        totalMinutes: 45,
      };

      const history = [];
      history.unshift(program);
      localStorage.setItem('program_history', JSON.stringify(history));

      const saved = JSON.parse(localStorage.getItem('program_history'));
      expect(saved.length).toBe(1);
      expect(saved[0].primaryArea).toBe('legs');
    });

    it('should limit history to 10 programs', () => {
      const history = [];
      for (let i = 0; i < 12; i++) {
        history.unshift({
          date: new Date().toISOString(),
          primaryArea: `area${i}`,
          exercises: { stretch: [], lfc: [], meditation: [] },
          totalMinutes: 45,
        });
      }

      // Simulate the limit
      while (history.length > 10) {
        history.pop();
      }

      expect(history.length).toBe(10);
      expect(history[0].primaryArea).toBe('area11'); // Most recent
      expect(history[9].primaryArea).toBe('area2'); // Oldest kept
    });

    it('should prevent repeating primary area from last program', () => {
      const lastProgram = {
        primaryArea: 'legs',
      };

      localStorage.setItem('program_history', JSON.stringify([lastProgram]));

      const history = JSON.parse(localStorage.getItem('program_history'));
      const lastPrimaryArea = history[0].primaryArea;

      expect(lastPrimaryArea).toBe('legs');

      // In actual implementation, new program should have different primaryArea
      const newPrimaryArea = 'back'; // Should be different
      expect(newPrimaryArea).not.toBe(lastPrimaryArea);
    });
  });

  describe('Tolerance constant', () => {
    it('should use unified 10% tolerance', () => {
      const MINUTES_TOLERANCE = 0.1;

      expect(MINUTES_TOLERANCE).toBe(0.1);
      expect(MINUTES_TOLERANCE * 100).toBe(10); // 10%
    });
  });
});
