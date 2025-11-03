import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/hello-wave';
import { PetProfileCard } from '@/components/pets/PetProfileCard';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { usePetStore } from '@/stores/petStore';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const logout = useAuthStore((s) => s.logout);
  const { user } = useAuthStore();
  const { pets, fetchPets } = usePetStore();

  useEffect(() => {
    fetchPets();
  }, [
    fetchPets,
  ]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await logout();
                router.replace('/welcome');
              } catch {
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            })();
          },
        },
      ]
    );
  };

  const handleBookWalk = () => {
    Alert.alert('Coming Soon', 'Walker booking feature is under development!');
  };

  const handleAddPet = () => {
    router.push('/pets/add');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title">Dashboard</ThemedText>
            <ThemedText style={styles.welcomeText}>
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </ThemedText>
          </View>
          <HelloWave />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: colors.tint }]}
            onPress={handleBookWalk}
          >
            <Ionicons name="walk" size={24} color="#fff" />
            <ThemedText style={styles.bookButtonText}>Book Walk Now</ThemedText>
          </TouchableOpacity>
        </View>

        {/* My Pets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">My Pets</ThemedText>
            {pets.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/pets')}>
                <ThemedText style={[styles.seeAllText, { color: colors.tint }]}>
                  See All
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {pets.length === 0 ? (
            <View style={[styles.emptyPets, { backgroundColor: colors.tint + '10' }]}>
              <Ionicons name="paw-outline" size={48} color={colors.tint} />
              <ThemedText style={styles.emptyPetsTitle}>No pets yet</ThemedText>
              <ThemedText style={styles.emptyPetsDescription}>
                Add your first pet to start booking walks
              </ThemedText>
              <TouchableOpacity
                style={[styles.addPetButton, { backgroundColor: colors.tint }]}
                onPress={handleAddPet}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <ThemedText style={styles.addPetButtonText}>Add Pet</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {pets.slice(0, 2).map((pet) => (
                <PetProfileCard key={pet.id} pet={pet} />
              ))}
            </View>
          )}
        </View>

        {/* Upcoming Walks Section - Placeholder */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Upcoming Walks</ThemedText>
          <View style={[styles.placeholder, { backgroundColor: colors.tint + '10' }]}>
            <Ionicons name="calendar-outline" size={32} color={colors.tint} />
            <ThemedText style={styles.placeholderText}>No upcoming walks</ThemedText>
          </View>
        </View>

        {/* Recent Activity Section - Placeholder */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Recent Activity</ThemedText>
          <View style={[styles.placeholder, { backgroundColor: colors.tint + '10' }]}>
            <Ionicons name="time-outline" size={32} color={colors.tint} />
            <ThemedText style={styles.placeholderText}>No recent activity</ThemedText>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: '#DC2626' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    marginTop: 4,
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyPets: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  emptyPetsTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyPetsDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 8,
  },
  addPetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    alignItems: 'center',
    paddingVertical: 32,
    borderRadius: 12,
    gap: 8,
  },
  placeholderText: {
    fontSize: 15,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});