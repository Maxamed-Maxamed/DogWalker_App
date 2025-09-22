import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignUpScreen() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    referralCode: '',
    agreeToTerms: false,
  });

  const handleSignUpWithEmail = () => {
    setShowEmailForm(true);
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google sign-up
    Alert.alert('Coming Soon', 'Google sign-up will be available soon');
  };

  const handleAppleSignUp = () => {
    // TODO: Implement Apple sign-up
    Alert.alert('Coming Soon', 'Apple sign-up will be available soon');
  };

  const handleEmailSignUp = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    // TODO: Implement actual sign-up logic
    Alert.alert('Success', 'Account created successfully!');
    router.push('/profile-setup/index');
  };

  const handleBackToOptions = () => {
    setShowEmailForm(false);
  };

  if (showEmailForm) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.content}>
          {/* Top: Headline "Create an Account" (or similar) */}
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>Create an Account</ThemedText>
          </ThemedView>

          {/* Email Sign-Up Form */}
          <ThemedView style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({...formData, firstName: text})}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({...formData, lastName: text})}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChangeText={(text) => setFormData({...formData, referralCode: text})}
              autoCapitalize="characters"
            />

            {/* Checkbox: "I agree to the Terms of Service and Privacy Policy" */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setFormData({...formData, agreeToTerms: !formData.agreeToTerms})}
            >
              <View style={[styles.checkbox, formData.agreeToTerms && styles.checkboxChecked]}>
                {formData.agreeToTerms && <ThemedText style={styles.checkmark}>✓</ThemedText>}
              </View>
              <ThemedText style={styles.checkboxText}>
                I agree to the Terms of Service and Privacy Policy
              </ThemedText>
            </TouchableOpacity>

            {/* Button: "Sign Up" */}
            <TouchableOpacity style={styles.signUpButton} onPress={handleEmailSignUp}>
              <ThemedText style={styles.signUpButtonText}>Sign Up</ThemedText>
            </TouchableOpacity>

            {/* Back Text Link: To return to the button options to sign-up */}
            <TouchableOpacity onPress={handleBackToOptions}>
              <ThemedText style={styles.backLink}>← Back to sign-up options</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Top: Headline "Create an Account" (or similar) */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Create an Account</ThemedText>
        </ThemedView>

        {/* Center: Social login buttons and email option */}
        <ThemedView style={styles.buttonContainer}>
          {/* Button: "Sign up with Email" */}
          <TouchableOpacity style={styles.emailButton} onPress={handleSignUpWithEmail}>
            <ThemedText style={styles.emailButtonText}>Sign up with Email</ThemedText>
          </TouchableOpacity>

          {/* Button: "Continue with Google" */}
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
            <ThemedText style={styles.socialButtonText}>Continue with Google</ThemedText>
          </TouchableOpacity>

          {/* Button: "Continue with Apple" */}
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignUp}>
            <ThemedText style={styles.socialButtonText}>Continue with Apple</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Bottom: Text Link: "Already have an account? Log In" */}
        <ThemedView style={styles.footer}>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.loginLink}>Already have an account? Log In</ThemedText>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  emailButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButton: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  socialButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // Email form styles
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  input: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});