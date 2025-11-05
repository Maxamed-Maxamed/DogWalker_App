import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WalkerProfile, formatDistance, getRatingColor } from '@/stores/walkerStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface WalkerCardProps {
  walker: WalkerProfile;
  onPress?: () => void;
  onFavoritePress?: (walkerId: string) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export function WalkerCard({ walker, onPress, onFavoritePress }: WalkerCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/walkers/${walker.id}` as any);
    }
  };

  const handleBookNow = (e: any) => {
    e.stopPropagation();
    router.push(`/booking/${walker.id}` as any);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    onFavoritePress?.(walker.id);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header with Avatar and Basic Info */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: walker.avatar }} style={styles.avatar} />
          {walker.isAvailableNow && (
            <View style={styles.availableBadge}>
              <View style={styles.pulseDot} />
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {walker.displayName}
            </Text>
            <TouchableOpacity
              onPress={handleFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={walker.isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={walker.isFavorite ? '#EF4444' : colors.icon}
              />
            </TouchableOpacity>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FCD34D" />
            <Text style={[styles.rating, { color: getRatingColor(walker.rating) }]}>
              {walker.rating.toFixed(1)}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.tabIconDefault }]}>
              ({walker.reviewCount} reviews)
            </Text>
          </View>

          {/* Experience */}
          <View style={styles.experienceRow}>
            <Ionicons name="time-outline" size={14} color={colors.tabIconDefault} />
            <Text style={[styles.experience, { color: colors.tabIconDefault }]}>
              {walker.experience} years experience • {walker.completedWalks} walks
            </Text>
          </View>
        </View>
      </View>

      {/* Specialties */}
      {walker.specialties.length > 0 && (
        <View style={styles.specialtiesContainer}>
          {walker.specialties.slice(0, 3).map((specialty, index) => (
            <View key={index} style={styles.specialtyBadge}>
              <Text style={styles.specialtyText} numberOfLines={1}>
                {specialty}
              </Text>
            </View>
          ))}
          {walker.specialties.length > 3 && (
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>+{walker.specialties.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Badges */}
      {walker.badges.length > 0 && (
        <View style={styles.badgesRow}>
          {walker.badges.slice(0, 3).map((badge) => (
            <View key={badge.id} style={styles.badge}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={[styles.badgeText, { color: colors.tabIconDefault }]} numberOfLines={1}>
                {badge.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer with Price, Distance, and Availability */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${walker.pricePerHour}</Text>
            <Text style={[styles.priceUnit, { color: colors.tabIconDefault }]}>/hour</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={14} color={colors.tabIconDefault} />
            <Text style={[styles.distance, { color: colors.tabIconDefault }]}>
              {formatDistance(walker.distance)}
            </Text>
          </View>
        </View>

        <View style={styles.footerRight}>
          {walker.isAvailableNow ? (
            <TouchableOpacity
              style={styles.availableButton}
              onPress={handleBookNow}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.availableText}>Book Now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.availableButton, styles.scheduledButton]}
              onPress={handleBookNow}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color={colors.tabIconDefault} />
              <Text style={[styles.availableText, { color: colors.tabIconDefault }]}>
                Schedule
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
  },
  availableBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 13,
    marginLeft: 4,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experience: {
    fontSize: 12,
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  specialtyBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    maxWidth: 150,
  },
  specialtyText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 120,
  },
  badgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  priceUnit: {
    fontSize: 13,
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 13,
    marginLeft: 4,
  },
  footerRight: {
    flexDirection: 'row',
  },
  availableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
    gap: 4,
  },
  scheduledButton: {
    backgroundColor: '#F3F4F6',
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
});
