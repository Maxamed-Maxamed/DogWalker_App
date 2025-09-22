import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Trusted Dog Walkers',
    description: 'All our walkers go through rigorous background checks and dog handling assessments.',
    icon: '🐕',
  },
  {
    id: 2,  
    title: 'Real-Time Tracking',
    description: 'Follow your dog\'s walk in real-time with GPS tracking and photo updates.',
    icon: '📍',
  },
  {
    id: 3,
    title: 'Safe & Secure',
    description: '24/7 emergency support, insurance coverage, and secure payment processing.',
    icon: '🛡️',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/welcome/get-started');
    }
  };

  const handleSkip = () => {
    router.push('/welcome/get-started');
  };

  // Secure slide data access without dynamic property access
  const getCurrentSlide = () => {
    // Validate index and return appropriate slide data statically
    if (currentIndex === 0) {
      return {
        id: 1,
        title: 'Trusted Dog Walkers',
        description: 'All our walkers go through rigorous background checks and dog handling assessments.',
        icon: '🐕',
      };
    } else if (currentIndex === 1) {
      return {
        id: 2,  
        title: 'Real-Time Tracking',
        description: 'Follow your dog\'s walk in real-time with GPS tracking and photo updates.',
        icon: '📍',
      };
    } else if (currentIndex === 2) {
      return {
        id: 3,
        title: 'Safe & Secure',
        description: '24/7 emergency support, insurance coverage, and secure payment processing.',
        icon: '🛡️',
      };
    } else {
      // Default fallback
      return {
        id: 1,
        title: 'Trusted Dog Walkers',
        description: 'All our walkers go through rigorous background checks and dog handling assessments.',
        icon: '🐕',
      };
    }
  };

  const currentSlide = getCurrentSlide();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={styles.skipText}>Skip</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.slideContainer}>
          <ThemedText style={styles.icon}>{currentSlide.icon}</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {currentSlide.title}
          </ThemedText>
          <ThemedText style={styles.description}>
            {currentSlide.description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.bottomContainer}>
          <ThemedView style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <ThemedView
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </ThemedView>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ThemedText style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </ThemedText>
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
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingTop: 20,
    paddingBottom: 20,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 40,
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
  },
  bottomContainer: {
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});