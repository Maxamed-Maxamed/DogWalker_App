import { Stack } from 'expo-router';
import React from 'react';

// Simple layout for auth screens. Screens live under app/auth/*.tsx
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
  

}