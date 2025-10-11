/**
 * Thresholds for wellbeing assessment and workout recommendations
 */

export const WELLBEING_THRESHOLDS = {
  SLEEP_QUALITY: {
    POOR: 2,
    MODERATE: 3,
    GOOD: 4,
    EXCELLENT: 5,
  },
  ENERGY_LEVEL: {
    LOW: 2,
    MODERATE: 3,
    HIGH: 4,
    VERY_HIGH: 5,
  },
  PAIN: {
    SIGNIFICANT_COUNT: 3,
  },
};

export const RPE_THRESHOLDS = {
  LOW: 3,
  HIGH: 7,
  MAX: 10,
};

export const TARGET_MINUTES = {
  HIGH_RPE: {
    stretch: 10,
    lfc: 15,
    meditation: 10,
  },
  LOW_RPE: {
    stretch: 20,
    lfc: 25,
    meditation: 10,
  },
  DEFAULT: {
    stretch: 15,
    lfc: 20,
    meditation: 10,
  },
};

export const PROGRAM_CONFIG = {
  MINUTES_TOLERANCE: 0.1, // 10% tolerance
  MAX_HISTORY_SIZE: 10,
  MIN_EXERCISES_PER_CATEGORY: 2,
};
