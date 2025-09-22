import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PhotoSetupScreen() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handleTakePhoto = () => {
    // TODO: Implement camera functionality
    Alert.alert('Coming Soon', 'Camera functionality will be available soon');
    // For now, simulate photo selection
    setProfilePhoto('camera_photo');
  };

  const handleChooseFromLibrary = () => {
    // TODO: Implement image picker functionality
    Alert.alert('Coming Soon', 'Photo library access will be available soon');
    // For now, simulate photo selection
    setProfilePhoto('library_photo');
  };

  const handleNext = () => {
    if (!profilePhoto) {
      Alert.alert('Photo Required', 'Please add a profile photo to continue');
      return;
    }
    router.push('/auth/profile-setup/location');
  };

  const handleSkip = () => {
    router.push('/auth/profile-setup/location');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Top: Step Indicator "1/3" (or similar to illustrate process) */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.stepIndicator}>1/3</ThemedText>
          <ThemedText style={styles.title}>Upload Profile Photo</ThemedText>
        </ThemedView>

        {/* Center: Large Circle (placeholder for profile picture) */}
        <ThemedView style={styles.centerContainer}>
          <View style={styles.photoContainer}>
            <View style={styles.photoCircle}>
              {profilePhoto ? (
                <ThemedText style={styles.photoPlaceholder}>📷</ThemedText>
              ) : (
                <ThemedText style={styles.photoPlaceholder}>👤</ThemedText>
              )}
            </View>
            <ThemedText style={styles.photoText}>
              {profilePhoto ? 'Photo Added!' : 'Upload Profile Photo'}
            </ThemedText>
          </View>

          {/* Button (Option button): "Take a Photo" */}
          {/* Button (Option button): "Choose From Library" */}
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={handleTakePhoto}>
              <ThemedText style={styles.optionButtonText}>Take a Photo</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionButton} onPress={handleChooseFromLibrary}>
              <ThemedText style={styles.optionButtonText}>Choose From Library</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Bottom: Button labeled "Next" */}
        <ThemedView style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ThemedText style={styles.nextButtonText}>Next</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSkip}>
            <ThemedText style={styles.skipText}>Skip for now</ThemedText>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholder: {
    fontSize: 48,
  },
  photoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomContainer: {
    paddingBottom: 32,
    gap: 16,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});