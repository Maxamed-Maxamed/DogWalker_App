import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OnboardingCompleteScreen() {
  const handleBookWalk = () => {
    // Navigate to the main app - tabs dashboard
    router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Center: Success icon and welcome message */}
        <ThemedView style={styles.centerContainer}>
          <ThemedView style={styles.successIconContainer}>
            <ThemedText style={styles.successIcon}>🎉</ThemedText>
          </ThemedView>
          
          {/* Headline: "Welcome to Dog Walker, [User Name]!" */}
          <ThemedText style={styles.title}>
            Welcome to Dog Walker!
          </ThemedText>
          
          {/* Text Paragraph: "Ready for your pet's first walk?..." */}
          <ThemedText style={styles.description}>
            Ready for your pet&apos;s first walk? Tap the button below to get started.
          </ThemedText>

          <ThemedView style={styles.completedStepsContainer}>
            <ThemedText style={styles.completedTitle}>You&apos;re all set up with:</ThemedText>
            
            <ThemedView style={styles.completedStep}>
              <ThemedText style={styles.completedIcon}>✅</ThemedText>
              <ThemedText style={styles.completedText}>Account created</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.completedStep}>
              <ThemedText style={styles.completedIcon}>✅</ThemedText>
              <ThemedText style={styles.completedText}>Profile set up</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.completedStep}>
              <ThemedText style={styles.completedIcon}>✅</ThemedText>
              <ThemedText style={styles.completedText}>Pet profile added</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.completedStep}>
              <ThemedText style={styles.completedIcon}>✅</ThemedText>
              <ThemedText style={styles.completedText}>Ready to book walks</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Button: "Book a Walk Now" */}
        <ThemedView style={styles.bottomContainer}>
          <TouchableOpacity style={styles.bookWalkButton} onPress={handleBookWalk}>
            <ThemedText style={styles.bookWalkButtonText}>Book a Walk Now</ThemedText>
          </TouchableOpacity>
          
          <ThemedText style={styles.welcomeNote}>
            🏆 Welcome to the Dog Walker family!
          </ThemedText>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  completedStepsContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  completedStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  completedIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  completedText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  bottomContainer: {
    paddingBottom: 32,
    gap: 16,
  },
  bookWalkButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookWalkButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  welcomeNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});