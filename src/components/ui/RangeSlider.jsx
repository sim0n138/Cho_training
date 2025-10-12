import PropTypes from 'prop-types';
import './RangeSlider.css';

/**
 * RangeSlider component - Custom styled range input
 * @param {Object} props - Component props
 * @param {number} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {string} props.label - Label text
 * @param {Function} props.formatValue - Function to format display value
 */
function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  label,
  formatValue,
  className = '',
}) {
  const displayValue = formatValue ? formatValue(value) : value;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`range-slider ${className}`.trim()}>
      {label && (
        <label className="range-slider-label">
          {label}: <strong>{displayValue}</strong>
        </label>
      )}
      <div className="range-slider-container">
        <input
          type="range"
          className="range-slider-input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-border-light) ${percentage}%, var(--color-border-light) 100%)`,
          }}
        />
        <div className="range-slider-marks">
          <span className="range-slider-mark">{min}</span>
          <span className="range-slider-mark">{max}</span>
        </div>
      </div>
    </div>
  );
}

RangeSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  label: PropTypes.string,
  formatValue: PropTypes.func,
  className: PropTypes.string,
};

export default RangeSlider;
