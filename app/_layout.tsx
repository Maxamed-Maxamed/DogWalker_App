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
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { CustomSplashScreen } from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { SplashScreenProvider } from '@/stores/splashScreenStore';

// Initialize Sentry for error monitoring and performance tracking
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Adds more context data to events (IP address, cookies, user, etc.)
  sendDefaultPii: true,
  // Enable performance monitoring - capture 100% of transactions for tracing
  // Adjust this value in production to reduce load on quota
  tracesSampleRate: 1.0,
  // Enable profiling - capture profiles for 100% of transactions
  profilesSampleRate: 1.0,
  // Enable session replay - 100% of errors and 10% of normal sessions
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [Sentry.mobileReplayIntegration()],
  // Enable debug mode in development
  debug: __DEV__,
});

// Prevent Expo splash from auto-hiding during initialization
SplashScreen.preventAutoHideAsync().catch(() => {
  // Silently ignore errors if splash screen is already dismissed
});

/**
 * Main RootLayout component
 * Wraps the entire app with necessary providers and coordinates bootstrap
 */
function RootLayout() {
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
}

// Wrap the component with Sentry for automatic error boundaries and touch event tracking
export default Sentry.wrap(RootLayout);