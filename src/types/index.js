/**
 * Common type definitions for the application
 */

/**
 * @typedef {Object} WellbeingLog
 * @property {number} sleepQuality - Качество сна (1-5)
 * @property {number} energyLevel - Уровень энергии (1-5)
 * @property {string[]} musclePain - Массив областей с болью
 * @property {string} mood - Настроение
 * @property {string} date - Дата в формате ISO
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} type - Тип рекомендации (rest|recovery|moderate|intensive)
 * @property {string} title - Заголовок
 * @property {string} description - Описание
 * @property {string} intensity - Интенсивность (none|low|moderate|high)
 * @property {string[]} [activities] - Рекомендуемые активности
 */

export {};
