import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // TODO: Implement actual registration logic
    Alert.alert('Success', 'Registration functionality to be implemented');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>Join the Dog Walker community</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {/* TODO: Add actual form inputs */}
          <ThemedText>Email input placeholder</ThemedText>
          <ThemedText>Password input placeholder</ThemedText>
          <ThemedText>Confirm Password input placeholder</ThemedText>
          
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <ThemedText style={styles.registerButtonText}>Create Account</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText>Already have an account? </ThemedText>
          <Link href="/auth/login">
            <ThemedText style={styles.linkText}>Sign In</ThemedText>
          </Link>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    marginBottom: 32,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});