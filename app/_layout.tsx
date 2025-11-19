/**
 * Root Layout (_layout.tsx)
 * 
 * Entry point for the entire app navigation structure.
 * Manages:
 * - Theme provider setup
 * - Navigation initialization
 * - Splash screen lifecycle
 * - Bootstrap store coordination (auth and app state initialization)
 * 
 * The layout prevents the Expo native splash from hiding until bootstrap
 * is complete (all stores initialized).
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { CustomSplashScreen } from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { SplashScreenProvider } from '@/stores/splashScreenStore';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://f648bd35e92e9f14d404ad2387b5a54d@o4510297697353728.ingest.de.sentry.io/4510364394651728',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Prevent Expo splash from auto-hiding during initialization
SplashScreen.preventAutoHideAsync().catch(() => {
  // Silently ignore errors if splash screen is already dismissed
});

/**
 * Main RootLayout component
 * Wraps the entire app with necessary providers and coordinates bootstrap
 */
export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const { phase, bootstrap } = useBootstrapStore();

  // Trigger bootstrap on mount
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Hide Expo splash once bootstrap is ready or on error
  useEffect(() => {
    if (phase === 'ready' || phase === 'error') {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
    }
  }, [phase]);

  return (
    <SplashScreenProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Custom splash screen overlay */}
        <CustomSplashScreen />

        {/* Navigation stack */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>

        {/* Status bar */}
        <StatusBar style="auto" />
      </ThemeProvider>
    </SplashScreenProvider>
  );
});