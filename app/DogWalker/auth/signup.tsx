import SignupScreen from '@/components/auth/SignupScreen';
import React from 'react';

export default function SignupWalker() {
  return <SignupScreen dashboardRoute="/DogWalker/(tabs)/dashboard" loginRoute="/DogWalker/auth/login" />;
}
