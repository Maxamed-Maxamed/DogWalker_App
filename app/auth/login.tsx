import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DesignTokens } from '@/constants/designTokens';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // TODO: Implement Google Sign-In tomorrow
      Alert.alert('Coming Soon', 'Google Sign-In will be implemented tomorrow!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      Alert.alert('Sign In Error', message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/newlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          {/* Social Sign-In Section */}
          <View style={styles.socialSection}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => { void handleGoogleSignIn(); }}
              disabled={googleLoading || loading}
              accessible={true}
              accessibilityLabel="Continue with Google"
              accessibilityHint="Sign in using your Google account"
              accessibilityRole="button"
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={DesignTokens.colors.primary.gray[700]} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={DesignTokens.colors.social.google} />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Password Form */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={DesignTokens.colors.primary.gray[400]}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={DesignTokens.colors.primary.gray[400]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading && !googleLoading}
                  accessible={true}
                  accessibilityLabel="Email address"
                  accessibilityHint="Enter your email address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() => router.push('/auth/forgot-password')}
                  disabled={loading || googleLoading}
                  accessible={true}
                  accessibilityLabel="Forgot password"
                  accessibilityHint="Navigate to password recovery"
                  accessibilityRole="button"
                >
                  <Text style={styles.forgotLink}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={DesignTokens.colors.primary.gray[400]}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={DesignTokens.colors.primary.gray[400]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading && !googleLoading}
                  accessible={true}
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password"
                />
                <TouchableOpacity
                  onPress={() => { setShowPassword(!showPassword); }}
                  style={styles.eyeButton}
                  disabled={loading || googleLoading}
                  accessible={true}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={DesignTokens.colors.primary.gray[400]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.primaryButton, (loading || googleLoading) && styles.buttonDisabled]}
              onPress={() => { void handleLogin(); }}
              disabled={loading || googleLoading}
              accessible={true}
              accessibilityLabel="Sign in"
              accessibilityHint="Sign in with your email and password"
              accessibilityRole="button"
              accessibilityState={{ disabled: loading || googleLoading }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Pressable
              onPress={() => router.push('/auth/signup')}
              disabled={loading || googleLoading}
              accessible={true}
              accessibilityLabel="Sign up"
              accessibilityHint="Navigate to sign up screen"
              accessibilityRole="button"
            >
              <Text style={styles.footerLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.primary.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: DesignTokens.spacing.md,
  },
  title: {
    fontSize: DesignTokens.typography.sizes['4xl'],
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.gray[900],
    marginBottom: DesignTokens.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: DesignTokens.typography.sizes.base,
    color: DesignTokens.colors.primary.gray[600],
    textAlign: 'center',
  },
  socialSection: {
    marginTop: DesignTokens.spacing.xl,
    gap: DesignTokens.spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: DesignTokens.dimensions.button.height,
    borderRadius: DesignTokens.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: DesignTokens.colors.primary.gray[300],
    backgroundColor: DesignTokens.colors.primary.white,
    gap: DesignTokens.spacing.sm,
    ...DesignTokens.shadows.sm,
  },
  socialButtonText: {
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.semibold,
    color: DesignTokens.colors.primary.gray[700],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: DesignTokens.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DesignTokens.colors.primary.gray[200],
  },
  dividerText: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.primary.gray[500],
    marginHorizontal: DesignTokens.spacing.md,
    fontWeight: DesignTokens.typography.weights.medium,
  },
  formSection: {
    gap: DesignTokens.spacing.lg,
  },
  inputGroup: {
    gap: DesignTokens.spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.semibold,
    color: DesignTokens.colors.primary.gray[700],
  },
  forgotLink: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.semibold,
    color: DesignTokens.colors.primary.blue,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DesignTokens.dimensions.input.height,
    borderRadius: DesignTokens.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: DesignTokens.colors.primary.gray[300],
    backgroundColor: DesignTokens.colors.primary.white,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  inputIcon: {
    marginRight: DesignTokens.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: DesignTokens.typography.sizes.base,
    color: DesignTokens.colors.primary.gray[900],
    paddingVertical: 0,
  },
  eyeButton: {
    padding: DesignTokens.spacing.xs,
  },
  primaryButton: {
    height: DesignTokens.dimensions.button.height,
    borderRadius: DesignTokens.borderRadius.lg,
    backgroundColor: DesignTokens.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DesignTokens.spacing.sm,
    ...DesignTokens.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.white,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DesignTokens.spacing.xl,
  },
  footerText: {
    fontSize: DesignTokens.typography.sizes.base,
    color: DesignTokens.colors.primary.gray[600],
  },
  footerLink: {
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.blue,
  },
});
