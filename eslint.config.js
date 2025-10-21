import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['dist', 'node_modules', '**/*.ts', '**/*.tsx'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Node globals  
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },
];
