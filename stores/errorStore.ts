import * as Sentry from '@sentry/react-native';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';

// Small in-memory dedupe map to avoid spamming Sentry with identical errors
const recentReports = new Map<string, number>();
const REPORT_DEDUPE_WINDOW_MS = 60_000; // 60s

const SENSITIVE_KEY_RE = /(password|pass|token|secret|ssn|card|cvv|authorization|auth|email|phone)/i;

function maskEmail(value: string) {
  const parts = value.split('@');
  if (parts.length !== 2) return '[REDACTED]';
  const local = parts[0];
  const maskedLocal = local.length > 2 ? local[0] + '***' + local[local.length - 1] : '***';
  return `${maskedLocal}@${parts[1]}`;
}

function scrubContext(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string') {
    // mask obvious emails
    if (value.includes('@')) return maskEmail(value);
    // limit long strings
    if (value.length > 200) return value.slice(0, 200) + '...[TRUNCATED]';
    return value;
  }
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(scrubContext);
  try {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_RE.test(k)) {
        out[k] = '[REDACTED]';
      } else {
        out[k] = scrubContext(v);
      }
    }
    return out;
  } catch {
    return '[UNSERIALIZABLE]';
  }
}

function shouldReportFingerprint(fingerprint: string) {
  const now = Date.now();
  const last = recentReports.get(fingerprint) || 0;
  if (now - last < REPORT_DEDUPE_WINDOW_MS) return false;
  recentReports.set(fingerprint, now);
  return true;
}

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

      // Prepare scrubbed context to avoid leaking PII into Sentry
      const scrubbed = scrubContext(error.context ?? {});

      // Create a simple fingerprint to dedupe identical reports
      let fingerprintKey: string;
      try {
        fingerprintKey = `${error.message}::${JSON.stringify(scrubbed)}`;
      } catch {
        fingerprintKey = error.message;
      }

      if (!shouldReportFingerprint(fingerprintKey)) return;

      // Send to error tracking service (Sentry) if available
      try {
        if (Sentry && typeof Sentry.captureException === 'function') {
          const ex = new Error(error.message);

          // Use a scope so we only attach allowed metadata
          Sentry.withScope((scope) => {
            scope.setLevel('fatal');
            scope.setTag('source', 'useErrorStore');
            // Attach scrubbed extras (safe-serializable)
            scope.setExtras(typeof scrubbed === 'object' ? (scrubbed as Record<string, unknown>) : { info: scrubbed });
            Sentry.captureException(ex);
          });
        }
      } catch {
        // ignore Sentry reporting failures
      }
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
