/**
 * Type guard utilities for runtime type checking
 */

import type { Owner, User, UserRole, Walker } from "@/types";

/**
 * Type guard to check if a user is an Owner
 * @param user - The user to check
 * @returns true if user is an Owner
 */
export const isOwner = (user: User): user is Owner => {
  return user.role === "owner";
};

/**
 * Type guard to check if a user is a Walker
 * @param user - The user to check
 * @returns true if user is a Walker
 */
export const isWalker = (user: User): user is Walker => {
  return user.role === "walker";
};

/**
 * Type guard to validate UserRole
 * @param role - The role to validate
 * @returns true if role is a valid UserRole
 */
export const isValidUserRole = (role: unknown): role is UserRole => {
  return role === "owner" || role === "walker";
};

/**
 * Validates email format
 * @param email - The email to validate
 * @returns true if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns true if password meets requirements
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
