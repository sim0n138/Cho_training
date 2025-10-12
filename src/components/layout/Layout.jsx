import PropTypes from 'prop-types';
import { AppNavigation, Breadcrumbs } from '../navigation';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header" role="banner">
        <div className="header-content">
          <h1>Cho Training</h1>
          <ThemeSwitcher />
        </div>
      </header>

      <AppNavigation />
      <Breadcrumbs />

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
