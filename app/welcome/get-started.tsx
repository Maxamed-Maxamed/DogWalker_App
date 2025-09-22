import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function GetStartedScreen() {
  const handleOwner = () => {
    // TODO: Set user role to 'owner' in state management
    router.replace('/(tabs)');
  };

  const handleWalker = () => {
    // TODO: Set user role to 'walker' in state management  
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Choose Your Role</ThemedText>
          <ThemedText style={styles.subtitle}>
            How would you like to use Dog Walker?
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity style={styles.roleButton} onPress={handleOwner}>
            <ThemedText style={styles.roleIcon}>🐕</ThemedText>
            <ThemedText style={styles.roleTitle}>I&apos;m a Pet Owner</ThemedText>
            <ThemedText style={styles.roleDescription}>
              Find trusted dog walkers for my furry friend
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.roleButton} onPress={handleWalker}>
            <ThemedText style={styles.roleIcon}>🚶</ThemedText>
            <ThemedText style={styles.roleTitle}>I&apos;m a Dog Walker</ThemedText>
            <ThemedText style={styles.roleDescription}>
              Earn money walking dogs in my neighborhood
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <ThemedText style={styles.signInText}>
              Already have an account? Sign In
            </ThemedText>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 20,
    flex: 1,
    justifyContent: 'center',
  },
  roleButton: {
    backgroundColor: '#F9FAFB',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  signInText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});