import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './AppNavigation.css';

/**
 * AppNavigation component - Modern navigation bar
 * Displays icons with text on desktop, icons only on mobile
 */
function AppNavigation({ className = '' }) {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Дашборд',
      icon: '📊',
      ariaLabel: 'Dashboard',
    },
    {
      path: '/log',
      label: 'Журнал',
      icon: '📝',
      ariaLabel: 'Log Wellbeing',
    },
    {
      path: '/program',
      label: 'Тренировки',
      icon: '💪',
      ariaLabel: 'Workout Program',
    },
    {
      path: '/stats',
      label: 'Статистика',
      icon: '📈',
      ariaLabel: 'Statistics',
    },
    {
      path: '/profile',
      label: 'Профиль',
      icon: '👤',
      ariaLabel: 'Profile',
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
