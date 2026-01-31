import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import type { User } from "../types";
import {
    getAuthToken,
    getUserData,
    removeAuthToken,
    removeUserData,
    saveUserData
} from "../utils/storage";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    role: "owner" | "walker",
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getAuthToken();
      if (token) {
        const userData = await getUserData();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual backend authentication
      // const response = await fetch('YOUR_API_URL/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const { token, user } = await response.json();

      // For now, this is a placeholder that does nothing
      // Remove this throw when you implement the backend
      throw new Error("Login not implemented - integrate with your backend");

      // When backend is ready, uncomment:
      // await saveAuthToken(token);
      // await saveUserData(user);
      // setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    role: "owner" | "walker",
  ) => {
    try {
      // TODO: Implement actual backend registration
      // const response = await fetch('YOUR_API_URL/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, role }),
      // });
      // const { token, user } = await response.json();

      // For now, this is a placeholder that does nothing
      // Remove this throw when you implement the backend
      throw new Error("Signup not implemented - integrate with your backend");

      // When backend is ready, uncomment:
      // await saveAuthToken(token);
      // await saveUserData(user);
      // setUser(user);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeAuthToken();
      await removeUserData();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = { ...user, ...userData } as User;
      await saveUserData(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
