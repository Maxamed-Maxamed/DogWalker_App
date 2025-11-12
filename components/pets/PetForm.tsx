import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Pet, PetFormData, usePetStore } from '@/stores/petStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface PetFormProps {
  initialData?: Pet;
  onSuccess?: (petId: string) => void;
  onCancel?: () => void;
}

export function PetForm({ initialData, onSuccess, onCancel }: PetFormProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { createPet, updatePet, loading } = usePetStore();

  const [formData, setFormData] = useState<PetFormData>({
    name: initialData?.name || '',
    breed: initialData?.breed || '',
    age: initialData?.age,
    weight: initialData?.weight,
    gender: initialData?.gender || 'male',
    medical_notes: initialData?.medical_notes || '',
    special_instructions: initialData?.special_instructions || '',
    vet_name: initialData?.vet_name || '',
    vet_phone: initialData?.vet_phone || '',
    emergency_contact_name: initialData?.emergency_contact_name || '',
    emergency_contact_phone: initialData?.emergency_contact_phone || '',
  });

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentPhotoUrl = initialData?.photo_url;
  const displayPhoto = photoUri || currentPhotoUrl;

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    }

    if (formData.age !== undefined && (formData.age < 0 || formData.age > 30)) {
      newErrors.age = 'Age must be between 0 and 30 years';
    }

    if (formData.weight !== undefined && (formData.weight <= 0 || formData.weight > 300)) {
      newErrors.weight = 'Weight must be between 1 and 300 lbs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const savePet = useCallback(async (): Promise<{ success: boolean; petId?: string }> => {
    if (initialData) {
      const success = await updatePet(initialData.id, formData, photoUri || undefined);
      return { success, petId: initialData.id };
    } else {
      const newPet = await createPet(formData, photoUri || undefined);
      return { success: !!newPet, petId: newPet?.id };
    }
  }, [initialData, formData, photoUri, createPet, updatePet]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      const { success, petId } = await savePet();

      if (success && petId) {
        const message = initialData ? 'Pet profile updated successfully' : 'Pet profile created successfully';
        Alert.alert('Success', message, [
          {
            text: 'OK',
            onPress: () => onSuccess?.(petId),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to save pet profile. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error saving pet:', errorMessage);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  }, [validateForm, savePet, initialData, onSuccess]);

  const handlePickPhoto = useCallback(() => {
    Alert.alert('Select Photo', 'Choose photo source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { takePhotoWithCamera } = await import('@/stores/petStore');
          const uri = await takePhotoWithCamera();
          if (uri) setPhotoUri(uri);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const { pickImageFromGallery } = await import('@/stores/petStore');
          const uri = await pickImageFromGallery();
          if (uri) setPhotoUri(uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Photo Section */}
      <View style={styles.photoSection}>
        <TouchableOpacity 
          style={styles.photoButton} 
          onPress={handlePickPhoto} 
          disabled={loading}
          accessible={true}
          accessibilityLabel={displayPhoto ? 'Change pet photo' : 'Add pet photo'}
          accessibilityHint="Opens camera or photo gallery to select a photo"
          accessibilityRole="button"
        >
          {displayPhoto ? (
            <Image source={{ uri: displayPhoto }} style={styles.photo} />
          ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.tint + '20' }]}>
              <Ionicons name="camera" size={40} color={colors.tint} />
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.photoHint, { color: colors.text + '99' }]}>
          Tap to {displayPhoto ? 'change' : 'add'} photo
        </Text>
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Pet Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: errors.name ? '#FF3B30' : colors.text + '30' },
            ]}
            placeholder="e.g., Max, Luna, Charlie"
            placeholderTextColor={colors.text + '60'}
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            editable={!loading}
            accessible={true}
            accessibilityLabel="Pet name (required)"
            accessibilityHint="Enter your pet's name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Breed</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="e.g., Golden Retriever, Mixed"
            placeholderTextColor={colors.text + '60'}
            value={formData.breed}
            onChangeText={(text) => setFormData({ ...formData, breed: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>Age (years)</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: errors.age ? '#FF3B30' : colors.text + '30' },
              ]}
              placeholder="e.g., 3"
              placeholderTextColor={colors.text + '60'}
              value={formData.age?.toString() || ''}
              onChangeText={(text) => {
                setFormData({ ...formData, age: text ? parseInt(text) : undefined });
                if (errors.age) setErrors({ ...errors, age: '' });
              }}
              keyboardType="number-pad"
              editable={!loading}
            />
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: colors.text }]}>Weight (lbs)</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: errors.weight ? '#FF3B30' : colors.text + '30' },
              ]}
              placeholder="e.g., 45"
              placeholderTextColor={colors.text + '60'}
              value={formData.weight?.toString() || ''}
              onChangeText={(text) => {
                setFormData({ ...formData, weight: text ? parseFloat(text) : undefined });
                if (errors.weight) setErrors({ ...errors, weight: '' });
              }}
              keyboardType="decimal-pad"
              editable={!loading}
            />
            {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
          <View style={styles.genderButtons}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                {
                  backgroundColor:
                    formData.gender === 'male' ? colors.tint : colors.background,
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setFormData({ ...formData, gender: 'male' })}
              disabled={loading}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  { color: formData.gender === 'male' ? '#fff' : colors.tint },
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                {
                  backgroundColor:
                    formData.gender === 'female' ? colors.tint : colors.background,
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setFormData({ ...formData, gender: 'female' })}
              disabled={loading}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  { color: formData.gender === 'female' ? '#fff' : colors.tint },
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Medical & Care Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Medical & Care</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Medical Notes</Text>
          <TextInput
            style={[styles.textArea, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="Any medical conditions, allergies, or medications"
            placeholderTextColor={colors.text + '60'}
            value={formData.medical_notes}
            onChangeText={(text) => setFormData({ ...formData, medical_notes: text })}
            multiline
            numberOfLines={3}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Special Instructions</Text>
          <TextInput
            style={[styles.textArea, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="Walking preferences, behavioral notes, etc."
            placeholderTextColor={colors.text + '60'}
            value={formData.special_instructions}
            onChangeText={(text) => setFormData({ ...formData, special_instructions: text })}
            multiline
            numberOfLines={3}
            editable={!loading}
          />
        </View>
      </View>

      {/* Veterinarian Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Veterinarian</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Vet Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="e.g., Dr. Smith"
            placeholderTextColor={colors.text + '60'}
            value={formData.vet_name}
            onChangeText={(text) => setFormData({ ...formData, vet_name: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Vet Phone</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="e.g., (555) 123-4567"
            placeholderTextColor={colors.text + '60'}
            value={formData.vet_phone}
            onChangeText={(text) => setFormData({ ...formData, vet_phone: text })}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contact</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Contact Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="e.g., John Doe"
            placeholderTextColor={colors.text + '60'}
            value={formData.emergency_contact_name}
            onChangeText={(text) => setFormData({ ...formData, emergency_contact_name: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Contact Phone</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="e.g., (555) 987-6543"
            placeholderTextColor={colors.text + '60'}
            value={formData.emergency_contact_phone}
            onChangeText={(text) => setFormData({ ...formData, emergency_contact_phone: text })}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.tint }]}
          onPress={handleSubmit}
          disabled={loading}
          accessible={true}
          accessibilityLabel={initialData ? 'Update pet profile' : 'Create pet profile'}
          accessibilityHint="Saves the pet information"
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {initialData ? 'Update Profile' : 'Create Profile'}
            </Text>
          )}
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.text + '30' }]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoButton: {
    marginBottom: 8,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
