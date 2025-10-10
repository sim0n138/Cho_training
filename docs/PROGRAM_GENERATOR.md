# Program Generator - Technical Documentation

## Overview

The Program Generator (`/program` page) creates personalized daily workout programs based on:
- RPE (Rate of Perceived Exertion): 1-10 scale
- Pain areas: Legs, Back, Arms, Chest, Full Body
- Historical data: Avoids repeating dominant areas

## Architecture

### Core Components

**Program.jsx**
- Main component managing state and UI
- Handles RPE and pain area selection
- Renders modals and exercise lists

**Modal Components**
- `RpeModal`: RPE selection with accessibility features
- `PainModal`: Multi-select pain areas

### Algorithm Flow

```
1. Load previous program history from localStorage
   ↓
2. Calculate target minutes based on RPE
   - RPE ≥ 7: Reduced volume (stretch: 10, lfc: 15, meditation: 10)
   - RPE ≤ 3: Increased volume (stretch: 20, lfc: 25, meditation: 10)
   - Default: stretch: 15, lfc: 20, meditation: 10
   ↓
3. Filter exercises by pain areas
   - Map pain areas to body parts
   - Remove exercises targeting painful areas
   ↓
4. Filter by difficulty level
   - RPE ≥ 7: Only level 1 exercises
   - RPE < 7: Levels 1 and 2
   ↓
5. Fallback for empty lists
   - If no exercises available after filtering
   - Select level 1 exercises regardless of other filters
   ↓
6. Pack exercises to target minutes (±10% tolerance)
   - Greedy algorithm selecting exercises closest to target
   - Final trimming if exceeding maximum
   ↓
7. Determine primary area
   - Count frequency of all body areas in selected exercises
   - Most frequent area becomes primary
   ↓
8. Check for repetition (P0 FIX)
   - If primaryArea === lastPrimaryArea:
     * Exclude exercises with that area
     * Regenerate with diverse exercises
   ↓
9. Save to history (max 10 programs)
   - Store in localStorage as 'program_history'
```

## P0 Audit Fixes

### 1. Strict Non-Repetition of Dominant Area

**Problem**: Previously only de-prioritized, not prevented  
**Solution**: Strict check with forced regeneration

```javascript
if (primaryArea === lastPrimaryArea && lastPrimaryArea !== null) {
  // Exclude exercises with last primary area and regenerate
}
```

### 2. Unified Tolerance (10%)

**Problem**: Different tolerances (10% vs 15%)  
**Solution**: Single constant for all categories

```javascript
const MINUTES_TOLERANCE = 0.1; // 10% tolerance for all
```

### 3. Fallback for Empty Lists

**Problem**: No fallback for stretch exercises  
**Solution**: Added fallback for both categories

```javascript
if (availableExercises.stretch.length === 0) {
  availableExercises.stretch = EXERCISES.stretch.filter((ex) => ex.level === 1);
}
```

### 4. Accessible Modals

**Features Implemented:**
- Focus Trap (Tab cycles within modal)
- Escape key handler
- Focus return to trigger button
- Body scroll lock
- ARIA attributes (role, aria-modal, aria-labelledby, aria-pressed)

## Testing Scenarios

### Scenario 1: No Pain, Medium RPE
- **Input**: RPE = 5, no pain
- **Expected**: Full range of exercises, balanced distribution

### Scenario 2: High RPE with Pain
- **Input**: RPE = 8, pain in back
- **Expected**: Reduced volume, only level 1, no back exercises

### Scenario 3: Area Repetition Check
- **Setup**: Generate program with primary area "legs"
- **Action**: Regenerate
- **Expected**: Primary area should NOT be "legs" again

### Scenario 4: Modal Accessibility
- Test focus trap, Escape key, focus return, keyboard navigation

## localStorage Keys

- `program_state`: Current RPE and pain areas
- `program_history`: Last 10 generated programs

## Future Enhancements

1. More exercises in database
2. Integration with Log Wellbeing data
3. Toast notifications
4. Advanced filters (time, equipment)
5. Progressive difficulty
6. Export/Share functionality
7. Statistics tracking
