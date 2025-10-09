import { Link } from 'react-router-dom';
import './Log.css';

function Log() {
  return (
    <div className="log-page">
      <header className="header">
        <h1>Cho_training</h1>
      </header>
      
      <nav className="navigation">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/log" className="nav-link">Log Wellbeing</Link>
        <Link to="/stats" className="nav-link">Statistics</Link>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">
          <h2>Log Your Wellbeing</h2>
          <p className="description">
            Track your daily wellbeing to get personalized training recommendations
          </p>
          
          <div className="placeholder">
            <p>Wellbeing logging form will be implemented here</p>
            <p className="note">Coming soon: Sleep quality, energy level, mood, and muscle soreness tracking</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Log;
