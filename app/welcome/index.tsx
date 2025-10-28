import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const PRIMARY_COLOR = Colors.light.tint;
const TERMS_URL = 'https://dogwalker.app/legal';

const DECORATIVE_ICONS: { name: IconName; size: number }[] = [
  { name: 'paw-outline', size: 18 },
  { name: 'ellipse', size: 6 },
  { name: 'paw-outline', size: 14 },
];

const HERO_BADGES: { label: string; icon: IconName }[] = [
  { label: 'Vetted walkers', icon: 'shield-checkmark-outline' },
  { label: 'Live GPS', icon: 'navigate-outline' },
];

const TRUST_POINTS = ['Insured', '24/7 support', 'Photo updates'];

type AnimatedStyle = Animated.WithAnimatedValue<StyleProp<ViewStyle>>;

type WelcomePalette = {
  background: string;
  headline: string;
  subtitle: string;
  heroCard: string;
  heroBadgeBg: string;
  heroBadgeBorder: string;
  trustChipBg: string;
  trustChipBorder: string;
  trustChipText: string;
  secondaryText: string;
  legalText: string;
  topDecorColors: string[];
};

function useWelcomePalette(): WelcomePalette {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return useMemo(
    () => ({
      background: isDark ? Colors.dark.background : Colors.light.background,
      headline: isDark ? Colors.dark.text : '#0f172a',
      subtitle: isDark ? '#cbd5f5' : '#64748b',
      heroCard: isDark ? '#1f2937' : '#eef2ff',
      heroBadgeBg: isDark ? '#1f2937ee' : '#ffffffee',
      heroBadgeBorder: isDark ? '#334155' : '#dbeafe',
      trustChipBg: isDark ? '#1f2a37' : '#f8fafc',
      trustChipBorder: isDark ? '#334155' : '#e2e8f0',
      trustChipText: isDark ? '#e2e8f0' : '#334155',
      secondaryText: isDark ? '#cbd5f5' : '#475569',
      legalText: isDark ? '#94a3b8' : '#94a3b8',
      topDecorColors: isDark ? ['#1f2937', '#334155', '#1f2937'] : ['#cbd5e1', '#e2e8f0', '#e5e7eb'],
    }),
    [isDark]
  );
}

function useWelcomeAnimations(chipCount: number) {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(16)).current;
  const badgeFloat = useRef(new Animated.Value(0)).current;
  const chipScalesRef = useRef<Animated.Value[]>([]);

  if (chipScalesRef.current.length !== chipCount) {
    chipScalesRef.current = Array.from({ length: chipCount }, (_, index) => chipScalesRef.current[index] ?? new Animated.Value(1));
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgeFloat, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(badgeFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();

    return () => {
      floatLoop.stop();
    };
  }, [badgeFloat, heroOpacity, heroTranslateY]);

  const heroAnimatedStyle = useMemo<AnimatedStyle>(
    () => ({
      opacity: heroOpacity,
      transform: [{ translateY: heroTranslateY }],
    }),
    [heroOpacity, heroTranslateY]
  );

  const badgeAnimatedStyles = useMemo<AnimatedStyle[]>(
    () =>
      HERO_BADGES.map((_, index) => {
        const outputRange = index === 0 ? [0, -3] : [-2, 1];
        return {
          transform: [
            {
              translateY: badgeFloat.interpolate({
                inputRange: [0, 1],
                outputRange,
              }),
            },
          ],
        };
      }),
    [badgeFloat]
  );

  const chipAnimatedStyles = chipScalesRef.current.map<AnimatedStyle>((scale) => ({
    transform: [{ scale }],
  }));

  const animateChip = useCallback((index: number, toValue: number) => {
    const scale = chipScalesRef.current[index];
    if (!scale) return;

    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      stiffness: 300,
      damping: 20,
      mass: 0.6,
    }).start();
  }, []);

  const handleChipPressIn = useCallback((index: number) => animateChip(index, 0.96), [animateChip]);
  const handleChipPressOut = useCallback((index: number) => animateChip(index, 1), [animateChip]);

  return {
    heroAnimatedStyle,
    badgeAnimatedStyles,
    chipAnimatedStyles,
    handleChipPressIn,
    handleChipPressOut,
  };
}

type HeroSectionProps = {
  animatedStyle: AnimatedStyle;
  badgeAnimatedStyles: AnimatedStyle[];
  palette: WelcomePalette;
};

function HeroSection({ animatedStyle, badgeAnimatedStyles, palette }: HeroSectionProps) {
  return (
    <Animated.View style={[styles.heroSection, animatedStyle]}>
      <View style={styles.brandRow}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <ThemedText style={[styles.brandName, { color: palette.subtitle }]}>DogWalker</ThemedText>
      </View>

      <ThemedText style={[styles.mainHeadline, { color: palette.headline }]}>Happy walks start here</ThemedText>
      <ThemedText style={[styles.subtitle, { color: palette.subtitle }]}>Book trusted walkers in minutes—GPS tracked, insured, and loved.</ThemedText>

      <View style={[styles.heroCard, { backgroundColor: palette.heroCard }]}>
        <Image
          source={require('@/assets/images/Gemini_Generated_Image_qd6nk9qd6nk9qd6n.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {HERO_BADGES.map((badge, index) => (
          <Animated.View
            key={badge.label}
            style={[
              styles.badge,
              index === 1 && styles.badgeRight,
              { borderColor: palette.heroBadgeBorder, backgroundColor: palette.heroBadgeBg },
              badgeAnimatedStyles[index],
            ]}
          >
            <Ionicons name={badge.icon} size={14} color={PRIMARY_COLOR} />
            <ThemedText style={[styles.badgeText, { color: PRIMARY_COLOR }]}>{badge.label}</ThemedText>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}

type TrustChipsRowProps = {
  chipAnimatedStyles: AnimatedStyle[];
  onPressIn: (index: number) => void;
  onPressOut: (index: number) => void;
  palette: WelcomePalette;
};

function TrustChipsRow({ chipAnimatedStyles, onPressIn, onPressOut, palette }: TrustChipsRowProps) {
  return (
    <ThemedView style={styles.trustRow}>
      {TRUST_POINTS.map((label, index) => (
        <Animated.View
          key={label}
          style={[styles.trustChip, { backgroundColor: palette.trustChipBg, borderColor: palette.trustChipBorder }, chipAnimatedStyles[index]]}
        >
          <Pressable onPressIn={() => onPressIn(index)} onPressOut={() => onPressOut(index)} hitSlop={10}>
            <View style={styles.trustChipInner}>
              <Ionicons name="checkmark-circle" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.trustChipText, { color: palette.trustChipText }]}>{label}</ThemedText>
            </View>
          </Pressable>
        </Animated.View>
      ))}
    </ThemedView>
  );
}

type CallToActionsProps = {
  onCreateAccount: () => void;
  onSignIn: () => void;
  onLegal: () => void;
  palette: WelcomePalette;
};

function CallToActions({ onCreateAccount, onSignIn, onLegal, palette }: CallToActionsProps) {
  return (
    <ThemedView style={styles.ctaSection}>
      <TouchableOpacity style={styles.primaryButton} onPress={onCreateAccount} activeOpacity={0.9}>
        <ThemedText style={styles.primaryButtonText}>Create account</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onSignIn} activeOpacity={0.8}>
        <ThemedText style={[styles.secondaryButtonText, { color: palette.secondaryText }]}>I already have an account</ThemedText>
      </TouchableOpacity>
      <Pressable onPress={onLegal} hitSlop={8}>
        <ThemedText style={[styles.legalText, { color: palette.legalText }]}>By continuing you agree to our Terms & Privacy.</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

function TopDecorRow({ colors }: { colors: string[] }) {
  return (
    <View style={styles.topDecor}>
      {DECORATIVE_ICONS.map(({ name, size }, index) => (
        <Ionicons key={`${name}-${index}`} name={name} size={size} color={colors[index] ?? colors[colors.length - 1]} />
      ))}
    </View>
  );
}

export default function WelcomeScreen() {
  const palette = useWelcomePalette();
  const { heroAnimatedStyle, badgeAnimatedStyles, chipAnimatedStyles, handleChipPressIn, handleChipPressOut } =
    useWelcomeAnimations(TRUST_POINTS.length);

  const handleGetStarted = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/welcome/onboarding');
  }, []);

  const handleSignIn = useCallback(() => {
    Haptics.selectionAsync();
    router.push('/sign-in');
  }, []);

  const handleLegal = useCallback(async () => {
    Haptics.selectionAsync();
    try {
      const supported = await Linking.canOpenURL(TERMS_URL);
      if (supported) {
        await Linking.openURL(TERMS_URL);
      }
    } catch (error) {
      // Fail silently if link cannot be opened.
      console.error(error);
    }
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ThemedView style={styles.content}>
        <TopDecorRow colors={palette.topDecorColors} />
        <HeroSection animatedStyle={heroAnimatedStyle} badgeAnimatedStyles={badgeAnimatedStyles} palette={palette} />
        <TrustChipsRow
          chipAnimatedStyles={chipAnimatedStyles}
          onPressIn={handleChipPressIn}
          onPressOut={handleChipPressOut}
          palette={palette}
        />
        <CallToActions onCreateAccount={handleGetStarted} onSignIn={handleSignIn} onLegal={handleLegal} palette={palette} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 24,
  },
  topDecor: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  heroSection: { alignItems: 'center', paddingTop: 10 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  logo: { width: 32, height: 32, borderRadius: 16 },
  brandName: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  mainHeadline: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  heroCard: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 12,
    backgroundColor: '#eef2ff',
    position: 'relative',
  },
  heroImage: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#ffffffee',
    borderWidth: 1,
  },
  badgeRight: { left: undefined, right: 12 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 999,
    minWidth: 110,
  },
  trustChipInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trustChipText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  ctaSection: {
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingTop: 24,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  legalText: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
});
