import { isSupabaseConfigured, supabase } from '@/utils/supabase';
import { create } from 'zustand';
import { 
  GoogleSignin, 
  isSuccessResponse,
  statusCodes,
  type User as GoogleUser 
} from '@react-native-google-signin/google-signin';

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
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true });
    try {
      // Configure Google Sign-In
      try {
        GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
          offlineAccess: true,
        });
      } catch (error) {
        console.warn('Google Sign-In configuration failed:', error);
      }
      
      await get().restore();
    } finally {
      set({ isLoading: false, isInitialized: true });
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
        // eslint-disable-next-line no-console
        console.error('Login error:', error);
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }

    // Fallback mock (only if Supabase not configured)
    if (__DEV__) {
      // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.error('Signup error:', error);
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }

    // Fallback mock (only if Supabase not configured)
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Using mock authentication - Supabase not configured');
    }
    const token = 'mock-token';
    const user = { id: '2', name, email: normalizedEmail } as User;
    set({ user, token, isLoading: false });
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });

    try {
      // Check if Google Play Services are available (Android only)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Sign in with Google
      const response = await GoogleSignin.signIn();
      
      if (!isSuccessResponse(response)) {
        set({ error: 'Google sign-in was cancelled', isLoading: false });
        throw new Error('Google sign-in was cancelled');
      }

      const { data: googleUser } = response;
      
      if (!googleUser.idToken) {
        set({ error: 'Failed to get Google ID token', isLoading: false });
        throw new Error('Failed to get Google ID token');
      }

      // Sign in to Supabase with Google ID token
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: googleUser.idToken,
        });

        if (error) {
          const friendly = error.message || 'Google sign-in failed';
          set({ error: friendly, isLoading: false });
          throw error;
        }

        const user = data.user ? {
          id: data.user.id,
          email: data.user.email ?? undefined,
          name: data.user.user_metadata?.full_name || googleUser.user?.name || undefined,
        } : null;

        set({
          user,
          token: data.session?.access_token ?? null,
          isLoading: false,
          error: null,
        });
        return;
      }
    } catch (error: any) {
      // Handle specific Google Sign-In errors
      let errorMessage = 'Google sign-in failed';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign-in is already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('Google sign-in error:', error);
      }
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }

    // Fallback mock (only if Supabase not configured)
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Using mock Google authentication - Supabase not configured');
    }
    const token = 'mock-google-token';
    const mockUser = { id: '3', email: 'google-user@example.com', name: 'Google User' } as User;
    set({ user: mockUser, token, isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      // Sign out from Google if user is signed in
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Logout error:', error);
          }
          set({ error: error.message, isLoading: false });
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      if (__DEV__) {
        // eslint-disable-next-line no-console
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
            // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.error('Session restore error:', error);
      }
      // Clear state on any error
      set({ user: null, token: null });
    }

    // fallback: nothing to restore for mock
    return;
  },
}));

export default useAuthStore;

