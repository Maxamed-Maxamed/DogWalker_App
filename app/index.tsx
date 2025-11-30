import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Href, router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants';
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
      
      // Type the route correctly using as const assertion
      const routeMap: Record<'owner' | 'walker', Href> = {
        owner: '/owner' ,
        walker: '/walker',
      };
      
      const route = routeMap[selectedRole];
      router.replace(route);
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
      <StatusBar style="dark" translucent />
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
          style={[styles.roleCard, styles.ownerCard]}
          onPress={() => { void handleRoleSelect('owner'); }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Owner role"
          accessibilityHint="Select to use the app as a pet owner"
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBadge, styles.ownerIconBadge]}>
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
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={Colors.light.icon} 
              style={styles.chevron}
            />
          </View>
          
          {/* Feature highlights */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons 
                name="navigate" 
                size={16} 
                color={Colors.light.featureBlue} 
              />
              <Text style={styles.featureText}>GPS tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name="shield-checkmark" 
                size={16} 
                color={Colors.light.featureGreen} 
              />
              <Text style={styles.featureText}>Vetted walkers</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Walker Card */}
        <TouchableOpacity
          style={[styles.roleCard, styles.walkerCard]}
          onPress={() => { void handleRoleSelect('walker'); }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Walker role"
          accessibilityHint="Select to use the app as a dog walker"
        >
          <View style={styles.cardRow}>
            {/* <View style={[
              styles.iconBadge,
              { backgroundColor: Colors.light.walkerBadgeBg }
            ]}> */}
            <View style={[styles.iconBadge, styles.walkerIconBadge]}>
              <Ionicons 
                name="walk-outline" 
                size={28} 
                color={Colors.light.featureGreen} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.roleTitle}>Walker</Text>
              <Text style={styles.roleDescription}>
                Help pet owners and earn money
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={Colors.light.icon} 
              style={styles.chevron}
            />
          </View>
          
          {/* Feature highlights */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons 
                name="cash-outline" 
                size={16} 
                color={Colors.light.featureGreen} 
              />
              <Text style={styles.featureText}>Earn income</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons 
                name="time-outline" 
                size={16} 
                color={Colors.light.featureBlue} 
              />
              <Text style={styles.featureText}>Flexible hours</Text>
            </View>
          </View>
        </TouchableOpacity>

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
    marginTop: 16,
    color: Colors.light.icon,
    fontSize: 16,
    fontWeight: '500',
  },
  
  /* Hero Section */
  heroSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.light.background,
    paddingVertical: 32,
  },
  heroLogo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 4,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.icon,
    letterSpacing: 0.5,
  },
  
  /* Content Section */
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  
  /* Role Cards */
  roleCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 3,
  },
  ownerCard: {
    borderLeftColor: Colors.light.featureBlue,
  },
  walkerCard: {
    borderLeftColor: Colors.light.featureGreen,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

walkerIconBadge: {
   backgroundColor: Colors.light.walkerBadgeBg,
 },

  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  ownerIconBadge: {
    backgroundColor: Colors.light.ownerBadgeBg,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 4, 
  },
  chevron: {
    marginLeft: 8,
    opacity: 0.5,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  roleDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.light.icon,
    lineHeight: 24,
  },
  
  /* Feature Highlights */
  featuresRow: {
    flexDirection: 'row',
    gap: 16,
    paddingLeft: 72,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.light.icon,
    lineHeight: 24,
  },
});