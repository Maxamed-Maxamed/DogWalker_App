// eslint.config.js
// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'import/no-unresolved': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
]);