import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const ROLE_STORAGE_KEY = 'user_role';

export type UserRole = 'owner' | 'walker' | null;

interface RoleStore {
  role: UserRole;
  isLoading: boolean;
  setRole: (role: 'owner' | 'walker') => Promise<void>;
  clearRole: () => Promise<void>;
  loadRole: () => Promise<void>;
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: null,
  isLoading: true,

  setRole: async (role: 'owner' | 'walker') => {
    try {
      await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
      set({ role });
    } catch (error) {
      console.error('Failed to save role:', error);
      throw error;
    }
  },

  clearRole: async () => {
    try {
      await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
      set({ role: null });
    } catch (error) {
      console.error('Failed to clear role:', error);
      throw error;
    }
  },

  loadRole: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
      if (stored === 'owner' || stored === 'walker') {
        set({ role: stored, isLoading: false });
      } else {
        set({ role: null, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load role:', error);
      set({ role: null, isLoading: false });
    }
  },
}));
