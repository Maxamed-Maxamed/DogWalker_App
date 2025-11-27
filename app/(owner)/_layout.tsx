/**
 * Owner Layout
 * 
 * Defines navigation structure for the owner role group.
 * Manages owner-specific screens: welcome, auth, and tabs.
 */

import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';

/**
 * Owner Layout component
 * Defines the navigation stack for owner-specific screens
 */
function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="owner" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
    </Stack>
  );
}

// Wrap with Sentry for error tracking
export default Sentry.wrap(OwnerLayout);