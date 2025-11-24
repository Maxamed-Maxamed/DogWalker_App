/**
 * Custom hook for managing authentication form state
 * Handles form field states, focus states, and loading states
 */

import { validateEmail, validateLoginForm, validateName, validateSignupForm } from '@/utils';
import { useCallback, useState } from 'react';

// Define allowed field names as a const
export const ALLOWED_FIELD_NAMES = ['email', 'password', 'fullName', 'confirmPassword'] as const;
export type AllowedFieldName = (typeof ALLOWED_FIELD_NAMES)[number];

export interface AuthFormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
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
   * Helper function to set error for a specific field
   */
  const setFieldError = useCallback(
    (fieldName: AllowedFieldName, errorMessage: string, currentErrors: AuthFormErrors) => {
      switch (fieldName) {
        case 'email':
          return { ...currentErrors, email: errorMessage };
        case 'password':
          return { ...currentErrors, password: errorMessage };
        case 'fullName':
          return { ...currentErrors, fullName: errorMessage };
        case 'confirmPassword':
          return { ...currentErrors, confirmPassword: errorMessage };
      }
    },
    []
  );

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
      // Validate that fieldName is one of allowed fields
      if (!ALLOWED_FIELD_NAMES.includes(fieldName as AllowedFieldName)) {
        return;
      }

      const typedFieldName = fieldName as AllowedFieldName;
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
          // Exhaustive check - should never reach here
          break;
      }

      if (hasError) {
        setErrors((prev) => setFieldError(typedFieldName, errorMessage, prev));
      } else {
        // Remove error for this field using explicit typed approach
        setErrors((prev) => {
          const updatedErrors: AuthFormErrors = {};
          if (typedFieldName !== 'email' && prev.email) updatedErrors.email = prev.email;
          if (typedFieldName !== 'password' && prev.password) updatedErrors.password = prev.password;
          if (typedFieldName !== 'fullName' && prev.fullName) updatedErrors.fullName = prev.fullName;
          if (typedFieldName !== 'confirmPassword' && prev.confirmPassword) updatedErrors.confirmPassword = prev.confirmPassword;
          return updatedErrors;
        });
      }
    },
    [password, setFieldError]
  );

  /**
   * Handle field value changes with real-time validation
   */
  const handleFieldChange = useCallback(
    (fieldName: string, value: string) => {
      // Validate that fieldName is one of allowed fields
      if (!ALLOWED_FIELD_NAMES.includes(fieldName as AllowedFieldName)) {
        return;
      }

      const typedFieldName = fieldName as AllowedFieldName;

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

      // Mark field as touched on first interaction using explicit checks
      const isTouched = 
        (typedFieldName === 'email' && touched.email) ||
        (typedFieldName === 'password' && touched.password) ||
        (typedFieldName === 'fullName' && touched.fullName) ||
        (typedFieldName === 'confirmPassword' && touched.confirmPassword);

      if (!isTouched) {
        setTouched((prev) => {
          const updated: Record<AllowedFieldName, boolean> = {
            email: typedFieldName === 'email' ? true : prev.email || false,
            password: typedFieldName === 'password' ? true : prev.password || false,
            fullName: typedFieldName === 'fullName' ? true : prev.fullName || false,
            confirmPassword: typedFieldName === 'confirmPassword' ? true : prev.confirmPassword || false,
          };
          return updated;
        });
      }

      // Validate in real-time for touched fields to trigger required errors on clear
      if (isTouched) {
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
    // Validate that fieldName is one of allowed fields
    if (!ALLOWED_FIELD_NAMES.includes(fieldName as AllowedFieldName)) {
      return;
    }

    const typedFieldName = fieldName as AllowedFieldName;

    setTouched((prev) => {
      // Use explicit field updates to avoid dynamic property access
      return {
        email: typedFieldName === 'email' ? true : prev.email || false,
        password: typedFieldName === 'password' ? true : prev.password || false,
        fullName: typedFieldName === 'fullName' ? true : prev.fullName || false,
        confirmPassword: typedFieldName === 'confirmPassword' ? true : prev.confirmPassword || false,
      };
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
    // Validate that fieldName is one of allowed fields
    if (!ALLOWED_FIELD_NAMES.includes(fieldName as AllowedFieldName)) {
      return;
    }

    const typedFieldName = fieldName as AllowedFieldName;

    setErrors((prev) => {
      // Remove error for this field using explicit field checks
      return {
        email: typedFieldName !== 'email' ? prev.email : undefined,
        password: typedFieldName !== 'password' ? prev.password : undefined,
        fullName: typedFieldName !== 'fullName' ? prev.fullName : undefined,
        confirmPassword: typedFieldName !== 'confirmPassword' ? prev.confirmPassword : undefined,
      };
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
