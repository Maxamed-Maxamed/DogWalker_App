import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useWalkerStore } from '@/stores/walkerStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { user, logout } = useAuthStore();
  const { paymentMethods, emergencyContacts } = useBookingStore();
  const { walkers } = useWalkerStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const favoriteWalkers = walkers.filter((walker) => walker.isFavorite);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handlePaymentMethods = () => {
    Alert.alert('Payment Methods', 'Payment method management coming soon!');
  };

  const handleEmergencyContacts = () => {
    Alert.alert('Emergency Contacts', 'Emergency contact management coming soon!');
  };

  const handleSubscription = () => {
    Alert.alert('Subscription', 'Subscription management coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Email: support@dogwalker.com\nPhone: 1-800-DOG-WALK');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of Service content will be displayed here.');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy Policy content will be displayed here.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>

        {/* User Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.name || 'Pet Owner'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.tabIconDefault }]}>
                {user?.email || 'owner@example.com'}
              </Text>
              <Text style={[styles.profilePhone, { color: colors.tabIconDefault }]}>
                +1 (555) 123-4567
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color="#0a7ea4" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Walks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {favoriteWalkers.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>$432</Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Spent</Text>
          </View>
        </View>

        {/* Favorite Walkers Section */}
        {favoriteWalkers.length > 0 && (
          <View style={[styles.section, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Favorite Walkers
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/browse' as any)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favoriteWalkers.map((walker) => (
                <TouchableOpacity
                  key={walker.id}
                  style={styles.favoriteWalkerCard}
                  onPress={() => router.push(`/walkers/${walker.id}` as any)}
                >
                  <Image source={{ uri: walker.avatar }} style={styles.favoriteWalkerAvatar} />
                  <Text style={[styles.favoriteWalkerName, { color: colors.text }]} numberOfLines={1}>
                    {walker.displayName}
                  </Text>
                  <View style={styles.favoriteWalkerRating}>
                    <Ionicons name="star" size={12} color="#FCD34D" />
                    <Text style={[styles.favoriteWalkerRatingText, { color: colors.tabIconDefault }]}>
                      {walker.rating.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Account Settings Section */}
        <View style={[styles.section, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handlePaymentMethods}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="card-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Payment Methods</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  {paymentMethods.length} card{paymentMethods.length !== 1 ? 's' : ''} saved
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleEmergencyContacts}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="medical-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Emergency Contacts</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  {emergencyContacts.length} contact{emergencyContacts.length !== 1 ? 's' : ''} saved
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSubscription}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="trophy-outline" size={24} color="#FCD34D" />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Subscription</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  Free Plan
                </Text>
              </View>
            </View>
            <View style={styles.upgradeBadge}>
              <Text style={styles.upgradeBadgeText}>Upgrade</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  Walk updates and reminders
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#0a7ea4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="mail-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Email Notifications</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  Booking confirmations
                </Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#D1D5DB', true: '#0a7ea4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>SMS Notifications</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  Emergency alerts only
                </Text>
              </View>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{ false: '#D1D5DB', true: '#0a7ea4' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="moon-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  {colorScheme === 'dark' ? 'Enabled' : 'System default'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="language-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Language</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  English (US)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="location-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>Location Services</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  While using the app
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>

        {/* Help & Support Section */}
        <View style={[styles.section, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Help & Support</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color={colors.tabIconDefault} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubbles-outline" size={24} color={colors.tabIconDefault} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="star-outline" size={24} color={colors.tabIconDefault} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>Rate the App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="share-social-outline" size={24} color={colors.tabIconDefault} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>Share with Friends</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={[styles.section, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={24} color={colors.tabIconDefault} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.tabIconDefault} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={24} color={colors.tabIconDefault} />
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>App Version</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.tabIconDefault }]}>
                  1.0.0 (Build 1)
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  editButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteWalkerCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  favoriteWalkerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  favoriteWalkerName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  favoriteWalkerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteWalkerRatingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
  },
  upgradeBadge: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upgradeBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
