import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { useErrorStore } from './errorStore';

type ThemePref = 'light' | 'dark' | 'system';

/**
 * App state type
 * Manages app-wide settings like theme, onboarding status, and initialization
 */
type AppState = {
  initializing: boolean;
  initialized: boolean;
  firstLaunch: boolean; // persisted
  themePreference: ThemePref; // placeholder for future switching
  error: string | null;
  setThemePreference: (pref: ThemePref) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  init: () => Promise<void>;
  clearError: () => void;
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
  error: null,

  setThemePreference: async (pref: ThemePref) => {
    set({ themePreference: pref });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREF, pref);
    } catch (error) {
      // Non-fatal: Theme preference persisting failed, will use system default
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('Failed to persist theme preference:', error);
      }
    }
  },

  completeOnboarding: async () => {
    set({ firstLaunch: false });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
    } catch (error) {
      // Non-fatal: First launch flag persisting failed, user may see onboarding again
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('Failed to persist onboarding completion:', error);
      }
    }
  },

  init: async () => {
    if (get().initialized) return; // idempotent
    set({ initializing: true, error: null });
    try {
      const [firstLaunchStr, themePref] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH),
        AsyncStorage.getItem(STORAGE_KEYS.THEME_PREF),
      ]);

      const firstLaunch = firstLaunchStr == null ? true : firstLaunchStr !== 'false';
      set({
        firstLaunch,
        themePreference: (themePref as ThemePref) || 'system',
        initializing: false,
        initialized: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize app state';
      
      // Log to error store
      const errorStore = useErrorStore.getState();
      errorStore.addError({
        level: 'error',
        message: errorMessage,
        context: { error: errorMessage, action: 'init_app_state' },
      });

      // Still mark as initialized even on error
      set({
        initializing: false,
        initialized: true,
        error: errorMessage,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAppStateStore;
