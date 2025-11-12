import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Reusable InputField component
  const InputField = useCallback(
    ({
      label,
      placeholder,
      value,
      onChangeText,
      icon,
      keyboardType = 'default',
      isPassword = false,
      showEye = false,
      onShowToggle,
      fieldName,
    }: {
      label: string;
      placeholder: string;
      value: string;
      onChangeText: (text: string) => void;
      icon: keyof typeof Ionicons.glyphMap;
      keyboardType?: 'default' | 'email-address' | 'numeric' | 'decimal-pad' | 'phone-pad';
      isPassword?: boolean;
      showEye?: boolean;
      onShowToggle?: () => void;
      fieldName: string;
    }) => (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputContainer,
            focusedField === fieldName && styles.inputContainerFocused,
            value && styles.inputContainerFilled,
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              focusedField === fieldName
                ? DesignTokens.colors.primary.blue
                : DesignTokens.colors.primary.gray[400]
            }
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={DesignTokens.colors.primary.gray[400]}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={isPassword ? 'none' : 'none'}
            autoCorrect={false}
            secureTextEntry={isPassword && !showEye}
            editable={!loading && !googleLoading}
            onFocus={() => {
              setFocusedField(fieldName);
            }}
            onBlur={() => {
              setFocusedField(null);
            }}
            accessible={true}
            accessibilityLabel={label}
            accessibilityHint={placeholder}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={onShowToggle}
              style={styles.eyeButton}
              disabled={loading || googleLoading}
              accessible={true}
              accessibilityLabel={showEye ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
              accessibilityRole="button"
            >
              <Ionicons
                name={showEye ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={DesignTokens.colors.primary.gray[400]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [focusedField, loading, googleLoading]
  );

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
          scrollEventThrottle={16}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image
              source={require('@/assets/images/newlogo.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
          </View>

          {/* Form Content */}
          <View style={styles.contentSection}>
            {/* Form Header */}
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formSubtitle}>Sign in to continue your journey</Text>
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
                    <Ionicons name="logo-google" size={20} color="#4285F4" />
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
              <InputField
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                icon="mail-outline"
                keyboardType="email-address"
                fieldName="email"
              />

              {/* Password Input */}
              <InputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                icon="lock-closed-outline"
                isPassword
                showEye={showPassword}
                onShowToggle={() => { setShowPassword(!showPassword); }}
                fieldName="password"
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => router.push('/auth/forgot-password')}
                disabled={loading || googleLoading}
                accessible={true}
                accessibilityLabel="Forgot password"
                accessibilityHint="Navigate to password recovery"
                accessibilityRole="button"
              >
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>

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
    paddingBottom: DesignTokens.spacing.xl,
  },

  /* Hero Section */
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: DesignTokens.spacing.lg,
    backgroundColor: DesignTokens.colors.primary.white,
  },
  heroLogo: {
    width: 80,
    height: 80,
    marginBottom: DesignTokens.spacing.md,
  },

  /* Content Section */
  contentSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.md,
    paddingBottom: DesignTokens.spacing.xl,
  },

  /* Form Header */
  formHeader: {
    marginBottom: DesignTokens.spacing.lg,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: DesignTokens.typography.sizes['3xl'],
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.gray[900],
    marginBottom: DesignTokens.spacing.xs,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: DesignTokens.typography.sizes.base,
    color: DesignTokens.colors.primary.gray[600],
    textAlign: 'center',
  },

  /* Social Section */
  socialSection: {
    marginTop: DesignTokens.spacing.xl,
    gap: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.xl,
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

  /* Divider */
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

  /* Form Section */
  formSection: {
    gap: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
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
  inputContainerFocused: {
    borderColor: DesignTokens.colors.primary.blue,
    backgroundColor: DesignTokens.colors.primary.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerFilled: {
    borderColor: DesignTokens.colors.primary.gray[300],
    backgroundColor: DesignTokens.colors.primary.white,
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
  forgotLink: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.semibold,
    color: DesignTokens.colors.primary.blue,
  },

  /* Primary Button */
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

  /* Footer */
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
