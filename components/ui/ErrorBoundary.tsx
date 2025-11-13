import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DesignTokens } from '@/constants/designTokens';
import { useErrorStore } from '@/stores/errorStore';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: (string | number)[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary component provides component-level error handling
 * for React Native/Expo applications. Catches JavaScript errors
 * in child components, displays a fallback UI, and logs errors
 * to the centralized error store for app-wide tracking and debugging.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  private errorStore: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };

    // Get error store instance for logging
    this.errorStore = useErrorStore.getState?.();
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Log to error store for app-wide error tracking
    if (this.errorStore?.addError) {
      this.errorStore.addError({
        message: error.message,
        context: {
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        },
        severity: 'error',
      });
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Console error in development
    if (__DEV__) {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error boundary when resetKeys change
    if (this.state.hasError && this.props.resetKeys) {
      const hasResetKeyChanged = prevProps.resetKeys?.some(
        (key, index) => key !== this.props.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use provided fallback or render default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <Ionicons
                name="alert-circle"
                size={64}
                color={DesignTokens.colors.semantic.error}
              />
            </View>

            {/* Error Title */}
            <Text style={styles.title}>Oops! Something Went Wrong</Text>

            {/* Error Message */}
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </Text>

            {/* Error Details (Development Only) */}
            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Error Details (Dev Only):</Text>
                <Text style={styles.debugText}>{this.state.error.message}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugStack}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            {/* Recovery Actions */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={this.resetErrorBoundary}
              >
                <Ionicons
                  name="refresh"
                  size={18}
                  color={DesignTokens.colors.primary.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color={DesignTokens.colors.primary.blue}
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>

            {/* Support Info */}
            <Text style={styles.supportText}>
              If this persists, please reach out to our support team at support@dogwalker.app
            </Text>
          </ScrollView>
        </View>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.primary.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.xl,
  },

  /* Icon */
  iconContainer: {
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg,
  },

  /* Title & Message */
  title: {
    fontSize: DesignTokens.typography.sizes['2xl'],
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.gray[900],
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  message: {
    fontSize: DesignTokens.typography.sizes.base,
    color: DesignTokens.colors.primary.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: DesignTokens.spacing.xl,
  },

  /* Debug Container (Development Only) */
  debugContainer: {
    backgroundColor: DesignTokens.colors.primary.gray[100],
    borderRadius: DesignTokens.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: DesignTokens.colors.semantic.error,
    padding: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.lg,
  },
  debugTitle: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.semantic.error,
    marginBottom: DesignTokens.spacing.xs,
  },
  debugText: {
    fontSize: DesignTokens.typography.sizes.xs,
    color: DesignTokens.colors.primary.gray[700],
    marginBottom: DesignTokens.spacing.xs,
    fontFamily: 'Courier New',
  },
  debugStack: {
    fontSize: DesignTokens.typography.sizes.xs,
    color: DesignTokens.colors.primary.gray[600],
    fontFamily: 'Courier New',
    lineHeight: 16,
  },

  /* Action Container */
  actionContainer: {
    gap: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.xl,
  },

  /* Button Base */
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DesignTokens.borderRadius.md,
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.lg,
    minHeight: DesignTokens.dimensions.input.height,
  },

  /* Primary Button */
  primaryButton: {
    backgroundColor: DesignTokens.colors.primary.blue,
  },
  primaryButtonText: {
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.white,
  },

  /* Secondary Button */
  secondaryButton: {
    backgroundColor: DesignTokens.colors.primary.gray[100],
    borderWidth: 1,
    borderColor: DesignTokens.colors.primary.gray[300],
  },
  secondaryButtonText: {
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
    color: DesignTokens.colors.primary.blue,
  },

  /* Button Icon */
  buttonIcon: {
    marginRight: DesignTokens.spacing.sm,
  },

  /* Support Text */
  supportText: {
    fontSize: DesignTokens.typography.sizes.xs,
    color: DesignTokens.colors.primary.gray[500],
    textAlign: 'center',
    lineHeight: 18,
  },
});
