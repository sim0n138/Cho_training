# Cho_training

A personal training tracker web application to help users systematize their workouts, track wellbeing, and monitor progress.

## 📋 Code Review Available

**🆕 Comprehensive code review with improvement recommendations is now available!**

- **[Краткое резюме (RU)](docs/REVIEW_SUMMARY_RU.md)** - Quick summary of key issues
- **[Полный код-ревью (RU)](docs/CODE_REVIEW_RU.md)** - Detailed analysis with 10 improvement points
- **[Примеры реализации (RU)](docs/IMPLEMENTATION_EXAMPLES.md)** - Ready-to-use code examples

**Overall Rating**: ⭐⭐⭐⭐ (4/5) - Good code quality with clear improvement path

## Features

### ✅ Implemented Features

- **Dashboard**: Overview of current status with quick access cards to main features
  - Current wellbeing status display
  - Personalized workout recommendations based on latest log
  - **NEW**: Data export/import functionality (JSON format)
  - Quick navigation to all features
- **Log Wellbeing**: Comprehensive form to track daily wellbeing metrics:
  - Sleep quality (1-5 scale)
  - Energy level (1-5 scale)
  - Mood selection
  - Muscle pain tracking (legs, back, arms, chest, full body)
  - **Full validation with validationService**
  - **Data sanitization before localStorage**
  - Form validation with user-friendly error messages
  - Data persistence in localStorage with quota checking
- **Program Generator**: Personalized daily workout program generator:
  - **NEW**: Completely refactored with modular components
  - **NEW**: Integration with wellbeing data for automatic recommendations
  - RPE-based intensity adjustment (1-10 scale)
  - Pain area filtering (excludes conflicting exercises)
  - Automatic area rotation (prevents repeating dominant areas)
  - Exercise packing with ±10% tolerance
  - Accessible modals with focus management
  - **NEW**: Loading states for async operations
  - **NEW**: Enhanced UI with separate components (RpeSelector, PainAreaSelector, ExerciseList)
  - Program history tracking (localStorage)
  - See [Technical Documentation](docs/PROGRAM_GENERATOR.md)
- **Statistics**: Visual analytics and progress tracking:
  - **NEW**: Customizable date ranges (7, 14, 30, 90 days, all time)
  - **NEW**: Enhanced statistics (avg sleep, energy, days with pain, most common mood)
  - Total logs and period-specific count
  - Average sleep quality and energy level for selected period
  - Line chart showing trends
  - Bar chart displaying mood distribution
  - Pie chart for muscle pain distribution
  - Responsive charts with Recharts
- **Data Management**:
  - **NEW**: Export all training logs to JSON
  - **NEW**: Import logs from JSON with merge/replace options
  - **NEW**: Data validation on import
  - localStorage quota monitoring and cleanup
  - Automatic old data cleanup (keeps last 100 logs)
- **Reusable Components**: 
  - Layout component with header and navigation
  - Card component for consistent styling
  - Button component with multiple variants
  - **NEW**: ErrorBoundary for graceful error handling
  - **NEW**: LoadingFallback for lazy-loaded routes
  - **NEW**: Program components (ProgramGenerator, RpeSelector, etc.)
- **Code Splitting & Performance**:
  - **NEW**: Lazy loading for all pages
  - **NEW**: Manual chunks for vendor libraries
  - **NEW**: Optimized bundle size (< 650 KB total)
- **Accessibility**: ARIA attributes, semantic HTML, keyboard navigation support
- **Responsive Design**: Mobile-friendly layouts with media queries
- **Code Quality**: ESLint + Prettier configuration for consistent code style
- **Testing**: Comprehensive test suite with 97 tests (Vitest + React Testing Library)
- **Documentation**: JSDoc comments on all key functions and components

## Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **Charts**: Recharts (for data visualization)
- **Type Checking**: PropTypes
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest + @testing-library/react
- **Styling**: CSS3 with responsive design

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code with Prettier
npm run format

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage (after installing coverage tool)
npm run test:coverage
```

### Development

The application runs on `http://localhost:5173/` by default.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx         # Common layout with header and navigation
│   │   └── Layout.css
│   ├── program/               # Program generator components
│   │   ├── ProgramGenerator.jsx    # Main program generator
│   │   ├── RpeSelector.jsx         # RPE selection modal
│   │   ├── PainAreaSelector.jsx    # Pain area selection modal
│   │   ├── ExerciseList.jsx        # Exercise list display
│   │   └── index.js                # Component exports
│   ├── ui/
│   │   ├── Button.jsx         # Reusable button component
│   │   ├── Card.jsx           # Reusable card component
│   │   └── index.js
│   └── ErrorBoundary.jsx      # Error boundary component
├── pages/
│   ├── Dashboard.jsx          # Main dashboard with data management
│   ├── Log.jsx                # Wellbeing logging form
│   ├── Program.jsx            # Program page (uses ProgramGenerator)
│   ├── Stats.jsx              # Statistics with date ranges
│   └── Program.test.js        # Program logic tests
├── services/
│   ├── validationService.js   # Data validation (10 tests)
│   ├── exportService.js       # Export/import functionality (10 tests)
│   ├── programService.js      # Program generation logic (20 tests)
│   ├── recommendationService.js  # Workout recommendations (19 tests)
│   ├── storageService.js      # localStorage operations (16 tests)
│   └── *.test.js              # Test files
├── constants/
│   ├── wellbeingThresholds.js # Wellbeing and program constants
│   ├── storageKeys.js         # localStorage keys
│   └── index.js               # Constants export
├── data/
│   └── exercises.js           # 340+ exercise database
├── hooks/
│   └── useWellbeingData.js    # Custom hook for wellbeing data
├── types/
│   └── index.js               # Type definitions
├── test/
│   └── setup.js               # Test configuration
├── App.jsx                    # Main app with routing and lazy loading
├── main.jsx                   # Application entry point
└── index.css                  # Global styles
```

## Data Storage

The application uses browser's localStorage to persist wellbeing logs. Data is stored under the key `training_logs` as a JSON array.

## Exercise Database

The application includes a comprehensive database of **340+ scientifically-based exercises**, all in Russian:
- **120 stretching exercises** (Растяжка) - improving flexibility and mobility
- **120 therapeutic/LFC exercises** (ЛФК) - rehabilitation and strengthening  
- **100 meditation exercises** (Медитация) - mental wellness and stress reduction

All exercises are:
- ✅ In Russian language (весь текст на русском)
- ✅ Scientifically-based (научно обоснованно)
- ✅ Categorized by difficulty level (1-3)
- ✅ Tagged by body areas for smart filtering
- ✅ Integrated with RPE and pain area filtering

See [Exercise Database Documentation](docs/EXERCISE_DATABASE.md) for details.

## Testing

The project includes a comprehensive test suite with **97 tests** covering:

- **validationService**: 10 tests
  - Log entry validation
  - RPE validation
  - Pain area validation
  - Edge cases and error handling

- **exportService**: 10 tests
  - JSON export functionality
  - Import with merge/replace
  - Invalid data handling
  - File format validation

- **programService**: 20 tests
  - Program generation logic
  - Wellbeing data integration
  - Exercise packing algorithm
  - Pain area filtering
  - RPE adjustments
  - Program history management

- **recommendationService**: 19 tests
  - All recommendation scenarios (rest, recovery, moderate, intensive)
  - Motivation message generation
  - Edge cases and boundary conditions

- **storageService**: 16 tests
  - CRUD operations on localStorage
  - Date-based filtering
  - Statistics calculations
  - Quota checking and cleanup
  - Error handling

- **Program Generator Logic**: 22 tests
  - Exercise packing algorithm
  - Pain area filtering
  - Most frequent area detection
  - RPE-based volume adjustments
  - Program history management

### Test Statistics
- **Total Tests**: 97
- **Pass Rate**: 100%
- **Service Coverage**: 85% (statements)
- **Framework**: Vitest with @vitest/coverage-v8
- **Libraries**: React Testing Library, Jest DOM

See [Code Analysis Report](docs/CODE_ANALYSIS.md) for detailed testing documentation and code quality assessment.

## Future Enhancements

- ~~Training programs and workout templates~~ ✅ **Implemented as Program Generator**
- ~~Expanded exercise database~~ ✅ **Implemented with 340+ exercises**
- ~~Integration between Program Generator and Log Wellbeing data~~ ✅ **Implemented with automatic recommendations**
- ~~Export/import data functionality~~ ✅ **Implemented with JSON format**
- ~~More detailed analytics and custom date ranges~~ ✅ **Implemented with 5 date range options**
- ~~Code splitting and lazy loading~~ ✅ **Implemented for all pages**
- ~~Validation service~~ ✅ **Implemented with comprehensive validation**
- Notes functionality for workout sessions
- Integration with fitness tracking devices
- Toast notifications for user actions
- Multi-language support (i18n)
- Component-level test coverage (currently focused on services)

## Development Guidelines

- Follow the existing code structure and naming conventions
- Run `npm run format` before committing to ensure consistent code style
- Ensure `npm run lint` passes without errors
- **Run `npm test` to ensure all tests pass**
- **Add tests for new features** (see existing test files for examples)
- Test responsive design on multiple screen sizes
- Add PropTypes to all new components
- Use semantic HTML and ARIA attributes for accessibility

## License

MIT License - see LICENSE file for details
