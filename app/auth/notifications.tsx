import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function NotificationsScreen() {
  const handleAllowNotifications = async () => {
    try {
      // TODO: Request actual notification permissions
      // const { status } = await Notifications.requestPermissionsAsync();
      // if (status === 'granted') {
      //   // Permissions granted
      // }
      
      Alert.alert('Success', 'Notifications enabled!');
      router.push('/auth/onboarding-complete');
    } catch (error) {
      Alert.alert('Error', 'Failed to enable notifications');
      console.error('Notification permission error:', error);
    }
  };

  const handleDontAllow = () => {
    Alert.alert(
      'Limited Notifications', 
      'You won\'t receive updates about your walks, but you can always enable notifications later in Settings.',
      [
        { text: 'Continue', onPress: () => router.push('/auth/onboarding-complete') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Top: Headline: "Stay in the Loop" */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Stay in the Loop</ThemedText>
        </ThemedView>

        {/* Center: Text Paragraph and notification icon */}
        <ThemedView style={styles.centerContainer}>
          <ThemedView style={styles.iconContainer}>
            <ThemedText style={styles.notificationIcon}>🔔</ThemedText>
          </ThemedView>
          
          {/* Text Paragraph: "Allow push notifications to receive updates..." */}
          <ThemedText style={styles.description}>
            Allow push notifications to receive updates about your walks, walker arrivals, and special offers.
          </ThemedText>

          <ThemedView style={styles.benefitsContainer}>
            <ThemedView style={styles.benefit}>
              <ThemedText style={styles.benefitIcon}>📱</ThemedText>
              <ThemedText style={styles.benefitText}>Walk confirmations and updates</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.benefit}>
              <ThemedText style={styles.benefitIcon}>🚶‍♂️</ThemedText>
              <ThemedText style={styles.benefitText}>Walker arrival notifications</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.benefit}>
              <ThemedText style={styles.benefitIcon}>📸</ThemedText>
              <ThemedText style={styles.benefitText}>Photo updates during walks</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.benefit}>
              <ThemedText style={styles.benefitIcon}>🎁</ThemedText>
              <ThemedText style={styles.benefitText}>Special offers and promotions</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Button: "Allow Notifications" */}
        {/* Text Link or outlined Button: "Don't Allow" */}
        <ThemedView style={styles.bottomContainer}>
          <TouchableOpacity style={styles.allowButton} onPress={handleAllowNotifications}>
            <ThemedText style={styles.allowButtonText}>Allow Notifications</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dontAllowButton} onPress={handleDontAllow}>
            <ThemedText style={styles.dontAllowButtonText}>Don&apos;t Allow</ThemedText>
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
  title: {
    fontSize: 28,
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
    backgroundColor: '#FEF3E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  notificationIcon: {
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
    fontSize: 20,
    marginRight: 12,
    width: 28,
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