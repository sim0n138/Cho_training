import PropTypes from 'prop-types';
import './ExerciseDetails.css';

/**
 * ExerciseDetails modal - Shows detailed information about an exercise
 * @param {Object} props - Component props
 * @param {Object} props.exercise - Exercise object
 * @param {Function} props.onClose - Close callback
 */
function ExerciseDetails({ exercise, onClose }) {
  if (!exercise) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTypeLabel = (id) => {
    if (id.startsWith('s')) return 'Растяжка';
    if (id.startsWith('l')) return 'ЛФК';
    if (id.startsWith('m')) return 'Медитация';
    return 'Упражнение';
  };

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Начальный',
      2: 'Средний',
      3: 'Продвинутый',
    };
    return labels[level] || 'Неизвестно';
  };

  const getAreaLabels = (areas) => {
    const areaNames = {
      legs: 'Ноги',
      back: 'Спина',
      arms: 'Руки',
      chest: 'Грудь',
      neck: 'Шея',
      core: 'Корпус',
      shoulders: 'Плечи',
      hips: 'Бедра',
    };
    return areas.map((area) => areaNames[area] || area);
  };

  return (
    <div className="exercise-details-backdrop" onClick={handleBackdropClick}>
      <div
        className="exercise-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-title"
      >
        <button className="close-button" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        <div className="exercise-details-header">
          <span className="exercise-type-badge">
            {getTypeLabel(exercise.id)}
          </span>
          <h2 id="exercise-title" className="exercise-title">
            {exercise.name}
          </h2>
        </div>

        <div className="exercise-details-content">
          <div className="exercise-info-grid">
            <div className="info-item">
              <span className="info-label">Длительность</span>
              <span className="info-value">{exercise.duration} мин</span>
            </div>
            <div className="info-item">
              <span className="info-label">Уровень</span>
              <span className="info-value">
                {getLevelLabel(exercise.level)}
              </span>
            </div>
          </div>

          <div className="exercise-areas">
            <span className="areas-label">Задействованные области:</span>
            <div className="area-tags">
              {getAreaLabels(exercise.areas).map((area, idx) => (
                <span key={idx} className="area-tag">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {exercise.description && (
            <div className="exercise-description">
              <h3>Описание</h3>
              <p>{exercise.description}</p>
            </div>
          )}
        </div>

        <div className="exercise-details-footer">
          <button className="close-footer-button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

ExerciseDetails.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    areas: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ExerciseDetails;
