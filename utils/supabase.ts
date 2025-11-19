/**
 * Canonical Supabase client initialization.
 * 
 * This is the single source of truth for the Supabase client across the app.
 * Uses SecureStore for secure token storage in React Native.
 * 
 * Environment variables required:
 * - EXPO_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - EXPO_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

// Read from environment variables (note: use EXPO_PUBLIC_SUPABASE_ANON_KEY not EXPO_PUBLIC_SUPABASE_KEY)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Secure storage adapter with chunking to bypass ~2KB limit on iOS SecureStore
// Supabase stores the entire session JSON in a single key; this can exceed 2KB.
// We split large values into multiple chunks under derived keys.
const CHUNK_SIZE = 1800; // keep well under platform limits
const META_SUFFIX = '__meta';

async function secureStoreSetChunked(baseKey: string, value: string) {
  // First, remove any existing chunks
  await secureStoreRemoveChunked(baseKey);

  if (value.length <= CHUNK_SIZE) {
    await SecureStore.setItemAsync(baseKey, value);
    return;
  }

  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += CHUNK_SIZE) {
    chunks.push(value.slice(i, i + CHUNK_SIZE));
  }

  // Store metadata (number of chunks)
  await SecureStore.setItemAsync(`${baseKey}${META_SUFFIX}`, String(chunks.length));

  // Store chunks individually
  await Promise.all(
    chunks.map((chunk, idx) => SecureStore.setItemAsync(`${baseKey}__chunk_${idx}`, chunk))
  );
}

async function secureStoreGetChunked(baseKey: string) {
  // If meta exists, reconstruct
  const meta = await SecureStore.getItemAsync(`${baseKey}${META_SUFFIX}`);
  if (meta) {
    const count = Number(meta);
    if (Number.isFinite(count) && count > 0) {
      // Try new format first
      let parts: (string | null)[] = await Promise.all(
        Array.from({ length: count }, (_, idx) => SecureStore.getItemAsync(`${baseKey}__chunk_${idx}`))
      );
      // If all are null, try old format
      if (parts.every(part => part === null)) {
        parts = await Promise.all(
          Array.from({ length: count }, (_, idx) => SecureStore.getItemAsync(`${baseKey}:${idx}`))
        );
        // If found, migrate to new format
        if (parts.some(part => part !== null)) {
          await Promise.all(
            parts.map((chunk, idx) =>
              chunk !== null
                ? SecureStore.setItemAsync(`${baseKey}__chunk_${idx}`, chunk)
                : Promise.resolve()
            )
          );
          // Optionally clean up old chunks here
        }
      }
      return parts.join('');
    }
  }
  // Fallback to single value
  return await SecureStore.getItemAsync(baseKey);
}

async function secureStoreRemoveChunked(baseKey: string) {
  const meta = await SecureStore.getItemAsync(`${baseKey}${META_SUFFIX}`);
  if (meta) {
    const count = Number(meta);
    await SecureStore.deleteItemAsync(`${baseKey}${META_SUFFIX}`);
    if (Number.isFinite(count) && count > 0) {
      // Remove new format chunks
      await Promise.all(
        Array.from({ length: count }, (_, idx) => SecureStore.deleteItemAsync(`${baseKey}__chunk_${idx}`))
      );
    }
  }
  // Also remove potential single value
  try {
    await SecureStore.deleteItemAsync(baseKey);
  } catch {
    // Intentionally ignore: key may not exist, which is fine during cleanup
    // No need to log as this is expected behavior
  }
}

// Storage interface expected by supabase-js auth
const ChunkedSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await secureStoreGetChunked(key);
    } catch {
      if (__DEV__) {
        console.error('SecureStore (chunked) getItem error:');
      }
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await secureStoreSetChunked(key, value);
    } catch {
      if (__DEV__) {
        console.error('SecureStore (chunked) setItem error:');
      }
    }
  },
  removeItem: async (key: string) => {
    try {
      await secureStoreRemoveChunked(key);
    } catch {
      if (__DEV__) {
        console.error('SecureStore (chunked) removeItem error:');
      }
    }
  },
};

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (__DEV__) {
    console.warn(
      '⚠️ Supabase environment variables missing!\n' +
      'Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    );
  }
}

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Use chunked SecureStore on native; AsyncStorage on web
    storage: Platform.OS === 'web'
      ? {
          getItem: AsyncStorage.getItem,
          setItem: AsyncStorage.setItem,
          removeItem: AsyncStorage.removeItem,
        }
      : ChunkedSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};