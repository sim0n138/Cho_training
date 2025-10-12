/**
 * Service for program generation business logic
 * Integrates wellbeing data with exercise program generation
 */
import { EXERCISES, PAIN_AREA_MAP } from '../data/exercises.js';
import {
  WELLBEING_THRESHOLDS,
  RPE_THRESHOLDS,
  TARGET_MINUTES,
  PROGRAM_CONFIG,
} from '../constants/index.js';
import storageService from './storageService.js';

/**
 * Filter exercises by pain areas
 * @param {Array} exercises - Array of exercises
 * @param {Array} painAreas - Array of pain area names
 * @returns {Array} Filtered exercises
 */
export const filterByPain = (exercises, painAreas) => {
  if (painAreas.length === 0) return exercises;

  const conflictAreas = painAreas.flatMap((pain) => PAIN_AREA_MAP[pain] || []);
  return exercises.filter((ex) => {
    return !ex.areas.some((area) => conflictAreas.includes(area));
  });
};

/**
 * Pack exercises to match target minutes with tolerance
 * @param {Array} exercises - Available exercises
 * @param {number} targetMinutes - Target duration
 * @param {number} tolerance - Tolerance percentage
 * @returns {Array} Selected exercises
 */
export const packByMinutes = (exercises, targetMinutes, tolerance) => {
  if (exercises.length === 0) return [];

  const minMin = targetMinutes * (1 - tolerance);
  const maxMin = targetMinutes * (1 + tolerance);

  let selected = [];
  let currentTotal = 0;
  const available = [...exercises];

  // Greedy packing
  while (currentTotal < maxMin && available.length > 0) {
    // Sort by how close they get us to target
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

    // Stop if we're in acceptable range
    if (currentTotal >= minMin && currentTotal <= maxMin) {
      break;
    }
  }

  return selected;
};

/**
 * Get the most frequent area from exercises
 * @param {Array} areas - Array of area arrays
 * @returns {string|null} Most frequent area
 */
export const getMostFrequentArea = (areas) => {
  if (areas.length === 0) return null;

  const flattened = areas.flat();
  if (flattened.length === 0) return null;

  const counts = {};
  flattened.forEach((area) => {
    counts[area] = (counts[area] || 0) + 1;
  });

  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

/**
 * Calculate total minutes from exercises
 * @param {Array} exercises - Array of exercises
 * @returns {number} Total minutes
 */
export const getTotalMinutes = (exercises) => {
  return exercises.reduce((sum, ex) => sum + ex.duration, 0);
};

/**
 * Get recommendations based on wellbeing data
 * @param {Object|null} latestLog - Latest wellbeing log entry
 * @returns {Object} Recommendations object
 */
export const getWellbeingRecommendations = (latestLog) => {
  if (!latestLog) {
    return {
      suggestedRPE: 5,
      message: 'Нет данных о самочувствии. Рекомендуем умеренную нагрузку.',
      painAreas: [],
    };
  }

  const { sleepQuality, energyLevel, musclePain } = latestLog;
  let suggestedRPE = 5;
  let messages = [];

  // Check sleep quality
  if (sleepQuality <= WELLBEING_THRESHOLDS.SLEEP_QUALITY.POOR) {
    suggestedRPE -= 2;
    messages.push('Плохой сон - снижена интенсивность');
  } else if (sleepQuality >= WELLBEING_THRESHOLDS.SLEEP_QUALITY.EXCELLENT) {
    suggestedRPE += 1;
    messages.push('Отличный сон - можно увеличить нагрузку');
  }

  // Check energy level
  if (energyLevel <= WELLBEING_THRESHOLDS.ENERGY_LEVEL.LOW) {
    suggestedRPE -= 2;
    messages.push('Низкая энергия - рекомендован отдых');
  } else if (energyLevel >= WELLBEING_THRESHOLDS.ENERGY_LEVEL.VERY_HIGH) {
    suggestedRPE += 1;
    messages.push('Высокая энергия - можно тренироваться интенсивнее');
  }

  // Check muscle pain
  if (
    musclePain &&
    musclePain.length >= WELLBEING_THRESHOLDS.PAIN.SIGNIFICANT_COUNT
  ) {
    suggestedRPE -= 1;
    messages.push('Боли в нескольких областях - снижена нагрузка');
  }

  // Clamp RPE to valid range
  suggestedRPE = Math.max(1, Math.min(10, suggestedRPE));

  return {
    suggestedRPE,
    message: messages.join('. ') || 'Нормальное состояние',
    painAreas: musclePain || [],
  };
};

/**
 * Generate program based on RPE, pain areas, and wellbeing data
 * @param {number} rpe - RPE value (1-10)
 * @param {Array} painAreas - Array of pain areas
 * @param {boolean} useWellbeingData - Whether to consider wellbeing data
 * @returns {Object} Generated program
 */
export const generateProgram = (rpe, painAreas, useWellbeingData = true) => {
  // Get wellbeing recommendations if requested
  let recommendations = null;
  if (useWellbeingData) {
    const latestLog = storageService.getLatestLog();
    recommendations = getWellbeingRecommendations(latestLog);

    // Optionally adjust RPE based on recommendations (user can override)
    // This is informational for now
  }

  // Determine target minutes based on RPE
  let targets;
  if (rpe >= RPE_THRESHOLDS.HIGH) {
    targets = TARGET_MINUTES.HIGH_RPE;
  } else if (rpe <= RPE_THRESHOLDS.LOW) {
    targets = TARGET_MINUTES.LOW_RPE;
  } else {
    targets = TARGET_MINUTES.DEFAULT;
  }

  // Get exercises by category
  const stretchExercises = EXERCISES.stretch || [];
  const lfcExercises = EXERCISES.lfc || [];
  const meditationExercises = EXERCISES.meditation || [];

  // Filter by pain
  const availableStretch = filterByPain(stretchExercises, painAreas);
  const availableLFC = filterByPain(lfcExercises, painAreas);
  const availableMeditation = filterByPain(meditationExercises, painAreas);

  // Pack exercises
  const selectedStretch = packByMinutes(
    availableStretch,
    targets.stretch,
    PROGRAM_CONFIG.MINUTES_TOLERANCE
  );
  const selectedLFC = packByMinutes(
    availableLFC,
    targets.lfc,
    PROGRAM_CONFIG.MINUTES_TOLERANCE
  );
  const selectedMeditation = packByMinutes(
    availableMeditation,
    targets.meditation,
    PROGRAM_CONFIG.MINUTES_TOLERANCE
  );

  // Calculate stats
  const totalMinutes =
    getTotalMinutes(selectedStretch) +
    getTotalMinutes(selectedLFC) +
    getTotalMinutes(selectedMeditation);

  const focusArea = getMostFrequentArea([
    ...selectedStretch.map((ex) => ex.areas),
    ...selectedLFC.map((ex) => ex.areas),
  ]);

  return {
    rpe,
    painAreas,
    stretch: selectedStretch,
    lfc: selectedLFC,
    meditation: selectedMeditation,
    totalMinutes,
    focusArea: focusArea || 'Все тело',
    recommendations,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Save program to history in localStorage
 * @param {Object} program - Program to save
 * @returns {boolean} Success status
 */
export const saveProgramToHistory = (program) => {
  try {
    const HISTORY_KEY = 'program_history';
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.push(program);

    // Keep only last N programs
    if (history.length > PROGRAM_CONFIG.MAX_HISTORY_SIZE) {
      history.shift();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving program to history:', error);
    return false;
  }
};

/**
 * Get program history from localStorage
 * @returns {Array} Array of saved programs
 */
export const getProgramHistory = () => {
  try {
    const HISTORY_KEY = 'program_history';
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch (error) {
    console.error('Error getting program history:', error);
    return [];
  }
};

const programService = {
  filterByPain,
  packByMinutes,
  getMostFrequentArea,
  getTotalMinutes,
  getWellbeingRecommendations,
  generateProgram,
  saveProgramToHistory,
  getProgramHistory,
};

export default programService;
