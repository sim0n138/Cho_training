/**
 * Dashboard page component
 * Main landing page showing current status, workout recommendations, and data management
 */
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useWellbeingData from '../hooks/useWellbeingData';
import recommendationService from '../services/recommendationService';
import exportService from '../services/exportService';
import './Dashboard.css';

/**
 * Dashboard component - main hub for the application
 * Displays current wellbeing status, workout recommendations, and data management tools
 */
function Dashboard() {
  const { latestLog, stats } = useWellbeingData();
  const [greeting, setGreeting] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    // Get workout recommendation based on latest log
    const rec = recommendationService.getRecommendation(latestLog);
    setRecommendation(rec);
  }, [latestLog]);

  /**
   * Handle export of all training logs to JSON file
   */
  const handleExport = () => {
    try {
      exportService.downloadLogsAsJSON();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Не удалось экспортировать данные');
    }
  };

  /**
   * Trigger file input click for import
   */
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle import of training logs from JSON file
   * @param {Event} event - File input change event
   */
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await exportService.importLogsFromFile(file, true);
      if (result.success) {
        setImportStatus({
          type: 'success',
          message: result.message,
        });
        // Reload page to update data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setImportStatus({
          type: 'error',
          message: result.message,
        });
      }
    } catch (err) {
      console.error('Import failed:', err);
      setImportStatus({
        type: 'error',
        message: 'Ошибка при импорте данных',
      });
    }

    // Clear input
    event.target.value = '';
  };

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
          {recommendation && (
            <div className="recommendation">
              <div
                className={`intensity-badge intensity-${recommendation.intensity}`}
              >
                {recommendation.intensity === 'low' && 'Низкая интенсивность'}
                {recommendation.intensity === 'moderate' &&
                  'Средняя интенсивность'}
                {recommendation.intensity === 'high' && 'Высокая интенсивность'}
                {recommendation.intensity === 'none' && 'Отдых'}
              </div>
              <h4>{recommendation.title}</h4>
              <p>{recommendation.description}</p>
              {recommendation.activities && (
                <div className="activities-list">
                  <strong>Рекомендуемые активности:</strong>
                  <ul>
                    {recommendation.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
              )}
              {stats.logsThisWeek > 0 && (
                <p className="motivation">
                  💪{' '}
                  {recommendationService.getMotivationMessage(
                    stats.logsThisWeek
                  )}
                </p>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h3>Quick Stats</h3>
          <p>View your progress and statistics</p>
          <Link to="/stats">
            <Button variant="secondary">View Statistics</Button>
          </Link>
        </Card>
      </section>

      <section className="data-management">
        <Card>
          <h3>📦 Управление данными</h3>
          <p>Экспортируйте и импортируйте свои данные о тренировках</p>
          <div className="data-actions">
            <Button onClick={handleExport} variant="outline">
              💾 Экспорт данных
            </Button>
            <Button onClick={handleImportClick} variant="outline">
              📥 Импорт данных
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>
          {importStatus && (
            <div
              className={`import-status ${importStatus.type === 'success' ? 'success' : 'error'}`}
            >
              {importStatus.message}
            </div>
          )}
          <p className="data-info">
            💡 Экспорт создаст JSON файл со всеми вашими записями. Импорт
            объединит данные с существующими.
          </p>
        </Card>
      </section>
    </Layout>
  );
}

export default Dashboard;
