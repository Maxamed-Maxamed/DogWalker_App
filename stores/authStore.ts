import { supabase } from '@/utils/supabase';
import { create } from 'zustand';

type User = {
  id?: string;
  name?: string;
  email?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set: unknown, get: any) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      await get().restore();
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email and password are required');

    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const session = data.session;
      const user = data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null;
      set({ user, token: session?.access_token ?? null });
      return;
      }
    } catch {
      // Fallthrough to mock fallback
    }

    // Fallback mock
    const token = 'mock-token';
    const user = { id: '1', email } as User;
    set({ user, token });
  },

  signup: async (name: string, email: string, password: string) => {
    if (!name || !email || !password) throw new Error('All fields are required');

    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error;

        const user = data.user ? { id: data.user.id, email: data.user.email ?? undefined, name } : null;
        set({ user, token: null });
        return;
      }
    } catch {
      // fallback to mock
    }

    // Fallback mock
    const token = 'mock-token';
    const user = { id: '2', name, email } as User;
    set({ user, token });
  },

  logout: async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
        set({ user: null, token: null });
        return;
      }
    } catch {
      // fallback to clearing store
    }

    set({ user: null, token: null });
  },

  restore: async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.getSession();
        if (error) return;
        const session = data.session;
        if (session) {
          const user = session.user ? { id: session.user.id, email: session.user.email ?? undefined } : null;
          set({ user, token: session.access_token });
        }
        return;
      }
    } catch {
      // no-op fallback
    }

    // fallback: nothing to restore for mock
    return;
  },
}));

export default useAuthStore;

