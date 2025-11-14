import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = getSentryExpoConfig(__dirname);

export default config;
