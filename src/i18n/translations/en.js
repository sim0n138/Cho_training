/**
 * English translations
 */
export const en = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    log: 'Log',
    program: 'Workouts',
    stats: 'Statistics',
    profile: 'Profile',
  },

  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    error: 'Error',
    success: 'Success',
  },

  // Error Boundary
  error: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try refreshing the page.',
    details: 'Error details (development only)',
    reload: 'Reload Page',
    retry: 'Try Again',
  },

  // Log page
  log: {
    title: 'Wellbeing Log',
    sleepQuality: 'Sleep Quality',
    energyLevel: 'Energy Level',
    mood: 'Mood',
    musclePain: 'Muscle Pain',
    date: 'Date',
    submit: 'Save Entry',
    validation: {
      sleepRequired: 'Sleep quality is required',
      sleepRange: 'Sleep quality must be a number from 1 to 5',
      energyRequired: 'Energy level is required',
      energyRange: 'Energy level must be a number from 1 to 5',
      moodRequired: 'Mood is required',
      moodLength: 'Mood must not exceed 100 characters',
      moodInvalid: 'Mood contains invalid characters',
      moodXss: 'Mood contains invalid HTML tags or scripts',
      dateRequired: 'Date is required',
      dateInvalid: 'Invalid date format',
      musclePainArray: 'Muscle pain must be an array',
      musclePainTooMany: 'Too many pain areas',
    },
  },

  // Pain areas
  painAreas: {
    legs: 'Legs',
    back: 'Back',
    arms: 'Arms',
    chest: 'Chest',
    fullBody: 'Full Body',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome',
    recentLogs: 'Recent Logs',
    statistics: 'Statistics',
    noData: 'No data to display',
  },

  // Stats
  stats: {
    title: 'Statistics',
    totalLogs: 'Total Logs',
    avgSleep: 'Average Sleep',
    avgEnergy: 'Average Energy',
    logsThisWeek: 'Logs This Week',
  },

  // Program
  program: {
    title: 'Workout Program',
    rpe: 'RPE (Load)',
    generateProgram: 'Generate Program',
    noProgram: 'No program created',
  },

  // Profile
  profile: {
    title: 'Profile',
    settings: 'Settings',
    language: 'Language',
    export: 'Export Data',
    import: 'Import Data',
    about: 'About',
    description: 'Personal training and wellbeing tracker',
    version: 'Version',
  },

  // Export/Import
  exportImport: {
    export: 'Export',
    import: 'Import',
    exportSuccess: 'Data exported successfully',
    importSuccess: 'Data imported successfully',
    exportError: 'Failed to export data',
    importError: 'Error importing data',
    invalidFormat: 'Invalid data format',
    noValidRecords: 'No valid records found for import',
    fileNotSelected: 'No file selected',
    selectJsonFile: 'Please select a JSON file',
    fileReadError: 'Error reading file',
    maliciousContent: 'JSON contains potentially malicious content',
    invalidJson: 'Invalid JSON format',
  },
};

export default en;
