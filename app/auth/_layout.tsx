import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="pet-profile" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="onboarding-complete" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}