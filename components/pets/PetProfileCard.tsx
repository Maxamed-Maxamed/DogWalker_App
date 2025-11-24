import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Pet, usePetStore } from '@/stores/petStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetProfileCardProps {
  pet: Pet;
}

export function PetProfileCard({ pet }: PetProfileCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { deletePet, loading } = usePetStore();

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}'s profile? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deletePet(pet.id);
            if (success) {
              Alert.alert('Success', `${pet.name}'s profile has been deleted.`);
            } else {
              Alert.alert('Error', 'Failed to delete pet profile. Please try again.');
            }
          },
        },
      ]
    );
  };

const handleEdit = () => {
  router.push({
    pathname: "/DogWalker/pets/:id/edit",
    params: { id: pet.id },
  });
};
  return (
    <View
      style={[styles.card, { backgroundColor: colors.background }]}
    >
      {/* Pet Photo */}
      <View style={styles.photoContainer}>
        {pet.photo_url ? (
          <Image source={{ uri: pet.photo_url }} style={styles.photo} />
        ) : (
          <View style={[styles.photoPlaceholder, { backgroundColor: colors.tint + '20' }]}>
            <Ionicons name="paw" size={40} color={colors.tint} />
          </View>
        )}
      </View>

      {/* Pet Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{pet.name}</Text>
        
        {pet.breed && (
          <Text style={[styles.breed, { color: colors.text + 'CC' }]}>{pet.breed}</Text>
        )}
        
        <View style={styles.detailsRow}>
          {pet.age !== undefined && (
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.text + '99'} />
              <Text style={[styles.detailText, { color: colors.text + '99' }]}>
                {pet.age} {pet.age === 1 ? 'year' : 'years'}
              </Text>
            </View>
          )}
          
          {pet.weight !== undefined && (
            <View style={styles.detailItem}>
              <Ionicons name="barbell-outline" size={14} color={colors.text + '99'} />
              <Text style={[styles.detailText, { color: colors.text + '99' }]}>
                {pet.weight} lbs
              </Text>
            </View>
          )}
        </View>

        {pet.special_instructions && (
          <View style={[styles.instructionsBadge, { backgroundColor: colors.tint + '15' }]}>
            <Ionicons name="information-circle-outline" size={14} color={colors.tint} />
            <Text style={[styles.instructionsText, { color: colors.tint }]} numberOfLines={1}>
              {pet.special_instructions}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.tint + '15' }]}
          onPress={handleEdit}
          disabled={loading}
          accessible={true}
          accessibilityLabel={`Edit ${pet.name}'s profile`}
          accessibilityHint="Opens edit form for this pet"
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
        >
          <Ionicons name="create-outline" size={20} color={colors.tint} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF3B3020' }]}
          onPress={handleDelete}
          disabled={loading}
          accessible={true}
          accessibilityLabel={`Delete ${pet.name}'s profile`}
          accessibilityHint="Permanently removes this pet profile"
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  photoContainer: {
    marginRight: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  breed: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
  },
  instructionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  instructionsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    justifyContent: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
