# Cho_training

A personal training tracker web application to help users systematize their workouts, track wellbeing, and monitor progress.

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

## Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **Charts**: Recharts (for data visualization)
- **Type Checking**: PropTypes
- **Code Quality**: ESLint + Prettier
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
│   ├── Stats.jsx            # Statistics and charts
│   └── Stats.css
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Application entry point
└── index.css                # Global styles
```

## Data Storage

The application uses browser's localStorage to persist wellbeing logs. Data is stored under the key `training_logs` as a JSON array.

## Future Enhancements

- ~~Training programs and workout templates~~ ✅ **Implemented as Program Generator**
- Integration between Program Generator and Log Wellbeing data
- Export/import data functionality
- More detailed analytics and custom date ranges
- Notes functionality for workout sessions
- Expanded exercise database
- Integration with fitness tracking devices
- Toast notifications for user actions
- Multi-language support (i18n)

## Development Guidelines

- Follow the existing code structure and naming conventions
- Run `npm run format` before committing to ensure consistent code style
- Ensure `npm run lint` passes without errors
- Test responsive design on multiple screen sizes
- Add PropTypes to all new components
- Use semantic HTML and ARIA attributes for accessibility

## License

MIT License - see LICENSE file for details
