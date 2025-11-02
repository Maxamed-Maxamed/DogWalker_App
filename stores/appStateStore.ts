import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type ThemePref = 'light' | 'dark' | 'system';

type AppState = {
  initializing: boolean;
  initialized: boolean;
  firstLaunch: boolean; // persisted
  themePreference: ThemePref; // placeholder for future switching
  setThemePreference: (pref: ThemePref) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  init: () => Promise<void>;
};

const STORAGE_KEYS = {
  FIRST_LAUNCH: 'app:firstLaunch',
  THEME_PREF: 'app:themePreference',
};

export const useAppStateStore = create<AppState>((set, get) => ({
  initializing: true,
  initialized: false,
  firstLaunch: true,
  themePreference: 'system',

  setThemePreference: async (pref: ThemePref) => {
    set({ themePreference: pref });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREF, pref);
    } catch {
      // non-fatal; ignore
    }
  },

  completeOnboarding: async () => {
    set({ firstLaunch: false });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
    } catch {
      // ignore
    }
  },

  init: async () => {
    if (get().initialized) return; // idempotent
    set({ initializing: true });
    try {
      const [firstLaunchStr, themePref] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH),
        AsyncStorage.getItem(STORAGE_KEYS.THEME_PREF),
      ]);

      const firstLaunch = firstLaunchStr == null ? true : firstLaunchStr !== 'false';
      set({
        firstLaunch,
        themePreference: (themePref as ThemePref) || 'system',
      });
    } finally {
      set({ initializing: false, initialized: true });
    }
  },
}));

export default useAppStateStore;
