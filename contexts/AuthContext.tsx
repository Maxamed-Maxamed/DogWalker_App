import { supabase } from "@/supabase/utils/supabase";
import {
  isOwner,
  isValidEmail,
  isValidPassword,
  isValidUserRole,
  isWalker,
} from "@/supabase/utils/typeGuards";
import { mapSupabaseUserToAppUser } from "@/types/userFactory";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { User, UserRole } from "../types";
import {
  removeAuthToken,
  removeUserData,
  saveAuthToken,
  saveUserData,
  saveRefreshToken,
  clearAllAuthData,
} from "../utils/storage";

// ============================================================================
// CONSTANTS
// ============================================================================

const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPT_WINDOW: 60000,
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000,
};

const SANITIZED_ERRORS: Record<string, string> = {
  "Invalid login credentials": "Invalid email or password",
  "invalid_credentials": "Invalid email or password",
  "User not found": "Invalid email or password",
  "invalid_grant": "Invalid email or password",
  "Email not confirmed": "Please confirm your email before logging in",
  "invalid_request_uri": "Authentication error occurred",
  "User already registered": "This email is already registered",
  "user_exists": "This email is already registered",
  "Password should be at least 6 characters":
    "Password must be at least 6 characters",
  "password_too_short": "Password must be at least 6 characters",
  "Invalid JSON in session": "Session expired. Please log in again",
  "session_not_found": "Session expired. Please log in again",
};

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

interface SupabaseUserMetadata {
  role?: string;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const sanitizeAuthError = (message: string): string => {
  const sanitized =
    SANITIZED_ERRORS[message] ||
    SANITIZED_ERRORS[message.toLowerCase()] ||
    "Authentication failed. Please try again.";

  console.debug("[AUTH] Error sanitized:", {
    original: message,
    sanitized,
  });

  return sanitized;
};

const isValidSession = (session: any): boolean => {
  if (!session?.expires_at) return false;
  const now = Math.floor(Date.now() / 1000);
  return session.expires_at > now;
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loginAttemptsRef = useRef<number>(0);
  const lastAttemptTimeRef = useRef<number>(0);
  const tokenRefreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const subscriptionRef = useRef<(() => void) | null>(null);

  const handleAuthStateChange = useCallback(
    async (session: any): Promise<void> => {
      try {
        if (!session || !isValidSession(session)) {
          setUser(null);
          await removeAuthToken();
          return;
        }

        const supabaseUser = session.user;
        const userRole = supabaseUser.user_metadata?.role;

        if (!isValidUserRole(userRole)) {
          console.error("[AUTH] Invalid or missing user role in metadata");
          await removeAuthToken();
          await removeUserData();
          setUser(null);
          setError("Invalid user role. Please contact support.");
          return;
        }

        const userData = mapSupabaseUserToAppUser(supabaseUser, userRole);

        await saveAuthToken(session.access_token);
        if (session.refresh_token) {
          await saveRefreshToken(session.refresh_token);
        }

        await saveUserData(userData);
        setUser(userData);
        setError(null);

        console.info("[AUTH] User authenticated:", { userId: userData.id });
      } catch (error) {
        console.error("[AUTH] Error handling auth state change:", error);
        await removeAuthToken();
        await removeUserData();
        setUser(null);
        setError("Authentication failed. Please try again.");
      }
    },
    []
  );

  const loadUser = useCallback(async (): Promise<void> => {
    try {
      if (!supabase) {
        throw new Error("Supabase not initialized");
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("[AUTH] Session retrieval error:", error.message);
        setError("Failed to retrieve session");
        return;
      }

      if (data?.session) {
        await handleAuthStateChange(data.session);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AUTH] Error loading user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthStateChange]);

  const setupTokenRefresh = useCallback(() => {
    tokenRefreshTimerRef.current = setInterval(() => {
      void (async () => {
        try {
          if (!supabase?.auth) {
            return;
          }

          const { data, error } = await supabase.auth.refreshSession();

          if (error) {
            console.error("[AUTH] Token refresh error:", error.message);
            return;
          }

          if (data?.session) {
            await handleAuthStateChange(data.session);
          }
        } catch (error) {
          console.error("[AUTH] Token refresh failed:", error);
        }
      })();
    }, SECURITY_CONFIG.TOKEN_REFRESH_INTERVAL);
  }, [handleAuthStateChange]);

  useEffect(() => {
    loadUser();
    setupTokenRefresh();

    if (!supabase) {
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session).catch((err) => {
        console.error("[AUTH] Auth state change subscription error:", err);
      });
    });

    subscriptionRef.current = data?.subscription?.unsubscribe || null;

    return () => {
      subscriptionRef.current?.();
      if (tokenRefreshTimerRef.current) {
        clearInterval(tokenRefreshTimerRef.current);
      }
    };
  }, [loadUser, setupTokenRefresh, handleAuthStateChange]);

  const checkLoginRateLimit = (): void => {
    const now = Date.now();

    if (
      loginAttemptsRef.current >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS &&
      now - lastAttemptTimeRef.current < SECURITY_CONFIG.LOGIN_ATTEMPT_WINDOW
    ) {
      throw new Error("Too many login attempts. Please try again later.");
    }

    if (now - lastAttemptTimeRef.current > SECURITY_CONFIG.LOGIN_ATTEMPT_WINDOW) {
      loginAttemptsRef.current = 0;
    }

    loginAttemptsRef.current += 1;
    lastAttemptTimeRef.current = now;
  };

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        checkLoginRateLimit();

        if (!email?.trim() || !password?.trim()) {
          throw new Error("Email and password are required");
        }

        if (!isValidEmail(email)) {
          throw new Error("Invalid email format");
        }

        if (!isValidPassword(password)) {
          throw new Error("Password must be at least 6 characters");
        }

        if (!supabase) {
          throw new Error("Supabase not initialized");
        }

        console.debug("[AUTH] Login attempt:", { email });

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(sanitizeAuthError(error.message));
        }

        if (!data.session || !data.user) {
          throw new Error("Invalid login response from server");
        }

        await handleAuthStateChange(data.session);
        console.info("[AUTH] User logged in successfully");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Login failed";
        console.error("[AUTH] Login error:", errorMessage);
        setError(errorMessage);
        throw error;
      }
    },
    [handleAuthStateChange]
  );

  const signup = useCallback(
    async (email: string, password: string, role: UserRole): Promise<void> => {
      try {
        if (!email?.trim() || !password?.trim() || !role) {
          throw new Error("Email, password, and role are required");
        }

        if (!isValidEmail(email)) {
          throw new Error("Invalid email format");
        }

        if (!isValidPassword(password)) {
          throw new Error("Password must be at least 6 characters");
        }

        if (!isValidUserRole(role)) {
          throw new Error(`Invalid role: ${role}`);
        }

        if (!supabase) {
          throw new Error("Supabase not initialized");
        }

        console.debug("[AUTH] Signup attempt:", { email, role });

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
            },
          },
        });

        if (error) {
          throw new Error(sanitizeAuthError(error.message));
        }

        if (!data.user) {
          throw new Error("Invalid signup response from server");
        }

        if (data.session) {
          await handleAuthStateChange(data.session);
          console.info("[AUTH] User signed up and logged in");
        } else {
          console.info("[AUTH] User signed up - email confirmation required");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Signup failed";
        console.error("[AUTH] Signup error:", errorMessage);
        setError(errorMessage);
        throw error;
      }
    },
    [handleAuthStateChange]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      console.debug("[AUTH] Logout initiated");

      if (!supabase) {
        throw new Error("Supabase not initialized");
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(`Logout failed: ${error.message}`);
      }

      await clearAllAuthData();
      setUser(null);
      setError(null);

      console.info("[AUTH] User logged out successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed";
      console.error("[AUTH] Logout error:", errorMessage);
      setError(errorMessage);
      throw error;
    }
  }, []);

  const updateUser = useCallback(
    async (userData: Partial<User>): Promise<void> => {
      try {
        if (!user) {
          throw new Error("No authenticated user");
        }

        if (!supabase) {
          throw new Error("Supabase not initialized");
        }

        console.debug("[AUTH] Updating user data:", { userId: user.id });

        let updatedUser: User;

        if (isOwner(user)) {
          updatedUser = {
            ...user,
            ...userData,
            role: "owner" as const,
          } as typeof user;
        } else if (isWalker(user)) {
          updatedUser = {
            ...user,
            ...userData,
            role: "walker" as const,
          } as typeof user;
        } else {
          throw new Error("Invalid user type");
        }

        if (userData.role && userData.role !== user.role) {
          const { error } = await supabase.auth.updateUser({
            data: {
              role: userData.role,
            },
          });

          if (error) {
            throw new Error(`Failed to update user role: ${error.message}`);
          }

          console.info("[AUTH] User role updated:", { newRole: userData.role });
        }

        await saveUserData(updatedUser);
        setUser(updatedUser);
        setError(null);

        console.info("[AUTH] User data updated successfully");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Update failed";
        console.error("[AUTH] Error updating user:", errorMessage);
        setError(errorMessage);
        throw error;
      }
    },
    [user]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}