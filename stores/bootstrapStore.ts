import { create } from 'zustand';

import { useAppStateStore } from './appStateStore';
import { useAuthStore } from './authStore';
import { useErrorStore } from './errorStore';

/**
 * Bootstrap phases representing app initialization state
 */
type BootstrapPhase = 'initializing' | 'ready' | 'error';

/**
 * Bootstrap store state and actions
 * Coordinates the initialization of all app stores in proper sequence
 */
type BootstrapState = {
  /** Current initialization phase */
  phase: BootstrapPhase;
  /** Error that occurred during bootstrap (if any) */
  error: Error | null;
  /** Detailed error message for user display */
  errorMessage: string | null;
  /** Whether currently in process of bootstrapping */
  isBootstrapping: boolean;
  /** Initialize the app by running all setup operations in sequence */
  bootstrap: () => Promise<void>;
  /** Reset bootstrap state (for testing/debugging) */
  reset: () => void;
};

/**
 * Bootstrap store
 * Manages sequential initialization of app state, auth, and other critical systems
 * Prevents race conditions and ensures proper initialization order:
 * 1. App state (theme, onboarding status)
 * 2. Auth state (restore session)
 * 3. Mark as ready
 */
export const useBootstrapStore = create<BootstrapState>((set, get) => ({
  phase: 'initializing',
  error: null,
  errorMessage: null,
  isBootstrapping: true,

  bootstrap: async () => {
    set({ phase: 'initializing', error: null, errorMessage: null, isBootstrapping: true });

    try {
      // Step 1: Initialize app state (theme, onboarding status)
      // This is safe to run first as it only reads from AsyncStorage
      const appStore = useAppStateStore.getState();
      await appStore.init();

      // Step 2: Restore auth session
      // Must run after app state because we need to know if it's first launch
      const authStore = useAuthStore.getState();
      await authStore.initialize();

      // Mark bootstrap as complete
      set({ phase: 'ready', isBootstrapping: false });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown bootstrap error');
      const errorMessage = error.message || 'Failed to initialize application';

      // Add to error store for app-wide tracking
      const errorStore = useErrorStore.getState();
      errorStore.addError({
        level: 'error',
        message: errorMessage,
        context: { error: error.message, phase: 'bootstrap' },
      });

      set({
        phase: 'error',
        error,
        errorMessage,
        isBootstrapping: false,
      });
    }
  },

  reset: () => {
    set({
      phase: 'initializing',
      error: null,
      errorMessage: null,
      isBootstrapping: true,
    });
  },
}));

export default useBootstrapStore;
