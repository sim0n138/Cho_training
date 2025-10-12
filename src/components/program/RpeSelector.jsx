import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import './RpeSelector.css';

/**
 * Modal component for selecting RPE (Rate of Perceived Exertion)
 * @param {Object} props - Component props
 * @param {number} props.currentRpe - Current RPE value
 * @param {Function} props.onSave - Callback when RPE is saved
 * @param {Function} props.onClose - Callback when modal is closed
 */
function RpeSelector({ currentRpe, onSave, onClose, recommendations }) {
  const [selectedRpe, setSelectedRpe] = useState(currentRpe);

  const handleSave = () => {
    onSave(selectedRpe);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rpe-modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 id="rpe-modal-title">Выберите уровень нагрузки (RPE)</h2>

        {recommendations && recommendations.message && (
          <div className="wellbeing-recommendations">
            <p className="recommendation-message">
              💡 Рекомендация на основе вашего самочувствия:
            </p>
            <p className="recommendation-rpe">
              Рекомендованная нагрузка:{' '}
              <strong>{recommendations.suggestedRPE}</strong>/10
            </p>
            <p className="recommendation-reason">{recommendations.message}</p>
          </div>
        )}

        <div className="rpe-scale">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <button
              key={value}
              className={`rpe-button ${selectedRpe === value ? 'selected' : ''}`}
              onClick={() => setSelectedRpe(value)}
              aria-label={`RPE ${value}`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="rpe-description">
          <p>
            <strong>1-3:</strong> Очень легко, восстановление
          </p>
          <p>
            <strong>4-6:</strong> Умеренно, комфортная нагрузка
          </p>
          <p>
            <strong>7-8:</strong> Тяжело, интенсивная работа
          </p>
          <p>
            <strong>9-10:</strong> Максимально, предельные усилия
          </p>
        </div>
        <div className="modal-actions">
          <Button onClick={handleSave} variant="primary">
            Сохранить
          </Button>
          <Button onClick={onClose} variant="secondary">
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}

RpeSelector.propTypes = {
  currentRpe: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  recommendations: PropTypes.shape({
    suggestedRPE: PropTypes.number,
    message: PropTypes.string,
    painAreas: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default RpeSelector;
