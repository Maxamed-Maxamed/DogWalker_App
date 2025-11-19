// ESM Metro config to match project's `type: "module"` in package.json.
// Use import to load Expo's helper and export the default config.
import { getDefaultConfig } from '@expo/metro-config';

const config = getDefaultConfig(process.cwd());

export default config;
