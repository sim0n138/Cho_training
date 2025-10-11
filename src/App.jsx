import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load страниц для уменьшения размера бандла
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Log = lazy(() => import('./pages/Log'));
const Stats = lazy(() => import('./pages/Stats'));
const Program = lazy(() => import('./pages/Program'));

// Компонент для отображения во время загрузки
function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загрузка...</p>
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
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
