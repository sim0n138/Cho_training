/**
 * Hook for using translations in components
 */
import { useState, useEffect, useCallback } from 'react';
import { getCurrentLanguage, setCurrentLanguage } from './config.js';
import translations from './translations/index.js';

// Global state for language
let currentLanguage = getCurrentLanguage();
const listeners = new Set();

/**
 * Notify all listeners about language change
 */
const notifyListeners = () => {
  listeners.forEach((listener) => listener(currentLanguage));
};

/**
 * Change the application language
 * @param {string} lang - Language code
 */
export const changeLanguage = (lang) => {
  if (currentLanguage !== lang && translations[lang]) {
    currentLanguage = lang;
    setCurrentLanguage(lang);
    notifyListeners();
  }
};

/**
 * Get translation by key path
 * @param {Object} obj - Translation object
 * @param {string} path - Dot-separated path
 * @returns {string} - Translation or key if not found
 */
const getNestedTranslation = (obj, path) => {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return key if translation not found
    }
  }

  return typeof current === 'string' ? current : path;
};

/**
 * Hook to use translations
 * @returns {Object} - Object with t function and current language
 */
export const useTranslation = () => {
  const [language, setLanguage] = useState(currentLanguage);

  useEffect(() => {
    const listener = (newLang) => setLanguage(newLang);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  /**
   * Translate a key
   * @param {string} key - Translation key (e.g., 'nav.dashboard')
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} - Translated string
   */
  const t = useCallback(
    (key, params = {}) => {
      const translation = getNestedTranslation(
        translations[language] || translations.ru,
        key
      );

      // Simple parameter interpolation
      if (typeof translation === 'string' && Object.keys(params).length > 0) {
        return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? params[paramKey] : match;
        });
      }

      return translation;
    },
    [language]
  );

  return {
    t,
    language,
    changeLanguage,
  };
};

export default useTranslation;
