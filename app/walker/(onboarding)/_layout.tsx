import { Stack } from "expo-router";

export default function WalkerOnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="how-it-works" />
      <Stack.Screen name="requirements" />
      <Stack.Screen name="get-started" />
    </Stack>
  );
}
