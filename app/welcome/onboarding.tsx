import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const slides = [
  {
    id: 1,
    title: 'Your dog\'s happiness\nis our priority',
    subtitle: 'Professional care',
    description: 'Every walker is thoroughly vetted, background-checked, and trained in dog safety protocols.',
    illustration: '🐕‍🦺',
    color: '#007AFF',
  },
  {
    id: 2,
    title: 'Never wonder where\nyour pup is',
    subtitle: 'Live tracking',
    description: 'Watch your dog\'s adventure unfold with real-time GPS tracking and instant photo updates.',
    illustration: '📱',
    color: '#007AFF',
  },
  {
    id: 3,
    title: 'Book a walk in\nseconds',
    subtitle: 'Instant booking',
    description: 'Schedule now or later. Your perfect walker is just a tap away, available 24/7.',
    illustration: '⚡',
    color: '#007AFF',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -50, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setCurrentIndex(currentIndex + 1);
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
        ]).start();
      });
    } else {
      router.push('/welcome/get-started');
    }
  };

  const handleSkip = () => {
    router.push('/welcome/get-started');
  };

  const currentSlide = slides[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={styles.skipText}>Skip</ThemedText>
        </TouchableOpacity>

        <Animated.View 
          style={[
            styles.slideContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.illustrationContainer, { backgroundColor: currentSlide.color + '15' }]}>
            <ThemedText style={styles.illustration}>{currentSlide.illustration}</ThemedText>
          </View>

          <ThemedText style={[styles.subtitle, { color: currentSlide.color }]}>
            {currentSlide.subtitle}
          </ThemedText>

          <ThemedText style={styles.title}>
            {currentSlide.title}
          </ThemedText>

          <ThemedText style={styles.description}>
            {currentSlide.description}
          </ThemedText>
        </Animated.View>

        <ThemedView style={styles.bottomContainer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && [styles.paginationDotActive, { backgroundColor: currentSlide.color }],
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: currentSlide.color }]} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
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
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  skipText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    fontSize: 64,
    lineHeight: 74,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  bottomContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
