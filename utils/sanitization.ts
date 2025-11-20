// Shared sanitization helpers to avoid duplicating logic across files.
// Exported utilities are intentionally small and well-typed so they
// can be used in multiple places without importing large modules.

export const SAFE_KEY_RE = /^[a-zA-Z0-9_.-]{1,100}$/;

export function sanitizeKey(k: unknown): string | null {
  if (typeof k !== 'string') return null;
  // Protect against prototype pollution keys
  if (k === '__proto__' || k === 'constructor' || k === 'prototype') return null;
  if (!SAFE_KEY_RE.test(k)) return null;
  return k;
}
