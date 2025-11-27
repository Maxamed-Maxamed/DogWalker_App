import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useRoleStore } from '@/stores/roleStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width > 600 ? 280 : width * 0.42;

/**
 * Role Selection Screen
 * Premium UI for users to choose between Owner or Walker roles
 */
export default function RoleSelectionScreen() {
  const { isLoading, setRole } = useRoleStore();
  const [selecting, setSelecting] = useState(false);

  // Pulse animation for cards
  const scale = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      setSelecting(false);
    }, [])
  );

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [
    scale
  ]);

  const handleRoleSelect = async (selectedRole: 'owner' | 'walker') => {
    try {
      setSelecting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setRole(selectedRole);
      
      // Navigate to the appropriate role group
      // Using unknown + Href cast for type safety instead of any
      const route = selectedRole === 'owner' ? '/owner' : '/walker';
      router.replace(route as unknown as Href);
    } catch (error) {
      console.error('Failed to set role:', error);
      setSelecting(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (isLoading || selecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>
          {selecting ? 'Setting up your experience...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#312e81']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>DogWalker</Text>
        <Text style={styles.subtitle}>Choose Your Role</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Owner Card */}
        <Animated.View style={[styles.cardWrapper, animatedStyle]}>
          <Pressable
            onPress={() => handleRoleSelect('owner')}
            style={({ pressed }) => [
              styles.pressable,
              pressed && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={['#f59e0b', '#f97316', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🏠</Text>
              </View>
              <Text style={styles.roleTitle}>Owner</Text>
              <Text style={styles.roleDescription}>
                Find trusted walkers for your furry friends
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Walker Card */}
        <Animated.View style={[styles.cardWrapper, animatedStyle]}>
          <Pressable
            onPress={() => handleRoleSelect('walker')}
            style={({ pressed }) => [
              styles.pressable,
              pressed && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={['#0ea5e9', '#06b6d4', '#14b8a6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🐕</Text>
              </View>
              <Text style={styles.roleTitle}>Walker</Text>
              <Text style={styles.roleDescription}>
                Help pet owners and earn money
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>

      <Text style={styles.footer}>
        You can change this anytime in settings
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '300',
  },
  cardsContainer: {
    flexDirection: width > 600 ? 'row' : 'column',
    gap: 24,
    marginBottom: 40,
  },
  cardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  pressable: {
    borderRadius: 24,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  card: {
    width: CARD_WIDTH,
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    minHeight: 280,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  roleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  roleDescription: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  footer: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
