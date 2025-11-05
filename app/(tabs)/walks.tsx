/* eslint-disable @typescript-eslint/no-unused-vars */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Booking, formatBookingDate, formatDuration, getStatusColor, getStatusLabel, useBookingStore } from '@/stores/bookingStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type WalkSection = {
  title: string;
  data: Booking[];
};

export default function WalksScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    bookings,
    getUpcomingBookings,
    getActiveBooking,
    getPastBookings,
    fetchBookings,
    cancelBooking,
    isLoading,
  } = useBookingStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const loadBookings = useCallback(async () => {
    await fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const activeBooking = getActiveBooking();
  const upcomingBookings = getUpcomingBookings();
  const pastBookings = getPastBookings();

  const getCountdown = (scheduledDate: Date): string => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diff = scheduled.getTime() - now.getTime();

    if (diff < 0) return 'Starting soon';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} ${days === 1 ? 'day' : 'days'}`;
    }
    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    }
    return `in ${minutes}m`;
  };

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
  };

  const handleRepeatBooking = (booking: Booking) => {
    router.push(`/booking/${booking.walkerId}` as any);
  };

  const handleViewDetails = (bookingId: string) => {
    router.push(`/walks/${bookingId}` as any);
  };

  const renderActiveWalkCard = () => {
    if (!activeBooking) return null;

    return (
      <TouchableOpacity
        style={styles.activeCard}
        onPress={() => handleViewDetails(activeBooking.id)}
        activeOpacity={0.7}
      >
        <View style={styles.activeHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>Walk in Progress</Text>
          </View>
          <Text style={styles.activeDuration}>
            {formatDuration(activeBooking.duration)}
          </Text>
        </View>

        <View style={styles.activeContent}>
          <Image
            source={{ uri: activeBooking.walkerAvatar }}
            style={styles.activeWalkerImage}
          />
          <View style={styles.activeInfo}>
            <Text style={styles.activeWalkerName}>{activeBooking.walkerName}</Text>
            <View style={styles.activePets}>
              <Ionicons name="paw" size={16} color="#6B7280" />
              <Text style={styles.activePetsText}>
                {activeBooking.petNames.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.activeProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% Complete</Text>
        </View>

        <TouchableOpacity style={styles.trackButton}>
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.trackButtonText}>Track Live</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderUpcomingWalkCard = (booking: Booking) => (
    <TouchableOpacity
      key={booking.id}
      style={[styles.walkCard, { backgroundColor: colors.background }]}
      onPress={() => handleViewDetails(booking.id)}
      activeOpacity={0.7}
    >
      <View style={styles.walkHeader}>
        <View style={styles.walkHeaderLeft}>
          <Image
            source={{ uri: booking.walkerAvatar }}
            style={styles.walkerAvatar}
          />
          <View style={styles.walkerInfo}>
            <Text style={[styles.walkerName, { color: colors.text }]}>
              {booking.walkerName}
            </Text>
            <View style={styles.walkPets}>
              <Ionicons name="paw" size={14} color={colors.tabIconDefault} />
              <Text style={[styles.walkPetsText, { color: colors.tabIconDefault }]}>
                {booking.petNames.join(', ')}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {getStatusLabel(booking.status)}
          </Text>
        </View>
      </View>

      <View style={styles.walkDetails}>
        <View style={styles.walkDetailItem}>
          <Ionicons name="time-outline" size={18} color={colors.tabIconDefault} />
          <Text style={[styles.walkDetailText, { color: colors.text }]}>
            {formatDuration(booking.duration)}
          </Text>
        </View>
        <View style={styles.walkDetailItem}>
          <Ionicons name="calendar-outline" size={18} color={colors.tabIconDefault} />
          <Text style={[styles.walkDetailText, { color: colors.text }]}>
            {formatBookingDate(booking.scheduledDate)}
            {booking.scheduledTime && ` • ${booking.scheduledTime}`}
          </Text>
        </View>
        <View style={styles.walkDetailItem}>
          <Ionicons name="location-outline" size={18} color={colors.tabIconDefault} />
          <Text style={[styles.walkDetailText, { color: colors.text }]} numberOfLines={1}>
            {booking.address}
          </Text>
        </View>
      </View>

      <View style={styles.countdown}>
        <Ionicons name="timer-outline" size={20} color="#0a7ea4" />
        <Text style={styles.countdownText}>{getCountdown(booking.scheduledDate)}</Text>
      </View>

      <View style={styles.walkActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => handleCancelBooking(booking.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.detailsButton]}
          onPress={() => handleViewDetails(booking.id)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPastWalkCard = (booking: Booking) => (
    <TouchableOpacity
      key={booking.id}
      style={[styles.walkCard, { backgroundColor: colors.background }]}
      onPress={() => handleViewDetails(booking.id)}
      activeOpacity={0.7}
    >
      <View style={styles.walkHeader}>
        <View style={styles.walkHeaderLeft}>
          <Image
            source={{ uri: booking.walkerAvatar }}
            style={styles.walkerAvatar}
          />
          <View style={styles.walkerInfo}>
            <Text style={[styles.walkerName, { color: colors.text }]}>
              {booking.walkerName}
            </Text>
            <View style={styles.walkPets}>
              <Ionicons name="paw" size={14} color={colors.tabIconDefault} />
              <Text style={[styles.walkPetsText, { color: colors.tabIconDefault }]}>
                {booking.petNames.join(', ')}
              </Text>
            </View>
          </View>
        </View>
        {booking.rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FCD34D" />
            <Text style={styles.ratingText}>{booking.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.walkDetails}>
        <View style={styles.walkDetailItem}>
          <Ionicons name="time-outline" size={18} color={colors.tabIconDefault} />
          <Text style={[styles.walkDetailText, { color: colors.text }]}>
            {formatDuration(booking.duration)}
          </Text>
        </View>
        <View style={styles.walkDetailItem}>
          <Ionicons name="calendar-outline" size={18} color={colors.tabIconDefault} />
          <Text style={[styles.walkDetailText, { color: colors.text }]}>
            {formatBookingDate(booking.scheduledDate)}
          </Text>
        </View>
        <View style={styles.walkDetailItem}>
          <Ionicons name="navigate-outline" size={18} color={colors.tabIconDefault} />
          <Text style={[styles.walkDetailText, { color: colors.text }]}>
            {booking.walkRoute ? (booking.walkRoute.length * 0.1).toFixed(2) : '0.00'} mi walked
          </Text>
        </View>
      </View>

      {booking.walkPhotos && booking.walkPhotos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.walkPhotos}
        >
          {booking.walkPhotos.map((photo: string, index: number) => (
            <Image key={index} source={{ uri: photo }} style={styles.walkPhoto} />
          ))}
        </ScrollView>
      )}

      <View style={styles.walkActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.repeatButton]}
          onPress={() => handleRepeatBooking(booking)}
        >
          <Ionicons name="repeat-outline" size={18} color="#0a7ea4" />
          <Text style={styles.repeatButtonText}>Book Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.detailsButton]}
          onPress={() => handleViewDetails(booking.id)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="walk-outline" size={80} color={colors.tabIconDefault} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Walks Yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.tabIconDefault }]}>
        Book your first walk to get started
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/(tabs)/browse' as any)}
      >
        <Text style={styles.emptyButtonText}>Find Walkers</Text>
      </TouchableOpacity>
    </View>
  );

  const getFilteredBookings = (): Booking[] => {
    switch (selectedFilter) {
      case 'upcoming':
        return upcomingBookings;
      case 'past':
        return pastBookings;
      default:
        return [...upcomingBookings, ...pastBookings];
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Walks</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="filter-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'all' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All ({upcomingBookings.length + pastBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'upcoming' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'upcoming' && styles.filterTabTextActive,
            ]}
          >
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'past' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('past')}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'past' && styles.filterTabTextActive,
            ]}
          >
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Active Walk Card */}
        {activeBooking && renderActiveWalkCard()}

        {/* Walks List */}
        {filteredBookings.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.walksList}>
            {selectedFilter !== 'past' && upcomingBookings.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Upcoming Walks
                </Text>
                {upcomingBookings.map(renderUpcomingWalkCard)}
              </View>
            )}

            {selectedFilter !== 'upcoming' && pastBookings.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Past Walks
                </Text>
                {pastBookings.map(renderPastWalkCard)}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  historyButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#0a7ea4',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  activeCard: {
    backgroundColor: '#0a7ea4',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  activeDuration: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeWalkerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  activeInfo: {
    flex: 1,
  },
  activeWalkerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  activePets: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activePetsText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  activeProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    textAlign: 'center',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  walksList: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  walkCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  walkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  walkHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  walkerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  walkerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  walkerName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  walkPets: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walkPetsText: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  walkDetails: {
    gap: 10,
    marginBottom: 16,
  },
  walkDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walkDetailText: {
    fontSize: 14,
    flex: 1,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  countdownText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  walkPhotos: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  walkPhoto: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  walkActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  repeatButton: {
    backgroundColor: '#E0F2FE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  repeatButtonText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#0a7ea4',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
