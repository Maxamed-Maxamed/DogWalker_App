import SignupScreen from '@/components/auth/SignupScreen';
import React from 'react';

export default function SignupOwner() {
  return (
    <SignupScreen dashboardRoute="/DogOfOwner/(tabs)/dashboard" loginRoute="/DogOfOwner/auth/login" />
  );
}
