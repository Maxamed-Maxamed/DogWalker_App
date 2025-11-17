import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const routingInstrumentation = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
  routeChangeTimeoutMs: 1200,
});

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
const isExpoGo = Constants.appOwnership === 'expo';
const enableNativeSdk = !isExpoGo;

if (__DEV__ && isExpoGo) {
  console.info(
    '[Sentry] Running inside Expo Go - disabling native SDK features. Use a dev build/EAS build to test native crash reporting.'
  );
}

if (__DEV__ && !sentryDsn) {
  console.warn('[Sentry] No EXPO_PUBLIC_SENTRY_DSN provided. Telemetry is disabled for this environment.');
}

const parseRate = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveRelease = () => {
  const version =
    process.env.EXPO_PUBLIC_APP_VERSION ??
    Constants.expoConfig?.version ??
    Constants.manifest2?.extra?.expoClient?.version ??
    Constants.manifest?.version;

  const identifier =
    process.env.EXPO_PUBLIC_SENTRY_RELEASE ??
    Constants.expoConfig?.slug ??
    Constants.expoConfig?.name ??
    'dogwalker';

  return version ? `${identifier}@${version}` : undefined;
};

Sentry.init({
  dsn: sentryDsn,
  environment: process.env.EXPO_PUBLIC_APP_ENV ?? (__DEV__ ? 'development' : 'production'),
  release: resolveRelease(),
  sendDefaultPii: false,
  enableNative: enableNativeSdk,
  enableNativeCrashHandling: enableNativeSdk,
  enableWatchdogTerminationTracking: enableNativeSdk,
  debug: __DEV__,
  enableAutoPerformanceTracing: true,
  enableAppStartTracking: true,
  tracesSampleRate: parseRate(process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, 0.3),
  profilesSampleRate: parseRate(process.env.EXPO_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE, 0.1),
  replaysSessionSampleRate: parseRate(process.env.EXPO_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0.05),
  replaysOnErrorSampleRate: parseRate(process.env.EXPO_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1),
  integrations: [
    routingInstrumentation,
    ...(enableNativeSdk
      ? [
          Sentry.reactNativeTracingIntegration({
            traceFetch: true,
            traceXHR: true,
          }),
          Sentry.mobileReplayIntegration({
            maskAllText: true,
            maskAllImages: true,
            maskAllVectors: true,
          }),
          Sentry.feedbackIntegration({
            colorScheme: 'system',
          }),
          Sentry.hermesProfilingIntegration({
            platformProfilers: true,
          }),
        ]
      : []),
  ],
});

export { routingInstrumentation, Sentry };

