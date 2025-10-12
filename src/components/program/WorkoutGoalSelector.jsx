import PropTypes from 'prop-types';
import { getAllWorkoutGoals } from '../../constants/workoutConstants';
import './WorkoutGoalSelector.css';

/**
 * WorkoutGoalSelector component - Select workout goal
 * @param {Object} props - Component props
 * @param {string} props.selectedGoal - Currently selected goal ID
 * @param {Function} props.onSelect - Callback when goal is selected
 */
function WorkoutGoalSelector({ selectedGoal, onSelect }) {
  const goals = getAllWorkoutGoals();

  return (
    <div className="workout-goal-selector">
      <h4 className="goal-selector-title">Выберите цель тренировки</h4>
      <div className="goal-options">
        {goals.map((goal) => (
          <button
            key={goal.id}
            className={`goal-option ${selectedGoal === goal.id ? 'selected' : ''}`}
            onClick={() => onSelect(goal.id)}
            aria-pressed={selectedGoal === goal.id}
          >
            <span className="goal-icon">{goal.icon}</span>
            <div className="goal-content">
              <h5 className="goal-name">{goal.name}</h5>
              <p className="goal-description">{goal.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

WorkoutGoalSelector.propTypes = {
  selectedGoal: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default WorkoutGoalSelector;
