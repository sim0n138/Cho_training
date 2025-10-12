import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import ExerciseDetails from './ExerciseDetails';
import './ExerciseList.css';

/**
 * Component for displaying a list of exercises in a category
 * @param {Object} props - Component props
 * @param {string} props.title - Category title
 * @param {Array} props.exercises - Array of exercises
 * @param {number} props.totalMinutes - Total minutes for this category
 * @param {string} props.icon - Icon emoji for the category
 */
function ExerciseList({ title, exercises, totalMinutes, icon }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  if (!exercises || exercises.length === 0) {
    return (
      <Card>
        <h3>
          {icon} {title}
        </h3>
        <p className="no-exercises">Нет подходящих упражнений</p>
      </Card>
    );
  }

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseDetails = () => {
    setSelectedExercise(null);
  };

  return (
    <>
      <Card>
        <h3>
          {icon} {title}{' '}
          <span className="category-time">({totalMinutes} мин)</span>
        </h3>
        <div className="exercise-list">
          {exercises.map((exercise, index) => (
            <button
              key={exercise.id || index}
              className="exercise-item"
              onClick={() => handleExerciseClick(exercise)}
              aria-label={`Подробнее об упражнении ${exercise.name}`}
            >
              <div className="exercise-info">
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-meta">
                  {exercise.duration} мин • Уровень {exercise.level}
                </span>
                {exercise.areas && exercise.areas.length > 0 && (
                  <span className="exercise-areas">
                    {exercise.areas.join(', ')}
                  </span>
                )}
              </div>
              <span className="exercise-arrow">›</span>
            </button>
          ))}
        </div>
      </Card>

      {selectedExercise && (
        <ExerciseDetails
          exercise={selectedExercise}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
}

ExerciseList.propTypes = {
  title: PropTypes.string.isRequired,
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      level: PropTypes.number,
      areas: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  totalMinutes: PropTypes.number.isRequired,
  icon: PropTypes.string,
};

ExerciseList.defaultProps = {
  icon: '📋',
};

export default ExerciseList;
