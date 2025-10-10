import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Stats from './pages/Stats';
import Program from './pages/Program';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<Log />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/program" element={<Program />} />
      </Routes>
    </Router>
  );
}

export default App;
