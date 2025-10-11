// Recommendation service for workout suggestions based on wellbeing data
import { WELLBEING_THRESHOLDS } from '../constants/wellbeingThresholds';

const recommendationService = {
  // Generate workout recommendation based on latest log
  getRecommendation: (latestLog) => {
    if (!latestLog) {
      return {
        type: 'rest',
        title: 'Начните отслеживать самочувствие',
        description:
          'Добавьте запись о вашем самочувствии, чтобы получить персонализированные рекомендации тренировок.',
        intensity: 'none',
      };
    }

    const { sleepQuality, energyLevel, musclePain } = latestLog;

    // Check for significant muscle pain
    const hasSignificantPain =
      musclePain &&
      musclePain.length >= WELLBEING_THRESHOLDS.PAIN.SIGNIFICANT_COUNT;

    // Low energy or poor sleep - recommend rest or light activity
    if (
      energyLevel <= WELLBEING_THRESHOLDS.ENERGY_LEVEL.LOW ||
      sleepQuality <= WELLBEING_THRESHOLDS.SLEEP_QUALITY.POOR
    ) {
      return {
        type: 'rest',
        title: 'Отдых и восстановление',
        description:
          'Ваш уровень энергии или качество сна низкие. Рекомендуется отдых, легкая растяжка или прогулка на свежем воздухе.',
        intensity: 'low',
        activities: ['Растяжка', 'Прогулка', 'Дыхательные упражнения'],
      };
    }

    // Significant muscle pain - recommend recovery
    if (hasSignificantPain) {
      return {
        type: 'recovery',
        title: 'Восстановительная тренировка',
        description:
          'У вас есть мышечная боль в нескольких зонах. Рекомендуется легкая восстановительная активность.',
        intensity: 'low',
        activities: [
          'Легкая растяжка',
          'Йога',
          'Плавание',
          'Массаж или самомассаж',
        ],
      };
    }

    // Moderate energy - recommend moderate intensity
    if (
      energyLevel === WELLBEING_THRESHOLDS.ENERGY_LEVEL.MODERATE ||
      sleepQuality === WELLBEING_THRESHOLDS.SLEEP_QUALITY.MODERATE
    ) {
      const painAreas = musclePain || [];
      const avoidAreas =
        painAreas.length > 0
          ? ` Избегайте нагрузки на: ${painAreas.join(', ')}.`
          : '';

      return {
        type: 'moderate',
        title: 'Умеренная тренировка',
        description: `Ваше состояние позволяет провести умеренную тренировку.${avoidAreas}`,
        intensity: 'moderate',
        activities: [
          'Кардио средней интенсивности',
          'Функциональные упражнения',
          'Легкая силовая тренировка',
        ],
      };
    }

    // High energy and good sleep - recommend intensive workout
    if (
      energyLevel >= WELLBEING_THRESHOLDS.ENERGY_LEVEL.HIGH &&
      sleepQuality >= WELLBEING_THRESHOLDS.SLEEP_QUALITY.GOOD
    ) {
      const painAreas = musclePain || [];
      const recommendation =
        painAreas.length === 0
          ? 'Отличное состояние для интенсивной тренировки! Можете выполнять любые упражнения.'
          : `Хорошее состояние для интенсивной тренировки. Будьте осторожны с: ${painAreas.join(', ')}.`;

      return {
        type: 'intensive',
        title: 'Интенсивная тренировка',
        description: recommendation,
        intensity: 'high',
        activities: [
          'Силовая тренировка',
          'HIIT',
          'Интенсивное кардио',
          'Кроссфит',
        ],
      };
    }

    // Default recommendation
    return {
      type: 'moderate',
      title: 'Умеренная активность',
      description:
        'Ваше состояние позволяет заниматься умеренными физическими упражнениями.',
      intensity: 'moderate',
      activities: ['Кардио', 'Функциональный тренинг', 'Растяжка'],
    };
  },

  // Get motivation message based on recent activity
  getMotivationMessage: (logsThisWeek) => {
    if (logsThisWeek === 0) {
      return 'Начните отслеживать своё самочувствие для более точных рекомендаций!';
    } else if (logsThisWeek >= 5) {
      return 'Отличная работа! Вы регулярно отслеживаете своё состояние.';
    } else if (logsThisWeek >= 3) {
      return 'Хороший прогресс! Продолжайте следить за своим самочувствием.';
    } else {
      return 'Попробуйте заполнять журнал чаще для более точных рекомендаций.';
    }
  },
};

export default recommendationService;
