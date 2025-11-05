import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/authStore';

// Remove anchor to allow proper routing control
// export const unstable_settings = {
//   anchor: '(tabs)',
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isInitialized, isLoading, initialize } = useAuthStore();
  const { initialized: appInitialized, initializing: appInitializing, init } = useAppStateStore();

  useEffect(() => {
    // Keep the splash screen visible while we initialize app and auth state
    SplashScreen.preventAutoHideAsync().catch(() => {});
    // Kick off both initializations in parallel
    init();
    initialize();
  }, [init, initialize]);

  useEffect(() => {
    // Hide splash once both app and auth are ready
    if (appInitialized && isInitialized && !appInitializing && !isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appInitialized, isInitialized, appInitializing, isLoading]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
