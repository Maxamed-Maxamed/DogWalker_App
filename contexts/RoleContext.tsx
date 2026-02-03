/**
 * Role Context
 * Manages user role state and persistence
 */

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { UserRole } from "../types";
import {
  getUserRole,
  removeUserRole,
  saveUserRole,
} from "../utils/storage";
import {
  isValidUserRole,
} from "@/supabase/utils/typeGuards";

/**
 * Role context type definition
 */
interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Create role context
 */
const RoleContext = createContext<RoleContextType | undefined>(undefined);

/**
 * Role Provider Component
 * Manages role state and provides role-related operations
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads role from storage on mount
   * Retrieves saved role and updates state
   */
  const loadRole = useCallback(async (): Promise<void> => {
    try {
      const savedRole = await getUserRole();

      if (savedRole && isValidUserRole(savedRole)) {
        setRoleState(savedRole);
      } else {
        setRoleState(null);
      }
    } catch (error) {
      console.error("Error loading role:", error);
      setRoleState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Effect: Load role on component mount
   */
  useEffect(() => {
    loadRole();
  }, [loadRole]);

  /**
   * Sets and persists a new role
   * @param newRole - The new user role to set
   * @throws Error if role persistence fails
   */
  const setRole = useCallback(async (newRole: UserRole): Promise<void> => {
    try {
      if (!isValidUserRole(newRole)) {
        throw new Error(`Invalid role: ${newRole}`);
      }

      await saveUserRole(newRole);
      setRoleState(newRole);
    } catch (error) {
      console.error("Error setting role:", error);
      throw error;
    }
  }, []);

  /**
   * Clears and removes persisted role
   * @throws Error if role removal fails
   */
  const clearRole = useCallback(async (): Promise<void> => {
    try {
      await removeUserRole();
      setRoleState(null);
    } catch (error) {
      console.error("Error clearing role:", error);
      throw error;
    }
  }, []);

  /**
   * Context value object
   */
  const contextValue: RoleContextType = {
    role,
    setRole,
    clearRole,
    isLoading,
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}

/**
 * Hook to use role context
 * Must be called within RoleProvider
 * @returns RoleContextType with role and role management methods
 * @throws Error if used outside RoleProvider
 */
export function useRole(): RoleContextType {
  const context = useContext(RoleContext);

  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }

  return context;
}