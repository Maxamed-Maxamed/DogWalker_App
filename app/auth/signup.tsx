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

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (pass: string): { strength: string; color: string } => {
    if (pass.length === 0) return { strength: '', color: '' };
    if (pass.length < 6) return { strength: 'Weak', color: DesignTokens.colors.semantic.error };
    if (pass.length < 10) return { strength: 'Fair', color: DesignTokens.colors.semantic.warning };
    if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass))
      return { strength: 'Good', color: DesignTokens.colors.primary.blue };
    return { strength: 'Strong', color: DesignTokens.colors.semantic.success };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(fullName.trim(), email.trim(), password);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      Alert.alert('Sign Up Error', message);
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
          {/* Header with Hero Image */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/happydog.png')}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.headerOverlay}>
              <Image
                source={require('@/assets/images/newlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Join DogWalker</Text>
              <Text style={styles.subtitle}>Start your journey with trusted walkers</Text>
            </View>
          </View>

          <View style={styles.contentSection}>
            {/* Social Sign-Up Section */}
            <View style={styles.socialSection}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
                disabled={googleLoading || loading}
                accessible={true}
                accessibilityLabel="Continue with Google"
                accessibilityHint="Sign up using your Google account"
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
              <Text style={styles.dividerText}>or sign up with email</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email/Password Form */}
            <View style={styles.formSection}>
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={DesignTokens.colors.primary.gray[400]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor={DesignTokens.colors.primary.gray[400]}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    editable={!loading && !googleLoading}
                    accessible={true}
                    accessibilityLabel="Full name"
                    accessibilityHint="Enter your full name"
                  />
                </View>
              </View>

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
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={DesignTokens.colors.primary.gray[400]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a strong password"
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
                    onPress={() => setShowPassword(!showPassword)}
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
                {password.length > 0 && (
                  <View style={styles.passwordStrength}>
                    <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                      {passwordStrength.strength}
                    </Text>
                    <View style={styles.strengthBar}>
                      <View
                        style={[
                          styles.strengthProgress,
                          {
                            width:
                              passwordStrength.strength === 'Weak'
                                ? '25%'
                                : passwordStrength.strength === 'Fair'
                                  ? '50%'
                                  : passwordStrength.strength === 'Good'
                                    ? '75%'
                                    : '100%',
                            backgroundColor: passwordStrength.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={DesignTokens.colors.primary.gray[400]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter your password"
                    placeholderTextColor={DesignTokens.colors.primary.gray[400]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading && !googleLoading}
                    accessible={true}
                    accessibilityLabel="Confirm password"
                    accessibilityHint="Re-enter your password to confirm"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                    disabled={loading || googleLoading}
                    accessible={true}
                    accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={DesignTokens.colors.primary.gray[400]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.primaryButton, (loading || googleLoading) && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading || googleLoading}
                accessible={true}
                accessibilityLabel="Create account"
                accessibilityHint="Create your account and sign up"
                accessibilityRole="button"
                accessibilityState={{ disabled: loading || googleLoading }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Terms & Privacy */}
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable
                onPress={() => router.push('/auth/login')}
                disabled={loading || googleLoading}
                accessible={true}
                accessibilityLabel="Sign in"
                accessibilityHint="Navigate to sign in screen"
                accessibilityRole="button"
              >
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>
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
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: DesignTokens.spacing.sm,
  },
  title: {
    fontSize: DesignTokens.typography.sizes['3xl'],
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.white,
    marginBottom: DesignTokens.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: DesignTokens.typography.sizes.base,
    color: DesignTokens.colors.primary.white,
    textAlign: 'center',
  },
  contentSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.xl,
  },
  socialSection: {
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
    marginVertical: DesignTokens.spacing.lg,
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
    gap: DesignTokens.spacing.md,
  },
  inputGroup: {
    gap: DesignTokens.spacing.sm,
  },
  label: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.semibold,
    color: DesignTokens.colors.primary.gray[700],
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
  passwordStrength: {
    gap: DesignTokens.spacing.xs,
  },
  strengthText: {
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: DesignTokens.typography.weights.semibold,
  },
  strengthBar: {
    height: 4,
    backgroundColor: DesignTokens.colors.primary.gray[200],
    borderRadius: DesignTokens.borderRadius.full,
    overflow: 'hidden',
  },
  strengthProgress: {
    height: '100%',
    borderRadius: DesignTokens.borderRadius.full,
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
  termsText: {
    fontSize: DesignTokens.typography.sizes.xs,
    color: DesignTokens.colors.primary.gray[500],
    textAlign: 'center',
    lineHeight: 18,
    marginTop: DesignTokens.spacing.sm,
  },
  termsLink: {
    color: DesignTokens.colors.primary.blue,
    fontWeight: DesignTokens.typography.weights.semibold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DesignTokens.spacing.lg,
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
