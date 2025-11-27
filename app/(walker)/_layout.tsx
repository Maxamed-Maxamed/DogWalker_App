/**
 * Walker Layout
 * 
 * Defines navigation structure for the walker role group.
 * Manages walker-specific screens.
 */

import { Stack } from 'expo-router';

export default function WalkerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="walker" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
