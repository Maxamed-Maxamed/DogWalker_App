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

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/Logo.jpeg')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </ThemedView>

        <ThemedView style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>
            Welcome to Dog Walker
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            The most trusted and convenient dog walking service. 
            Connect with vetted, passionate dog lovers in your area.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <ThemedText style={styles.getStartedButtonText}>Get Started</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={() => router.push('/auth/login')}
          >
            <ThemedText style={styles.signInButtonText}>Already have an account? Sign In</ThemedText>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 16,
  },
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
  signInButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});