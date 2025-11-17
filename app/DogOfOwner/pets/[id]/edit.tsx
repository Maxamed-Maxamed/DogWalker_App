import { PetForm } from '@/components/pets/PetForm';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useErrorStore } from '@/stores/errorStore';
import { usePetStore } from '@/stores/petStore';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditPetScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, fetchPets, loading } = usePetStore();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const errorStore = useErrorStore.getState();

  // Fetch pets on mount if not loaded - fetchPets is stable from Zustand store
  useEffect(() => {
    // Fetch pets if not already loaded
    if (pets.length === 0) {
      (async () => {
        try {
          await fetchPets();
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pets';
          if (__DEV__) {
            console.error('Fetch pets error:', err);
          }

          // Record error in global error store for UI/monitoring
          errorStore.addError({
            level: 'error',
            message: errorMessage,
            context: { action: 'fetch_pets', error: String(errorMessage) },
          });

          // Surface local error so UI can show retry / message
          setFetchError(errorMessage);
        }
      })();
    }
  }, [fetchPets, pets.length, errorStore]);

  // Memoize pet lookup to avoid recalculation on every render
  const pet = useMemo(() => pets.find((p) => p.id === id) || null, [pets, id]);

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading && pets.length === 0) {
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
            <Text style={[styles.loadingText, { color: colors.text + '99' }]}>Loading pet profile...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  // If we failed to fetch pets, surface a retry UI instead of silently failing
  if (fetchError && pets.length === 0) {
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
            <Text style={[styles.errorText, { color: colors.text }]}>Failed to load pets: {fetchError}</Text>
            <Pressable
              onPress={async () => {
                setFetchError(null);
                try {
                  await fetchPets();
                } catch (err: unknown) {
                  const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pets';
                  if (__DEV__) console.error('Retry fetch pets error:', err);
                  errorStore.addError({ level: 'error', message: errorMessage, context: { action: 'retry_fetch_pets' } });
                  setFetchError(errorMessage);
                }
              }}
              style={{ marginTop: 12 }}
            >
              <Text style={{ color: colors.tint }}>Retry</Text>
            </Pressable>
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
