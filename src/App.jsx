import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { useTranslation } from './i18n/useTranslation.js';
import './App.css';

// Lazy load страниц для уменьшения размера бандла
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Log = lazy(() => import('./pages/Log'));
const Stats = lazy(() => import('./pages/Stats'));
const Program = lazy(() => import('./pages/Program'));
const Profile = lazy(() => import('./pages/Profile'));

// Компонент для отображения во время загрузки
function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{t('common.loading')}</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<Log />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/program" element={<Program />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
