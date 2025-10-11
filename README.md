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
- **Log Wellbeing**: Comprehensive form to track daily wellbeing metrics:
  - Sleep quality (1-5 scale)
  - Energy level (1-5 scale)
  - Mood selection
  - Muscle pain tracking (legs, back, arms, chest, full body)
  - Form validation
  - Data persistence in localStorage
- **Program Generator**: Personalized daily workout program generator:
  - RPE-based intensity adjustment (1-10 scale)
  - Pain area filtering (excludes conflicting exercises)
  - Automatic area rotation (prevents repeating dominant areas)
  - Exercise packing with ±10% tolerance
  - Accessible modals with focus management
  - Program history tracking (localStorage)
  - See [Technical Documentation](docs/PROGRAM_GENERATOR.md)
- **Statistics**: Visual analytics and progress tracking:
  - Total logs and weekly logs count
  - Average sleep quality and energy level
  - Line chart showing trends over last 7 days
  - Bar chart displaying mood distribution
- **Reusable Components**: 
  - Layout component with header and navigation
  - Card component for consistent styling
  - Button component with multiple variants
- **Accessibility**: ARIA attributes, semantic HTML, keyboard navigation support
- **Responsive Design**: Mobile-friendly layouts with media queries
- **Code Quality**: ESLint + Prettier configuration for consistent code style
- **Testing**: Comprehensive test suite with 57 tests (Vitest + React Testing Library)

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
│   │   ├── Layout.jsx      # Common layout with header and navigation
│   │   └── Layout.css
│   └── ui/
│       ├── Button.jsx       # Reusable button component
│       ├── Button.css
│       ├── Card.jsx         # Reusable card component
│       └── Card.css
├── pages/
│   ├── Dashboard.jsx        # Main dashboard page
│   ├── Dashboard.css
│   ├── Log.jsx              # Wellbeing logging form
│   ├── Log.css
│   ├── Program.jsx          # Workout program generator
│   ├── Program.css
│   ├── Program.test.js      # Program generator tests
│   ├── Stats.jsx            # Statistics and charts
│   └── Stats.css
├── services/
│   ├── recommendationService.js      # Workout recommendation logic
│   ├── recommendationService.test.js # 19 tests
│   ├── storageService.js             # localStorage operations
│   └── storageService.test.js        # 16 tests
├── test/
│   └── setup.js             # Test configuration
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Application entry point
└── index.css                # Global styles
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

The project includes a comprehensive test suite with **57 tests** covering:

- **recommendationService**: 19 tests
  - All recommendation scenarios (rest, recovery, moderate, intensive)
  - Motivation message generation
  - Edge cases and boundary conditions

- **storageService**: 16 tests
  - CRUD operations on localStorage
  - Date-based filtering
  - Statistics calculations
  - Error handling

- **Program Generator Logic**: 22 tests
  - Exercise packing algorithm
  - Pain area filtering
  - Most frequent area detection
  - RPE-based volume adjustments
  - Program history management

### Test Statistics
- **Total Tests**: 57
- **Pass Rate**: 100%
- **Framework**: Vitest
- **Libraries**: React Testing Library, Jest DOM

See [Code Analysis Report](docs/CODE_ANALYSIS.md) for detailed testing documentation and code quality assessment.

## Future Enhancements

- ~~Training programs and workout templates~~ ✅ **Implemented as Program Generator**
- ~~Expanded exercise database~~ ✅ **Implemented with 340+ exercises**
- Integration between Program Generator and Log Wellbeing data
- Export/import data functionality
- More detailed analytics and custom date ranges
- Notes functionality for workout sessions
- Integration with fitness tracking devices
- Toast notifications for user actions
- Multi-language support (i18n)

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
