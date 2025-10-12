# Security Enhancements and i18n Implementation

This document describes the security enhancements and internationalization (i18n) features implemented in the Cho Training application.

## Security Enhancements

### XSS Prevention

The application now includes comprehensive XSS (Cross-Site Scripting) prevention mechanisms to protect against malicious user input.

#### Sanitization Utilities

Located in `/src/utils/sanitize.js`, the following functions are available:

**`sanitizeString(str, maxLength = 1000)`**
- Removes HTML tags and script content
- Strips `javascript:` protocol
- Removes event handlers (onclick, onload, etc.)
- Trims whitespace
- Enforces maximum string length

**`escapeHtml(str)`**
- Escapes HTML entities to prevent injection
- Converts `<`, `>`, `&`, `"`, `'`, `/` to safe entities

**`sanitizeJSON(jsonString)`**
- Validates JSON strings for malicious patterns
- Checks for script tags, eval, Function calls
- Returns parsed data only if safe

**`sanitizeObject(obj, maxLength = 1000)`**
- Recursively sanitizes all string values in objects
- Works with nested objects and arrays

#### Integration

Sanitization is integrated throughout the application:

1. **Validation Service** (`validationService.js`)
   - `sanitizeAndValidateLogEntry()` function sanitizes all log entries
   - Mood field is checked for XSS content
   - Returns sanitized data or validation errors

2. **Storage Service** (`storageService.js`)
   - All data is validated and sanitized before storage
   - Prevents malicious data from being stored in localStorage

3. **Export/Import Service** (`exportService.js`)
   - Imported JSON is validated for malicious patterns
   - Each log entry is sanitized before import
   - Uses comprehensive validation for all fields

### Test Coverage

26 comprehensive tests cover all sanitization scenarios:
- HTML tag removal
- Script tag removal
- Event handler removal
- JSON validation
- Object/array sanitization

## Internationalization (i18n)

The application supports multiple languages with easy switching between them.

### Supported Languages

- **Russian (ru)** - Default language
- **English (en)**

### Architecture

#### Configuration (`/src/i18n/config.js`)
- Language constants and preferences
- localStorage integration for persistence
- Utility functions for getting/setting language

#### Translations (`/src/i18n/translations/`)
- `ru.js` - Russian translations
- `en.js` - English translations
- `index.js` - Translation exports

#### React Hook (`/src/i18n/useTranslation.js`)
- Custom hook for accessing translations
- Reactive language updates across components
- Translation function with interpolation support

### Usage

#### In Components

```javascript
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const { t, language, changeLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.dashboard')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

#### Translation Keys

Translation keys use dot notation:
- `nav.dashboard` - Navigation labels
- `error.title` - Error messages
- `log.validation.moodRequired` - Validation messages
- `profile.settings` - Profile page text

### Language Switcher Component

The `LanguageSwitcher` component provides a user-friendly interface for changing languages:
- Located in `/src/components/LanguageSwitcher.jsx`
- Displays language names (Русский, English)
- Highlights current language
- Integrated into Profile page

### Features

- **Persistent Preferences**: Language choice saved in localStorage
- **Reactive Updates**: Entire UI updates immediately on language change
- **No Page Reload**: Language switching is instant without refresh
- **Consistent Translations**: All UI text uses translation keys

### Updated Components

The following components have been updated to use translations:
- `ErrorBoundary` - Error messages
- `AppNavigation` - Navigation labels
- `App` - Loading messages
- `Profile` - Profile page content

## Testing

### Test Coverage Summary

- **Total tests**: 134 (increased from 97)
- **New tests**: 37
  - 26 tests for sanitization
  - 7 tests for i18n
  - 4 updated tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/utils/sanitize.test.js
```

### Coverage Metrics

- **sanitize.js**: 100% coverage
- **validationService.js**: 92.53% coverage
- **useTranslation.js**: 95.34% coverage
- **Translation files**: 100% coverage

## Bundle Optimization

The application uses code splitting and lazy loading:

### Lazy Loading

Pages are loaded on demand using React.lazy():
- Dashboard
- Log
- Stats
- Program
- Profile

### Vendor Chunks

Libraries are split into separate chunks:
- `vendor-react`: React, React DOM, React Router (44KB)
- `vendor-charts`: Recharts library (343KB)

### Benefits

- Faster initial load time
- Better caching
- Reduced bandwidth usage

## Security Best Practices

1. **Always validate user input** - Use `sanitizeAndValidateLogEntry()`
2. **Sanitize before display** - Use `escapeHtml()` for dynamic content
3. **Validate imported data** - Use `sanitizeJSON()` for JSON imports
4. **Check validation results** - Always check `isValid` before using data

## Adding New Translations

To add a new language:

1. Create a new translation file in `/src/i18n/translations/`
2. Add the language to `SUPPORTED_LANGUAGES` in `config.js`
3. Add the language name to `LANGUAGE_NAMES`
4. Import and export in `/src/i18n/translations/index.js`

Example:

```javascript
// /src/i18n/translations/fr.js
export const fr = {
  nav: {
    dashboard: 'Tableau de bord',
    log: 'Journal',
    // ... other translations
  }
};
```

## Maintenance

### Updating Translations

1. Locate the translation file (ru.js or en.js)
2. Find the appropriate section
3. Update or add new keys
4. Test with `npm test`

### Adding New Sanitization Rules

1. Add function to `/src/utils/sanitize.js`
2. Add tests to `/src/utils/sanitize.test.js`
3. Integrate into validation service if needed
4. Run `npm test` to verify

## Performance Considerations

- Sanitization is performed only once per data entry
- Language switching is instant (no network calls)
- Translations are included in the bundle (no lazy loading)
- Bundle size impact: ~10KB for i18n code + translations

## Future Enhancements

Potential improvements:
- Add more languages
- Server-side translation loading
- Translation management UI
- More sanitization rules
- Content Security Policy (CSP) headers
