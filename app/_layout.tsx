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
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { CustomSplashScreen } from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { SplashScreenProvider } from '@/stores/splashScreenStore';
import { Sentry, routingInstrumentation } from '@/utils/monitoring/sentry';

export const unstable_settings = {
  initialRouteName: 'index',
  anchor: 'index',
};

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
  const navigationRef = useNavigationContainerRef();

  // Trigger bootstrap on mount
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    // Only register when the navigation ref becomes available/ready
    try {
      if (navigationRef && navigationRef.current) {
        // routingInstrumentation expects the actual NavigationContainerRef instance.
        // Pass the `.current` value (non-null checked above) to avoid unsafe casts.
        routingInstrumentation.registerNavigationContainer(navigationRef.current);
      }
    } catch (e) {
      // Avoid crashing the app if registration fails
      console.error('Failed to register navigation container for routing instrumentation', e);
    }
  }, [navigationRef]);

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
        <Stack ref={navigationRef} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="DogOfOwner" options={{ headerShown: false }} />
          <Stack.Screen name="DogWalker" options={{ headerShown: false }} />
        </Stack>

        {/* Status bar */}
        <StatusBar style="auto" />
      </ThemeProvider>
    </SplashScreenProvider>
  );
});