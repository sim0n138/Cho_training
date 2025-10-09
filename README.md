# Cho_training

A personal training tracker web application to help users systematize their workouts, track wellbeing, and monitor progress.

## Features

- **Dashboard**: Overview of current status, today's training, and quick stats
- **Log Wellbeing**: Track daily wellbeing metrics (coming soon)
- **Statistics**: View progress and training data (coming soon)

## Tech Stack

- React 19.1.1
- Vite 7.1.7
- React Router DOM 7.1.1
- CSS for styling

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
```

### Development

The application runs on `http://localhost:5173/` by default.

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Dashboard.jsx
│   ├── Log.jsx
│   └── Stats.jsx
├── components/      # Reusable components (to be added)
├── assets/          # Static assets
├── App.jsx          # Main app component with routing
└── main.jsx         # Application entry point
```

## Future Enhancements

- Wellbeing logging form (sleep quality, energy level, mood, muscle soreness)
- Personalized workout recommendations
- Progress tracking with charts
- Notes functionality
- LocalStorage integration for data persistence
- Workout history
- Training programs

## License

MIT License - see LICENSE file for details
