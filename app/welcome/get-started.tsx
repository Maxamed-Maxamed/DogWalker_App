import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function GetStartedScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleOwner = () => {
    router.push('/auth/register');
  };

  const handleWalker = () => {
    router.push('/auth/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Welcome to Dog Walker</ThemedText>
          <ThemedText style={styles.subtitle}>
            Choose how you'd like to get started
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.roleCard, styles.ownerCard]}
            onPress={handleOwner}
            activeOpacity={0.85}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <ThemedText style={styles.cardIcon}>🏠</ThemedText>
              </View>
              
              <ThemedText style={styles.cardTitle}>I need a dog walker</ThemedText>
              <ThemedText style={styles.cardDescription}>
                Find trusted walkers for your furry friend
              </ThemedText>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <ThemedText style={styles.benefitIcon}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>Vetted professionals</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <ThemedText style={styles.benefitIcon}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>Real-time tracking</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <ThemedText style={styles.benefitIcon}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>Instant booking</ThemedText>
                </View>
              </View>
            </View>
            
            <View style={[styles.cardFooter, styles.ownerFooter]}>
              <ThemedText style={styles.footerText}>Get Started as Pet Owner</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, styles.walkerCard]}
            onPress={handleWalker}
            activeOpacity={0.85}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <ThemedText style={styles.cardIcon}>🚶‍♂️</ThemedText>
              </View>
              
              <ThemedText style={styles.cardTitle}>I want to walk dogs</ThemedText>
              <ThemedText style={styles.cardDescription}>
                Earn money doing what you love
              </ThemedText>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <ThemedText style={styles.benefitIcon}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>Flexible schedule</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <ThemedText style={styles.benefitIcon}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>Great earnings</ThemedText>
                </View>
                <View style={styles.benefitItem}>
                  <ThemedText style={styles.benefitIcon}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>Love dogs daily</ThemedText>
                </View>
              </View>
            </View>
            
            <View style={[styles.cardFooter, styles.walkerFooter]}>
              <ThemedText style={styles.footerText}>Get Started as Walker</ThemedText>
            </View>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.bottomInfo}>
          <ThemedText style={styles.infoText}>
            🔒 Safe, secure, and trusted by thousands
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    flex: 1,
    gap: 20,
    paddingBottom: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    flex: 1,
  },
  ownerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  walkerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardContent: {
    padding: 24,
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitIcon: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    width: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  cardFooter: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ownerFooter: {
    backgroundColor: '#007AFF',
  },
  walkerFooter: {
    backgroundColor: '#10B981',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
