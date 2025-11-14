/**
 * Custom hook for password strength calculation and tracking
 * Provides password strength level, label, and color for UI feedback
 */

import { useMemo } from 'react';
import { validatePassword } from '@/utils/validation';

export interface PasswordStrength {
  level: number; // 0-5
  label: string;
  color: string;
  requirements: Record<
    string,
    {
      met: boolean;
      label: string;
    }
  >;
}

/**
 * Hook to calculate password strength
 * Evaluates password based on length, character types, and returns feedback
 * @param password - Password string to evaluate
 * @returns PasswordStrength object with level, label, color, and requirements
 */
export const usePasswordStrength = (password: string): PasswordStrength => {
  return useMemo(() => {
    if (!password) {
      return {
        level: 0,
        label: 'No password',
        color: '#9CA3AF',
        requirements: {},
      };
    }

    const validation = validatePassword(password);

    // Determine strength level based on met requirements
    let level = 0;
    if (validation.requirements.minLength.met) level++;
    if (validation.requirements.uppercase.met) level++;
    if (validation.requirements.lowercase.met) level++;
    if (validation.requirements.number.met) level++;
    if (validation.requirements.specialChar.met) level++;

    const strengthLevels = [
      { level: 0, label: 'Too Weak', color: '#DC2626' },
      { level: 1, label: 'Weak', color: '#EA580C' },
      { level: 2, label: 'Fair', color: '#F59E0B' },
      { level: 3, label: 'Good', color: '#10B981' },
      { level: 4, label: 'Strong', color: '#059669' },
      { level: 5, label: 'Very Strong', color: '#047857' },
    ];

    const strength = strengthLevels[Math.min(level, strengthLevels.length - 1)];

    return {
      ...strength,
      requirements: validation.requirements,
    };
  }, [password]);
};
