import * as Crypto from 'expo-crypto';
import { create } from 'zustand';

export type ErrorLevel = 'warning' | 'error' | 'critical';

/**
 * Represents an application error with context and metadata
 */
export type AppError = {
  /** Unique identifier for the error */
  id: string;
  /** Severity level of the error */
  level: ErrorLevel;
  /** User-friendly error message */
  message: string;
  /** Technical details for debugging */
  context?: Record<string, unknown>;
  /** Timestamp when error occurred */
  timestamp: number;
  /** Whether error has been dismissed by user */
  dismissed: boolean;
};

/**
 * Error store state and actions
 * Manages app-wide error tracking and display
 */
type ErrorState = {
  /** List of active errors (max 10) */
  errors: AppError[];
  /** Add new error to store */
  addError: (error: Omit<AppError, 'id' | 'timestamp' | 'dismissed'>) => void;
  /** Mark error as dismissed */
  dismissError: (id: string) => void;
  /** Clear all errors */
  clearAll: () => void;
  /** Get most recent error of a specific level */
  getLatestError: (level?: ErrorLevel) => AppError | null;
};

/**
 * Centralized error management store
 * Tracks application errors for monitoring and user feedback
 */
export const useErrorStore = create<ErrorState>((set, get) => ({
  errors: [],

  addError: (error) => {
    // Generate cryptographically secure random ID instead of Math.random()
    const id = Crypto.randomUUID();
    const newError: AppError = {
      ...error,
      id,
      timestamp: Date.now(),
      dismissed: false,
    };

    set((state) => ({
      // Keep only last 10 errors to prevent memory bloat
      errors: [newError, ...state.errors].slice(0, 10),
    }));

    // Log critical errors for monitoring
    if (error.level === 'critical') {
      if (__DEV__) {
        console.error('[CRITICAL ERROR]', error.message, error.context);
      }
      // TODO: Send to error tracking service (Sentry, etc.)
    }
  },

  dismissError: (id) => {
    set((state) => ({
      errors: state.errors.map((e) =>
        e.id === id ? { ...e, dismissed: true } : e
      ),
    }));
  },

  clearAll: () => {
    set({ errors: [] });
  },

  getLatestError: (level) => {
    const { errors } = get();
    const filtered = level ? errors.filter((e) => e.level === level) : errors;
    return filtered.length > 0 ? filtered[0] : null;
  },
}));

export default useErrorStore;
