/**
 * Workout Goals and related constants
 * Defines different workout goals and their exercise type distributions
 */

/**
 * Available workout goals with their characteristics
 */
export const WORKOUT_GOALS = {
  GENERAL: {
    id: 'general',
    name: 'Общая тренировка',
    description: 'Сбалансированная тренировка для общего здоровья',
    icon: '🏃',
    distribution: {
      stretch: 0.4,
      lfc: 0.4,
      meditation: 0.2,
    },
  },
  MOBILITY: {
    id: 'mobility',
    name: 'Мобильность',
    description: 'Улучшение подвижности суставов и гибкости',
    icon: '🤸',
    distribution: {
      stretch: 0.7,
      lfc: 0.2,
      meditation: 0.1,
    },
  },
  STRENGTH: {
    id: 'strength',
    name: 'Сила',
    description: 'Укрепление мышц и увеличение силы',
    icon: '💪',
    distribution: {
      stretch: 0.2,
      lfc: 0.7,
      meditation: 0.1,
    },
  },
  POSTURE: {
    id: 'posture',
    name: 'Осанка',
    description: 'Коррекция осанки и укрепление спины',
    icon: '🧘',
    distribution: {
      stretch: 0.3,
      lfc: 0.6,
      meditation: 0.1,
    },
    focusAreas: ['back', 'core', 'shoulders'],
  },
  RECOVERY: {
    id: 'recovery',
    name: 'Восстановление',
    description: 'Мягкое восстановление после нагрузок',
    icon: '🌿',
    distribution: {
      stretch: 0.5,
      lfc: 0.2,
      meditation: 0.3,
    },
  },
  CARDIO: {
    id: 'cardio',
    name: 'Кардио',
    description: 'Аэробная нагрузка для сердца и выносливости',
    icon: '❤️',
    distribution: {
      stretch: 0.3,
      lfc: 0.6,
      meditation: 0.1,
    },
    focusAreas: ['legs', 'core'],
  },
};

/**
 * Get workout goal by ID
 * @param {string} goalId - Goal identifier
 * @returns {Object|null} Workout goal object or null
 */
export const getWorkoutGoal = (goalId) => {
  return (
    Object.values(WORKOUT_GOALS).find((goal) => goal.id === goalId) || null
  );
};

/**
 * Get all workout goals as array
 * @returns {Array} Array of workout goal objects
 */
export const getAllWorkoutGoals = () => {
  return Object.values(WORKOUT_GOALS);
};

/**
 * Default workout duration options (in minutes)
 */
export const DURATION_OPTIONS = [15, 20, 30, 45, 60];

/**
 * Default workout duration
 */
export const DEFAULT_DURATION = 30;
