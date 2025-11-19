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
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { CustomSplashScreen } from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { SplashScreenProvider } from '@/stores/splashScreenStore';

// Prevent Expo splash from auto-hiding during initialization
SplashScreen.preventAutoHideAsync().catch(() => {
  // Silently ignore errors if splash screen is already dismissed
});

// Initialize Sentry as early as possible so native errors are captured
const SENTRY_DSN =
  process.env.EXPO_PUBLIC_SENTRY_DSN ||
  // Expo's Constants may include extra config with env vars
  (Constants.manifest as any)?.extra?.EXPO_PUBLIC_SENTRY_DSN ||
  '';

if (SENTRY_DSN) {
  try {
    // Build a release identifier: version[+commitSha]
    const appVersion = (Constants.manifest as any)?.version || 'dev';
    const commitSha =
      (Constants.manifest as any)?.extra?.commitSha ||
      (Constants.manifest as any)?.extra?.commitSHA ||
      '';
    const release = commitSha ? `${appVersion}+${commitSha}` : appVersion;

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: __DEV__ ? 'development' : 'production',
      release,
      debug: __DEV__,
      enableNative: true,
      attachStacktrace: true,
      // Use a sampler so we can adjust sampling logic later; keep 0 in dev.
      tracesSampler: (_samplingContext: any) => {
        return __DEV__ ? 0.0 : 0.1;
      },
      // Scrub PII and tokens before sending
      beforeSend(event) {
        try {
          if (event.user && (event.user as any).email) {
            delete (event.user as any).email;
          }

          if (event.request && (event.request as any).headers) {
            const headers = (event.request as any).headers as Record<string, any>;
            if (headers.authorization) delete headers.authorization;
            if (headers.Authorization) delete headers.Authorization;
          }

          if (event.extra) {
            const extra = event.extra as Record<string, any>;
            ['token', 'authToken', 'SENTRY_AUTH_TOKEN', 'password'].forEach(k => {
              if (k in extra) delete extra[k];
            });
          }
        } catch {
          // ignore scrub errors
        }

        return event;
      },
    });
  } catch (e) {
    // Do not crash app if Sentry init fails
    console.warn('Sentry initialization failed', e);
  }
}

// Expose a dev-only global helper to trigger a Sentry test event from the JS debugger
if (__DEV__) {
  try {
    const sendSentryTest = (msg = 'Sentry test event') => {
      try {
        Sentry.captureException(new Error(msg));
        console.log('[Sentry] test event sent:', msg);
      } catch (err) {
        console.warn('[Sentry] failed to send test event', err);
      }
    };

    // Attach to both global and globalThis for debugger accessibility
    // so you can run `__sentryTest('my message')` from the browser debugger.
    // Use in Expo DevTools Console or React Native debugger.
    // Example: __sentryTest('manual test from console')
    (global as any).__sentryTest = sendSentryTest;
    (globalThis as any).__sentryTest = sendSentryTest;
  } catch {
    // ignore attach errors in exotic runtimes
  }
}

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