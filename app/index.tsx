import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to welcome screen on app start
  return <Redirect href="/welcome" />;
}