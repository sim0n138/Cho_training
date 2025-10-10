import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Dashboard.css';

function Dashboard() {
  const [latestLog, setLatestLog] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Get latest log from localStorage
    const logs = JSON.parse(localStorage.getItem('training_logs') || '[]');
    if (logs.length > 0) {
      setLatestLog(logs[logs.length - 1]);
    }

    // Set dynamic greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Доброе утро!');
    } else if (hour < 18) {
      setGreeting('Добрый день!');
    } else {
      setGreeting('Добрый вечер!');
    }
  }, []);

  return (
    <Layout>
      <section className="summary-section">
        <h2>{greeting}</h2>
        <p>Your personal training tracker</p>
      </section>

      <section className="quick-access">
        <Card>
          <h3>Current Status</h3>
          {latestLog ? (
            <div className="status-summary">
              <p className="status-item">
                <strong>Качество сна:</strong> {latestLog.sleepQuality}/5
              </p>
              <p className="status-item">
                <strong>Уровень энергии:</strong> {latestLog.energyLevel}/5
              </p>
              <p className="status-item">
                <strong>Настроение:</strong> {latestLog.mood}
              </p>
              {latestLog.musclePain && latestLog.musclePain.length > 0 && (
                <p className="status-item">
                  <strong>Мышечная боль:</strong>{' '}
                  {latestLog.musclePain.join(', ')}
                </p>
              )}
              <p className="last-update">
                Последняя запись:{' '}
                {new Date(latestLog.date).toLocaleDateString('ru-RU')}
              </p>
            </div>
          ) : (
            <div className="empty-status">
              <p>
                Начните отслеживать своё самочувствие для получения
                персонализированных рекомендаций
              </p>
            </div>
          )}
          <Link to="/log">
            <Button variant="primary">
              {latestLog ? 'Добавить запись' : 'Начать отслеживание'}
            </Button>
          </Link>
        </Card>

        <Card>
          <h3>Тренировка на сегодня</h3>
          <p>Скоро здесь появятся персонализированные рекомендации</p>
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
