import { supabase } from '@/utils/supabase';
import * as ImagePicker from "expo-image-picker";
import { Alert } from 'react-native';
import { create } from 'zustand';

// File upload validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Pet interface
export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: 'male' | 'female';
  photo_url?: string;
  temperament?: string;
  medical_notes?: string;
  special_instructions?: string;
  vet_name?: string;
  vet_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

// Pet form data (for create/update)
export interface PetFormData {
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: 'male' | 'female';
  temperament?: string;
  medical_notes?: string;
  special_instructions?: string;
  vet_name?: string;
  vet_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPets: () => Promise<void>;
  createPet: (petData: PetFormData, photoUri?: string) => Promise<Pet | null>;
  updatePet: (petId: string, petData: Partial<PetFormData>, photoUri?: string) => Promise<boolean>;
  deletePet: (petId: string) => Promise<boolean>;
  selectPet: (pet: Pet | null) => void;
  clearError: () => void;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,

  // Fetch all pets for the current user
  fetchPets: async () => {
    set({ loading: true, error: null });
    
    try {
      // Get authenticated user with proper error handling
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError.message);
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (!user) {
        console.warn('No authenticated user found');
        set({ pets: [], loading: false, error: 'Please log in to view your pets' });
        return;
      }

      // Fetch pets with proper error handling
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error.message);
        throw new Error(`Failed to load pets: ${error.message}`);
      }

      console.log(`Successfully loaded ${data?.length || 0} pets for user ${user.id}`);
      set({ pets: data || [], loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load pets';
      console.error('Error fetching pets:', errorMessage);
      set({ error: errorMessage, loading: false, pets: [] });
    }
  },

  // Create a new pet
  createPet: async (petData: PetFormData, photoUri?: string) => {
    set({ loading: true, error: null });
    
    try {
      // Validate required fields
      if (!petData.name || petData.name.trim().length === 0) {
        throw new Error('Pet name is required');
      }

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Please log in to add a pet');
      }

      // Ensure user profile exists (required for foreign key constraint)
      await ensureProfileExists(user);

      let photo_url: string | undefined;

      // Upload photo if provided
      if (photoUri) {
        console.log('Uploading pet photo...');
        photo_url = await uploadPetPhoto(user.id, photoUri);
        console.log('Photo uploaded successfully:', photo_url);
      }

      // Insert pet into database
      const { data, error } = await supabase
        .from('pets')
        .insert([
          {
            owner_id: user.id,
            name: petData.name.trim(),
            breed: petData.breed?.trim(),
            age: petData.age,
            weight: petData.weight,
            gender: petData.gender,
            photo_url,
            temperament: petData.temperament?.trim(),
            medical_notes: petData.medical_notes?.trim(),
            special_instructions: petData.special_instructions?.trim(),
            vet_name: petData.vet_name?.trim(),
            vet_phone: petData.vet_phone?.trim(),
            emergency_contact_name: petData.emergency_contact_name?.trim(),
            emergency_contact_phone: petData.emergency_contact_phone?.trim(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Failed to create pet: ${error.message}`);
      }

      console.log('Pet created successfully:', data.id);

      // Update local state
      set((state) => ({
        pets: [data, ...state.pets],
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create pet';
      console.error('Error creating pet:', errorMessage);
      set({ error: errorMessage, loading: false });
      Alert.alert('Error', errorMessage);
      return null;
    }
  },

  // Update an existing pet
  updatePet: async (petId: string, petData: Partial<PetFormData>, photoUri?: string) => {
    set({ loading: true, error: null });
    
    try {
      // Validate pet ID
      if (!petId || petId.trim().length === 0) {
        throw new Error('Invalid pet ID');
      }

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Please log in to update pet');
      }

      let photo_url: string | undefined;

      // Upload new photo if provided
      if (photoUri) {
        console.log('Uploading new pet photo...');
        photo_url = await uploadPetPhoto(user.id, photoUri);
        console.log('Photo uploaded successfully:', photo_url);
      }

      // Prepare update data with trimmed strings
      const updateData: any = {};
      if (petData.name) updateData.name = petData.name.trim();
      if (petData.breed !== undefined) updateData.breed = petData.breed?.trim();
      if (petData.age !== undefined) updateData.age = petData.age;
      if (petData.weight !== undefined) updateData.weight = petData.weight;
      if (petData.gender !== undefined) updateData.gender = petData.gender;
      if (petData.temperament !== undefined) updateData.temperament = petData.temperament?.trim();
      if (petData.medical_notes !== undefined) updateData.medical_notes = petData.medical_notes?.trim();
      if (petData.special_instructions !== undefined) updateData.special_instructions = petData.special_instructions?.trim();
      if (petData.vet_name !== undefined) updateData.vet_name = petData.vet_name?.trim();
      if (petData.vet_phone !== undefined) updateData.vet_phone = petData.vet_phone?.trim();
      if (petData.emergency_contact_name !== undefined) updateData.emergency_contact_name = petData.emergency_contact_name?.trim();
      if (petData.emergency_contact_phone !== undefined) updateData.emergency_contact_phone = petData.emergency_contact_phone?.trim();
      if (photo_url) updateData.photo_url = photo_url;
      
      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', petId)
        .eq('owner_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        throw new Error(`Failed to update pet: ${error.message}`);
      }

      console.log('Pet updated successfully:', petId);

      // Update local state
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === petId ? data : pet)),
        selectedPet: state.selectedPet?.id === petId ? data : state.selectedPet,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pet';
      console.error('Error updating pet:', errorMessage);
      set({ error: errorMessage, loading: false });
      Alert.alert('Error', errorMessage);
      return false;
    }
  },

  // Delete a pet
  deletePet: async (petId: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('owner_id', user.id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        pets: state.pets.filter((pet) => pet.id !== petId),
        selectedPet: state.selectedPet?.id === petId ? null : state.selectedPet,
        loading: false,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete pet';
      console.error('Error deleting pet:', errorMessage);
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // Select a pet
  selectPet: (pet: Pet | null) => {
    set({ selectedPet: pet });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Helper function to ensure user profile exists in profiles table
async function ensureProfileExists(user: any): Promise<void> {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // If profile exists, we're done
    if (existingProfile) {
      console.log('Profile already exists for user:', user.id);
      return;
    }

    // If error is not "no rows", throw it
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking profile:', checkError);
      throw checkError;
    }

    // Profile doesn't exist, create it
    console.log('Creating profile for user:', user.id);
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error('Error creating profile:', insertError);
      throw insertError;
    }

    console.log('Profile created successfully for user:', user.id);
  } catch (error) {
    console.error('Error ensuring profile exists:', error);
    throw new Error('Failed to create user profile. Please try again.');
  }
}

// Helper function to upload pet photo
async function uploadPetPhoto(userId: string, photoUri: string): Promise<string> {
  try {
    console.log('Starting photo upload from URI:', photoUri);
    
    // Read file as base64 for React Native compatibility
    const base64 = await fetch(photoUri)
      .then(res => res.blob())
      .then(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Remove data URL prefix to get pure base64
            const base64String = base64data.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });

    // Convert base64 to Uint8Array for Supabase upload
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Validate file size (approximate from base64 length)
    if (bytes.length > MAX_FILE_SIZE) {
      Alert.alert('Error', 'Image size must be less than 5MB');
      throw new Error('File size exceeds limit');
    }

    // Determine MIME type from file extension
    const fileExt = photoUri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeTypeMap: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
    };
    const contentType = mimeTypeMap[fileExt] || 'image/jpeg';
    
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      Alert.alert('Error', 'Only JPEG, PNG, and WebP images are allowed');
      throw new Error('Invalid file type');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log('Uploading to Supabase Storage:', filePath);

    // Upload to Supabase Storage using Uint8Array
    const { error: uploadError } = await supabase.storage
      .from('pet-photos')
      .upload(filePath, bytes, {
        contentType: contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pet-photos')
      .getPublicUrl(filePath);

    console.log('Photo uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo';
    console.error('Error uploading pet photo:', errorMessage);
    throw new Error(errorMessage);
  }
}

// Helper to request camera/gallery permissions
export async function requestImagePermissions(): Promise<boolean> {
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  return cameraStatus === 'granted' && galleryStatus === 'granted';
}

// Helper to pick image from gallery
export async function pickImageFromGallery(): Promise<string | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: 'images' as unknown as ImagePicker.MediaTypeOptions,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
});


    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

// Helper to take photo with camera
export async function takePhotoWithCamera(): Promise<string | null> {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
}
