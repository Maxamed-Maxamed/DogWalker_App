/**
 * Custom hook for managing authentication form state
 * Handles form field states, focus states, and loading states
 */

import { useCallback, useState } from 'react';
import { validateEmail, validateLoginForm, validateName, validateSignupForm } from '@/utils/validation';

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      let hasError = false;
      let errorMessage = '';

      switch (fieldName) {
        case 'email':
          if (!value.trim()) {
            errorMessage = 'Email is required';
            hasError = true;
          } else if (!validateEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            hasError = true;
          }
          break;

        case 'password':
          if (!value) {
            errorMessage = 'Password is required';
            hasError = true;
          } else if (value.length < 8) {
            errorMessage = 'Password must be at least 8 characters';
            hasError = true;
          }
          break;

        case 'fullName':
          if (!value.trim()) {
            errorMessage = 'Full name is required';
            hasError = true;
          } else if (!validateName(value)) {
            errorMessage = 'Please enter a valid name';
            hasError = true;
          }
          break;

        case 'confirmPassword':
          if (!value) {
            errorMessage = 'Please confirm your password';
            hasError = true;
          } else if (password && value !== password) {
            errorMessage = 'Passwords do not match';
            hasError = true;
          }
          break;

        default:
          break;
      }

      if (hasError) {
        newErrors[fieldName as keyof AuthFormErrors] = errorMessage;
      } else {
        // Use Object.keys to safely remove property without delete operator
        const updatedErrors = Object.keys(newErrors).reduce((acc, key) => {
          if (key !== fieldName) {
            acc[key] = newErrors[key];
          }
          return acc;
        }, {} as AuthFormErrors);
        setErrors(updatedErrors);
        return;
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
      // Update field value based on field name
      if (fieldName === 'email') {
        setEmail(value);
      } else if (fieldName === 'password') {
        setPassword(value);
      } else if (fieldName === 'fullName') {
        setFullName(value);
      } else if (fieldName === 'confirmPassword') {
        setConfirmPassword(value);
      }

      // Mark field as touched on first interaction
      if (!touched[fieldName]) {
        setTouched((prev) => {
          const updated = { ...prev };
          updated[fieldName] = true;
          return updated;
        });
      }

      // Validate in real-time for touched fields to trigger required errors on clear
      if (touched[fieldName]) {
        validateField(fieldName, value);
      }
    },
    [validateField, touched]
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
   * Mark a field as touched to enable real-time validation
   */
  const markFieldTouched = useCallback((fieldName: string) => {
    setTouched((prev) => {
      const updated = { ...prev };
      updated[fieldName] = true;
      return updated;
    });
  }, []);

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
    setTouched({});
  }, []);

  /**
   * Clear specific field error
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      // Use Object.keys to safely remove property without delete operator
      return Object.keys(prev).reduce((acc, key) => {
        if (key !== fieldName) {
          acc[key] = prev[key];
        }
        return acc;
      }, {} as AuthFormErrors);
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
    touched,
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
    markFieldTouched,
    reset,
    validateLoginFields,
    validateSignupFields,
  };
};
