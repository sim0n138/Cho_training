/**
 * Constants for localStorage keys used throughout the application
 */

export const STORAGE_KEYS = {
  TRAINING_LOGS: 'training_logs',
  PROGRAM_HISTORY: 'program_history',
  USER_PREFERENCES: 'user_preferences',
  LAST_RPE: 'last_rpe',
  LAST_PAIN_AREAS: 'last_pain_areas',
};

/**
 * Storage quota and cleanup configuration
 */
export const STORAGE_CONFIG = {
  MAX_SIZE_MB: 4.5, // Maximum storage size before cleanup
  WARNING_SIZE_MB: 4, // Size at which to warn user
  MAX_LOGS_COUNT: 100, // Maximum number of logs to keep
  STORAGE_TEST_KEY: '__storage_test__',
};
