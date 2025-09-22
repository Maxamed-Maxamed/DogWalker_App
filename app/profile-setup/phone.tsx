import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PhoneSetupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    // TODO: Implement actual SMS sending
    setCodeSent(true);
    Alert.alert('Code Sent', `Verification code sent to ${phoneNumber}`);
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      Alert.alert('Invalid Code', 'Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    
    // TODO: Implement actual verification
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert('Success', 'Phone number verified!', [
        { 
          text: 'Continue', 
          onPress: () => router.push('/auth/pet-profile') // Move to pet profile creation
        }
      ]);
    }, 1500);
  };

  const handleResendCode = () => {
    Alert.alert('Code Resent', `New verification code sent to ${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Top: Step Indicator "3/3" */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.stepIndicator}>3/3</ThemedText>
          <ThemedText style={styles.title}>Verify Phone Number</ThemedText>
        </ThemedView>

        <ThemedView style={styles.centerContainer}>
          {!codeSent ? (
            <>
              {/* Input Field: Phone Number */}
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>Phone Number</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={14}
                />
                <ThemedText style={styles.inputHint}>
                  We&apos;ll send you a verification code
                </ThemedText>
              </ThemedView>

              {/* Button: "Send Verification Code" */}
              <TouchableOpacity style={styles.sendButton} onPress={handleSendCode}>
                <ThemedText style={styles.sendButtonText}>Send Verification Code</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Input Field: Verification Code */}
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>Verification Code</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <ThemedText style={styles.inputHint}>
                  Enter the code sent to {phoneNumber}
                </ThemedText>
              </ThemedView>

              {/* Button: "Verify" */}
              <TouchableOpacity 
                style={[styles.verifyButton, isVerifying && styles.buttonDisabled]} 
                onPress={handleVerify}
                disabled={isVerifying}
              >
                <ThemedText style={styles.verifyButtonText}>
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </ThemedText>
              </TouchableOpacity>

              {/* Text Link: Resend Code (Available if not sent the code successfully) */}
              <TouchableOpacity onPress={handleResendCode}>
                <ThemedText style={styles.resendText}>Resend Code</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </ThemedView>

        <ThemedView style={styles.bottomContainer}>
          <ThemedText style={styles.securityNote}>
            🔒 Your phone number is used for security and will never be shared with walkers
          </ThemedText>
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
    paddingBottom: 20,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  input: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
  },
  inputHint: {
    fontSize: 14,
    color: '#6B7280',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomContainer: {
    paddingBottom: 32,
  },
  securityNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});