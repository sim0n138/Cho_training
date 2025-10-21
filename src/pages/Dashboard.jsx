/**
 * Dashboard page component
 * Main landing page showing current status, workout recommendations, and data management
 */
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from '../components/ui/Toast';
import { useWellbeing } from '../contexts/WellbeingContext';
import recommendationService from '../services/recommendationService';
import exportService from '../services/exportService';
import './Dashboard.css';

/**
 * Dashboard component - main hub for the application
 * Displays current wellbeing status, workout recommendations, and data management tools
 */
function Dashboard() {
  const { latestLog, importLogs, getStats } = useWellbeing();
  const stats = getStats();
  const [greeting, setGreeting] = useState('');
  const [recommendation, setRecommendation] = useState(null);
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
      toast.success('Данные успешно экспортированы');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Не удалось экспортировать данные');
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

    const loadingToast = toast.loading('Импорт данных...');

    try {
      const result = await exportService.importLogsFromFile(file, true);
      toast.dismiss(loadingToast);

      if (result.success) {
        // Import logs using context (no page reload needed!)
        importLogs(result.logs, true);
        toast.success(result.message || 'Данные успешно импортированы');
      } else {
        toast.error(result.message || 'Не удалось импортировать данные');
      }
    } catch (err) {
      console.error('Import failed:', err);
      toast.dismiss(loadingToast);
      toast.error('Ошибка при импорте данных');
    }

    // Clear input
    event.target.value = '';
  };

  return (
    <Layout>
      <section className="hero-section">
        <Card variant="gradient" hoverable={false}>
          <h2 className="hero-title">{greeting}</h2>
          <p className="hero-subtitle">
            Ваш персональный трекер здоровья и тренировок
          </p>
        </Card>
      </section>

      {recommendation && (
        <section className="recommendations-section">
          <Card variant="info">
            <h3>🎯 Рекомендации на сегодня</h3>
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
          </Card>
        </section>
      )}

      <section className="quick-actions">
        <h3 className="section-title">Быстрые действия</h3>
        <div className="actions-grid">
          <Card>
            <div className="action-icon">📝</div>
            <h4>Записать самочувствие</h4>
            <p>Отследите качество сна, энергию и настроение</p>
            <Link to="/log">
              <Button variant="primary">
                {latestLog ? 'Добавить запись' : 'Начать отслеживание'}
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="action-icon">💪</div>
            <h4>Создать программу</h4>
            <p>Сгенерируйте персональную тренировку</p>
            <Link to="/program">
              <Button variant="primary">Создать</Button>
            </Link>
          </Card>

          <Card>
            <div className="action-icon">📈</div>
            <h4>Посмотреть статистику</h4>
            <p>Анализируйте свой прогресс</p>
            <Link to="/stats">
              <Button variant="secondary">Статистика</Button>
            </Link>
          </Card>
        </div>
      </section>

      <section className="status-section">
        <h3 className="section-title">Текущее состояние</h3>
        {latestLog ? (
          <Card>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-icon">😴</span>
                <div className="status-details">
                  <span className="status-label">Качество сна</span>
                  <span className="status-value">
                    {latestLog.sleepQuality}/5
                  </span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">⚡</span>
                <div className="status-details">
                  <span className="status-label">Уровень энергии</span>
                  <span className="status-value">
                    {latestLog.energyLevel}/5
                  </span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">😊</span>
                <div className="status-details">
                  <span className="status-label">Настроение</span>
                  <span className="status-value">{latestLog.mood}</span>
                </div>
              </div>
              {latestLog.musclePain && latestLog.musclePain.length > 0 && (
                <div className="status-item">
                  <span className="status-icon">🩹</span>
                  <div className="status-details">
                    <span className="status-label">Мышечная боль</span>
                    <span className="status-value">
                      {latestLog.musclePain.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="last-update">
              Последняя запись:{' '}
              {new Date(latestLog.date).toLocaleDateString('ru-RU')}
            </p>
          </Card>
        ) : (
          <Card>
            <div className="empty-status">
              <p>
                Начните отслеживать своё самочувствие для получения
                персонализированных рекомендаций
              </p>
              <Link to="/log">
                <Button variant="primary">Начать отслеживание</Button>
              </Link>
            </div>
          </Card>
        )}
      </section>

      <section className="data-section">
        <h3 className="section-title">Управление данными</h3>
        <Card>
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
