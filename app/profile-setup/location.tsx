import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LocationSetupScreen() {
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  const handleAllowLocation = async () => {
    try {
      // TODO: Request actual location permissions
      // const { status } = await Location.requestForegroundPermissionsAsync();
      // if (status === 'granted') {
      //   setLocationPermission(true);
      // } else {
      //   setLocationPermission(false);
      // }
      
      // For now, simulate permission granted
      setLocationPermission(true);
      Alert.alert('Success', 'Location access enabled!');
      
      // Auto-advance after a brief delay
      setTimeout(() => {
        router.push('/profile-setup/phone');
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const handleDontAllow = () => {
    setLocationPermission(false);
    Alert.alert(
      'Limited Functionality', 
      'Without location access, you won\'t be able to find nearby walkers or use real-time tracking features.',
      [
        { text: 'Continue Anyway', onPress: () => router.push('/profile-setup/phone') },
        { text: 'Grant Access', onPress: handleAllowLocation }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Top: Step Indicator "2/3" */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.stepIndicator}>2/3</ThemedText>
          <ThemedText style={styles.title}>Enable Location Services</ThemedText>
        </ThemedView>

        {/* Center: Text Headline: "Enable Location Services" */}
        {/* Text Paragraph: "Dog Walker needs access to your location..." */}
        <ThemedView style={styles.centerContainer}>
          <ThemedView style={styles.iconContainer}>
            <ThemedText style={styles.locationIcon}>📍</ThemedText>
          </ThemedView>
          
          <ThemedText style={styles.description}>
            Dog Walker needs access to your location to find nearby walkers and provide real-time tracking.
          </ThemedText>

          <ThemedView style={styles.benefitsContainer}>
            <ThemedView style={styles.benefit}>
              <ThemedText style={styles.benefitIcon}>✓</ThemedText>
              <ThemedText style={styles.benefitText}>Find the closest available walkers</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.benefit}>
              <ThemedText style={styles.benefitIcon}>✓</ThemedText>
              <ThemedText style={styles.benefitText}>Real-time walk tracking</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.benefit}>
              <ThemedText style={styles.benefitIcon}>✓</ThemedText>
              <ThemedText style={styles.benefitText}>Accurate pickup and drop-off</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Button: "Allow Location Access" */}
        {/* Text Button or Button outlined: "Don't Allow (Limited Functionality)" */}
        <ThemedView style={styles.bottomContainer}>
          <TouchableOpacity style={styles.allowButton} onPress={handleAllowLocation}>
            <ThemedText style={styles.allowButtonText}>Allow Location Access</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dontAllowButton} onPress={handleDontAllow}>
            <ThemedText style={styles.dontAllowButtonText}>Don&apos;t Allow (Limited Functionality)</ThemedText>
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
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationIcon: {
    fontSize: 40,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  benefitsContainer: {
    alignSelf: 'stretch',
    gap: 16,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  benefitIcon: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  bottomContainer: {
    paddingBottom: 32,
    gap: 16,
  },
  allowButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dontAllowButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dontAllowButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});