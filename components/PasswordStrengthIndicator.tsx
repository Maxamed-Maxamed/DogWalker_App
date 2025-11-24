/**
 * Password Strength Indicator Component
 * Displays visual feedback about password strength with progress bar and label
 */

import { DesignTokens } from '@/constants';
import { PasswordStrength } from '@/hooks';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface PasswordStrengthIndicatorProps {
  /** Password strength object from usePasswordStrength hook */
  strength: PasswordStrength;
  /** Whether to show detailed requirements list */
  showRequirements?: boolean;
}

/**
 * PasswordStrengthIndicator Component
 * Shows password strength visually with progress bar, label, and optional requirements
 */
export const PasswordStrengthIndicator = React.memo(
  ({ strength, showRequirements = false }: PasswordStrengthIndicatorProps) => {
    const strengthPercentage = ((strength.level + 1) / 6) * 100;

    return (
      <View style={styles.container}>
        {/* Strength Bar */}
        <View style={styles.barContainer}>
          <View style={[styles.barBackground, { backgroundColor: DesignTokens.colors.primary.gray[200] }]}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${strengthPercentage}%`,
                  backgroundColor: strength.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Strength Label */}
        <Text style={[styles.strengthLabel, { color: strength.color }]}>
          {strength.label}
        </Text>

        {/* Requirements List (Optional) */}
        {showRequirements && Object.keys(strength.requirements).length > 0 && (
          <View style={styles.requirementsContainer}>
            {Object.entries(strength.requirements).map(([key, req]) => (
              <View key={key} style={styles.requirementRow}>
                <Text
                  style={[
                    styles.requirementCheck,
                    { color: req.met ? DesignTokens.colors.semantic.success : DesignTokens.colors.primary.gray[400] },
                  ]}
                >
                  {req.met ? '✓' : '○'}
                </Text>
                <Text
                  style={[
                    styles.requirementLabel,
                    { color: req.met ? DesignTokens.colors.primary.gray[700] : DesignTokens.colors.primary.gray[500] },
                  ]}
                >
                  {req.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
);

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

const styles = StyleSheet.create({
  container: {
    gap: DesignTokens.spacing.sm,
  },

  /* Bar */
  barContainer: {
    gap: DesignTokens.spacing.xs,
  },
  barBackground: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },

  /* Label */
  strengthLabel: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.semibold,
  },

  /* Requirements */
  requirementsContainer: {
    gap: DesignTokens.spacing.xs,
    marginTop: DesignTokens.spacing.sm,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.sm,
    backgroundColor: DesignTokens.colors.primary.gray[50],
    borderRadius: DesignTokens.borderRadius.md,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  },
  requirementCheck: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.bold,
    minWidth: 20,
  },
  requirementLabel: {
    fontSize: DesignTokens.typography.sizes.xs,
    flex: 1,
  },
});

export default PasswordStrengthIndicator;
