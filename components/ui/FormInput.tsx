/**
 * Reusable FormInput component for authentication screens
 * Handles text input with icon, label, password toggle, and error states
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { DesignTokens } from '@/constants/designTokens';

interface FormInputProps extends Omit<RNTextInputProps, 'style'> {
  /** Label text displayed above input */
  label: string;
  /** Placeholder text inside input */
  placeholder: string;
  /** Icon name from Ionicons */
  icon: keyof typeof Ionicons.glyphMap;
  /** Current input value */
  value: string;
  /** Callback when input value changes */
  onChangeText: (text: string) => void;
  /** Whether this is a password field */
  isPassword?: boolean;
  /** Whether to show password (toggle state) */
  showPassword?: boolean;
  /** Callback to toggle password visibility */
  onShowToggle?: () => void;
  /** Unique field name for focus tracking */
  fieldName: string;
  /** Current focused field name */
  focusedField?: string | null;
  /** Error message to display */
  error?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether field is required */
  required?: boolean;
  /** Custom keyboard type */
  keyboardType?: RNTextInputProps['keyboardType'];
  /** Input container style override */
  containerStyle?: ViewStyle;
}

/**
 * FormInput Component
 * Reusable text input with validation, icons, password toggle, and error display
 */
const FormInput = React.memo(
  ({
    label,
    placeholder,
    icon,
    value,
    onChangeText,
    isPassword = false,
    showPassword = false,
    onShowToggle,
    fieldName,
    focusedField,
    error,
    disabled = false,
    required = false,
    keyboardType = 'default',
    containerStyle,
    ...textInputProps
  }: FormInputProps) => {
    const isFocused = focusedField === fieldName;
    const hasError = !!error;
    const hasValue = !!value;

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredBadge}>*</Text>}
        </View>

        {/* Input Container */}
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            hasValue && styles.inputContainerFilled,
            hasError && styles.inputContainerError,
          ]}
        >
          {/* Icon */}
          <Ionicons
            name={icon}
            size={20}
            color={
              isFocused
                ? DesignTokens.colors.primary.blue
                : hasError
                  ? DesignTokens.colors.primary.semantic.error
                  : DesignTokens.colors.primary.gray[400]
            }
            style={styles.inputIcon}
          />

          {/* Text Input */}
          <RNTextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={DesignTokens.colors.primary.gray[400]}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={isPassword ? 'none' : 'none'}
            autoCorrect={false}
            secureTextEntry={isPassword && !showPassword}
            editable={!disabled}
            accessible={true}
            accessibilityLabel={label}
            accessibilityHint={placeholder}
            {...textInputProps}
          />

          {/* Password Toggle Button */}
          {isPassword && (
            <TouchableOpacity
              onPress={onShowToggle}
              style={styles.eyeButton}
              disabled={disabled}
              accessible={true}
              accessibilityLabel={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
              accessibilityRole="button"
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={DesignTokens.colors.primary.gray[400]}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color={DesignTokens.colors.primary.semantic.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.value === nextProps.value &&
      prevProps.focusedField === nextProps.focusedField &&
      prevProps.error === nextProps.error &&
      prevProps.showPassword === nextProps.showPassword &&
      prevProps.disabled === nextProps.disabled
    );
  }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  container: {
    gap: DesignTokens.spacing.sm,
  },

  /* Label */
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  },
  label: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.semibold,
    color: DesignTokens.colors.primary.gray[700],
  },
  requiredBadge: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.semantic.error,
  },

  /* Input Container */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DesignTokens.dimensions.input?.height || 56,
    borderRadius: DesignTokens.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: DesignTokens.colors.primary.gray[300],
    backgroundColor: DesignTokens.colors.primary.white,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  inputContainerFocused: {
    borderColor: DesignTokens.colors.primary.blue,
    backgroundColor: DesignTokens.colors.primary.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerFilled: {
    borderColor: DesignTokens.colors.primary.gray[300],
    backgroundColor: DesignTokens.colors.primary.white,
  },
  inputContainerError: {
    borderColor: DesignTokens.colors.primary.semantic.error,
    backgroundColor: DesignTokens.colors.primary.semantic.error + '05',
  },

  /* Icon */
  inputIcon: {
    marginRight: DesignTokens.spacing.sm,
  },

  /* Text Input */
  input: {
    flex: 1,
    fontSize: DesignTokens.typography.sizes.base,
    color: DesignTokens.colors.primary.gray[900],
    paddingVertical: 0,
  },

  /* Eye Button */
  eyeButton: {
    padding: DesignTokens.spacing.xs,
    marginLeft: DesignTokens.spacing.xs,
  },

  /* Error */
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
    paddingHorizontal: DesignTokens.spacing.sm,
  },
  errorText: {
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: DesignTokens.typography.weights.medium,
    color: DesignTokens.colors.primary.semantic.error,
  },
});

export default FormInput;
