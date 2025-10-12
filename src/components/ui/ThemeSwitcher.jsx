import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ThemeSwitcher.css';

/**
 * ThemeSwitcher component - Toggles between light and dark themes
 */
function ThemeSwitcher({ className = '' }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      className={`theme-switcher ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className="theme-switcher-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="theme-switcher-text">
        {theme === 'light' ? 'Темная' : 'Светлая'}
      </span>
    </button>
  );
}

ThemeSwitcher.propTypes = {
  className: PropTypes.string,
};

export default ThemeSwitcher;
