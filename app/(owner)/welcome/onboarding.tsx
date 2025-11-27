import { Colors } from '@/constants';
import { useRoleStore } from '@/stores/roleStore';
import { ThemedText } from '@/ui/ThemedText';
import { ThemedView } from '@/ui/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SlideAction = 'next' | 'createAccount' | 'signIn';

type SlideType = 'welcome' | 'why' | 'how' | 'peace' | 'final';

type Slide = {
  id: number; 
  type: SlideType;
  title: string;
  description?: string;
  primaryCta: string;
  primaryAction: SlideAction;
  secondaryCta?: string;
  secondaryAction?: SlideAction;
  showSkip?: boolean;
};

const primaryColor = Colors.light.tint;

const slides: Slide[] = [
  {
    id: 1,
    type: 'welcome',
    title: 'Welcome to DogWalker',
    description: 'Trusted walkers. Happy pups.',
    primaryCta: "Let's Go",
    primaryAction: 'next',
    secondaryCta: 'Learn more',
    secondaryAction: 'next',
    showSkip: true,
  },
  {
    id: 2,
    type: 'why',
    title: 'Why it matters',
    description: 'Vetted walkers who treat your pup like family.',
    primaryCta: 'Next',
    primaryAction: 'next',
    showSkip: true,
  },
  {
    id: 3,
    type: 'how',
    title: 'How it works',
    description: 'Book, track, and get photo updates in minutes.',
    primaryCta: 'Next',
    primaryAction: 'next',
    showSkip: true,
  },
  {
    id: 4,
    type: 'peace',
    title: 'Peace of mind',
    description: 'Thousands of walks completed with 4.9★ reviews.',
    primaryCta: 'Get Started',
    primaryAction: 'next',
    showSkip: true,
  },
  {
    id: 5,
    type: 'final',
    title: 'Ready to book your first walk?',
    description: 'Create your account to schedule your first walk in minutes.',
    primaryCta: 'Create account',
    primaryAction: 'createAccount',
    secondaryCta: 'I already have an account',
    secondaryAction: 'signIn',
    showSkip: false,
  },
];

export default function OnboardingScreen() {
  const { clearRole } = useRoleStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  const currentSlide = slides[currentIndex];
  const isFinalSlide = currentSlide.type === 'final';

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
  }, [currentIndex, fadeAnim, slideAnim]);

  const animateOutAnd = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -50, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      animateOutAnd(() => { setCurrentIndex((index) => Math.min(index + 1, slides.length - 1)); });
    }
  };

  const handleSkip = () => {
    Haptics.selectionAsync();
    // Skip to the final slide to show account creation options
    animateOutAnd(() => { setCurrentIndex(slides.length - 1); });
  };

  const handleGoBack = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await clearRole();
      router.back();
    } catch (error) {
      console.error('Failed to go back:', error);
    }
  };

  const handleCreateAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    Haptics.selectionAsync();
    router.push('/auth/login');
  };

  const handlePrimaryPress = () => {
    if (currentSlide.primaryAction === 'createAccount') {
      handleCreateAccount();
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleNext();
  };

  const handleSecondaryPress = () => {
    if (!currentSlide.secondaryAction) return;

    Haptics.selectionAsync();

    if (currentSlide.secondaryAction === 'signIn') {
      handleSignIn();

      return;
    }

    handleNext();
  };

  const handleLegalPress = () => {
    Haptics.selectionAsync();
    // TODO: Navigate to legal page or open legal URL when implemented
  };

  const renderWelcome = () => (
    <View style={styles.centerContent}>
      <View style={styles.brandRow}>
        <Image source={require('@/assets/images/newlogo.png')} style={styles.brandLogo} resizeMode="contain" />
        <ThemedText style={styles.brandName}>DogWalker</ThemedText>
      </View>
      <ThemedText style={styles.title}>{currentSlide.title}</ThemedText>
      <ThemedText style={styles.subtitle}>{currentSlide.description}</ThemedText>
    </View>
  );

  const renderWhy = () => (
    <View style={styles.centerContent}>
      <View style={styles.heroCard}>
        <Image
          source={require('@/assets/images/happydog.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.badgeCluster}>
        {['Background checks', 'Insurance', '24/7 support'].map((label) => (
          <View key={label} style={styles.badge}>
            <Ionicons name="checkmark-circle" size={16} color={primaryColor} />
            <ThemedText style={styles.badgeText}>{label}</ThemedText>
          </View>
        ))}
      </View>
      <ThemedText style={styles.title}>{currentSlide.title}</ThemedText>
      <ThemedText style={styles.subtitle}>{currentSlide.description}</ThemedText>
    </View>
  );

  const renderHow = () => {
    const steps = [
      { icon: 'flash-outline' as const, title: 'Book in minutes', body: 'Pick a walker, set the time, confirm.' },
      { icon: 'navigate-outline' as const, title: 'GPS-tracked walks', body: 'Follow every step in real time.' },
      { icon: 'camera-outline' as const, title: 'Photo updates', body: 'See their tail wags after each walk.' },
    ];

    return (
      <View style={styles.centerContent}>
        <ThemedText style={styles.title}>{currentSlide.title}</ThemedText>
        <ThemedText style={styles.subtitle}>{currentSlide.description}</ThemedText>
        <View style={styles.cardGrid}>
          {steps.map((step) => (
            <View key={step.title} style={styles.infoCard}>
              <View style={styles.infoIconWrap}>
                <Ionicons name={step.icon} size={24} color={primaryColor} />
              </View>
              <ThemedText style={styles.infoTitle}>{step.title}</ThemedText>
              <ThemedText style={styles.infoBody}>{step.body}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPeace = () => (
    <View style={styles.centerContent}>
      <View style={styles.ratingCard}>
        <View style={styles.ratingHeader}>
          <Ionicons name="star" size={24} color="#FACC15" />
          <View>
            <ThemedText style={styles.ratingValue}>4.9</ThemedText>
            <ThemedText style={styles.ratingLabel}>Avg. walker rating</ThemedText>
          </View>
        </View>
        <View style={styles.ratingBody}>
          <View style={styles.avatarRow}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.avatar, { zIndex: 3 - i, marginLeft: i === 0 ? 0 : -12 }]}>
                <Ionicons name="paw" size={16} color="#fff" />
              </View>
            ))}
          </View>
          <ThemedText style={styles.ratingQuote}>“Always on time, always caring.”</ThemedText>
          <ThemedText style={styles.ratingAuthor}>— Maria & Max</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.title}>{currentSlide.title}</ThemedText>
      <ThemedText style={styles.subtitle}>{currentSlide.description}</ThemedText>
    </View>
  );

  const renderFinal = () => (
    <View style={styles.centerContent}>
      <View style={styles.finalCard}>
        <ThemedText style={styles.finalTitle}>{currentSlide.title}</ThemedText>
        <ThemedText style={styles.finalBody}>{currentSlide.description}</ThemedText>
        <View style={styles.finalHighlights}>
          {['Schedule in 60 seconds', 'Background-checked walkers', 'Live GPS + photo recap'].map((item) => (
            <View key={item} style={styles.highlightRow}>
              <Ionicons name="paw" size={16} color={primaryColor} />
              <ThemedText style={styles.highlightText}>{item}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case 'welcome':
        return renderWelcome();
      case 'why':
        return renderWhy();
      case 'how':
        return renderHow();
      case 'peace':
        return renderPeace();
      case 'final':
        return renderFinal();
      default:
        return null;
    }
  };

  return (
    // <SafeAreaView style={styles.container}>
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      <ThemedView style={styles.content}>
        {/* Back button in top-left corner */}
        <TouchableOpacity style={styles.backButton} onPress={() => { void handleGoBack(); }}>
          <Ionicons name="arrow-back" size={24} color="#475569" />
        </TouchableOpacity>

        {currentSlide.showSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <ThemedText style={styles.skipText}>Skip</ThemedText>
          </TouchableOpacity>
        )}

        <Animated.View
          style={[
            styles.slideContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderSlideContent()}
        </Animated.View>

        <ThemedView style={styles.bottomContainer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <Ionicons
                key={index}
                name={index === currentIndex ? 'paw' : 'paw-outline'}
                size={index === currentIndex ? 14 : 12}
                color={index === currentIndex ? primaryColor : '#CBD5E1'}
                style={styles.paginationIcon}
              />
            ))}
          </View>

          {!isFinalSlide ? (
            <View style={styles.actionsStack}>
              <TouchableOpacity style={styles.primaryButton} onPress={handlePrimaryPress} activeOpacity={0.9}>
                <ThemedText style={styles.primaryButtonText}>{currentSlide.primaryCta}</ThemedText>
              </TouchableOpacity>
              {currentSlide.secondaryCta && (
                <Pressable style={styles.secondaryLink} onPress={handleSecondaryPress} hitSlop={8}>
                  <ThemedText style={styles.secondaryLinkText}>{currentSlide.secondaryCta}</ThemedText>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.actionsStack}>
              <TouchableOpacity style={styles.finalPrimaryButton} onPress={handlePrimaryPress} activeOpacity={0.9}>
                <ThemedText style={styles.finalPrimaryButtonText}>{currentSlide.primaryCta}</ThemedText>
              </TouchableOpacity>
              {currentSlide.secondaryCta && (
                <TouchableOpacity style={styles.finalSecondaryButton} onPress={handleSecondaryPress} activeOpacity={0.8}>
                  <ThemedText style={styles.finalSecondaryButtonText}>{currentSlide.secondaryCta}</ThemedText>
                </TouchableOpacity>
              )}
              <Pressable style={styles.legalLink} onPress={handleLegalPress}>
                <ThemedText style={styles.legalText}>Terms & Privacy</ThemedText>
              </Pressable>
            </View>
          )}
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    zIndex: 10,
    padding: 8,
  },
  skipButton: {
    // alignSelf: 'flex-end',
    // paddingTop: 20,
    // paddingBottom: 16,
    // paddingHorizontal: 4,
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
  centerContent: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  heroCard: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  badgeCluster: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFFEE',
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  cardGrid: {
    width: '100%',
    gap: 12,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#F8FAFC',
    
    
    
  },
  infoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  infoBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  ratingCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#0F172A',
    gap: 16,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  ratingBody: {
    gap: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingQuote: {
    fontSize: 16,
    color: '#F8FAFC',
    fontStyle: 'italic',
  },
  ratingAuthor: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  finalCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  finalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 30,
    textAlign: 'center',
  },
  finalBody: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
  },
  finalHighlights: {
    gap: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  bottomContainer: {
    paddingBottom: Platform.OS === 'ios' ? 16 : 40,
  alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  paginationIcon: {
    opacity: 0.9,
  },
  actionsStack: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: primaryColor,
    alignItems: 'center',
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLink: {
    paddingVertical: 4,
  },
  secondaryLinkText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
  },
  finalPrimaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: primaryColor,
    alignItems: 'center',
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  finalPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  finalSecondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  finalSecondaryButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
  legalLink: {
    paddingVertical: 4,
  },
  legalText: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'underline',
  },
});
