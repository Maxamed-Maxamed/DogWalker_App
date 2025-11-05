import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Booking, formatBookingDate, formatDuration, getStatusColor, getStatusLabel, useBookingStore } from '@/stores/bookingStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WalkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { getBookingById, cancelBooking, rateBooking, updateBookingStatus } = useBookingStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (id) {
      const foundBooking = getBookingById(id);
      setBooking(foundBooking || null);
    }
  }, [id]);

  if (!booking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: colors.text }]}>Walk not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCancelWalk = () => {
    Alert.alert(
      'Cancel Walk',
      'Are you sure you want to cancel this walk? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelBooking(booking.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleContactWalker = () => {
    Alert.alert('Contact Walker', 'Call or message your walker', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Call walker') },
      { text: 'Message', onPress: () => console.log('Message walker') },
    ]);
  };

  const handleBookAgain = () => {
    router.push(`/booking/${booking.walkerId}` as any);
  };

  const handleRateWalk = () => {
    rateBooking(booking.id, rating, review);
    Alert.alert('Thank You!', 'Your rating has been submitted.');
    setShowRatingModal(false);
    router.back();
  };

  const isUpcoming = booking.status === 'confirmed' || booking.status === 'pending';
  const isActive = booking.status === 'in-progress';
  const isCompleted = booking.status === 'completed';
  const isCancelled = booking.status === 'cancelled';

  const photos = booking.walkPhotos || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => console.log('Share walk')}
        >
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map/Photo Section */}
        {photos.length > 0 ? (
          <View style={styles.photoSection}>
            <Image source={{ uri: photos[selectedPhoto] }} style={styles.mapImage} />
            <View style={styles.photoIndicators}>
              {photos.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.photoIndicator,
                    selectedPhoto === index && styles.photoIndicatorActive,
                  ]}
                  onPress={() => setSelectedPhoto(index)}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={60} color={colors.tabIconDefault} />
            <Text style={[styles.mapPlaceholderText, { color: colors.tabIconDefault }]}>
              {isUpcoming ? 'Walk route will appear here' : 'No route data available'}
            </Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Status Banner */}
          {isActive && (
            <View style={styles.activeBanner}>
              <View style={styles.liveIndicator}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>Walk in Progress</Text>
              </View>
              <TouchableOpacity style={styles.trackLiveButton}>
                <Ionicons name="navigate" size={18} color="#fff" />
                <Text style={styles.trackLiveText}>Track Live</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Walk Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <View style={styles.infoHeader}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Walk Details</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) + '20' },
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                  {getStatusLabel(booking.status)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={22} color={colors.tabIconDefault} />
              <View style={styles.infoRowContent}>
                <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>Date & Time</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatBookingDate(booking.scheduledDate)}
                  {booking.scheduledTime && ` • ${booking.scheduledTime}`}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={22} color={colors.tabIconDefault} />
              <View style={styles.infoRowContent}>
                <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>Duration</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatDuration(booking.duration)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={22} color={colors.tabIconDefault} />
              <View style={styles.infoRowContent}>
                <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>Location</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {booking.address}
                </Text>
              </View>
            </View>

            {booking.walkRoute && (
              <View style={styles.infoRow}>
                <Ionicons name="navigate-outline" size={22} color={colors.tabIconDefault} />
                <View style={styles.infoRowContent}>
                  <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
                    Distance Walked
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {(booking.walkRoute.length * 0.1).toFixed(2)} miles
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={22} color={colors.tabIconDefault} />
              <View style={styles.infoRowContent}>
                <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>Total Cost</Text>
                <Text style={styles.priceValue}>${booking.totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Walker Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Walker</Text>
            <View style={styles.walkerRow}>
              <Image source={{ uri: booking.walkerAvatar }} style={styles.walkerAvatar} />
              <View style={styles.walkerInfo}>
                <Text style={[styles.walkerName, { color: colors.text }]}>
                  {booking.walkerName}
                </Text>
                {booking.rating && (
                  <View style={styles.walkerRating}>
                    <Ionicons name="star" size={16} color="#FCD34D" />
                    <Text style={[styles.walkerRatingText, { color: colors.text }]}>
                      {booking.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
              {!isCompleted && !isCancelled && (
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={handleContactWalker}
                >
                  <Ionicons name="chatbubble-outline" size={24} color="#0a7ea4" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Pets Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Pets</Text>
            <View style={styles.petsRow}>
              {booking.petNames.map((petName, index) => (
                <View key={index} style={styles.petChip}>
                  <Ionicons name="paw" size={16} color="#0a7ea4" />
                  <Text style={styles.petChipText}>{petName}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Special Instructions */}
          {booking.specialInstructions && (
            <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Special Instructions
              </Text>
              <Text style={[styles.instructionsText, { color: colors.text }]}>
                {booking.specialInstructions}
              </Text>
            </View>
          )}

          {/* Walker Notes */}
          {booking.walkerNotes && (
            <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Walker Notes</Text>
              <Text style={[styles.instructionsText, { color: colors.text }]}>
                {booking.walkerNotes}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isUpcoming && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelActionButton]}
                  onPress={handleCancelWalk}
                >
                  <Text style={styles.cancelActionText}>Cancel Walk</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.modifyActionButton]}
                  onPress={() => console.log('Modify walk')}
                >
                  <Ionicons name="create-outline" size={20} color="#fff" />
                  <Text style={styles.modifyActionText}>Modify</Text>
                </TouchableOpacity>
              </>
            )}

            {isCompleted && !booking.rating && (
              <TouchableOpacity
                style={[styles.actionButton, styles.rateActionButton]}
                onPress={handleRateWalk}
              >
                <Ionicons name="star-outline" size={20} color="#fff" />
                <Text style={styles.rateActionText}>Rate Walk</Text>
              </TouchableOpacity>
            )}

            {isCompleted && (
              <TouchableOpacity
                style={[styles.actionButton, styles.bookAgainButton]}
                onPress={handleBookAgain}
              >
                <Ionicons name="repeat-outline" size={20} color="#fff" />
                <Text style={styles.bookAgainText}>Book Again</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  photoSection: {
    width: width,
    height: width * 0.6,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  photoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoIndicatorActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  mapPlaceholder: {
    width: width,
    height: width * 0.6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 14,
    marginTop: 12,
  },
  content: {
    padding: 20,
  },
  activeBanner: {
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  trackLiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  trackLiveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoRowContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  walkerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  walkerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  walkerInfo: {
    flex: 1,
  },
  walkerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  walkerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walkerRatingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  petChipText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsText: {
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelActionButton: {
    backgroundColor: '#FEE2E2',
  },
  cancelActionText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
  modifyActionButton: {
    backgroundColor: '#6B7280',
  },
  modifyActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  rateActionButton: {
    backgroundColor: '#FCD34D',
  },
  rateActionText: {
    color: '#92400E',
    fontSize: 16,
    fontWeight: '700',
  },
  bookAgainButton: {
    backgroundColor: '#0a7ea4',
  },
  bookAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
