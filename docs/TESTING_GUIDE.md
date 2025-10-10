# Testing Guide - Cho Training App

## Overview

This guide provides comprehensive information about the testing infrastructure and practices for the Cho Training application.

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Best Practices](#best-practices)
6. [Coverage](#coverage)

---

## Testing Stack

The project uses modern testing tools optimized for Vite and React:

- **Vitest**: Fast, Vite-native test runner
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions
- **jsdom**: Browser environment simulation

### Why Vitest?

- ⚡ **Fast**: Uses Vite's transformation pipeline
- 🔧 **Zero Config**: Works out of the box with Vite
- 🎯 **Jest Compatible**: Familiar API if you know Jest
- 📊 **Built-in Coverage**: Integrated coverage reporting
- 🎨 **UI Mode**: Interactive test runner interface

---

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test -- --run

# Run tests in watch mode (default)
npm test

# Run tests with UI interface
npm run test:ui

# Run tests with coverage (requires @vitest/coverage-v8)
npm run test:coverage

# Run specific test file
npm test -- src/services/storageService.test.js

# Run tests matching a pattern
npm test -- --grep "recommendation"
```

### Watch Mode Features

When running `npm test`, Vitest starts in watch mode with these features:

- **Auto-rerun**: Tests re-run when files change
- **Filtered mode**: Press keys to filter tests
  - `p`: Filter by filename pattern
  - `t`: Filter by test name pattern
  - `a`: Run all tests
  - `f`: Run only failed tests
- **Quick navigation**: Jump to test files
- **Clear output**: Press `c` to clear console

### UI Mode

Run `npm run test:ui` to launch an interactive web interface:

- 📊 Visual test results
- 🔍 Test filtering and search
- 📈 Performance metrics
- 🐛 Error inspection
- 📁 File tree navigation

Access at `http://localhost:51204/__vitest__/`

---

## Test Structure

### Directory Layout

```
src/
├── services/
│   ├── recommendationService.js
│   ├── recommendationService.test.js
│   ├── storageService.js
│   └── storageService.test.js
├── pages/
│   ├── Program.jsx
│   └── Program.test.js
└── test/
    └── setup.js
```

**Convention**: Test files are placed next to the code they test with `.test.js` extension.

### Test File Structure

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import serviceToTest from './serviceToTest';

describe('ServiceName', () => {
  // Setup before each test
  beforeEach(() => {
    // Clean state, mock data, etc.
  });

  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = serviceToTest.method(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

---

## Writing Tests

### Test Anatomy

Follow the **Arrange-Act-Assert** (AAA) pattern:

```javascript
it('should calculate average correctly', () => {
  // Arrange: Set up test data
  const numbers = [1, 2, 3, 4, 5];
  
  // Act: Execute the function
  const average = calculateAverage(numbers);
  
  // Assert: Verify the result
  expect(average).toBe(3);
});
```

### Common Assertions

```javascript
// Equality
expect(value).toBe(5);                    // Strict equality (===)
expect(value).toEqual({ a: 1 });          // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(5);
expect(value).toBeCloseTo(0.3, 1);        // Floating point

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/pattern/);

// Arrays
expect(array).toContain('item');
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ a: 1 });

// DOM (with @testing-library/jest-dom)
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('text');
```

### Testing localStorage

The test setup includes a localStorage mock:

```javascript
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
});

it('should save data to localStorage', () => {
  const data = { key: 'value' };
  
  storageService.save(data);
  
  const saved = localStorage.getItem('key');
  expect(saved).toBe(JSON.stringify(data));
});
```

### Testing Async Code

```javascript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  
  expect(result).toBe('expected');
});

// Or with promises
it('should handle promises', () => {
  return asyncFunction().then(result => {
    expect(result).toBe('expected');
  });
});
```

### Testing Error Cases

```javascript
it('should handle errors gracefully', () => {
  localStorage.setItem('data', 'invalid json');
  
  const result = storageService.getData();
  
  expect(result).toEqual([]); // Should return default value
});

it('should throw error for invalid input', () => {
  expect(() => {
    validateInput(null);
  }).toThrow('Input cannot be null');
});
```

---

## Best Practices

### 1. Test Naming

Use descriptive test names that explain the scenario:

✅ **Good**:
```javascript
it('should return rest recommendation when energy level is 2 or less', () => {
  // ...
});
```

❌ **Bad**:
```javascript
it('test 1', () => {
  // ...
});
```

### 2. One Assertion Per Test (Guideline)

Focus each test on one specific behavior:

```javascript
// Prefer this:
it('should filter by pain areas', () => {
  expect(result).not.toContainEqual(
    expect.objectContaining({ name: 'Leg Press' })
  );
});

it('should keep non-conflicting exercises', () => {
  expect(result).toContainEqual(
    expect.objectContaining({ name: 'Arm Curl' })
  );
});
```

### 3. Test Edge Cases

Always test boundary conditions:

```javascript
it('should handle empty input', () => { /* ... */ });
it('should handle null input', () => { /* ... */ });
it('should handle maximum value', () => { /* ... */ });
it('should handle minimum value', () => { /* ... */ });
```

### 4. Avoid Test Interdependence

Each test should be independent:

```javascript
// Use beforeEach for setup
beforeEach(() => {
  localStorage.clear();
  // Each test gets fresh state
});
```

### 5. Mock External Dependencies

```javascript
// Mock API calls, timers, etc.
import { vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

it('should call API', () => {
  mockFetch.mockResolvedValue({ data: 'test' });
  
  // Test code...
  
  expect(mockFetch).toHaveBeenCalledWith('/api/endpoint');
});
```

### 6. Keep Tests Fast

- Avoid actual network calls
- Use mocks for slow operations
- Don't add unnecessary delays
- Current test suite: ~1.25s for 57 tests ✅

### 7. Test Behavior, Not Implementation

Focus on **what** the code does, not **how** it does it:

✅ **Good** (tests behavior):
```javascript
it('should recommend intensive workout for high energy and good sleep', () => {
  const result = recommendationService.getRecommendation({
    energyLevel: 5,
    sleepQuality: 5,
  });
  
  expect(result.type).toBe('intensive');
  expect(result.intensity).toBe('high');
});
```

❌ **Bad** (tests implementation):
```javascript
it('should check if energyLevel >= 4 and sleepQuality >= 4', () => {
  // Testing internal logic instead of outcome
});
```

---

## Coverage

### Installing Coverage Tool

```bash
npm install -D @vitest/coverage-v8
```

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Report

The coverage report shows:
- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches taken
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

### Coverage Goals

Target coverage levels:
- 🎯 **Statements**: 80%+
- 🎯 **Branches**: 75%+
- 🎯 **Functions**: 80%+
- 🎯 **Lines**: 80%+

### Current Coverage

| Module | Tests | Coverage Status |
|--------|-------|-----------------|
| recommendationService.js | 19 | ✅ Excellent |
| storageService.js | 16 | ✅ Excellent |
| Program.jsx (logic) | 22 | ✅ Good |

---

## Test Examples

### Example 1: Service with Error Handling

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import storageService from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getLogs', () => {
    it('should return empty array when no logs exist', () => {
      const logs = storageService.getLogs();
      expect(logs).toEqual([]);
    });

    it('should return stored logs', () => {
      const testLogs = [
        { date: '2024-01-01', data: 'test' }
      ];
      
      localStorage.setItem('training_logs', JSON.stringify(testLogs));
      const logs = storageService.getLogs();
      
      expect(logs).toEqual(testLogs);
    });

    it('should handle parse errors gracefully', () => {
      localStorage.setItem('training_logs', 'invalid json');
      const logs = storageService.getLogs();
      
      expect(logs).toEqual([]);
    });
  });
});
```

### Example 2: Testing Algorithm Logic

```javascript
describe('packByMinutes algorithm', () => {
  const mockExercises = [
    { name: 'Exercise 1', duration: 5, level: 1 },
    { name: 'Exercise 2', duration: 7, level: 1 },
    { name: 'Exercise 3', duration: 3, level: 1 },
  ];

  it('should pack exercises within tolerance range', () => {
    const targetMinutes = 15;
    const tolerance = 0.1;
    
    const packed = packByMinutes(mockExercises, targetMinutes, tolerance);
    const totalMinutes = packed.reduce((sum, ex) => sum + ex.duration, 0);
    
    expect(totalMinutes).toBeGreaterThanOrEqual(targetMinutes * 0.9);
    expect(totalMinutes).toBeLessThanOrEqual(targetMinutes * 1.1);
  });
});
```

### Example 3: Testing with Multiple Scenarios

```javascript
describe('getRecommendation', () => {
  const testCases = [
    {
      name: 'low energy',
      input: { energyLevel: 2, sleepQuality: 4, musclePain: [] },
      expected: { type: 'rest', intensity: 'low' }
    },
    {
      name: 'high energy',
      input: { energyLevel: 5, sleepQuality: 5, musclePain: [] },
      expected: { type: 'intensive', intensity: 'high' }
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(`should return ${expected.type} recommendation for ${name}`, () => {
      const result = recommendationService.getRecommendation(input);
      
      expect(result.type).toBe(expected.type);
      expect(result.intensity).toBe(expected.intensity);
    });
  });
});
```

---

## Troubleshooting

### Tests Not Running

1. **Check dependencies**: `npm install`
2. **Verify Vitest config**: Check `vite.config.js`
3. **Look for syntax errors**: Run `npm run lint`

### localStorage Errors

If you see localStorage errors:
- Ensure `src/test/setup.js` is properly configured
- Check `vite.config.js` has correct `setupFiles` path

### Timeout Errors

If tests timeout:
```javascript
it('slow test', async () => {
  // ... test code
}, 10000); // 10 second timeout
```

### Module Import Errors

Ensure imports match the actual exports:
```javascript
// Named export
export const myFunction = () => {};
import { myFunction } from './module';

// Default export
export default myService;
import myService from './module';
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Contributing Tests

When adding new features:

1. **Write tests first** (TDD approach, optional)
2. **Place test file next to source**: `feature.js` → `feature.test.js`
3. **Follow naming conventions**: Descriptive test names
4. **Test edge cases**: Null, empty, boundary values
5. **Ensure tests pass**: Run `npm test` before committing
6. **Update documentation**: Add test scenarios to this guide if needed

---

*Last Updated: January 2025*
