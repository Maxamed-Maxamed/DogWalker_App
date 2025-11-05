import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatDistance, getRatingColor, useWalkerStore, WalkerProfile } from '@/stores/walkerStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
const PHOTO_SIZE = width;

export default function WalkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { getWalkerById, fetchWalkerById, toggleFavorite } = useWalkerStore();
  const [walker, setWalker] = useState<WalkerProfile | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWalker = async () => {
      // Validate walker ID format
      if (!id || typeof id !== 'string') {
        setError('Invalid walker ID');
        setIsLoading(false);
        return;
      }

      // Check UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        setError('Invalid walker ID format');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Try to get from local store first
        let foundWalker = getWalkerById(id);
        
        // If not found locally, fetch from Supabase
        if (!foundWalker) {
          foundWalker = await fetchWalkerById(id);
        }

        if (foundWalker) {
          setWalker(foundWalker);
        } else {
          setError('Walker not found');
        }
      } catch (err) {
        console.error('Error loading walker:', err);
        setError('Failed to load walker profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadWalker();
  }, [id, getWalkerById, fetchWalkerById]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading walker profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !walker) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error || 'Walker not found'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const photos = [walker.avatar, walker.avatar, walker.avatar]; // In production, walker would have multiple photos
  const displayedReviews = showAllReviews ? walker.reviews : walker.reviews.slice(0, 3);

  const handleBookNow = () => {
    router.push(`/booking/${walker.id}` as any);
  };

  const handleScheduleWalk = () => {
    router.push(`/booking/${walker.id}` as any);
  };

  const handleMeetAndGreet = () => {
    Alert.alert(
      'Request Meet & Greet',
      `Request a free meet & greet session with ${walker.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request', onPress: () => console.log('Meet & Greet requested') }
      ]
    );
  };

  const handleToggleFavorite = () => {
    toggleFavorite(walker.id);
    setWalker({ ...walker, isFavorite: !walker.isFavorite });
  };

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
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={walker.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={walker.isFavorite ? '#EF4444' : '#fff'}
          />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Gallery */}
        <View style={styles.photoGallery}>
          <Image source={{ uri: photos[selectedPhotoIndex] }} style={styles.mainPhoto} />
          {walker.isAvailableNow && (
            <View style={styles.availableBanner}>
              <View style={styles.pulseDot} />
              <Text style={styles.availableBannerText}>Available Now</Text>
            </View>
          )}
          {photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {photos.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.photoIndicator,
                    selectedPhotoIndex === index && styles.photoIndicatorActive,
                  ]}
                  onPress={() => setSelectedPhotoIndex(index)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.content}>
          <View style={styles.basicInfo}>
            <View style={styles.nameSection}>
              <Text style={[styles.name, { color: colors.text }]}>{walker.displayName}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#0a7ea4" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={18} color="#FCD34D" />
                <Text style={[styles.statValue, { color: getRatingColor(walker.rating) }]}>
                  {walker.rating.toFixed(1)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>
                  ({walker.reviewCount} reviews)
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="location" size={18} color={colors.tabIconDefault} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatDistance(walker.distance)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>away</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="time" size={18} color={colors.tabIconDefault} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {walker.experience}yr
                </Text>
                <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>experience</Text>
              </View>
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Starting at</Text>
              <Text style={styles.price}>${walker.pricePerHour}/hour</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
            <Text style={[styles.bio, { color: colors.text }]}>
              Hi! I&apos;m {walker.displayName.split(' ')[0]}, a passionate dog lover with {walker.experience} years of professional dog walking experience. I&apos;ve completed {walker.completedWalks} walks and have a perfect track record of happy pups and satisfied owners. I specialize in handling dogs of all sizes and temperaments, and I&apos;m certified in pet first aid and CPR.
            </Text>
          </View>

          {/* Experience Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Experience</Text>
            <View style={styles.experienceGrid}>
              <View style={styles.experienceCard}>
                <Text style={styles.experienceNumber}>{walker.completedWalks}</Text>
                <Text style={[styles.experienceLabel, { color: colors.tabIconDefault }]}>
                  Walks Completed
                </Text>
              </View>
              <View style={styles.experienceCard}>
                <Text style={styles.experienceNumber}>{walker.experience}</Text>
                <Text style={[styles.experienceLabel, { color: colors.tabIconDefault }]}>
                  Years Experience
                </Text>
              </View>
              <View style={styles.experienceCard}>
                <Text style={styles.experienceNumber}>100%</Text>
                <Text style={[styles.experienceLabel, { color: colors.tabIconDefault }]}>
                  Response Rate
                </Text>
              </View>
              <View style={styles.experienceCard}>
                <Text style={styles.experienceNumber}>24/7</Text>
                <Text style={[styles.experienceLabel, { color: colors.tabIconDefault }]}>
                  Availability
                </Text>
              </View>
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Specialties</Text>
            <View style={styles.specialtiesGrid}>
              {walker.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Badges */}
          {walker.badges.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
              <View style={styles.badgesGrid}>
                {walker.badges.map((badge) => (
                  <View key={badge.id} style={styles.badgeCard}>
                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                    <Text style={[styles.badgeName, { color: colors.text }]}>{badge.name}</Text>
                    <Text style={[styles.badgeDescription, { color: colors.tabIconDefault }]}>
                      {badge.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Availability Calendar */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Availability</Text>
            <View style={styles.availabilityCalendar}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const avail = walker.availability[index];
                return (
                <View key={day} style={styles.dayColumn}>
                  <Text style={[styles.dayLabel, { color: colors.tabIconDefault }]}>{day}</Text>
                  {avail?.timeSlots && avail.timeSlots.length > 0 ? (
                    avail.timeSlots.map((slot, slotIdx) => (
                      <View
                        key={slotIdx}
                        style={[
                          styles.timeSlot,
                          styles.timeSlotAvailable,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timeSlotText,
                            styles.timeSlotTextAvailable,
                          ]}
                        >
                          {slot.start}-{slot.end}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.noAvailability, { color: colors.tabIconDefault }]}>
                      Not available
                    </Text>
                  )}
                </View>
              );
              })}
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Reviews ({walker.reviewCount})
              </Text>
              <View style={styles.ratingOverview}>
                <Ionicons name="star" size={20} color="#FCD34D" />
                <Text style={[styles.ratingOverviewText, { color: colors.text }]}>
                  {walker.rating.toFixed(1)} / 5.0
                </Text>
              </View>
            </View>

            {displayedReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.ownerAvatar || 'https://i.pravatar.cc/150' }} style={styles.reviewerAvatar} />
                  <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: colors.text }]}>
                      {review.ownerName}
                    </Text>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? 'star' : 'star-outline'}
                          size={14}
                          color="#FCD34D"
                        />
                      ))}
                      <Text style={[styles.reviewDate, { color: colors.tabIconDefault }]}>
                        • {review.walkDate.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.reviewText, { color: colors.text }]}>
                  {review.comment}
                </Text>
                {review.photos && review.photos.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewPhotos}>
                    {review.photos.map((photo, index) => (
                      <Image key={index} source={{ uri: photo }} style={styles.reviewPhoto} />
                    ))}
                  </ScrollView>
                )}
              </View>
            ))}

            {walker.reviews.length > 3 && !showAllReviews && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAllReviews(true)}
              >
                <Text style={styles.showMoreText}>
                  Show all {walker.reviews.length} reviews
                </Text>
                <Ionicons name="chevron-down" size={20} color="#0a7ea4" />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Fixed Bottom CTAs */}
      <SafeAreaView style={[styles.bottomBar, { backgroundColor: colors.background }]}>
        <View style={styles.bottomBarContent}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleMeetAndGreet}
          >
            <Ionicons name="people-outline" size={20} color="#0a7ea4" />
            <Text style={styles.secondaryButtonText}>Meet & Greet</Text>
          </TouchableOpacity>

          <View style={styles.primaryButtonsRow}>
            <TouchableOpacity
              style={[styles.primaryButton, styles.scheduleButton]}
              onPress={handleScheduleWalk}
            >
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Schedule</Text>
            </TouchableOpacity>

            {walker.isAvailableNow && (
              <TouchableOpacity
                style={[styles.primaryButton, styles.bookNowButton]}
                onPress={handleBookNow}
              >
                <View style={styles.pulseContainer}>
                  <View style={styles.pulseDotSmall} />
                </View>
                <Text style={styles.primaryButtonText}>Book Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  photoGallery: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 0.75,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  availableBanner: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  availableBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
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
  content: {
    paddingHorizontal: 20,
  },
  basicInfo: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  section: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  experienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  experienceCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  experienceNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0a7ea4',
    marginBottom: 4,
  },
  experienceLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specialtyChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  specialtyText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  availabilityCalendar: {
    flexDirection: 'row',
    gap: 8,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeSlot: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  timeSlotAvailable: {
    backgroundColor: '#D1FAE5',
  },
  timeSlotText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  timeSlotTextAvailable: {
    color: '#10B981',
    fontWeight: '600',
  },
  noAvailability: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingOverviewText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCard: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewDate: {
    fontSize: 13,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewPhotos: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  showMoreText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    marginBottom: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  scheduleButton: {
    backgroundColor: '#6B7280',
  },
  bookNowButton: {
    backgroundColor: '#10B981',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  pulseContainer: {
    width: 12,
    height: 12,
  },
  pulseDotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});
