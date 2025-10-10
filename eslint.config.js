// https://docs.expo.dev/guides/using-eslint/
import expoConfig from 'eslint-config-expo/flat.js';

export default [
  // Global ignore patterns
  {
    ignores: [
      'scripts/**',
      'node_modules/**',
      'dist/**',
      '.expo/**'
    ]
  },
  
  // Apply Expo config
  ...expoConfig,
];