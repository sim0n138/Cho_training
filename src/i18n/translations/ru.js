/**
 * Russian translations
 */
export const ru = {
  // Navigation
  nav: {
    dashboard: 'Дашборд',
    log: 'Журнал',
    program: 'Тренировки',
    stats: 'Статистика',
    profile: 'Профиль',
  },

  // Common
  common: {
    loading: 'Загрузка...',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    confirm: 'Подтвердить',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    error: 'Ошибка',
    success: 'Успешно',
  },

  // Error Boundary
  error: {
    title: 'Что-то пошло не так',
    message: 'Произошла непредвиденная ошибка. Попробуйте обновить страницу.',
    details: 'Детали ошибки (только для разработки)',
    reload: 'Обновить страницу',
    retry: 'Попробовать снова',
  },

  // Log page
  log: {
    title: 'Журнал самочувствия',
    sleepQuality: 'Качество сна',
    energyLevel: 'Уровень энергии',
    mood: 'Настроение',
    musclePain: 'Мышечная боль',
    date: 'Дата',
    submit: 'Сохранить запись',
    validation: {
      sleepRequired: 'Качество сна обязательно для заполнения',
      sleepRange: 'Качество сна должно быть числом от 1 до 5',
      energyRequired: 'Уровень энергии обязателен для заполнения',
      energyRange: 'Уровень энергии должен быть числом от 1 до 5',
      moodRequired: 'Настроение обязательно для заполнения',
      moodLength: 'Настроение не должно превышать 100 символов',
      moodInvalid: 'Настроение содержит недопустимые символы',
      moodXss: 'Настроение содержит недопустимые HTML теги или скрипты',
      dateRequired: 'Дата обязательна',
      dateInvalid: 'Некорректный формат даты',
      musclePainArray: 'musclePain должен быть массивом',
      musclePainTooMany: 'Слишком много областей с болью',
    },
  },

  // Pain areas
  painAreas: {
    legs: 'Ноги',
    back: 'Спина',
    arms: 'Руки',
    chest: 'Грудь',
    fullBody: 'Всё тело',
  },

  // Dashboard
  dashboard: {
    title: 'Дашборд',
    welcome: 'Добро пожаловать',
    recentLogs: 'Последние записи',
    statistics: 'Статистика',
    noData: 'Нет данных для отображения',
  },

  // Stats
  stats: {
    title: 'Статистика',
    totalLogs: 'Всего записей',
    avgSleep: 'Средний сон',
    avgEnergy: 'Средняя энергия',
    logsThisWeek: 'Записей на этой неделе',
  },

  // Program
  program: {
    title: 'Программа тренировок',
    rpe: 'RPE (нагрузка)',
    generateProgram: 'Создать программу',
    noProgram: 'Программа не создана',
  },

  // Profile
  profile: {
    title: 'Профиль',
    settings: 'Настройки',
    language: 'Язык',
    export: 'Экспорт данных',
    import: 'Импорт данных',
  },

  // Export/Import
  exportImport: {
    export: 'Экспортировать',
    import: 'Импортировать',
    exportSuccess: 'Данные успешно экспортированы',
    importSuccess: 'Данные успешно импортированы',
    exportError: 'Не удалось экспортировать данные',
    importError: 'Ошибка при импорте данных',
    invalidFormat: 'Некорректный формат данных',
    noValidRecords: 'Не найдено корректных записей для импорта',
    fileNotSelected: 'Файл не выбран',
    selectJsonFile: 'Пожалуйста, выберите JSON файл',
    fileReadError: 'Ошибка при чтении файла',
    maliciousContent: 'JSON содержит потенциально опасный контент',
    invalidJson: 'Некорректный формат JSON',
  },
};

export default ru;
