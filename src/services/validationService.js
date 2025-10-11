/**
 * Service for validating user input data
 */

/**
 * Validates a wellbeing log entry
 * @param {Object} entry - The log entry to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
const validateLogEntry = (entry) => {
  const errors = {};

  // Validate sleepQuality
  if (!entry.sleepQuality) {
    errors.sleepQuality = 'Качество сна обязательно для заполнения';
  } else if (
    typeof entry.sleepQuality !== 'number' ||
    entry.sleepQuality < 1 ||
    entry.sleepQuality > 5
  ) {
    errors.sleepQuality = 'Качество сна должно быть числом от 1 до 5';
  }

  // Validate energyLevel
  if (!entry.energyLevel) {
    errors.energyLevel = 'Уровень энергии обязателен для заполнения';
  } else if (
    typeof entry.energyLevel !== 'number' ||
    entry.energyLevel < 1 ||
    entry.energyLevel > 5
  ) {
    errors.energyLevel = 'Уровень энергии должен быть числом от 1 до 5';
  }

  // Validate mood
  if (!entry.mood || typeof entry.mood !== 'string') {
    errors.mood = 'Настроение обязательно для заполнения';
  } else if (entry.mood.length > 100) {
    errors.mood = 'Настроение не должно превышать 100 символов';
  }

  // Validate date
  if (!entry.date) {
    errors.date = 'Дата обязательна';
  } else {
    const dateObj = new Date(entry.date);
    if (isNaN(dateObj.getTime())) {
      errors.date = 'Некорректный формат даты';
    }
  }

  // Validate musclePain
  if (!Array.isArray(entry.musclePain)) {
    errors.musclePain = 'musclePain должен быть массивом';
  } else if (entry.musclePain.length > 10) {
    errors.musclePain = 'Слишком много областей с болью';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates RPE value
 * @param {number} rpe - RPE value to validate
 * @returns {Object} - Validation result
 */
const validateRPE = (rpe) => {
  if (typeof rpe !== 'number' || rpe < 1 || rpe > 10) {
    return {
      isValid: false,
      error: 'RPE должно быть числом от 1 до 10',
    };
  }
  return { isValid: true };
};

/**
 * Validates pain areas
 * @param {Array} painAreas - Array of pain area strings
 * @returns {Object} - Validation result
 */
const validatePainAreas = (painAreas) => {
  if (!Array.isArray(painAreas)) {
    return {
      isValid: false,
      error: 'Области боли должны быть массивом',
    };
  }

  const validAreas = ['Ноги', 'Спина', 'Руки', 'Грудь', 'Всё тело'];
  const invalidAreas = painAreas.filter((area) => !validAreas.includes(area));

  if (invalidAreas.length > 0) {
    return {
      isValid: false,
      error: `Некорректные области: ${invalidAreas.join(', ')}`,
    };
  }

  return { isValid: true };
};

const validationService = {
  validateLogEntry,
  validateRPE,
  validatePainAreas,
};

export default validationService;
