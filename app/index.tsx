import { Redirect } from 'expo-router';

import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const { user, isInitialized } = useAuthStore();
  const { initialized: appInitialized, firstLaunch } = useAppStateStore();

  if (!appInitialized || !isInitialized) {
    return null;
  }

  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  if (firstLaunch) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/auth/login" />;
}
