import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    if (!email) { Alert.alert('Please enter your email'); return; }
    
    void (async () => {
      setLoading(true);
      // Mock sending reset link
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Reset link sent', `A password reset link was sent to ${email} (mock)`);
        router.back();
      }, 900);
    })();
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
          <TouchableOpacity onPress={() => router.push('./auth/login')}>
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
