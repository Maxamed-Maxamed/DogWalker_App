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
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/authStore';
import { useSplashScreen } from '@/stores/splashScreenStore';

/**
 * Animated loading dots component
 * Creates a pulsing dots animation with staggered timing
 * @param dotStyle - Dynamic styles to apply to each dot (e.g., backgroundColor)
 */
function LoadingDots({ dotStyle }: { dotStyle: Record<string, unknown> }) {
  
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
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
      );
    };

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 150);
    const anim3 = animateDot(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }, dotStyle]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }, dotStyle]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }, dotStyle]} />
    </View>
  );
}

/**
 * Main CustomSplashScreen component
 * Waits for app initialization before fading out
 */
export function CustomSplashScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { isSplashVisible, hideSplash } = useSplashScreen();
  const { initialized: appInitialized, initializing: appInitializing } = useAppStateStore();
  const { isInitialized, isLoading } = useAuthStore();
  const ready = appInitialized && isInitialized && !appInitializing && !isLoading;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const dynamicStyles = useMemo(() => createStyles(colors), [colors]);

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
    <Animated.View style={[dynamicStyles.container, { opacity: fadeAnim }]}>
      <View style={dynamicStyles.content}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/newlogo.png')}
          style={dynamicStyles.logo}
          contentFit="contain"
          transition={300}
        />

        {/* App Name and Tagline */}
        <View style={dynamicStyles.textContainer}>
          <Animated.Text
            style={[
              dynamicStyles.appName,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            DogWalker
          </Animated.Text>
          <Animated.Text
            style={[
              dynamicStyles.tagline,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            Safe walks, happy pups
          </Animated.Text>
        </View>

        {/* Loading Indicator */}
        <View style={dynamicStyles.loaderContainer}>
          <LoadingDots dotStyle={{ backgroundColor: colors.tint }} />
        </View>
      </View>
    </Animated.View>
  );
}

/**
 * Create dynamic styles based on the current color scheme
 */
function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.background,
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
      color: colors.text,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    tagline: {
      fontSize: 14,
      color: `${colors.text}80`, // Add transparency
      letterSpacing: 0.3,
    },
    loaderContainer: {
      marginTop: 20,
    },
  });
}

const styles = StyleSheet.create({
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
  },
});
