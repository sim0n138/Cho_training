import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Tabs from '../ui/Tabs';
import RangeSlider from '../ui/RangeSlider';
import RpeSelector from './RpeSelector';
import PainAreaSelector from './PainAreaSelector';
import ExerciseList from './ExerciseList';
import WorkoutGoalSelector from './WorkoutGoalSelector';
import programService from '../../services/programService';
import { STORAGE_KEYS, DEFAULT_DURATION, DURATION_OPTIONS } from '../../constants/index';
import './ProgramGenerator.css';

/**
 * Main component for generating exercise programs with goal-based selection
 * @param {Object} props - Component props
 * @param {boolean} props.useWellbeingData - Whether to use wellbeing data for recommendations
 */
function ProgramGenerator({ useWellbeingData = true }) {
  const [rpe, setRpe] = useState(5);
  const [painAreas, setPainAreas] = useState([]);
  const [workoutGoal, setWorkoutGoal] = useState('general');
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [program, setProgram] = useState(null);
  const [showRpeModal, setShowRpeModal] = useState(false);
  const [showPainModal, setShowPainModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedRpe = localStorage.getItem(STORAGE_KEYS.LAST_RPE);
      const savedPainAreas = localStorage.getItem(STORAGE_KEYS.LAST_PAIN_AREAS);

      if (savedRpe) {
        setRpe(parseInt(savedRpe, 10));
      }
      if (savedPainAreas) {
        setPainAreas(JSON.parse(savedPainAreas));
      }

      // Get wellbeing recommendations
      if (useWellbeingData) {
        const latestLog = programService.getWellbeingRecommendations(null);
        setRecommendations(latestLog);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, [useWellbeingData]);

  // Save state to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_RPE, rpe.toString());
      localStorage.setItem(
        STORAGE_KEYS.LAST_PAIN_AREAS,
        JSON.stringify(painAreas)
      );
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [rpe, painAreas]);

  const handleGenerateProgram = useCallback(() => {
    setIsGenerating(true);

    // Simulate async operation for loading state
    setTimeout(() => {
      try {
        const newProgram = programService.generateProgramWithGoal(
          rpe,
          painAreas,
          workoutGoal,
          duration,
          useWellbeingData
        );
        setProgram(newProgram);
        programService.saveProgramToHistory(newProgram);
      } catch (error) {
        console.error('Error generating program:', error);
        // Could show error notification here
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  }, [rpe, painAreas, workoutGoal, duration, useWellbeingData]);

  const handleSaveRpe = (newRpe) => {
    setRpe(newRpe);
  };

  const handleSavePainAreas = (newAreas) => {
    setPainAreas(newAreas);
  };

  const getTotalMinutes = (category) => {
    if (!program || !program[category]) return 0;
    return programService.getTotalMinutes(program[category]);
  };

  // Tab content for setup
  const setupContent = (
    <div className="setup-content">
      <Card>
        <h3>Настройки тренировки</h3>
        
        <WorkoutGoalSelector 
          selectedGoal={workoutGoal}
          onSelect={setWorkoutGoal}
        />

        <div className="settings-grid">
          <div className="setting-item">
            <RangeSlider
              label="Длительность тренировки"
              value={duration}
              onChange={setDuration}
              min={15}
              max={60}
              step={5}
              formatValue={(val) => `${val} мин`}
            />
          </div>

          <div className="setting-item">
            <label className="setting-label">Уровень нагрузки (RPE)</label>
            <Button onClick={() => setShowRpeModal(true)} variant="outline" className="setting-button">
              {rpe} / 10
            </Button>
          </div>

          <div className="setting-item">
            <label className="setting-label">Области с болью</label>
            <Button onClick={() => setShowPainModal(true)} variant="outline" className="setting-button">
              {painAreas.length === 0 ? 'Нет' : `${painAreas.length} выбрано`}
            </Button>
          </div>
        </div>

        {painAreas.length > 0 && (
          <div className="selected-pain-areas">
            <p>
              <strong>Исключены области:</strong>{' '}
              {painAreas.map((area, idx) => (
                <span key={area} className="pain-tag">
                  {area}
                  {idx < painAreas.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        )}

        <Button
          onClick={handleGenerateProgram}
          variant="primary"
          disabled={isGenerating}
          className="generate-button"
        >
          {isGenerating ? 'Генерация...' : '🎯 Сгенерировать программу'}
        </Button>
      </Card>
    </div>
  );

  // Tab content for program results
  const programContent = (
    <div className="program-content">
      {isGenerating && (
        <Card>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Подбираем упражнения...</p>
          </div>
        </Card>
      )}

      {!isGenerating && !program && (
        <Card>
          <div className="no-program">
            <p>Настройте параметры и сгенерируйте программу во вкладке "Настройка"</p>
          </div>
        </Card>
      )}

      {!isGenerating && program && (
        <>
          <Card variant="gradient">
            <h3>📊 Общая информация</h3>
            <div className="program-summary">
              <div className="summary-item">
                <span className="summary-label">Цель:</span>
                <span className="summary-value">{program.goalName}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Общее время:</span>
                <span className="summary-value">
                  {program.totalMinutes} мин
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Фокус:</span>
                <span className="summary-value">{program.focusArea}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">RPE:</span>
                <span className="summary-value">{program.rpe}/10</span>
              </div>
            </div>
          </Card>

          <ExerciseList
            title="Растяжка"
            exercises={program.stretch}
            totalMinutes={getTotalMinutes('stretch')}
            icon="🧘"
          />

          <ExerciseList
            title="ЛФК (Лечебная физкультура)"
            exercises={program.lfc}
            totalMinutes={getTotalMinutes('lfc')}
            icon="💪"
          />

          <ExerciseList
            title="Медитация"
            exercises={program.meditation}
            totalMinutes={getTotalMinutes('meditation')}
            icon="🧘‍♀️"
          />
        </>
      )}
    </div>
  );

  return (
    <div className="program-generator">
      <Card hoverable={false}>
        <h2>Генератор программы тренировок</h2>
        <p className="generator-description">
          Создайте персонализированную программу на основе вашего состояния и целей
        </p>
      </Card>

      <Tabs
        tabs={[
          { id: 'setup', label: 'Настройка', icon: '⚙️', content: setupContent },
          { id: 'program', label: 'Программа', icon: '📋', content: programContent },
        ]}
        defaultTab="setup"
      />


      {showRpeModal && (
        <RpeSelector
          currentRpe={rpe}
          onSave={handleSaveRpe}
          onClose={() => setShowRpeModal(false)}
          recommendations={recommendations}
        />
      )}

      {showPainModal && (
        <PainAreaSelector
          currentPainAreas={painAreas}
          onSave={handleSavePainAreas}
          onClose={() => setShowPainModal(false)}
        />
      )}
    </div>
  );
}

ProgramGenerator.propTypes = {
  useWellbeingData: PropTypes.bool,
};

export default ProgramGenerator;
