import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileSetupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="photo" />
      <Stack.Screen name="location" />
      <Stack.Screen name="phone" />
    </Stack>
  );
}