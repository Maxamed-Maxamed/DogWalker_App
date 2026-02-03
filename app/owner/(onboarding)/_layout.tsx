import { Stack } from "expo-router";

export default function OwnerOnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="how-it-works" />
      <Stack.Screen name="safety" />
      <Stack.Screen name="get-started" />
    </Stack>
  );
}
