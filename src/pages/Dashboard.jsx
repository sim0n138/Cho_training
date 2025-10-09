import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <header className="header">
        <h1>Cho_training</h1>
      </header>
      
      <nav className="navigation">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/log" className="nav-link">Log Wellbeing</Link>
        <Link to="/stats" className="nav-link">Statistics</Link>
      </nav>

      <main className="main-content">
        <section className="summary-section">
          <h2>Welcome to Cho_training</h2>
          <p>Your personal training tracker</p>
        </section>

        <section className="quick-access">
          <div className="card">
            <h3>Current Status</h3>
            <p>Track your wellbeing and get personalized workout recommendations</p>
            <Link to="/log" className="btn-primary">Log Your Wellbeing</Link>
          </div>

          <div className="card">
            <h3>Today's Training</h3>
            <p>No training scheduled yet</p>
          </div>

          <div className="card">
            <h3>Quick Stats</h3>
            <p>View your progress and statistics</p>
            <Link to="/stats" className="btn-secondary">View Statistics</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
