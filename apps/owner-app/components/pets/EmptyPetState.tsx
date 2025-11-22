import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyPetStateProps {
  onAddPet: () => void;
  showButton?: boolean;
}

export function EmptyPetState({ onAddPet, showButton = true }: EmptyPetStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.tint + '10' }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
        <Ionicons name="paw" size={64} color={colors.tint} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>No Pets Yet</Text>
      <Text style={[styles.description, { color: colors.text + '99' }]}>
        Add your first pet profile to start booking walks
      </Text>
      {showButton && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={onAddPet}
          accessible={true}
          accessibilityLabel="Add your first pet"
          accessibilityHint="Opens form to create your first pet profile"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Pet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
