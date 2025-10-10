import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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
        {/* Hero Section with Logo */}
        <ThemedView style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {/* Main Headline - Clean & Bold */}
          <ThemedText style={styles.mainHeadline}>
            Safe walks for{'\n'}happy dogs
          </ThemedText>
          
          {/* Subtitle - Simple & Clear */}
          <ThemedText style={styles.subtitle}>
            Professional, vetted walkers in your neighborhood
          </ThemedText>
        </ThemedView>

        {/* Trust Indicators - Subtle & Professional */}
        <ThemedView style={styles.trustSection}>
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              </View>
              <ThemedText style={styles.trustText}>Vetted walkers</ThemedText>
            </View>
            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              </View>
              <ThemedText style={styles.trustText}>GPS tracking</ThemedText>
            </View>
            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              </View>
              <ThemedText style={styles.trustText}>24/7 support</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Call-to-Action Section */}
        <ThemedView style={styles.ctaSection}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <ThemedText style={styles.primaryButtonText}>Get Started as Pet Owner</ThemedText>
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
  
  // Hero Section - Clean & Minimalist
  heroSection: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  mainHeadline: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    paddingHorizontal: 8,
  },
  
  // Trust Section - Subtle & Professional
  trustSection: {
    paddingVertical: 32,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  trustText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  
  // CTA Section - Uber-style Clean Buttons
  ctaSection: {
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 46,
    paddingTop: 32,
    marginTop: 32,
    paddingHorizontal: 16,

  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
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
});