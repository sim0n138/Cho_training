import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <header className="header" role="banner">
        <h1>Cho_training</h1>
      </header>

      <nav
        className="navigation"
        role="navigation"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          Dashboard
        </Link>
        <Link
          to="/log"
          className={`nav-link ${isActive('/log') ? 'active' : ''}`}
          aria-current={isActive('/log') ? 'page' : undefined}
        >
          Log Wellbeing
        </Link>
        <Link
          to="/stats"
          className={`nav-link ${isActive('/stats') ? 'active' : ''}`}
          aria-current={isActive('/stats') ? 'page' : undefined}
        >
          Statistics
        </Link>
      </nav>

      <main className="main-content" role="main">
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
