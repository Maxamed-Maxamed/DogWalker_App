import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, DesignTokens } from '@/constants';
import { useRoleStore } from '@/stores/roleStore';



/**
 * Role Selection Screen
 * Hero-driven card selection matching welcome and home screen patterns
 */
export default function RoleSelectionScreen() {
  const { isLoading, setRole } = useRoleStore();
  const [selecting, setSelecting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSelecting(false);
    }, [])
  );

  const handleRoleSelect = async (selectedRole: 'owner' | 'walker') => {
    try {
      setSelecting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setRole(selectedRole);
      
      const route = selectedRole === 'owner' ? '/owner' : '/walker';
      router.replace(route as unknown as Href);
    } catch (error) {
      console.error('Failed to set role:', error);
      setSelecting(false);
    }
  };

  if (isLoading || selecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>
          {selecting ? 'Setting up your experience...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={require('@/assets/images/newlogo.png')}
          style={styles.heroLogo}
          resizeMode="contain"
        />
        <View style={styles.heroContent}>
          <Text style={styles.title}>DogWalker</Text>
          <Text style={styles.subtitle}>Choose Your Role</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Owner Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => { void handleRoleSelect('owner'); }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Owner role"
          accessibilityHint="Select to use the app as a pet owner"
        >
          <View style={styles.cardRow}>
            <View style={[
              styles.iconBadge,
              { backgroundColor: `${Colors.light.tint}15` }
            ]}>
              <Ionicons 
                name="home-outline" 
                size={28} 
                color={Colors.light.tint} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.roleTitle}>Owner</Text>
              <Text style={styles.roleDescription}>
                Find trusted walkers for your furry friends
              </Text>
            </View>
          </View>
          
          {/* Feature highlights */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons 
                name="navigate" 
                size={16} 
                color={DesignTokens.colors.semantic.info} 
              />
              <Text style={styles.featureText}>GPS tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name="shield-checkmark" 
                size={16} 
                color={DesignTokens.colors.semantic.success} 
              />
              <Text style={styles.featureText}>Vetted walkers</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Walker Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => { void handleRoleSelect('walker'); }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Walker role"
          accessibilityHint="Select to use the app as a dog walker"
        >
          <View style={styles.cardRow}>
            <View style={[
              styles.iconBadge,
              { backgroundColor: `${DesignTokens.colors.semantic.success}15` }
            ]}>
              <Ionicons 
                name="walk-outline" 
                size={28} 
                color={DesignTokens.colors.semantic.success} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.roleTitle}>Walker</Text>
              <Text style={styles.roleDescription}>
                Help pet owners and earn money
              </Text>
            </View>
          </View>
          
          {/* Feature highlights */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons 
                name="cash-outline" 
                size={16} 
                color={DesignTokens.colors.semantic.success} 
              />
              <Text style={styles.featureText}>Earn income</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name="time-outline" 
                size={16} 
                color={DesignTokens.colors.semantic.info} 
              />
              <Text style={styles.featureText}>Flexible hours</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          You can change this anytime in settings
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: DesignTokens.spacing.md,
    color: Colors.light.icon,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.medium,
  },
  
  /* Hero Section */
  heroSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
    backgroundColor: Colors.light.background,
  },
  heroLogo: {
    width: 100,
    height: 100,
    marginBottom: DesignTokens.spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: DesignTokens.typography.sizes['5xl'],
    fontWeight: DesignTokens.typography.weights.extrabold,
    color: Colors.light.text,
    marginBottom: DesignTokens.spacing.xs,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: DesignTokens.typography.weights.medium,
    color: Colors.light.icon,
    letterSpacing: 0.5,
  },
  
  /* Content Section */
  contentSection: {
    flex: 0.6,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.lg,
  },
  
  /* Role Cards */
  roleCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: DesignTokens.borderRadius.xl,
    padding: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.md,
    ...DesignTokens.shadows.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: DesignTokens.spacing.md,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DesignTokens.spacing.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: DesignTokens.typography.sizes['2xl'],
    fontWeight: DesignTokens.typography.weights.bold,
    color: Colors.light.text,
    marginBottom: DesignTokens.spacing.xs,
    letterSpacing: 0.3,
  },
  roleDescription: {
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.regular,
    color: Colors.light.icon,
    lineHeight: DesignTokens.typography.sizes.base * DesignTokens.typography.lineHeights.normal,
  },
  
  /* Feature Highlights */
  featuresRow: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.md,
    paddingLeft: 56 + DesignTokens.spacing.md, // Align with card content
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  },
  featureText: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.medium,
    color: Colors.light.icon,
  },
  
  /* Footer */
  footer: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.regular,
    color: Colors.light.icon,
    textAlign: 'center',
    marginTop: DesignTokens.spacing.lg,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
