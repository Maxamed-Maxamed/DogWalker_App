/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DesignTokens } from '@/constants';
import { useAuthForm, usePasswordStrength } from '@/hooks';
import { useAuthStore } from '@/stores';
import { FormInput, PasswordStrengthIndicator } from '@/ui';

export default function SignupScreen() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);

  const {
    email,
    password,
    fullName,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    loading,
    focusedField,
    errors,
    handleFieldChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
    setFocusedField,
  } = useAuthForm(
    async (fields) => {
      try {
        const name = fields.fullName?.trim() ?? '';
        const emailVal = fields.email ?? '';
        const passVal = fields.password ?? '';

        if (!name || !emailVal || !passVal) {
          throw new Error('All fields are required');
        }

        await signup(name, emailVal, passVal);
        router.replace('/dashboard');
      } catch (error: unknown) {
        Alert.alert('Signup Error', (error as Error).message || 'Failed to create account');
      }
    },
    'signup'
  );

  const passwordStrength = usePasswordStrength(password);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/newlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community of pet owners</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <FormInput
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={(text) => handleFieldChange('fullName', text)}
              icon="person-outline"
              fieldName="fullName"
              focusedField={focusedField}
              error={errors.fullName}
              disabled={loading}
              required
            />

            {/* Email Input */}
            <FormInput
              label="Email Address"
              placeholder="your@email.com"
              value={email}
              onChangeText={(text) => handleFieldChange('email', text)}
              keyboardType="email-address"
              icon="mail-outline"
              fieldName="email"
              focusedField={focusedField}
              error={errors.email}
              disabled={loading}
              required
            />

            {/* Password Input */}
            <FormInput
              label="Password"
              placeholder="Create a strong password"
              value={password}
              onChangeText={(text) => handleFieldChange('password', text)}
              isPassword={!showPassword}
              showPassword={showPassword}
              onShowToggle={() => setShowPassword(!showPassword)}
              icon="lock-closed-outline"
              fieldName="password"
              focusedField={focusedField}
              error={errors.password}
              disabled={loading}
              required
            />

            {/* Password Strength Indicator */}
            {password ? (
              <PasswordStrengthIndicator
                strength={passwordStrength}
                showRequirements={true}
              />
            ) : null}

            {/* Confirm Password Input */}
            <FormInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => handleFieldChange('confirmPassword', text)}
              isPassword={!showConfirmPassword}
              showPassword={showConfirmPassword}
              onShowToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              icon="lock-closed-outline"
              fieldName="confirmPassword"
              focusedField={focusedField}
              error={errors.confirmPassword}
              disabled={loading}
              required
            />

            {/* Terms Agreement */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://dogwalker.app/terms').catch(() => {
                    Alert.alert('Error', 'Unable to open Terms of Service');
                  });
                }}
                accessible
                accessibilityRole="link"
                accessibilityLabel="Terms of Service"
              >
                <Text style={styles.termsLink}>Terms of Service</Text>
              </TouchableOpacity>
              {' and '}
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://dogwalker.app/privacy').catch(() => {
                    Alert.alert('Error', 'Unable to open Privacy Policy');
                  });
                }}
                accessible
                accessibilityRole="link"
                accessibilityLabel="Privacy Policy"
              >
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </Text>

            {/* Signup Button */}
            <Pressable
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.signupButtonPressed,
                loading && styles.signupButtonDisabled,
              ]}
              onPress={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color={DesignTokens.colors.primary.white}
                  size="small"
                />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: DesignTokens.spacing.xl,
  },

  /* Header */
  header: {
    alignItems: 'center',
    paddingTop: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: DesignTokens.spacing.lg,
  },
  title: {
    fontSize: DesignTokens.typography.sizes['2xl'],
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.gray[900],
    marginBottom: DesignTokens.spacing.xs,
  },
  subtitle: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.primary.gray[600],
  },

  /* Form */
  form: {
    paddingHorizontal: DesignTokens.spacing.lg,
    gap: DesignTokens.spacing.lg,
  },

  /* Terms Text */
  termsText: {
    fontSize: DesignTokens.typography.sizes.xs,
    color: DesignTokens.colors.primary.gray[600],
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: DesignTokens.colors.primary.blue,
    fontWeight: DesignTokens.typography.weights.semibold,
    textDecorationLine: 'underline',
  },

  /* Signup Button */
  signupButton: {
    backgroundColor: DesignTokens.colors.primary.blue,
    borderRadius: DesignTokens.borderRadius.md,
    paddingVertical: DesignTokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: DesignTokens.dimensions.input.height,
  },
  signupButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.white,
  },

  /* Divider */
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: DesignTokens.spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: DesignTokens.colors.primary.gray[200],
  },
  dividerText: {
    fontSize: DesignTokens.typography.sizes.xs,
    color: DesignTokens.colors.primary.gray[500],
    marginHorizontal: DesignTokens.spacing.md,
  },

  /* Login Container */
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.primary.gray[600],
  },
  loginLink: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.blue,
  },
});
