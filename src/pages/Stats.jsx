import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useWellbeingData from '../hooks/useWellbeingData';
import './Stats.css';

function Stats() {
  const { logs, stats } = useWellbeingData();

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

  // Calculate muscle pain distribution
  const musclePainData = logs.reduce((acc, log) => {
    if (log.musclePain && log.musclePain.length > 0) {
      log.musclePain.forEach((pain) => {
        acc[pain] = (acc[pain] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const musclePainChartData = Object.entries(musclePainData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];

  return (
    <Layout>
      <div className="stats-container">
        <h2>Your Statistics</h2>
        <p className="description">
          Track your progress and analyze your training data
        </p>

        {logs.length === 0 ? (
          <div className="no-data">
            <div className="empty-state-icon">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M40 60 L55 75 L80 45"
                  stroke="var(--color-primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <h3>Начните отслеживать своё самочувствие</h3>
            <p className="note">
              Ваша статистика появится здесь, как только вы добавите первую
              запись о самочувствии
            </p>
            <Link to="/log">
              <Button variant="primary">Добавить первую запись</Button>
            </Link>
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
                      <defs>
                        <linearGradient
                          id="colorSleep"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4caf50"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4caf50"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorEnergy"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2196f3"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2196f3"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
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
                        fill="url(#colorSleep)"
                      />
                      <Line
                        type="monotone"
                        dataKey="Уровень энергии"
                        stroke="#2196f3"
                        strokeWidth={2}
                        fill="url(#colorEnergy)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {moodChartData.length > 0 && (
                  <Card>
                    <h3>Распределение настроения</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={moodChartData}>
                        <defs>
                          <linearGradient
                            id="colorMood"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#4caf50"
                              stopOpacity={0.9}
                            />
                            <stop
                              offset="95%"
                              stopColor="#4caf50"
                              stopOpacity={0.6}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mood" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="url(#colorMood)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {musclePainChartData.length > 0 && (
                  <Card>
                    <h3>Распределение мышечной боли</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={musclePainChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {musclePainChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
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
