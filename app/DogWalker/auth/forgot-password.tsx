import { isSupabaseConfigured, supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const PASSWORD_RESET_REDIRECT = process.env.PASSWORD_RESET_REDIRECT || 'dogwalker://auth/password-reset-confirmation';

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Please enter your email');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address');
      return;
    }

    if (!isSupabaseConfigured()) {
      Alert.alert('Service unavailable', 'Password reset service is not configured.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: PASSWORD_RESET_REDIRECT } as any);
      if (error) throw error;

      Alert.alert('Password reset link sent', 'If an account exists for that email, a reset link has been sent.');
      router.back();
    } catch (err: any) {
      console.error('Failed to request password reset', err);
      Alert.alert('Error', err?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Reset password
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Enter the email associated with your account
        </ThemedText>

        <TextInput placeholder="Email" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.tint }]} onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Send reset link</ThemedText>}
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.push('/DogWalker/auth/login')}>
            <ThemedText type="link">Back to sign in</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'transparent' },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 20, color: '#6B7280' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: { height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
});
