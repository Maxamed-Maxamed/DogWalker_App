/**
 * Custom hook for managing authentication form state
 * Handles form field states, focus states, and loading states
 */

import { useCallback, useState } from 'react';
import { validateEmail, validateLoginForm, validateName, validatePassword } from '@/utils/validation';

export interface AuthFormErrors {
  [key: string]: string;
}

export interface FormFields {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
}

/**
 * Hook for managing auth form state and validation
 * @param onSubmit - Callback function when form is submitted
 * @returns Form state, handlers, and helper methods
 */
export const useAuthForm = (
  onSubmit?: (fields: FormFields) => Promise<void>,
  mode: 'login' | 'signup' = 'login'
) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  /**
   * Validate login form fields
   */
  const validateLoginFields = useCallback(() => {
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    setErrors({});
    return true;
  }, [email, password]);

  /**
   * Validate signup form fields
   */
  const validateSignupFields = useCallback(() => {
    // Import here to avoid circular dependency
    const { validateSignupForm } = require('@/utils/validation');
    const validation = validateSignupForm(fullName, email, password, confirmPassword);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    setErrors({});
    return true;
  }, [fullName, email, password, confirmPassword]);

  /**
   * Validate field in real-time
   */
  const validateField = useCallback(
    (fieldName: string, value: string) => {
      const newErrors = { ...errors };

      switch (fieldName) {
        case 'email':
          if (!value.trim()) {
            newErrors.email = 'Email is required';
          } else if (!validateEmail(value)) {
            newErrors.email = 'Please enter a valid email address';
          } else {
            delete newErrors.email;
          }
          break;

        case 'password':
          if (!value) {
            newErrors.password = 'Password is required';
          } else if (value.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
          } else {
            delete newErrors.password;
          }
          break;

        case 'fullName':
          if (!value.trim()) {
            newErrors.fullName = 'Full name is required';
          } else if (!validateName(value)) {
            newErrors.fullName = 'Please enter a valid name';
          } else {
            delete newErrors.fullName;
          }
          break;

        case 'confirmPassword':
          if (!value) {
            newErrors.confirmPassword = 'Please confirm your password';
          } else if (password && value !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else {
            delete newErrors.confirmPassword;
          }
          break;

        default:
          break;
      }

      setErrors(newErrors);
    },
    [errors, password]
  );

  /**
   * Handle field value changes with real-time validation
   */
  const handleFieldChange = useCallback(
    (fieldName: string, value: string) => {
      switch (fieldName) {
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        case 'fullName':
          setFullName(value);
          break;
        case 'confirmPassword':
          setConfirmPassword(value);
          break;
        default:
          break;
      }

      // Validate in real-time after user starts typing
      if (value.length > 0) {
        validateField(fieldName, value);
      }
    },
    [validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Validate based on mode
    const isValid = mode === 'login' ? validateLoginFields() : validateSignupFields();

    if (!isValid || !onSubmit) {
      return;
    }

    setLoading(true);
    try {
      const fields: FormFields = {
        email: email.trim(),
        password,
        ...(mode === 'signup' && { fullName: fullName.trim(), confirmPassword }),
      };
      await onSubmit(fields);
    } catch (error) {
      // Error handling done in component
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  }, [email, password, fullName, confirmPassword, mode, validateLoginFields, validateSignupFields, onSubmit]);

  /**
   * Reset form to initial state
   */
  const reset = useCallback(() => {
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setFocusedField(null);
  }, []);

  /**
   * Clear specific field error
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    // Field values
    email,
    password,
    fullName,
    confirmPassword,
    // UI states
    showPassword,
    showConfirmPassword,
    loading,
    focusedField,
    errors,
    // Setters
    setEmail,
    setPassword,
    setFullName,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setFocusedField,
    // Methods
    handleFieldChange,
    handleSubmit,
    validateField,
    clearFieldError,
    reset,
    validateLoginFields,
    validateSignupFields,
  };
};
