/**
 * Input validation utilities for form inputs across the app
 * Provides reusable validators for email, password, name, and phone
 */

/**
 * Email validation using standard regex pattern
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Password strength validator
 * Checks for minimum length (8 chars) and character variety
 * @param password - Password string to validate
 * @returns Object with validation result and specific requirements
 */
export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^a-zA-Z\d]/.test(password);
  const isLongEnough = password.length >= minLength;

  return {
    isValid: isLongEnough && hasUppercase && hasLowercase && hasNumber,
    requirements: {
      minLength: { met: isLongEnough, label: `At least ${minLength} characters` },
      uppercase: { met: hasUppercase, label: 'At least one uppercase letter' },
      lowercase: { met: hasLowercase, label: 'At least one lowercase letter' },
      number: { met: hasNumber, label: 'At least one number' },
      specialChar: { met: hasSpecialChar, label: 'At least one special character (optional)' },
    },
  };
};

/**
 * Name validation
 * Allows Unicode letters, spaces, hyphens, and apostrophes
 * Supports international names (e.g., José, Мария)
 * @param name - Name string to validate
 * @returns True if valid name format
 */
export const validateName = (name: string): boolean => {
  const trimmed = name.trim();
  // Unicode-aware regex: \p{L} matches any Unicode letter
  const nameRegex = /^[\p{L}\s'-]{2,50}$/u;
  return nameRegex.test(trimmed);
};

/**
 * Phone number validation (E.164 format)
 * @param phone - Phone string to validate
 * @returns True if valid phone format
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Constant-time string comparison to prevent timing attacks
 * Used for password confirmation comparison
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
export const constantTimeEqual = (a: string, b: string): boolean => {
  const maxLen = Math.max(a.length, b.length);
  let result = a.length ^ b.length; // Include length difference in result
  for (let i = 0; i < maxLen; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0;
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }
  return result === 0;
};

/**
 * Validate email and password together (common login validation)
 * @param email - Email to validate
 * @param password - Password to validate
 * @returns Object with validation results and error messages
 */
export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate signup form inputs
 * @param fullName - Full name
 * @param email - Email address
 * @param password - Password
 * @param confirmPassword - Confirmation password
 * @returns Object with validation results and error messages
 */
export const validateSignupForm = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const errors: Record<string, string> = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (!validateName(fullName)) {
    errors.fullName = 'Please enter a valid name';
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = 'Password must include uppercase, lowercase, and a number';
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (!constantTimeEqual(password, confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
