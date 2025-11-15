import { Stack } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';

export const unstable_settings = {
  initialRouteName: 'index',
  anchor: '(tabs)',
};

/**
 * Walker-specific navigation stack. Global providers (theme, splash, Sentry)
 * are configured in the root layout, so this file focuses purely on routing.
 */
export default function DogWalkerLayout() {
  const isLoggedIn = Boolean(useAuthStore((state) => state.user));

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}