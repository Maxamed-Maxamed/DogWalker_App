import { sanitizeKey } from '@/utils/sanitization';
import * as Sentry from '@sentry/react-native';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';

// Small in-memory dedupe map to avoid spamming Sentry with identical errors
const recentReports = new Map<string, number>();
const REPORT_DEDUPE_WINDOW_MS = 60_000; // 60s

// Clean up old entries periodically to prevent memory leaks.
// Store the interval handle so it can be cleared during app shutdown or tests.
let recentReportsCleanupInterval: ReturnType<typeof setInterval> | null = null;

function cleanupRecentReports() {
  const now = Date.now();
  for (const [key, timestamp] of recentReports.entries()) {
    if (now - timestamp > REPORT_DEDUPE_WINDOW_MS) {
      recentReports.delete(key);
    }
  }
}

/**
 * Start the periodic cleanup interval if it's not already running.
 * This avoids creating the interval at module import time which can cause
 * persistent timers during tests or hot reloads.
 */
export function startCleanupInterval() {
  if (recentReportsCleanupInterval == null) {
    recentReportsCleanupInterval = setInterval(cleanupRecentReports, REPORT_DEDUPE_WINDOW_MS);
  }
}

/**
 * Clear the periodic cleanup interval. Call this on application shutdown/tests to avoid
 * leaving timers running.
 */
export function clearRecentReportsCleanupInterval() {
  if (recentReportsCleanupInterval != null) {
    // clear the interval in a type-safe way
    clearInterval(recentReportsCleanupInterval);
    recentReportsCleanupInterval = null;
  }
}

const SENSITIVE_KEY_RE = /(password|pass|token|secret|ssn|card|cvv|authorization|auth|email|phone)/i;
// Maximum recursion depth for scrubber to avoid stack overflows on deep inputs
const SCRUB_MAX_DEPTH = 5;

// `sanitizeKey` is shared from `utils/sanitization.ts` to avoid duplication

// Make a deep, safe copy of unknown input into a null-prototype structure
function safeCopy(value: unknown, depth = 0, seen: WeakSet<object> = new WeakSet()): unknown {
  if (value == null) return value;
  if (depth > SCRUB_MAX_DEPTH) return '[TRUNCATED]';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return value;
  if (Array.isArray(value)) {
    if (seen.has(value as unknown as object)) return '[CYCLE]';
    seen.add(value as unknown as object);
    return (value as unknown[]).map((v) => safeCopy(v, depth + 1, seen));
  }
  if (t === 'object') {
    const obj = value as Record<string, unknown>;
    if (seen.has(obj as object)) return '[CYCLE]';
    seen.add(obj as object);
    const out: Record<string, unknown> = Object.create(null);
    for (const rawK of Object.keys(obj)) {
      const k = sanitizeKey(rawK);
      if (!k) continue;
      try {
        const v = obj[rawK];
        // Recurse and assign safe copies only
        out[k] = safeCopy(v, depth + 1, seen);
      } catch {
        // ignore
      }
    }
    return out;
  }
  // fallback to string representation
  try {
    return String(value);
  } catch {
    return '[UNSERIALIZABLE]';
  }
}

function maskEmail(value: string) {
  // Use the last '@' to support malformed inputs with multiple '@' characters
  const at = value.lastIndexOf('@');
  if (at === -1) return '[REDACTED]';
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  // Guard: require both local and domain to be non-empty
  if (!local || !domain) return '[REDACTED]';
  const maskedLocal = local.length > 2 ? local[0] + '***' + local[local.length - 1] : '***';
  return `${maskedLocal}@${domain}`;
}

// Simple, safe email regex: local@domain.tld (not exhaustive, avoids false positives)
const SIMPLE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function scrubContext(
  value: unknown,
  depth = 0,
  seen: WeakSet<object> = new WeakSet()
): unknown {
  if (value == null) return value;
  if (depth > SCRUB_MAX_DEPTH) return '[TRUNCATED]';
  if (typeof value === 'string') {
    // mask only valid-looking emails, avoid misclassifying other strings
    if (SIMPLE_EMAIL_RE.test(value)) return maskEmail(value);
    // limit long strings
    if (value.length > 200) return value.slice(0, 200) + '...[TRUNCATED]';
    return value;
  }
  if (typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    const arrObj = value as unknown as object;
    if (seen.has(arrObj)) return '[CYCLE]';
    seen.add(arrObj);
    return (value as unknown[]).map((item) => scrubContext(item, depth + 1, seen));
  }
  try {
    const obj = value as Record<string, unknown>;
    if (seen.has(obj as object)) return '[CYCLE]';
    seen.add(obj as object);
    // Use a null-prototype object to avoid prototype pollution via dangerous keys
    const out: Record<string, unknown> = Object.create(null);
    for (const rawK of Object.keys(obj)) {
      if (!Object.prototype.hasOwnProperty.call(obj, rawK)) continue;
      const k = sanitizeKey(rawK);
      if (!k) continue;
      try {
        const v = obj[rawK];
        if (SENSITIVE_KEY_RE.test(k)) {
          out[k] = '[REDACTED]';
        } else {
          out[k] = scrubContext(v, depth + 1, seen);
        }
      } catch {
        // ignore per-key failures
      }
    }
    return out;
  } catch {
    return '[UNSERIALIZABLE]';
  }
}

/**
 * Build a safe, null-prototype extras object suitable for sending to Sentry.
 * This function enforces a key whitelist and ensures values are plain serializable
 * primitives or truncated strings to avoid passing untrusted objects directly.
 */
function buildSafeExtras(input: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = Object.create(null);
  if (input == null) return out;
  if (typeof input === 'object' && !Array.isArray(input)) {
    const src = input as Record<string, unknown>;
    for (const rawK of Object.keys(src)) {
      const k = sanitizeKey(rawK);
      if (!k) continue;
      if (!Object.prototype.hasOwnProperty.call(src, rawK)) continue;
      try {
        const v = src[rawK];
        if (v == null) {
          out[k] = v;
          continue;
        }
        if (typeof v === 'string') {
          out[k] = v.length > 200 ? v.slice(0, 200) + '...[TRUNCATED]' : v;
          continue;
        }
        if (typeof v === 'number' || typeof v === 'boolean') {
          out[k] = v;
          continue;
        }
        // Use safeCopy to produce a null-prototype, sanitized copy of nested objects/arrays
        out[k] = safeCopy(v);
      } catch {
        // ignore individual key failures
      }
    }
    return out;
  }
  // Fallback: put a stringified summary under `info`
  out['info'] = typeof input === 'string' ? input : String(input);
  return out;
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
    // Ensure the periodic cleanup is running (start lazily on first error)
    startCleanupInterval();
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
      const scrubbedRaw = scrubContext(error.context ?? {});
      // Build a strictly whitelisted, serializable extras object for Sentry
      const safeExtras = buildSafeExtras(scrubbedRaw);

      // Create a simple fingerprint to dedupe identical reports using the safe extras
      let fingerprintKey: string;
      try {
        fingerprintKey = `${error.message}::${JSON.stringify(safeExtras)}`;
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
            // Attach the already-built, whitelisted + serializable extras
            scope.setExtras(safeExtras);
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
