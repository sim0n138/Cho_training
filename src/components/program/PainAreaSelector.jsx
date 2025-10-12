import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import './PainAreaSelector.css';

/**
 * Modal component for selecting pain areas
 * @param {Object} props - Component props
 * @param {Array} props.currentPainAreas - Currently selected pain areas
 * @param {Function} props.onSave - Callback when pain areas are saved
 * @param {Function} props.onClose - Callback when modal is closed
 */
function PainAreaSelector({ currentPainAreas, onSave, onClose }) {
  const [selectedAreas, setSelectedAreas] = useState([...currentPainAreas]);

  const painOptions = ['Ноги', 'Спина', 'Руки', 'Грудь', 'Всё тело'];

  const toggleArea = (area) => {
    setSelectedAreas((prev) => {
      if (prev.includes(area)) {
        return prev.filter((a) => a !== area);
      }
      return [...prev, area];
    });
  };

  const handleSave = () => {
    onSave(selectedAreas);
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
      aria-labelledby="pain-modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 id="pain-modal-title">Укажите области с болью</h2>
        <p className="modal-description">
          Выберите области, которые беспокоят. Упражнения для этих областей
          будут исключены из программы.
        </p>
        <div className="pain-options">
          {painOptions.map((area) => (
            <button
              key={area}
              className={`pain-option ${selectedAreas.includes(area) ? 'selected' : ''}`}
              onClick={() => toggleArea(area)}
              aria-pressed={selectedAreas.includes(area)}
            >
              {area}
            </button>
          ))}
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

PainAreaSelector.propTypes = {
  currentPainAreas: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PainAreaSelector;
