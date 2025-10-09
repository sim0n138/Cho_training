import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Dashboard.css';

function Dashboard() {
  return (
    <Layout>
      <section className="summary-section">
        <h2>Welcome to Cho_training</h2>
        <p>Your personal training tracker</p>
      </section>

      <section className="quick-access">
        <Card>
          <h3>Current Status</h3>
          <p>
            Track your wellbeing and get personalized workout recommendations
          </p>
          <Link to="/log">
            <Button variant="primary">Log Your Wellbeing</Button>
          </Link>
        </Card>

        <Card>
          <h3>Today&apos;s Training</h3>
          <p>No training scheduled yet</p>
        </Card>

        <Card>
          <h3>Quick Stats</h3>
          <p>View your progress and statistics</p>
          <Link to="/stats">
            <Button variant="secondary">View Statistics</Button>
          </Link>
        </Card>
      </section>
    </Layout>
  );
}

export default Dashboard;
