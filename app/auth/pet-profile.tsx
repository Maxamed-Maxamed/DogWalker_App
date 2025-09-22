import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface EmergencyContact {
  name: string;
  phone: string;
  address: string;
}

export default function PetProfileScreen() {
  const [petData, setPetData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    temperament: '',
    specialInstructions: '',
  });

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    address: '',
  });

  const handleSavePet = () => {
    // Validate required fields
    if (!petData.name || !petData.breed || !petData.age || !petData.weight) {
      Alert.alert('Missing Information', 'Please fill in all pet details');
      return;
    }

    if (!emergencyContact.name || !emergencyContact.phone || !emergencyContact.address) {
      Alert.alert('Missing Information', 'Emergency contact information is required');
      return;
    }

    // TODO: Save pet data
    Alert.alert('Success', 'Pet profile created!', [
      { 
        text: 'Continue', 
        onPress: () => router.push('/auth/notifications') 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* Top: Headline "Add your first Pet!" */}
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>Add your first Pet!</ThemedText>
            <ThemedText style={styles.subtitle}>
              Help us get to know your furry friend
            </ThemedText>
          </ThemedView>

          {/* Pet Information Section */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Pet Information</ThemedText>
            
            {/* Input Field: Pet Name */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Pet Name *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g., Buddy"
                value={petData.name}
                onChangeText={(text) => setPetData({...petData, name: text})}
              />
            </ThemedView>

            {/* Input Field: Breed */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Breed *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g., Golden Retriever"
                value={petData.breed}
                onChangeText={(text) => setPetData({...petData, breed: text})}
              />
            </ThemedView>

            {/* Input Field: Age */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Age *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g., 3 years"
                value={petData.age}
                onChangeText={(text) => setPetData({...petData, age: text})}
              />
            </ThemedView>

            {/* Input Field: Weight */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Weight *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g., 65 lbs"
                value={petData.weight}
                onChangeText={(text) => setPetData({...petData, weight: text})}
                keyboardType="numeric"
              />
            </ThemedView>

            {/* Dropdown: Gender (simplified as text input for now) */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Gender</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Male/Female/Other"
                value={petData.gender}
                onChangeText={(text) => setPetData({...petData, gender: text})}
              />
            </ThemedView>

            {/* Dropdown: Temperament (simplified as text input for now) */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Temperament</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Friendly/Energetic/Calm/Shy"
                value={petData.temperament}
                onChangeText={(text) => setPetData({...petData, temperament: text})}
              />
            </ThemedView>

            {/* Text Area: Special Instructions */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Special Instructions</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Important instructions for the walker (allergies, fears, favorite treats, etc.)"
                value={petData.specialInstructions}
                onChangeText={(text) => setPetData({...petData, specialInstructions: text})}
                multiline
                numberOfLines={4}
              />
            </ThemedView>
          </ThemedView>

          {/* Emergency Contact Section */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Emergency Contact *</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              This information will be available to walkers in case of emergency
            </ThemedText>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Contact Name *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                value={emergencyContact.name}
                onChangeText={(text) => setEmergencyContact({...emergencyContact, name: text})}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Phone Number *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="(555) 123-4567"
                value={emergencyContact.phone}
                onChangeText={(text) => setEmergencyContact({...emergencyContact, phone: text})}
                keyboardType="phone-pad"
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Address *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Full address"
                value={emergencyContact.address}
                onChangeText={(text) => setEmergencyContact({...emergencyContact, address: text})}
              />
            </ThemedView>
          </ThemedView>

          {/* Button: "Save Pet and Continue" */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSavePet}>
            <ThemedText style={styles.saveButtonText}>Save Pet and Continue</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});