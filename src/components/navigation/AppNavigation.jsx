import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from '../../i18n/useTranslation.js';
import './AppNavigation.css';

/**
 * AppNavigation component - Modern navigation bar
 * Displays icons with text on desktop, icons only on mobile
 */
function AppNavigation({ className = '' }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      path: '/',
      label: t('nav.dashboard'),
      icon: '📊',
      ariaLabel: t('nav.dashboard'),
    },
    {
      path: '/log',
      label: t('nav.log'),
      icon: '📝',
      ariaLabel: t('nav.log'),
    },
    {
      path: '/program',
      label: t('nav.program'),
      icon: '💪',
      ariaLabel: t('nav.program'),
    },
    {
      path: '/stats',
      label: t('nav.stats'),
      icon: '📈',
      ariaLabel: t('nav.stats'),
    },
    {
      path: '/profile',
      label: t('nav.profile'),
      icon: '👤',
      ariaLabel: t('nav.profile'),
    },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`app-navigation ${className}`.trim()}
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          aria-current={isActive(item.path) ? 'page' : undefined}
          aria-label={item.ariaLabel}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

AppNavigation.propTypes = {
  className: PropTypes.string,
};

export default AppNavigation;
