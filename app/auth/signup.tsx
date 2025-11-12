import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
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

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

// Constant-time string comparison to prevent timing attacks
const constantTimeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

// Password strength calculator
const calculatePasswordStrength = (password: string): { level: number; label: string; color: string } => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  const levels = [
    { level: 0, label: 'Too Weak', color: '#DC2626' },
    { level: 1, label: 'Weak', color: '#EA580C' },
    { level: 2, label: 'Fair', color: '#F59E0B' },
    { level: 3, label: 'Good', color: '#10B981' },
    { level: 4, label: 'Strong', color: '#059669' },
    { level: 5, label: 'Very Strong', color: '#047857' },
  ];

  return levels[Math.min(strength, levels.length - 1)];
};

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

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
                ? Colors.light.tint
                : '#9CA3AF'
            }
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={isPassword ? 'none' : 'words'}
            autoCorrect={false}
            secureTextEntry={isPassword && !showEye}
            editable={!loading}
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
              disabled={loading}
              accessible={true}
              accessibilityLabel={showEye ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
              accessibilityRole="button"
            >
              <Ionicons
                name={showEye ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [focusedField, loading]
  );

  const handleSignup = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters');
      return;
    }

    if (!constantTimeEqual(password, confirmPassword)) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
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

  const handleGoogleSignUp = (): void => {
    Alert.alert('Coming Soon', 'Google Sign-Up is coming in the next release. Thanks for your patience!');
  };

  const handleAppleSignUp = (): void => {
    Alert.alert('Coming Soon', 'Apple Sign-Up is coming in the next release. Thanks for your patience!');
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
              source={require('@/assets/images/happydog.png')}
              style={styles.heroLogo}
              resizeMode="cover"
            />
          </View>

          {/* Form Content */}
          <View style={styles.contentSection}>
            {/* Form Header */}
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Create Your Account</Text>
              <Text style={styles.formSubtitle}>
                Join thousands of pet owners who trust DogWalker
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              {/* Full Name Input */}
              <InputField
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
                icon="person-outline"
                fieldName="fullName"
              />

              {/* Email Input */}
              <InputField
                label="Email Address"
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
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                icon="lock-closed-outline"
                isPassword
                showEye={showPassword}
                onShowToggle={() => setShowPassword(!showPassword)}
                fieldName="password"
              />

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        {
                          width: `${((passwordStrength.level + 1) / 6) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                icon="lock-closed-outline"
                isPassword
                showEye={showConfirmPassword}
                onShowToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                fieldName="confirmPassword"
              />

              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <View style={styles.mismatchContainer}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <Text style={styles.mismatchText}>Passwords do not match</Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons */}
            <View style={styles.socialSection}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => {
                  handleGoogleSignUp();
                }}
                disabled={loading}
                accessible={true}
                accessibilityLabel="Continue with Google"
                accessibilityRole="button"
              >
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => {
                  handleAppleSignUp();
                }}
                disabled={loading}
                accessible={true}
                accessibilityLabel="Continue with Apple"
                accessibilityRole="button"
              >
                <Ionicons name="logo-apple" size={20} color="#000" />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={(): void => {
                handleSignup().catch((): void => {
                  // Error already handled in handleSignup
                });
              }}
              disabled={loading}
              accessible={true}
              accessibilityLabel="Create account"
              accessibilityHint="Create your account and sign up"
              accessibilityRole="button"
              accessibilityState={{ disabled: loading }}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Terms & Privacy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>By creating an account, you agree to our</Text>
              <View style={styles.termsLinks}>
                <Pressable accessible={true} accessibilityRole="link">
                  <Text style={styles.termsLink}>Terms of Service</Text>
                </Pressable>
                <Text style={styles.termsSeparator}> and </Text>
                <Pressable accessible={true} accessibilityRole="link">
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Pressable>
              </View>
            </View>

            {/* Sign In Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable
                onPress={(): void => {
                  router.push('/auth/login');
                }}
                disabled={loading}
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
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* Hero Section */
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  heroLogo: {
    width: 180,
    height: 180,
    marginBottom: 0,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },

  /* Content Section */
  contentSection: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingBottom: 48,
  },

  /* Form Header */
  formHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },

  /* Form Section */
  formSection: {
    gap: 24,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: Colors.light.tint,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerFilled: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },

  /* Password Strength Indicator */
  strengthContainer: {
    gap: 6,
    marginTop: -16,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Password Mismatch Indicator */
  mismatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginTop: -16,
  },
  mismatchText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC2626',
  },

  /* Social Auth Section */
  socialSection: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  /* Divider */
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginHorizontal: 12,
  },

  /* Primary Button */
  primaryButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* Terms & Privacy */
  termsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 4,
  },
  termsLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  termsLink: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  termsSeparator: {
    fontSize: 12,
    color: '#4B5563',
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4B5563',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.tint,
  },
});