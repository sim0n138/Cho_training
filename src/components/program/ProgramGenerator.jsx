import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import RpeSelector from './RpeSelector';
import PainAreaSelector from './PainAreaSelector';
import ExerciseList from './ExerciseList';
import programService from '../../services/programService';
import { STORAGE_KEYS } from '../../constants/index';
import './ProgramGenerator.css';

/**
 * Main component for generating exercise programs
 * @param {Object} props - Component props
 * @param {boolean} props.useWellbeingData - Whether to use wellbeing data for recommendations
 */
function ProgramGenerator({ useWellbeingData = true }) {
  const [rpe, setRpe] = useState(5);
  const [painAreas, setPainAreas] = useState([]);
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
        const newProgram = programService.generateProgram(
          rpe,
          painAreas,
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
  }, [rpe, painAreas, useWellbeingData]);

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

  return (
    <div className="program-generator">
      <Card>
        <h2>Генератор программы тренировок</h2>
        <p className="generator-description">
          Создайте персонализированную программу на основе вашего состояния
        </p>

        <div className="program-controls">
          <div className="control-group">
            <label>Уровень нагрузки (RPE)</label>
            <Button onClick={() => setShowRpeModal(true)} variant="outline">
              {rpe} / 10
            </Button>
          </div>

          <div className="control-group">
            <label>Области с болью</label>
            <Button onClick={() => setShowPainModal(true)} variant="outline">
              {painAreas.length === 0 ? 'Нет' : `${painAreas.length} выбрано`}
            </Button>
          </div>

          <Button
            onClick={handleGenerateProgram}
            variant="primary"
            disabled={isGenerating}
            className="generate-button"
          >
            {isGenerating ? 'Генерация...' : '🎯 Сгенерировать программу'}
          </Button>
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
      </Card>

      {isGenerating && (
        <Card>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Подбираем упражнения...</p>
          </div>
        </Card>
      )}

      {!isGenerating && program && (
        <>
          <Card>
            <h3>📊 Общая информация</h3>
            <div className="program-summary">
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
