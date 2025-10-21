/**
 * UI-related constants
 * Replaces magic numbers throughout the application
 */

/**
 * Timing constants (in milliseconds)
 */
export const UI_TIMINGS = {
  RELOAD_DELAY: 2000,
  TOAST_DURATION: 3000,
  TOAST_SUCCESS_DURATION: 2000,
  TOAST_ERROR_DURATION: 4000,
  PROGRAM_GENERATION_DELAY: 300,
  DEBOUNCE_DELAY: 300,
};

/**
 * Animation durations
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

/**
 * Z-index layers for proper stacking
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 2000,
  TOAST: 3000,
  TOOLTIP: 4000,
};

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
};

/**
 * Maximum string lengths for validation
 */
export const MAX_LENGTHS = {
  MOOD: 100,
  NOTE: 1000,
  GENERAL_TEXT: 500,
};

/**
 * Date range options
 */
export const DATE_RANGES = {
  WEEK: 7,
  TWO_WEEKS: 14,
  MONTH: 30,
  QUARTER: 90,
};

/**
 * Storage quota thresholds (in percentage)
 */
export const STORAGE_THRESHOLDS = {
  WARNING: 80,
  CRITICAL: 95,
};

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
};

/**
 * Chart colors
 */
export const CHART_COLORS = {
  PRIMARY: '#4f46e5',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6',
  NEUTRAL: '#6b7280',
};
