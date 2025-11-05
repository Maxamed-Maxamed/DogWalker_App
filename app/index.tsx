import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/authStore';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, isInitialized } = useAuthStore();
  const { initialized: appInitialized, firstLaunch } = useAppStateStore();

  // Redirect based on auth state
  if (appInitialized && isInitialized && user) {
    return <Redirect href="/(tabs)" />;
  }

  // While splash is up, render nothing
  if (!appInitialized || !isInitialized) return null;

  // First-time users go to welcome; otherwise auth/login
  return <Redirect href={firstLaunch ? '/welcome' : '/auth/login'} />;
}
 