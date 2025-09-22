import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileSetupIndex() {
  const handleStart = () => {
    router.push('/auth/profile-setup/photo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Set Up Your Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Let&apos;s get your profile ready in just a few steps
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepsContainer}>
          <ThemedView style={styles.step}>
            <ThemedText style={styles.stepNumber}>1</ThemedText>
            <ThemedText style={styles.stepTitle}>Profile Photo</ThemedText>
            <ThemedText style={styles.stepDescription}>Add a photo so walkers can recognize you</ThemedText>
          </ThemedView>

          <ThemedView style={styles.step}>
            <ThemedText style={styles.stepNumber}>2</ThemedText>
            <ThemedText style={styles.stepTitle}>Location Access</ThemedText>
            <ThemedText style={styles.stepDescription}>Enable location to find nearby walkers</ThemedText>
          </ThemedView>

          <ThemedView style={styles.step}>
            <ThemedText style={styles.stepNumber}>3</ThemedText>
            <ThemedText style={styles.stepTitle}>Phone Verification</ThemedText>
            <ThemedText style={styles.stepDescription}>Verify your phone number for security</ThemedText>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <ThemedText style={styles.startButtonText}>Get Started</ThemedText>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 40,
    marginRight: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    flex: 1,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});