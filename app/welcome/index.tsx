import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Image, Linking, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const PRIMARY_COLOR = Colors.light.tint;
const TERMS_URL = 'https://dogwalker.app/legal';

const KEY_FEATURES: { icon: IconName; title: string; color: string }[] = [
  { icon: 'navigate', title: 'GPS tracking', color: '#3B82F6' },
  { icon: 'shield-checkmark', title: 'Vetted walkers', color: '#10B981' },
  { icon: 'camera', title: 'Photo updates', color: '#8B5CF6' },
];

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleGetStarted = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/welcome/onboarding');
  }, []);

  const handleSignIn = useCallback(() => {
    Haptics.selectionAsync();
    router.push('/auth/login');
  }, []);

  const handleLegal = useCallback(async () => {
    Haptics.selectionAsync();
    try {
      const supported = await Linking.canOpenURL(TERMS_URL);
      if (supported) {
        await Linking.openURL(TERMS_URL);
      }
    } catch (error) {
      console.error('Failed to open legal URL:', error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Hero Section - Top Half */}
      <View style={styles.heroSection}>
        <Image
          source={require('@/assets/images/newlogo.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Content Section - Bottom Half */}
      <ThemedView style={[styles.bottomSection, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
          {/* Features Card */}
          <View style={[styles.featuresCard, { backgroundColor: isDark ? '#1F2937' : '#F8FAFC' }]}>
            {KEY_FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureRow}>
                <View style={[styles.featureIconWrapper, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon} size={24} color={feature.color} />
                </View>
                <ThemedText style={styles.featureText}>{feature.title}</ThemedText>
              </View>
            ))}
          </View>

          {/* Tagline */}
          <ThemedText style={styles.tagline}>Safe walks, happy pups</ThemedText>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted} activeOpacity={0.9}>
              <ThemedText style={styles.primaryButtonText}>Get Started</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleSignIn} activeOpacity={0.8}>
              <ThemedText style={[styles.secondaryButtonText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Already have an account? Sign in
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Legal Link */}
          <Pressable onPress={handleLegal} hitSlop={8} style={styles.legalContainer}>
            <ThemedText style={[styles.legalText, { color: isDark ? '#6B7280' : '#94A3B8' }]}>
              By continuing you agree to our Terms & Privacy
            </ThemedText>
          </Pressable>
        </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    flex: 0.5, // Takes 50% of available space
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    flex: 1, // Takes 50% of available space
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  featuresCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginTop: 16,
  },
  ctaContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  legalContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  legalText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
});
