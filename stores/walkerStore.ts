import { createBooking, endWalk, getBookingsForWalker, startWalk, uploadWalkPhoto } from '@/services/walkerService';
import { Booking, Walk, WalkPhoto } from '@/types/walker';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'zustand';

interface WalkerState {
  bookings: Booking[];
  activeWalk: Walk | null;
  loading: boolean;
  error: string | null;

  fetchBookings: (walkerId: string, status?: string) => Promise<void>;
  createBooking: (payload: Partial<Booking>) => Promise<Booking | null>;
  startWalk: (bookingId: string, walkerId: string) => Promise<Walk | null>;
  endWalk: (walkId: string, updates?: Partial<Walk>) => Promise<Walk | null>;
  uploadWalkPhoto: (walkerId: string, walkId: string, fileUri: string) => Promise<Partial<WalkPhoto> | null>;
  clearError: () => void;
}

export const useWalkerStore = create<WalkerState>((set, get) => ({
  bookings: [],
  activeWalk: null,
  loading: false,
  error: null,

  fetchBookings: async (walkerId: string, status?: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getBookingsForWalker(walkerId, status);
      set({ bookings: data || [], loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load bookings';
      console.error('fetchBookings error:', message);
      set({ error: message, loading: false });
    }
  },

  createBooking: async (payload: Partial<Booking>) => {
    set({ loading: true, error: null });
    try {
      const data = await createBooking(payload);
      set((state) => ({ bookings: [data, ...state.bookings], loading: false }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create booking';
      console.error('createBooking error:', message);
      set({ error: message, loading: false });
      return null;
    }
  },

  startWalk: async (bookingId: string, walkerId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await startWalk(bookingId, walkerId);
      set({ activeWalk: data, loading: false });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start walk';
      console.error('startWalk error:', message);
      set({ error: message, loading: false });
      return null;
    }
  },

  endWalk: async (walkId: string, updates?: Partial<Walk>) => {
    set({ loading: true, error: null });
    try {
      const data = await endWalk(walkId, updates);
      // Clear activeWalk if it matches the ended walk
      set((state) => ({ activeWalk: state.activeWalk?.id === data.id ? null : state.activeWalk, loading: false }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to end walk';
      console.error('endWalk error:', message);
      set({ error: message, loading: false });
      return null;
    }
  },

  uploadWalkPhoto: async (walkerId: string, walkId: string, fileUri: string) => {
    set({ loading: true, error: null });
    try {
      const result = await uploadWalkPhoto(walkerId, walkId, fileUri);
      set({ loading: false });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload photo';
      console.error('uploadWalkPhoto error:', message);
      set({ error: message, loading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));

// Helper for selecting/taking an image (exposed for convenience)
export async function pickWalkPhotoFromGallery(): Promise<string | null> {
  try {
    // Request permission first to avoid launching the picker when not allowed
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // Some platforms return `granted` boolean, others return `status` string
    const granted = (permission as any).granted === true || (permission as any).status === 'granted';
    if (!granted) {
      console.warn('Media library permission not granted');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) return result.assets[0].uri;
    return null;
  } catch (e) {
    console.error('pickWalkPhotoFromGallery error', e);
    return null;
  }
}
