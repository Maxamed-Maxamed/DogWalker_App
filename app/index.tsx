import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/stores/authStore';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { Redirect } from 'expo-router';
import { useAppStateStore } from '@/stores/appStateStore';

/**
 * Entry point screen that handles navigation based on app state
 * - Shows loading state during initialization
 * - Shows error state if bootstrap fails
 * - Routes to appropriate screen based on auth status and first launch
 */
export default function Index() {
  const { phase, error: bootstrapError, errorMessage } = useBootstrapStore();
  const { user } = useAuthStore();
  const { firstLaunch } = useAppStateStore();

  // Still initializing
  if (phase === 'initializing') {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Initializing...</ThemedText>
      </ThemedView>
    );
  }

  // Bootstrap failed
  if (phase === 'error') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.errorTitle}>
          Initialization Failed
        </ThemedText>
        <ThemedText style={styles.errorText}>
          {errorMessage || 'An unknown error occurred. Please try restarting the app.'}
        </ThemedText>
        {bootstrapError && __DEV__ && (
          <ThemedText style={styles.debugText}>
            Debug: {bootstrapError.message}
          </ThemedText>
        )}
      </ThemedView>
    );
  }

  // Bootstrap successful - route based on auth state
  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  if (firstLaunch) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorTitle: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  debugText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 16,
  },
});
