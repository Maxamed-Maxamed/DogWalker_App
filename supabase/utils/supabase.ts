import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient, processLock } from '@supabase/supabase-js';

interface SupabaseConfig {
  url: string;
  key: string;
}

const getSupabaseConfig = (): SupabaseConfig => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

  if (!url) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!key) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_KEY environment variable");
  }

  return { url, key };
};

let supabase: SupabaseClient | null = null;

try {
  const config = getSupabaseConfig();
  
  supabase = createClient(config.url, config.key, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  });
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  throw error;
}

export { supabase };