/**
 * Root Layout (_layout.tsx)
 * 
 * Entry point for the entire app navigation structure.
 * Manages:
 * - Theme provider setup
 * - Navigation initialization
 * - Splash screen lifecycle
 * - Authentication and app state initialization
 * 
 * The layout prevents the Expo native splash from hiding until both
 * app and auth states are fully initialized.
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { CustomSplashScreen } from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/authStore';
import { SplashScreenProvider } from '@/stores/splashScreenStore';

// Prevent Expo splash from auto-hiding during initialization
SplashScreen.preventAutoHideAsync().catch(() => {
  // Silently ignore errors if splash screen is already dismissed
});

/**
 * Main RootLayout component
 * Wraps the entire app with necessary providers and initializes app state
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isInitialized, isLoading, initialize } = useAuthStore();
  const { initialized: appInitialized, initializing: appInitializing, init } = useAppStateStore();

  // Initialize both auth and app state
  useEffect(() => {
    // Kick off both initializations in parallel
    init();
    initialize();
  }, [init, initialize]);

  // Hide Expo splash once both app and auth are ready
  useEffect(() => {
    if (appInitialized && isInitialized && !appInitializing && !isLoading) {
      SplashScreen.hideAsync().catch(() => {
        // Silently ignore if already hidden
      });
    }
  }, [appInitialized, isInitialized, appInitializing, isLoading]);

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
