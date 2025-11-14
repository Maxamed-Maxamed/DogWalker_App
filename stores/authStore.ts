import { isSupabaseConfigured, supabase } from '@/utils/supabase';
import { create } from 'zustand';

import { useErrorStore } from './errorStore';

type User = {
  id?: string;
  name?: string;
  email?: string;
};

/**
 * Authentication state type
 * Manages user authentication, session persistence, and auth-related errors
 */
type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      await get().restore();
      set({ isInitialized: true, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore session';
      
      // Log to error store
      const errorStore = useErrorStore.getState();
      errorStore.addError({
        level: 'error',
        message: errorMessage,
        context: { error: errorMessage, action: 'restore_session' },
      });

      // Still mark as initialized even on error
      set({ 
        isInitialized: true, 
        isLoading: false, 
        error: errorMessage 
      });
    }
  },

  login: async (email: string, password: string) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail || !password) {
      set({ error: 'Email and password are required' });
      throw new Error('Email and password are required');
    }

    set({ isLoading: true, error: null });

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: normalizedEmail, 
          password 
        });
        
        if (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }

        const session = data.session;
        const user = data.user ? { 
          id: data.user.id, 
          email: data.user.email ?? undefined,
          name: data.user.user_metadata?.full_name 
        } : null;
        
        set({ user, token: session?.access_token ?? null, isLoading: false, error: null });
        return;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      if (__DEV__) {
         
        console.error('Login error:', error);
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }

    // Fallback mock (only if Supabase not configured)
    if (__DEV__) {
       
      console.warn('Using mock authentication - Supabase not configured');
    }
    const token = 'mock-token';
    const user = { id: '1', email: normalizedEmail } as User;
    set({ user, token, isLoading: false });
  },

  signup: async (name: string, email: string, password: string) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      set({ error: 'All fields are required' });
      throw new Error('All fields are required');
    }

    set({ isLoading: true, error: null });

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({ 
          email: normalizedEmail, 
          password, 
          options: { 
            data: { full_name: name } 
          } 
        });
        
        if (error) {
          // Provide clearer message for common cases like domain restrictions
          const friendly =
            typeof error.message === 'string' && /allowed|domain|invalid email/i.test(error.message)
              ? 'Signup failed. Please check the email address (domain restrictions may apply).'
              : error.message;
          set({ error: friendly, isLoading: false });
          throw error;
        }

        const user = data.user ? { 
          id: data.user.id, 
          email: data.user.email ?? undefined, 
          name 
        } : null;
        
        // Note: Session may be null if email confirmation is required
        const session = data.session;
        set({ 
          user, 
          token: session?.access_token ?? null, 
          isLoading: false, 
          error: null 
        });
        return;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      if (__DEV__) {
         
        console.error('Signup error:', error);
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }

    // Fallback mock (only if Supabase not configured)
    if (__DEV__) {
       
      console.warn('Using mock authentication - Supabase not configured');
    }
    const token = 'mock-token';
    const user = { id: '2', name, email: normalizedEmail } as User;
    set({ user, token, isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          if (__DEV__) {
             
            console.error('Logout error:', error);
          }
          set({ error: error.message, isLoading: false });
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      if (__DEV__) {
         
        console.error('Logout error:', error);
      }
      set({ error: errorMessage });
    } finally {
      // Always clear local state
      set({ user: null, token: null, isLoading: false });
    }
  },

  restore: async () => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          if (__DEV__) {
             
            console.error('Session restore error:', error);
          }
          // Clear invalid session
          if (error.message?.includes('Refresh Token') || error.message?.includes('Invalid')) {
            await supabase.auth.signOut();
            set({ user: null, token: null });
          }
          return;
        }
        
        const session = data.session;
        if (session) {
          const user = session.user ? { 
            id: session.user.id, 
            email: session.user.email ?? undefined,
            name: session.user.user_metadata?.full_name
          } : null;
          
          set({ user, token: session.access_token });
        } else {
          // No session found, clear state
          set({ user: null, token: null });
        }
        return;
      }
    } catch (error: unknown) {
      if (__DEV__) {
         
        console.error('Session restore error:', error);
      }
      // Clear state on any error
      set({ user: null, token: null });
    }

    // fallback: nothing to restore for mock
    return;
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;

