import { useTranslation, SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '../i18n';
import './LanguageSwitcher.css';

/**
 * LanguageSwitcher component - Allows users to switch between languages
 */
function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`lang-button ${language === lang ? 'active' : ''}`}
          aria-label={`Switch to ${LANGUAGE_NAMES[lang]}`}
          aria-pressed={language === lang}
        >
          {LANGUAGE_NAMES[lang]}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
