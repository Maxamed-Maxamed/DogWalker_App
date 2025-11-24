/**
 * Application Configuration Constants
 * Contains hardcoded configuration values used across the app
 */

export const AppConfig = {
  // Support email for error reporting
  SUPPORT_EMAIL: 'support@dogwalker.app',

  // Maximum length for mailto URL body to prevent truncation
  // Most email clients support URLs up to 2000 chars, we use 1500 as safe margin
  MAX_MAILTO_BODY_LENGTH: 1500,

  // App name for error reporting
  APP_NAME: 'Dog Walker',
} as const;
