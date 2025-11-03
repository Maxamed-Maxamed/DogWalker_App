import { supabase } from '@/utils/supabase';
import * as ImagePicker from "expo-image-picker";
import { create } from 'zustand';



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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ pets: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching pets:', error);
      set({ error: error.message || 'Failed to load pets', loading: false });
    }
  },

  // Create a new pet
  createPet: async (petData: PetFormData, photoUri?: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let photo_url: string | undefined;

      // Upload photo if provided
      if (photoUri) {
        photo_url = await uploadPetPhoto(user.id, photoUri);
      }

      // Insert pet into database
      const { data, error } = await supabase
        .from('pets')
        .insert([
          {
            owner_id: user.id,
            ...petData,
            photo_url,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        pets: [data, ...state.pets],
        loading: false,
      }));

      return data;
    } catch (error: any) {
      console.error('Error creating pet:', error);
      set({ error: error.message || 'Failed to create pet', loading: false });
      return null;
    }
  },

  // Update an existing pet
  updatePet: async (petId: string, petData: Partial<PetFormData>, photoUri?: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let photo_url: string | undefined;

      // Upload new photo if provided
      if (photoUri) {
        photo_url = await uploadPetPhoto(user.id, photoUri);
      }

      // Update pet in database
      const updateData = photo_url ? { ...petData, photo_url } : petData;
      
      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', petId)
        .eq('owner_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === petId ? data : pet)),
        selectedPet: state.selectedPet?.id === petId ? data : state.selectedPet,
        loading: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error updating pet:', error);
      set({ error: error.message || 'Failed to update pet', loading: false });
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
    } catch (error: any) {
      console.error('Error deleting pet:', error);
      set({ error: error.message || 'Failed to delete pet', loading: false });
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

// Helper function to upload pet photo
async function uploadPetPhoto(userId: string, photoUri: string): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.jpg`;
    const filePath = `${userId}/${fileName}`;

    // Read file as base64
    const response = await fetch(photoUri);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('pet-photos')
      .upload(filePath, uint8Array, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pet-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading pet photo:', error);
    throw new Error('Failed to upload photo');
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
  mediaTypes: [ImagePicker.MediaTypeOptions.Images],
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
