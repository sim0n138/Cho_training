import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import './Stats.css';

function Stats() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    avgSleep: 0,
    avgEnergy: 0,
    logsThisWeek: 0,
  });

  useEffect(() => {
    const storedLogs = JSON.parse(
      localStorage.getItem('training_logs') || '[]'
    );
    setLogs(storedLogs);

    if (storedLogs.length > 0) {
      const totalLogs = storedLogs.length;
      const avgSleep =
        storedLogs.reduce((sum, log) => sum + log.sleepQuality, 0) / totalLogs;
      const avgEnergy =
        storedLogs.reduce((sum, log) => sum + log.energyLevel, 0) / totalLogs;

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const logsThisWeek = storedLogs.filter(
        (log) => new Date(log.date) >= oneWeekAgo
      ).length;

      setStats({
        totalLogs,
        avgSleep: avgSleep.toFixed(1),
        avgEnergy: avgEnergy.toFixed(1),
        logsThisWeek,
      });
    }
  }, []);

  const chartData = logs.slice(-7).map((log) => ({
    date: new Date(log.date).toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
    }),
    'Качество сна': log.sleepQuality,
    'Уровень энергии': log.energyLevel,
  }));

  const moodData = logs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {});

  const moodChartData = Object.entries(moodData).map(([mood, count]) => ({
    mood,
    count,
  }));

  return (
    <Layout>
      <div className="stats-container">
        <h2>Your Statistics</h2>
        <p className="description">
          Track your progress and analyze your training data
        </p>

        {logs.length === 0 ? (
          <div className="no-data">
            <p>Нет данных для отображения</p>
            <p className="note">
              Начните логировать своё самочувствие, чтобы увидеть статистику
            </p>
          </div>
        ) : (
          <>
            <section
              className="stats-overview"
              role="region"
              aria-label="Обзор статистики"
            >
              <Card>
                <h3>Всего записей</h3>
                <p className="stat-value">{stats.totalLogs}</p>
              </Card>
              <Card>
                <h3>Записей за неделю</h3>
                <p className="stat-value">{stats.logsThisWeek}</p>
              </Card>
              <Card>
                <h3>Ср. качество сна</h3>
                <p className="stat-value">{stats.avgSleep}</p>
              </Card>
              <Card>
                <h3>Ср. уровень энергии</h3>
                <p className="stat-value">{stats.avgEnergy}</p>
              </Card>
            </section>

            {chartData.length > 0 && (
              <section
                className="charts-section"
                role="region"
                aria-label="Графики"
              >
                <Card>
                  <h3>Динамика за последние 7 дней</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Качество сна"
                        stroke="#4caf50"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="Уровень энергии"
                        stroke="#2196f3"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {moodChartData.length > 0 && (
                  <Card>
                    <h3>Распределение настроения</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={moodChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mood" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#4caf50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Stats;
