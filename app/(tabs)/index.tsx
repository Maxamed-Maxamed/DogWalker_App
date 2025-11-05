import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { useBookingStore } from '@/stores/bookingStore';
import { usePetStore } from '@/stores/petStore';
import { useWalkerStore } from '@/stores/walkerStore';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuthStore();
  const { pets, fetchPets } = usePetStore();
  const { bookings, fetchBookings } = useBookingStore();
  const { walkers } = useWalkerStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchPets();
    fetchBookings();
  }, []);

  // Get active walk (in progress)
  const activeWalk = useMemo(() => {
    return bookings.find((b) => b.status === 'in-progress');
  }, [bookings]);

  // Get upcoming walks (next 3)
  const upcomingWalks = useMemo(() => {
    const upcoming = bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'pending')
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 3);
    return upcoming;
  }, [bookings]);

  // Get favorite walkers
  const favoriteWalkers = useMemo(() => {
    return walkers.filter((w) => w.isFavorite).slice(0, 4);
  }, [walkers]);

  // Get recent activity (past walks)
  const recentActivity = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'completed')
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
      .slice(0, 3);
  }, [bookings]);

  // Get pet quick access (first 3 pets)
  const quickAccessPets = useMemo(() => pets.slice(0, 3), [pets]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchPets(), fetchBookings()]).finally(() => {
      setRefreshing(false);
    });
  }, [fetchPets, fetchBookings]);

  const handleBookWalk = () => {
    router.push('/(tabs)/browse' as any);
  };

  const handleTrackWalk = () => {
    if (activeWalk) {
      router.push(`/walks/${activeWalk.id}` as any);
    }
  };

  const getTimeUntilWalk = (scheduledDate: Date) => {
    const now = new Date();
    const walkTime = new Date(scheduledDate);
    const diff = walkTime.getTime() - now.getTime();
    
    if (diff < 0) return 'Starting soon';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    }
    return `in ${minutes} min`;
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return 'Just now';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title">Home</ThemedText>
            <ThemedText style={styles.welcomeText}>
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </ThemedText>
          </View>
          <HelloWave />
        </View>

        {/* Book Walk Now CTA */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: colors.tint }]}
            onPress={handleBookWalk}
          >
            <Ionicons name="walk" size={28} color="#fff" />
            <ThemedText style={styles.bookButtonText}>Book Walk Now</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Active Walk Banner */}
        {activeWalk && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.activeWalkCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}
              onPress={handleTrackWalk}
            >
              <View style={styles.activeWalkHeader}>
                <View style={styles.liveIndicator}>
                  <View style={styles.pulseCircle} />
                  <ThemedText style={styles.liveText}>WALK IN PROGRESS</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.tint} />
              </View>
              <View style={styles.activeWalkContent}>
                <Image
                  source={{ uri: walkers.find(w => w.id === activeWalk.walkerId)?.avatar }}
                  style={styles.activeWalkerAvatar}
                />
                <View style={styles.activeWalkInfo}>
                  <ThemedText style={styles.activeWalkerName}>
                    {walkers.find(w => w.id === activeWalk.walkerId)?.displayName}
                  </ThemedText>
                  <ThemedText style={styles.activeWalkDuration}>
                    {activeWalk.duration} min walk
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.trackButton, { backgroundColor: colors.tint }]}
                  onPress={handleTrackWalk}
                >
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <ThemedText style={styles.trackButtonText}>Track</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Upcoming Walks Preview */}
        {upcomingWalks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">Upcoming Walks</ThemedText>
              <TouchableOpacity onPress={() => router.push('/(tabs)/walks' as any)}>
                <ThemedText style={[styles.seeAllText, { color: colors.tint }]}>
                  See All
                </ThemedText>
              </TouchableOpacity>
            </View>
            {upcomingWalks.map((walk) => {
              const walker = walkers.find(w => w.id === walk.walkerId);
              return (
                <TouchableOpacity
                  key={walk.id}
                  style={[styles.upcomingWalkCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}
                  onPress={() => router.push(`/walks/${walk.id}` as any)}
                >
                  <Image source={{ uri: walker?.avatar }} style={styles.walkerAvatar} />
                  <View style={styles.upcomingWalkInfo}>
                    <ThemedText style={styles.walkerName}>{walker?.displayName}</ThemedText>
                    <ThemedText style={styles.walkTime}>
                      {new Date(walk.scheduledDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </ThemedText>
                  </View>
                  <View style={styles.countdownBadge}>
                    <Ionicons name="time-outline" size={14} color={colors.tint} />
                    <ThemedText style={[styles.countdownText, { color: colors.tint }]}>
                      {getTimeUntilWalk(walk.scheduledDate)}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Favorite Walkers Quick Access */}
        {favoriteWalkers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">Favorite Walkers</ThemedText>
              <TouchableOpacity onPress={() => router.push('/(tabs)/browse' as any)}>
                <ThemedText style={[styles.seeAllText, { color: colors.tint }]}>
                  See All
                </ThemedText>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {favoriteWalkers.map((walker) => (
                <TouchableOpacity
                  key={walker.id}
                  style={[styles.favoriteWalkerCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}
                  onPress={() => router.push(`/walkers/${walker.id}` as any)}
                >
                  <Image source={{ uri: walker.avatar }} style={styles.favoriteWalkerAvatar} />
                  <ThemedText style={styles.favoriteWalkerName} numberOfLines={1}>
                    {walker.displayName.split(' ')[0]}
                  </ThemedText>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FCD34D" />
                    <ThemedText style={styles.ratingText}>{walker.rating.toFixed(1)}</ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Pet Quick Access Cards */}
        {quickAccessPets.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">My Pets</ThemedText>
              <TouchableOpacity onPress={() => router.push('/(tabs)/pets')}>
                <ThemedText style={[styles.seeAllText, { color: colors.tint }]}>
                  See All
                </ThemedText>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {quickAccessPets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.petCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}
                  onPress={() => router.push(`/pets/${pet.id}/edit` as any)}
                >
                  <Image source={{ uri: pet.photo_url }} style={styles.petPhoto} />
                  <ThemedText style={styles.petName} numberOfLines={1}>
                    {pet.name}
                  </ThemedText>
                  <ThemedText style={styles.petBreed} numberOfLines={1}>
                    {pet.breed}
                  </ThemedText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.addPetCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF', borderColor: '#D1D5DB' }]}
                onPress={() => router.push('/pets/add')}
              >
                <Ionicons name="add-circle" size={40} color={colors.tint} />
                <ThemedText style={[styles.addPetText, { color: colors.tint }]}>
                  Add Pet
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Recent Activity Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            {recentActivity.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/walks' as any)}>
                <ThemedText style={[styles.seeAllText, { color: colors.tint }]}>
                  See All
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
          {recentActivity.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.tint + '10' }]}>
              <Ionicons name="time-outline" size={32} color={colors.tint} />
              <ThemedText style={styles.emptyStateText}>No recent activity</ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                Your completed walks will appear here
              </ThemedText>
            </View>
          ) : (
            recentActivity.map((activity) => {
              const walker = walkers.find(w => w.id === activity.walkerId);
              return (
                <TouchableOpacity
                  key={activity.id}
                  style={[styles.activityCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}
                  onPress={() => router.push(`/walks/${activity.id}` as any)}
                >
                  <View style={styles.activityIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  </View>
                  <View style={styles.activityContent}>
                    <ThemedText style={styles.activityTitle}>Walk completed</ThemedText>
                    <ThemedText style={styles.activitySubtitle}>
                      with {walker?.displayName} • {activity.duration} min
                    </ThemedText>
                    <ThemedText style={styles.activityTime}>
                      {getRelativeTime(activity.scheduledDate)}
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Empty state if no pets */}
        {pets.length === 0 && (
          <View style={[styles.section, styles.emptyPetsContainer]}>
            <View style={[styles.emptyState, { backgroundColor: colors.tint + '10' }]}>
              <Ionicons name="paw" size={48} color={colors.tint} />
              <ThemedText style={styles.emptyStateTitle}>No pets yet</ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                Add your first pet to start booking walks
              </ThemedText>
              <TouchableOpacity
                style={[styles.addPetButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/pets/add')}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <ThemedText style={styles.addPetButtonText}>Add Pet</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
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
    marginBottom: 12,
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
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  activeWalkCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activeWalkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  activeWalkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeWalkerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  activeWalkInfo: {
    flex: 1,
  },
  activeWalkerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeWalkDuration: {
    fontSize: 14,
    opacity: 0.6,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  upcomingWalkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  walkerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  upcomingWalkInfo: {
    flex: 1,
  },
  walkerName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  walkTime: {
    fontSize: 13,
    opacity: 0.6,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  favoriteWalkerCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteWalkerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  favoriteWalkerName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  petCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  petPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  petName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  petBreed: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  addPetCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addPetText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyPetsContainer: {
    marginTop: 40,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  addPetButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
});