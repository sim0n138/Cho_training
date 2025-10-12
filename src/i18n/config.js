/**
 * i18n configuration for the application
 */

export const SUPPORTED_LANGUAGES = {
  RU: 'ru',
  EN: 'en',
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.RU;

export const LANGUAGE_NAMES = {
  [SUPPORTED_LANGUAGES.RU]: 'Русский',
  [SUPPORTED_LANGUAGES.EN]: 'English',
};

/**
 * Get the current language from localStorage or use default
 * @returns {string} - Current language code
 */
export const getCurrentLanguage = () => {
  try {
    const stored = localStorage.getItem('app_language');
    if (stored && Object.values(SUPPORTED_LANGUAGES).includes(stored)) {
      return stored;
    }
  } catch (e) {
    console.error('Error reading language from localStorage:', e);
  }
  return DEFAULT_LANGUAGE;
};

/**
 * Save the current language to localStorage
 * @param {string} lang - Language code to save
 */
export const setCurrentLanguage = (lang) => {
  try {
    if (Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
      localStorage.setItem('app_language', lang);
    }
  } catch (e) {
    console.error('Error saving language to localStorage:', e);
  }
};
