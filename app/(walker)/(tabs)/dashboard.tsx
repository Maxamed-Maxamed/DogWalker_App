import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/hello-wave';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks';
import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';
import { ThemedText } from '@/ui';

export default function WalkerDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const logout = useAuthStore((s) => s.logout);
  const { user } = useAuthStore();
  const { setRole } = useRoleStore();

  const handleLogout = useCallback(() => {
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
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            })();
          },
        },
      ]
    );
  }, [logout]);

  const handleSwitchRole = async () => {
    try {
      // Clear role to trigger selection screen - using unknown cast for type safety
      await setRole(null as unknown as 'owner' | 'walker');
      router.replace('/');
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  const handleGoOnline = () => {
    Alert.alert('Coming Soon', 'Online status toggle is under development!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title">Walker Dashboard</ThemedText>
            <ThemedText style={styles.welcomeText}>
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </ThemedText>
          </View>
          <HelloWave />
        </View>

        {/* Status Card */}
        <View style={styles.section}>
          <View style={[styles.statusCard, { backgroundColor: colors.icon}]}>
            <View style={styles.statusHeader}>
              <ThemedText type="subtitle">Current Status</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: '#64748b' }]}>
                <ThemedText style={styles.statusText}>OFFLINE</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.statusDescription}>
              Go online to start receiving walk requests in your area.
            </ThemedText>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.tint }]}
              onPress={handleGoOnline}
            >
              <ThemedText style={styles.actionButtonText}>Go Online</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview - Placeholder */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Today&apos;s Stats</ThemedText>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.icon  }]}>
              <ThemedText style={styles.statValue}>$0</ThemedText>
              <ThemedText style={styles.statLabel}>Earnings</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.icon }]}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Walks</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.icon }]}>
              <ThemedText style={styles.statValue}>0h</ThemedText>
              <ThemedText style={styles.statLabel}>Active</ThemedText>
            </View>
          </View>
        </View>

        {/* Recent Activity Section - Placeholder */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Recent Requests</ThemedText>
          <View style={[styles.placeholder, { backgroundColor: colors.tint + '10' }]}>
            <Ionicons name="notifications-outline" size={32} color={colors.tint} />
            <ThemedText style={styles.placeholderText}>No recent requests</ThemedText>
          </View>
        </View>

        {/* Settings / Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.tint }]}
            onPress={handleSwitchRole}
          >
            <Ionicons name="swap-horizontal" size={20} color={colors.tint} />
            <ThemedText style={[styles.secondaryButtonText, { color: colors.tint }]}>Switch to Owner View</ThemedText>
          </TouchableOpacity>
          
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
  statusCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  statusDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  placeholder: {
    alignItems: 'center',
    paddingVertical: 32,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
  },
  placeholderText: {
    fontSize: 15,
    opacity: 0.7,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
