/**
 * Export i18n utilities
 */
export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES,
  getCurrentLanguage,
  setCurrentLanguage,
} from './config.js';

export { useTranslation, changeLanguage } from './useTranslation.js';

export { default as translations } from './translations/index.js';
