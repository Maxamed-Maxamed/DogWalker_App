import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Read keys from environment. Prefer EXPO_PUBLIC_ vars for client-side use.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? (Constants.expoConfig?.extra?.SUPABASE_URL as string) ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? (Constants.expoConfig?.extra?.SUPABASE_ANON_KEY as string) ?? '';

let supabase: SupabaseClient | null = null;

function createSecureStorage() {
  return {
    getItem: async (key: string) => {
      return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
      await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
      await SecureStore.deleteItemAsync(key);
    },
  };
}

export function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (supabase) return supabase;

  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        // @ts-ignore - storage adapter for RN
        storage: createSecureStorage(),
        // persist session across reloads
        persistSession: true,
      },
    });
    return supabase;
  } catch (e) {
    // If initialization fails, return null and fallback to mock
    console.error(e);
    return null;
  }
}

export default getSupabaseClient;
