import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserRole } from "../types";
import { getUserRole, removeUserRole, saveUserRole } from "../utils/storage";

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load role from storage on mount
  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    try {
      // TEMPORARY: Clear storage on app start (remove this in production)
      await removeUserRole();
      

      const savedRole = await getUserRole();
      setRoleState(savedRole);
    } catch (error) {
      console.error("Error loading role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setRole = async (newRole: UserRole) => {
    try {
      await saveUserRole(newRole);
      setRoleState(newRole);
    } catch (error) {
      console.error("Error setting role:", error);
      throw error;
    }
  };

  const clearRole = async () => {
    try {
      await removeUserRole();
      setRoleState(null);
    } catch (error) {
      console.error("Error clearing role:", error);
      throw error;
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
