import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserRole } from "../types";

const STORAGE_KEYS = {
  AUTH_TOKEN: "@dogwalker:auth_token",
  USER_ROLE: "@dogwalker:user_role",
  USER_DATA: "@dogwalker:user_data",
  ONBOARDING_COMPLETED: "@dogwalker:onboarding_completed",
  SETUP_COMPLETED: "@dogwalker:setup_completed",
} as const;

// Auth Token
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error("Error saving auth token:", error);
    throw error;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error("Error removing auth token:", error);
    throw error;
  }
};

// User Role
export const saveUserRole = async (role: UserRole): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  } catch (error) {
    console.error("Error saving user role:", error);
    throw error;
  }
};

export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return role as UserRole | null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

export const removeUserRole = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  } catch (error) {
    console.error("Error removing user role:", error);
    throw error;
  }
};

// User Data
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData),
    );
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error("Error removing user data:", error);
    throw error;
  }
};

// Onboarding Status
export const saveOnboardingCompleted = async (
  role: UserRole,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_${role}`,
      "true",
    );
  } catch (error) {
    console.error("Error saving onboarding status:", error);
    throw error;
  }
};

export const getOnboardingCompleted = async (
  role: UserRole,
): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_${role}`,
    );
    return completed === "true";
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    return false;
  }
};

// Setup Status
export const saveSetupCompleted = async (role: UserRole): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.SETUP_COMPLETED}_${role}`,
      "true",
    );
  } catch (error) {
    console.error("Error saving setup status:", error);
    throw error;
  }
};

export const getSetupCompleted = async (role: UserRole): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(
      `${STORAGE_KEYS.SETUP_COMPLETED}_${role}`,
    );
    return completed === "true";
  } catch (error) {
    console.error("Error getting setup status:", error);
    return false;
  }
};

// Clear All Data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_ROLE,
      STORAGE_KEYS.USER_DATA,
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_owner`,
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_walker`,
      `${STORAGE_KEYS.SETUP_COMPLETED}_owner`,
      `${STORAGE_KEYS.SETUP_COMPLETED}_walker`,
    ]);
  } catch (error) {
    console.error("Error clearing all data:", error);
    throw error;
  }
};
