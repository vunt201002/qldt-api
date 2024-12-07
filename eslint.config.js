// Import necessary modules
import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

// Export the configuration
export default [
  {
    files: ['**/*.{js,jsx}'], // Apply to all JS/JSX files
    languageOptions: {
      globals: {
        ...globals.browser, // Include browser environment
        ...globals.node, // Include Node.js environment for process, require, etc.
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2020, // Updated to support ECMAScript 2020 features like optional chaining
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // Enable Prettier as an ESLint rule
    },
  },
  pluginJs.configs.recommended, // Include recommended ESLint rules
  prettierConfig, // Include Prettier config for formatting rules
];
