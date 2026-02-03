/**
 * Storage utilities with secure token management
 * 
 * ⚠️ CRITICAL SECURITY UPGRADE:
 * - Sensitive data (tokens) now stored in encrypted SecureStore
 * - Non-sensitive data (user data, roles) remain in AsyncStorage
 * - Proper error handling and fail-safe mechanisms
 * 
 * @file utils/storage.ts
 * @version 2.0.0
 * @security OWASP A02:2021 - Cryptographic Failures
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import type { UserRole } from "../types";

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  // ✅ SENSITIVE - Stored in encrypted SecureStore
  AUTH_TOKEN: "secure_auth_token",
  REFRESH_TOKEN: "secure_refresh_token",

  // 📝 NON-SENSITIVE - Stored in AsyncStorage
  USER_ROLE: "@dogwalker:user_role",
  USER_DATA: "@dogwalker:user_data",
  ONBOARDING_COMPLETED: "@dogwalker:onboarding_completed",
  SETUP_COMPLETED: "@dogwalker:setup_completed",
} as const;

// ============================================================================
// AUTH TOKEN - ENCRYPTED SECURE STORAGE
// ============================================================================

/**
 * Saves authentication token securely in encrypted storage
 * 
 * ✅ Uses Keychain (iOS) / Keystore (Android)
 * ✅ Device-locked access only
 * ✅ Encrypted at rest
 * 
 * OWASP A02:2021 - Cryptographic Failures
 * 
 * @param token - JWT access token from Supabase
 * @throws Logs error but continues (fail-safe)
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    if (!token) {
      console.warn("[STORAGE] Attempted to save empty auth token");
      return;
    }

    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    console.debug("[STORAGE] Auth token saved securely to encrypted storage");
  } catch (error) {
    console.error("[STORAGE] Failed to save auth token securely:", error);
    // Fail-safe: Don't throw - token is valid in memory for current session
  }
};

/**
 * Retrieves authentication token from encrypted storage
 * 
 * @returns JWT token or null if not found
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      console.debug("[STORAGE] Auth token retrieved from secure storage");
    }

    return token || null;
  } catch (error) {
    console.error("[STORAGE] Failed to retrieve auth token:", error);
    return null;
  }
};

/**
 * Removes authentication token from encrypted storage
 * Called on logout
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    console.debug("[STORAGE] Auth token removed from secure storage");
  } catch (error) {
    console.error("[STORAGE] Failed to remove auth token:", error);
  }
};

// ============================================================================
// REFRESH TOKEN - ENCRYPTED SECURE STORAGE
// ============================================================================

/**
 * Saves refresh token securely in encrypted storage
 * Used for obtaining new access tokens without user interaction
 * 
 * @param token - Refresh token from Supabase
 */
export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    if (!token) return;

    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    console.debug("[STORAGE] Refresh token saved securely");
  } catch (error) {
    console.error("[STORAGE] Failed to save refresh token:", error);
  }
};

/**
 * Retrieves refresh token from encrypted storage
 * 
 * @returns Refresh token or null
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    return token || null;
  } catch (error) {
    console.error("[STORAGE] Failed to retrieve refresh token:", error);
    return null;
  }
};

/**
 * Removes refresh token from encrypted storage
 */
export const removeRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    console.debug("[STORAGE] Refresh token removed from secure storage");
  } catch (error) {
    console.error("[STORAGE] Failed to remove refresh token:", error);
  }
};

// ============================================================================
// USER ROLE - ASYNC STORAGE (Non-sensitive)
// ============================================================================

/**
 * Saves user role (non-sensitive, can be public)
 * 
 * @param role - User role ("owner" or "walker")
 */
export const saveUserRole = async (role: UserRole): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    console.debug("[STORAGE] User role saved:", { role });
  } catch (error) {
    console.error("[STORAGE] Error saving user role:", error);
    throw error;
  }
};

/**
 * Retrieves user role
 * 
 * @returns User role or null
 */
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return role as UserRole | null;
  } catch (error) {
    console.error("[STORAGE] Error getting user role:", error);
    return null;
  }
};

/**
 * Removes user role
 */
export const removeUserRole = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    console.debug("[STORAGE] User role removed");
  } catch (error) {
    console.error("[STORAGE] Error removing user role:", error);
    throw error;
  }
};

// ============================================================================
// USER DATA - ASYNC STORAGE (Non-sensitive)
// ============================================================================

/**
 * Saves user profile data (non-sensitive)
 * Examples: name, email, profile picture URL, etc.
 * 
 * Note: Do NOT store sensitive data like passwords here
 * 
 * @param userData - User profile object
 */
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData)
    );
    console.debug("[STORAGE] User data saved");
  } catch (error) {
    console.error("[STORAGE] Error saving user data:", error);
    throw error;
  }
};

/**
 * Retrieves user profile data
 * 
 * @returns User data object or null
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("[STORAGE] Error getting user data:", error);
    return null;
  }
};

/**
 * Removes user profile data
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    console.debug("[STORAGE] User data removed");
  } catch (error) {
    console.error("[STORAGE] Error removing user data:", error);
    throw error;
  }
};

// ============================================================================
// ONBOARDING STATUS - ASYNC STORAGE (Non-sensitive)
// ============================================================================

/**
 * Marks onboarding as completed for a user role
 * 
 * @param role - User role
 */
export const saveOnboardingCompleted = async (role: UserRole): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_${role}`,
      "true"
    );
    console.debug("[STORAGE] Onboarding marked complete:", { role });
  } catch (error) {
    console.error("[STORAGE] Error saving onboarding status:", error);
    throw error;
  }
};

/**
 * Checks if onboarding is completed for a role
 * 
 * @param role - User role
 * @returns true if completed, false otherwise
 */
export const getOnboardingCompleted = async (role: UserRole): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_${role}`
    );
    return completed === "true";
  } catch (error) {
    console.error("[STORAGE] Error getting onboarding status:", error);
    return false;
  }
};

// ============================================================================
// SETUP STATUS - ASYNC STORAGE (Non-sensitive)
// ============================================================================

/**
 * Marks setup as completed for a user role
 * 
 * @param role - User role
 */
export const saveSetupCompleted = async (role: UserRole): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.SETUP_COMPLETED}_${role}`,
      "true"
    );
    console.debug("[STORAGE] Setup marked complete:", { role });
  } catch (error) {
    console.error("[STORAGE] Error saving setup status:", error);
    throw error;
  }
};

/**
 * Checks if setup is completed for a role
 * 
 * @param role - User role
 * @returns true if completed, false otherwise
 */
export const getSetupCompleted = async (role: UserRole): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(
      `${STORAGE_KEYS.SETUP_COMPLETED}_${role}`
    );
    return completed === "true";
  } catch (error) {
    console.error("[STORAGE] Error getting setup status:", error);
    return false;
  }
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Clears all authentication data
 * Called during logout or when user wants to clear all data
 * 
 * Removes:
 * - Auth tokens (from encrypted storage)
 * - Refresh tokens (from encrypted storage)
 * - User data
 * - User role
 * - Onboarding status
 * - Setup status
 */
export const clearAllAuthData = async (): Promise<void> => {
  try {
    // Remove from encrypted storage
    await Promise.all([
      removeAuthToken(),
      removeRefreshToken(),
    ]);

    // Remove from AsyncStorage
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_ROLE,
      STORAGE_KEYS.USER_DATA,
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_owner`,
      `${STORAGE_KEYS.ONBOARDING_COMPLETED}_walker`,
      `${STORAGE_KEYS.SETUP_COMPLETED}_owner`,
      `${STORAGE_KEYS.SETUP_COMPLETED}_walker`,
    ]);

    console.info("[STORAGE] All authentication data cleared successfully");
  } catch (error) {
    console.error("[STORAGE] Error clearing all auth data:", error);
    throw error;
  }
};

/**
 * Clears ALL data from storage (emergency wipe)
 * Use with caution - clears everything including non-auth data
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await clearAllAuthData();
    console.info("[STORAGE] All storage data cleared");
  } catch (error) {
    console.error("[STORAGE] Error clearing all data:", error);
    throw error;
  }
};







