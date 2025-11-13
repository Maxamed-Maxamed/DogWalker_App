import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormInput from '@/components/ui/FormInput'; // eslint-disable-line import/no-named-as-default
import { DesignTokens } from '@/constants/designTokens';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    email,
    password,
    showPassword,
    loading,
    focusedField,
    errors,
    handleFieldChange,
    handleSubmit,
    setShowPassword,
    setFocusedField,
  } = useAuthForm(
    async (fields) => {
      try {
        await login(fields.email, fields.password);
        router.replace('/(tabs)/dashboard');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        Alert.alert('Login Error', message);
      }
    },
    'login'
  );

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google Sign-In
      Alert.alert('Coming Soon', 'Google Sign-In will be implemented tomorrow!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      Alert.alert('Sign In Error', message);
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
                onPress={() => {
                  void handleGoogleSignIn();
                }}
                disabled={loading}
                accessible={true}
                accessibilityLabel="Continue with Google"
                accessibilityHint="Sign in using your Google account"
                accessibilityRole="button"
              >
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
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
              <FormInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={(text) => handleFieldChange('email', text)}
                icon="mail-outline"
                keyboardType="email-address"
                fieldName="email"
                focusedField={focusedField}
                error={errors.email}
                disabled={loading}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />

              {/* Password Input */}
              <FormInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => handleFieldChange('password', text)}
                icon="lock-closed-outline"
                isPassword
                showPassword={showPassword}
                onShowToggle={() => {
                  setShowPassword(!showPassword);
                }}
                fieldName="password"
                focusedField={focusedField}
                error={errors.password}
                disabled={loading}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => router.push('/auth/forgot-password')}
                disabled={loading}
                accessible={true}
                accessibilityLabel="Forgot password"
                accessibilityHint="Navigate to password recovery"
                accessibilityRole="button"
              >
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={() => {
                  void handleSubmit();
                }}
                disabled={loading}
                accessible={true}
                accessibilityLabel="Sign in"
                accessibilityHint="Sign in with your email and password"
                accessibilityRole="button"
                accessibilityState={{ disabled: loading }}
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
                disabled={loading}
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
