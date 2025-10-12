import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Breadcrumbs.css';

/**
 * Breadcrumbs component - Shows navigation path
 */
function Breadcrumbs({ className = '' }) {
  const location = useLocation();

  // Route name mapping
  const routeNames = {
    '/': 'Главная',
    '/log': 'Журнал',
    '/program': 'Тренировки',
    '/stats': 'Статистика',
    '/profile': 'Профиль',
  };

  // Generate breadcrumb items from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = [{ path: '/', name: routeNames['/'] }];

  // Build breadcrumb trail
  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = routeNames[currentPath] || segment;
    breadcrumbs.push({ path: currentPath, name });
  });

  // Don't show breadcrumbs if on home page
  if (breadcrumbs.length === 1) {
    return null;
  }

  return (
    <nav className={`breadcrumbs ${className}`.trim()} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={crumb.path} className="breadcrumb-item">
              {!isLast ? (
                <>
                  <Link to={crumb.path} className="breadcrumb-link">
                    {crumb.name}
                  </Link>
                  <span className="breadcrumb-separator">/</span>
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {crumb.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  className: PropTypes.string,
};

export default Breadcrumbs;
