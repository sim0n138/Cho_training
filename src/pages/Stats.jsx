import { Link } from 'react-router-dom';
import './Stats.css';

function Stats() {
  return (
    <div className="stats-page">
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
          <h2>Your Statistics</h2>
          <p className="description">
            Track your progress and analyze your training data
          </p>
          
          <div className="placeholder">
            <p>Statistics and charts will be displayed here</p>
            <p className="note">Coming soon: Energy level trends, workout frequency, and progress tracking</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Stats;
