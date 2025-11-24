import { Stack } from 'expo-router';

export default function WalkerRootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'DogWalker Walker' }} />
    </Stack>
  );
}
