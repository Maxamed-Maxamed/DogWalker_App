import { PetForm } from '@/components/pets/PetForm';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Pet, usePetStore } from '@/stores/petStore';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditPetScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, fetchPets, loading } = usePetStore();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    // Fetch pets if not already loaded
    if (pets.length === 0) {
      fetchPets();
    }
  }, [fetchPets, pets.length]);

  useEffect(() => {
    // Find the pet by id
    const foundPet = pets.find((p) => p.id === id);
    if (foundPet) {
      setPet(foundPet);
    }
  }, [id, pets]);

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading && !pet) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Edit Pet',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          edges={['bottom']}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={[styles.loadingText, { color: colors.text + '99' }]}>
              Loading pet profile...
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!pet) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Edit Pet',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          edges={['bottom']}
        >
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.text }]}>Pet not found</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Edit ${pet.name}`,
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <PetForm initialData={pet} onSuccess={handleSuccess} onCancel={handleCancel} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
