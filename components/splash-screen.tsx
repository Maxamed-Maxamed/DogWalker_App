/**
 * CustomSplashScreen Component
 * 
 * Displays an animated splash screen during app initialization.
 * Shows DogWalker logo, app name, tagline, and loading animation.
 * 
 * The component waits for both auth and app state initialization before
 * fading out. It automatically hides when all stores are initialized and
 * ready for the main app experience.
 */

import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/authStore';
import { useSplashScreen } from '@/stores/splashScreenStore';

/**
 * Animated loading dots component
 * Creates a pulsing dots animation with staggered timing
 */
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
}

/**
 * Main CustomSplashScreen component
 * Waits for app initialization before fading out
 */
export function CustomSplashScreen() {
  const { isSplashVisible, hideSplash } = useSplashScreen();
  const { initialized: appInitialized, initializing: appInitializing } = useAppStateStore();
  const { isInitialized, isLoading } = useAuthStore();
  const ready = appInitialized && isInitialized && !appInitializing && !isLoading;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isSplashVisible || !ready) return;

    let animation: Animated.CompositeAnimation | undefined;
    // Show splash for 2 seconds, then fade out
    const timer = setTimeout(() => {
      animation = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      });
      animation.start(() => {
        hideSplash();
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
    animation?.stop();
    };
  }, [isSplashVisible, ready, fadeAnim, hideSplash]);

  if (!isSplashVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/newlogo.png')}
          style={styles.logo}
          contentFit="contain"
          transition={300}
        />

        {/* App Name and Tagline */}
        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.appName,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            DogWalker
          </Animated.Text>
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            Safe walks, happy pups
          </Animated.Text>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loaderContainer}>
          <LoadingDots />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: `${Colors.light.text}80`, // Add transparency
    letterSpacing: 0.3,
  },
  loaderContainer: {
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.tint,
  },
});
