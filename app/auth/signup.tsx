import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';


export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (password !== confirmPassword) { Alert.alert('Passwords do not match'); return; }
    void (async () => {
      setLoading(true);
      try {
        await signup(name.trim(), email.trim(), password);
        router.replace('/(tabs)');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        Alert.alert('Signup failed', message);
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleGoogleSignIn = () => {
    void (async () => {
      setLoading(true);
      try {
        await loginWithGoogle();
        router.replace('/(tabs)');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        Alert.alert('Google sign-in failed', message);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Create account
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Create an account to start booking walks
        </ThemedText>

        <TextInput placeholder="Full name" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Email" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TextInput placeholder="Confirm password" placeholderTextColor="#9CA3AF" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.tint }]} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Sign up</ThemedText>}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={handleGoogleSignIn}
          disabled={loading}
          style={styles.googleButton}
        />

        <View style={styles.row}>
          <ThemedText>Already have an account? </ThemedText>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <ThemedText type="link">Sign in</ThemedText>
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    height: 48,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
});
