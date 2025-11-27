import { Redirect } from 'expo-router';


/**
 * Walker Entry Point
 * Routes to the walker dashboard (tabs)
 */
export default function WalkerIndex() {
  // For now, simply redirect to walker dashboard
  // In the future, this can include bootstrap logic similar to owner
  return <Redirect href="/(walker)/(tabs)/dashboard" />;
}
