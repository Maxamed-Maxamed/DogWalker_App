import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/welcome/onboarding');
  };

  const handleLogin = () => {
    router.push('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Top: Large rectangle filling the top third of the screen (placeholder for the logo) */}
        <ThemedView style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </ThemedView>

        {/* Center: Short text block (placeholder for the tagline) */}
        <ThemedView style={styles.taglineContainer}>
          <ThemedText style={styles.tagline}>
            Your trusted partner in pet care.
          </ThemedText>
        </ThemedView>

        {/* Bottom Middle: Rectangular button labeled "Get Started" (primary CTA) */}
        {/* Bottom Center: Smaller text link below the button: "Already have an account? Log In" */}
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <ThemedText style={styles.getStartedButtonText}>Get Started</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
          >
            <ThemedText style={styles.loginButtonText}>Already have an account? Log In</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  // Top: Large rectangle filling the top third of the screen (placeholder for the logo)
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  // Center: Short text block (placeholder for the tagline)
  taglineContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  tagline: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  // Bottom section with buttons
  buttonContainer: {
    gap: 16,
    paddingBottom: 32,
  },
  // Bottom Middle: Rectangular button labeled "Get Started" (primary CTA)
  getStartedButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Bottom Center: Smaller text link below the button: "Already have an account? Log In"
  loginButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});