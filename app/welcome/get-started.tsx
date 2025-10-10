import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function GetStartedScreen() {
  const colorScheme = useColorScheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Logo and Branding Section */}
        <ThemedView style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <ThemedText style={styles.appName}>Dog Walker</ThemedText>
          <ThemedText style={styles.tagline}>
            The most trusted dog walking service
          </ThemedText>
        </ThemedView>

        {/* Main Value Proposition */}
        <ThemedView style={styles.valueSection}>
          <ThemedText style={styles.mainHeading}>
            Peace of mind for you,{'\n'}adventure for your dog
          </ThemedText>
          <ThemedText style={styles.description}>
            Professional, vetted dog walkers ready to give your furry friend the exercise and attention they deserve.
          </ThemedText>
        </ThemedView>

        {/* Trust Indicators */}
        <ThemedView style={styles.trustSection}>
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <ThemedText style={styles.trustEmoji}>🛡️</ThemedText>
              </View>
              <ThemedText style={styles.trustText}>Multi-stage{'\n'}vetting</ThemedText>
            </View>
            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <ThemedText style={styles.trustEmoji}>📍</ThemedText>
              </View>
              <ThemedText style={styles.trustText}>Real-time{'\n'}GPS tracking</ThemedText>
            </View>
            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <ThemedText style={styles.trustEmoji}>📱</ThemedText>
              </View>
              <ThemedText style={styles.trustText}>Photo{'\n'}updates</ThemedText>
            </View>
            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <ThemedText style={styles.trustEmoji}>�</ThemedText>
              </View>
              <ThemedText style={styles.trustText}>Fully{'\n'}insured</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* CTA Buttons */}
        <ThemedView style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <ThemedText style={styles.primaryButtonText}>Get Started</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.secondaryButtonText}>Already have an account? Sign in</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Bottom Trust Badge */}
        <ThemedView style={styles.bottomSection}>
          <View style={styles.trustBadge}>
            <ThemedText style={styles.trustBadgeText}>
              ⭐ Trusted by thousands of pet owners
            </ThemedText>
          </View>
          <ThemedText style={styles.disclaimerText}>
            24/7 customer support • Background-checked walkers • Full insurance coverage
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    justifyContent: 'space-between',
  },
  brandSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  valueSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  trustSection: {
    paddingVertical: 20,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trustEmoji: {
    fontSize: 24,
  },
  trustText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  ctaSection: {
    paddingBottom: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 12,
  },
  trustBadge: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trustBadgeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
