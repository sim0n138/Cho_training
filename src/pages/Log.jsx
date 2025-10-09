import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    fullBody: false
  });

  const handleMusclePainChange = (e) => {
    setMusclePain({
      ...musclePain,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect selected muscle pain areas
    const selectedMusclePain = Object.keys(musclePain)
      .filter(key => musclePain[key])
      .map(key => {
        const labels = {
          legs: 'Ноги',
          back: 'Спина',
          arms: 'Руки',
          chest: 'Грудь',
          fullBody: 'Всё тело'
        };
        return labels[key];
      });

    // Create log entry
    const logEntry = {
      date: new Date().toISOString(),
      sleepQuality: parseInt(sleepQuality),
      energyLevel: parseInt(energyLevel),
      mood,
      musclePain: selectedMusclePain
    };

    // Get existing logs from localStorage
    const existingLogs = JSON.parse(localStorage.getItem('training_logs') || '[]');
    
    // Add new log to array
    existingLogs.push(logEntry);
    
    // Save back to localStorage
    localStorage.setItem('training_logs', JSON.stringify(existingLogs));
    
    // Navigate to dashboard
    navigate('/');
  };

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
          
          <form onSubmit={handleSubmit} className="wellbeing-form">
            <div className="form-group">
              <label className="form-label">Качество сна</label>
              <div className="radio-group">
                {[1, 2, 3, 4, 5].map(value => (
                  <label key={value} className="radio-option">
                    <input
                      type="radio"
                      name="sleepQuality"
                      value={value}
                      checked={sleepQuality === String(value)}
                      onChange={(e) => setSleepQuality(e.target.value)}
                    />
                    <span className="radio-label">{value}</span>
                  </label>
                ))}
              </div>
              <div className="scale-labels">
                <span>Плохо</span>
                <span>Отлично</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Уровень энергии</label>
              <div className="radio-group">
                {[1, 2, 3, 4, 5].map(value => (
                  <label key={value} className="radio-option">
                    <input
                      type="radio"
                      name="energyLevel"
                      value={value}
                      checked={energyLevel === String(value)}
                      onChange={(e) => setEnergyLevel(e.target.value)}
                    />
                    <span className="radio-label">{value}</span>
                  </label>
                ))}
              </div>
              <div className="scale-labels">
                <span>Низкий</span>
                <span>Высокий</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mood">Настроение</label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="form-select"
              >
                <option value="Отличное">Отличное</option>
                <option value="Хорошее">Хорошее</option>
                <option value="Нормальное">Нормальное</option>
                <option value="Плохое">Плохое</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Мышечная боль (крепатура)</label>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="legs"
                    checked={musclePain.legs}
                    onChange={handleMusclePainChange}
                  />
                  <span>Ноги</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="back"
                    checked={musclePain.back}
                    onChange={handleMusclePainChange}
                  />
                  <span>Спина</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="arms"
                    checked={musclePain.arms}
                    onChange={handleMusclePainChange}
                  />
                  <span>Руки</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="chest"
                    checked={musclePain.chest}
                    onChange={handleMusclePainChange}
                  />
                  <span>Грудь</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="fullBody"
                    checked={musclePain.fullBody}
                    onChange={handleMusclePainChange}
                  />
                  <span>Всё тело</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-submit">
              Сохранить
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Log;
