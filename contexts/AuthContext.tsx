// **
//  * Authentication Context
//  * Manages user authentication state and auth-related operations
//  */

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
  useState,
} from "react";
import type { User, UserRole } from "../types";
import {
  removeAuthToken,
  removeUserData,
  saveAuthToken,
  saveUserData
} from "../utils/storage";

/**
 * Auth context type definition
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

/**
 * Create auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Wraps the app and provides auth state and methods
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Handles auth state changes from Supabase
   * Updates local state and storage
   */
  const handleAuthStateChange = useCallback(
    async (session: any): Promise<void> => {
      try {
        if (!session) {
          setUser(null);
          return;
        }

        const supabaseUser = session.user;
        const userRole = supabaseUser.user_metadata?.role;

        if (!isValidUserRole(userRole)) {
          console.error("Invalid or missing user role in metadata");
          setUser(null);
          return;
        }

        const userData = mapSupabaseUserToAppUser(supabaseUser, userRole);

        await saveAuthToken(session.access_token);
        await saveUserData(userData);
        setUser(userData);
      } catch (error) {
        console.error("Error handling auth state change:", error);
        setUser(null);
      }
    },
    [],
  );

  /**
   * Loads user from storage on app initialization
   */
  const loadUser = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session retrieval error:", error.message);
        return;
      }

      if (data?.session) {
        await handleAuthStateChange(data.session);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthStateChange]);

  /**
   * Effect: Load user on mount and subscribe to auth changes
   */
  useEffect(() => {
    loadUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session).catch((err) => {
        console.error("Auth state change subscription error:", err);
      });
    });

    const { subscription } = data;

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadUser, handleAuthStateChange]);

  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   * @throws Error if login fails
   */
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (!isValidEmail(email)) {
          throw new Error("Invalid email format");
        }

        if (!isValidPassword(password)) {
          throw new Error("Password must be at least 6 characters");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(`Login failed: ${error.message}`);
        }

        if (!data.session || !data.user) {
          throw new Error("Invalid login response from server");
        }

        await handleAuthStateChange(data.session);
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [handleAuthStateChange],
  );

  /**
   * Signup with email, password, and role
   * @param email - User email
   * @param password - User password
   * @param role - User role (owner or walker)
   * @throws Error if signup fails
   */
  const signup = useCallback(
    async (email: string, password: string, role: UserRole): Promise<void> => {
      try {
        if (!email || !password || !role) {
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
          throw new Error(`Signup failed: ${error.message}`);
        }

        if (!data.user) {
          throw new Error("Invalid signup response from server");
        }

        if (data.session) {
          await handleAuthStateChange(data.session);
        } else {
          console.log("Email confirmation required for:", email);
        }
      } catch (error) {
        console.error("Signup error:", error);
        throw error;
      }
    },
    [handleAuthStateChange],
  );

  /**
   * Logout current user
   * @throws Error if logout fails
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(`Logout failed: ${error.message}`);
      }

      await removeAuthToken();
      await removeUserData();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  /**
   * Update current user data
   * @param userData - Partial user data to update
   * @throws Error if update fails
   */
  const updateUser = useCallback(
    async (userData: Partial<User>): Promise<void> => {
      try {
        if (!user) {
          throw new Error("No authenticated user");
        }

        // Preserve user type during update
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

        // Update role in Supabase if changed
        if (userData.role && userData.role !== user.role) {
          const { error } = await supabase.auth.updateUser({
            data: {
              role: userData.role,
            },
          });

          if (error) {
            throw new Error(`Failed to update user role: ${error.message}`);
          }
        }

        await saveUserData(updatedUser);
        setUser(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },
    [user],
  );

  /**
   * Context value object
   */
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 * Must be called within AuthProvider
 * @returns AuthContextType with user and auth methods
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
