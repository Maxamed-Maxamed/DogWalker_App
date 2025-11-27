import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/authStore';
import { Redirect } from 'expo-router';

/**
 * Owner Entry Point
 * Routes to appropriate screen based on auth status and first launch
 */
export default function OwnerIndex() {
  const { user } = useAuthStore();
  const { firstLaunch } = useAppStateStore();

  // Route based on auth state
  if (user) {
    // User is authenticated - go to tabs
    return <Redirect href="/(owner)/(tabs)/home" />;
  }

  if (firstLaunch) {
    // First time user - show welcome
    return <Redirect href="/welcome" />;
  }

  // Returning user, not authenticated - show login
  return <Redirect href="/auth/login" />;
}