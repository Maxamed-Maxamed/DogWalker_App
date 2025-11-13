import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Ionicons } from '@expo/vector-icons';

import { DesignTokens } from '@/constants/designTokens';
import { AppConfig } from '@/constants/appConfig';
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
    this.errorStore = useErrorStore.getState();
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
        level: 'error',
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
    if (this.state.hasError) {
      const prevKeys = prevProps.resetKeys ?? [];
      const currKeys = this.props.resetKeys ?? [];

      // Check if lengths differ or any element at same index differs
      const hasResetKeyChanged =
        prevKeys.length !== currKeys.length ||
        prevKeys.some((key, index) => key !== currKeys[index]);

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

  /**
   * Handle contact support action with intelligent error reporting
   * Attempts to send full error details via mailto, with fallback to clipboard
   */
  handleContactSupport = async () => {
    try {
      const errorMessage = this.state.error?.message || 'Unknown error';
      const componentStack = this.state.errorInfo?.componentStack || 'N/A';
      const timestamp = new Date().toISOString();

      // Build full error details string
      const fullErrorDetails = `Error: ${errorMessage}\n\nComponent Stack:\n${componentStack}\n\nTimestamp: ${timestamp}`;

      // Build mailto body and check length
      const baseMailtoBody = `Error Report\n\n${fullErrorDetails}`;
      const encodedBody = encodeURIComponent(baseMailtoBody);

      // If body exceeds safe length, truncate component stack
      let finalMailtoBody = baseMailtoBody;
      let wasComponentStackTruncated = false;

      if (encodedBody.length > AppConfig.MAX_MAILTO_BODY_LENGTH) {
        wasComponentStackTruncated = true;
        // Calculate available space for component stack
        const baseMessage = `Error: ${errorMessage}\n\nComponent Stack:\n`;
        const footerMessage = `\n\n... (truncated)\n\nTimestamp: ${timestamp}`;
        const remainingEncoded =
          AppConfig.MAX_MAILTO_BODY_LENGTH - encodeURIComponent(baseMessage + footerMessage).length;

        if (remainingEncoded > 0) {
          // Use binary search to find maximum raw character count that fits within encoded limit
          // This accounts for URL-encoding expansion (e.g., spaces → %20, non-ASCII → multi-byte)
          const findMaxSubstringLength = (str: string, maxEncodedLen: number): number => {
            let left = 0;
            let right = str.length;
            let maxN = 0;

            while (left <= right) {
              const mid = Math.floor((left + right) / 2);
              const encoded = encodeURIComponent(str.substring(0, mid));

              if (encoded.length <= maxEncodedLen) {
                maxN = mid;
                left = mid + 1;
              } else {
                right = mid - 1;
              }
            }

            return maxN;
          };

          const maxStackLength = findMaxSubstringLength(componentStack, remainingEncoded);

          if (maxStackLength > 0) {
            const truncatedStack = componentStack.substring(0, maxStackLength);
            finalMailtoBody = `${baseMessage}${truncatedStack}${footerMessage}`;
          } else {
            // Fallback to minimal body if still too long
            finalMailtoBody = `Error Report - see clipboard for details`;
          }
        } else {
          // Fallback to minimal body if still too long
          finalMailtoBody = `Error Report - see clipboard for details`;
        }
      }

      const mailtoLink = `mailto:${AppConfig.SUPPORT_EMAIL}?subject=App%20Error%20Report`;
      const mailtoLinkWithBody = `${mailtoLink}&body=${encodeURIComponent(finalMailtoBody)}`;

      // Try to open mailto with body
      try {
        await Linking.openURL(mailtoLinkWithBody);

        // If component stack was truncated, notify user and copy to clipboard
        if (wasComponentStackTruncated) {
          try {
            await Clipboard.setString(fullErrorDetails);
            Alert.alert(
              'Error Details Copied',
              `The full error details have been copied to your clipboard because the details were too long for email. You can paste them into the email you're composing.`,
              [{ text: 'OK' }]
            );
          } catch (clipboardError) {
            console.error('Failed to copy error details to clipboard:', clipboardError);
            Alert.alert(
              'Error Details Truncated',
              `The error details were too long to include in the email. Please describe the issue in detail.`,
              [{ text: 'OK' }]
            );
          }
        }
      } catch (linkingError) {
        console.error('Failed to open mailto link:', linkingError);

        // Fallback: Copy full error details to clipboard and show instructions
        try {
          await Clipboard.setString(fullErrorDetails);
          Alert.alert(
            'Error Details Copied to Clipboard',
            `We couldn't open your email client, but the full error details have been copied to your clipboard. Please:\n\n1. Open your email app\n2. Send an email to ${AppConfig.SUPPORT_EMAIL}\n3. Paste the error details into the email\n4. Describe what you were doing when the error occurred`,
            [
              {
                text: 'Try Opening Email',
                onPress: async () => {
                  try {
                    // Try to open plain mailto without body
                    await Linking.openURL(`mailto:${AppConfig.SUPPORT_EMAIL}`);
                  } catch (plainMailtoError) {
                    console.error('Failed to open plain mailto link:', plainMailtoError);
                    Alert.alert(
                      'Unable to Open Email',
                      `Please manually email ${AppConfig.SUPPORT_EMAIL} with the error details from your clipboard.`,
                      [{ text: 'OK' }]
                    );
                  }
                },
              },
              { text: 'OK', style: 'cancel' },
            ]
          );
        } catch (clipboardError) {
          console.error('Failed to copy error details to clipboard:', clipboardError);
          // Last resort: Show contact info and ask user to manually report
          Alert.alert(
            'Error Reporting Issue',
            `We encountered an issue while trying to report this error. Please contact support directly at ${AppConfig.SUPPORT_EMAIL} and describe the problem you experienced.`,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Unexpected error in handleContactSupport:', error);
      Alert.alert(
        'Contact Support',
        `Please email ${AppConfig.SUPPORT_EMAIL} with details of this error.`,
        [{ text: 'OK' }]
      );
    }
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

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={async () => {
                  await this.handleContactSupport();
                }}
              >
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
