import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import './Log.css';

function Log() {
  const navigate = useNavigate();

  const [sleepQuality, setSleepQuality] = useState('3');
  const [energyLevel, setEnergyLevel] = useState('3');
  const [mood, setMood] = useState('Нормальное');
  const [musclePain, setMusclePain] = useState({
    legs: false,
    back: false,
    arms: false,
    chest: false,
    fullBody: false,
  });
  const [errors, setErrors] = useState({});

  const handleMusclePainChange = (e) => {
    setMusclePain({
      ...musclePain,
      [e.target.name]: e.target.checked,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!sleepQuality) {
      newErrors.sleepQuality = 'Пожалуйста, выберите качество сна';
    }

    if (!energyLevel) {
      newErrors.energyLevel = 'Пожалуйста, выберите уровень энергии';
    }

    if (!mood) {
      newErrors.mood = 'Пожалуйста, выберите настроение';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Collect selected muscle pain areas
    const selectedMusclePain = Object.keys(musclePain)
      .filter((key) => musclePain[key])
      .map((key) => {
        const labels = {
          legs: 'Ноги',
          back: 'Спина',
          arms: 'Руки',
          chest: 'Грудь',
          fullBody: 'Всё тело',
        };
        return labels[key];
      });

    // Create log entry
    const logEntry = {
      date: new Date().toISOString(),
      sleepQuality: parseInt(sleepQuality),
      energyLevel: parseInt(energyLevel),
      mood,
      musclePain: selectedMusclePain,
    };

    // Get existing logs from localStorage
    const existingLogs = JSON.parse(
      localStorage.getItem('training_logs') || '[]'
    );

    // Add new log to array
    existingLogs.push(logEntry);

    // Save back to localStorage
    localStorage.setItem('training_logs', JSON.stringify(existingLogs));

    // Navigate to dashboard
    navigate('/');
  };

  return (
    <Layout>
      <div className="content-wrapper">
        <h2>Log Your Wellbeing</h2>
        <p className="description">
          Track your daily wellbeing to get personalized training
          recommendations
        </p>

        <form onSubmit={handleSubmit} className="wellbeing-form">
          <div className="form-group">
            <label className="form-label">Качество сна</label>
            <div
              className="radio-group"
              role="radiogroup"
              aria-label="Качество сна"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="radio-option">
                  <input
                    type="radio"
                    name="sleepQuality"
                    value={value}
                    checked={sleepQuality === String(value)}
                    onChange={(e) => setSleepQuality(e.target.value)}
                    aria-label={`Качество сна ${value}`}
                  />
                  <span className="radio-label">{value}</span>
                </label>
              ))}
            </div>
            <div className="scale-labels">
              <span>Плохо</span>
              <span>Отлично</span>
            </div>
            {errors.sleepQuality && (
              <span className="error-message" role="alert">
                {errors.sleepQuality}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Уровень энергии</label>
            <div
              className="radio-group"
              role="radiogroup"
              aria-label="Уровень энергии"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="radio-option">
                  <input
                    type="radio"
                    name="energyLevel"
                    value={value}
                    checked={energyLevel === String(value)}
                    onChange={(e) => setEnergyLevel(e.target.value)}
                    aria-label={`Уровень энергии ${value}`}
                  />
                  <span className="radio-label">{value}</span>
                </label>
              ))}
            </div>
            <div className="scale-labels">
              <span>Низкий</span>
              <span>Высокий</span>
            </div>
            {errors.energyLevel && (
              <span className="error-message" role="alert">
                {errors.energyLevel}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mood">
              Настроение
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="form-select"
              aria-label="Настроение"
            >
              <option value="Отличное">Отличное</option>
              <option value="Хорошее">Хорошее</option>
              <option value="Нормальное">Нормальное</option>
              <option value="Плохое">Плохое</option>
            </select>
            {errors.mood && (
              <span className="error-message" role="alert">
                {errors.mood}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Мышечная боль (крепатура)</label>
            <div
              className="checkbox-group"
              role="group"
              aria-label="Мышечная боль"
            >
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="legs"
                  checked={musclePain.legs}
                  onChange={handleMusclePainChange}
                  aria-label="Ноги"
                />
                <span>Ноги</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="back"
                  checked={musclePain.back}
                  onChange={handleMusclePainChange}
                  aria-label="Спина"
                />
                <span>Спина</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="arms"
                  checked={musclePain.arms}
                  onChange={handleMusclePainChange}
                  aria-label="Руки"
                />
                <span>Руки</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="chest"
                  checked={musclePain.chest}
                  onChange={handleMusclePainChange}
                  aria-label="Грудь"
                />
                <span>Грудь</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="fullBody"
                  checked={musclePain.fullBody}
                  onChange={handleMusclePainChange}
                  aria-label="Всё тело"
                />
                <span>Всё тело</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="submit">
            Сохранить
          </Button>
        </form>
      </div>
    </Layout>
  );
}

export default Log;
