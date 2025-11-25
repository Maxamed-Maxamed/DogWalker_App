import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks';
import { useAuthStore } from '@/stores/authStore';
import { ThemedText } from '@/ui';

export default function WalkerProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </View>

      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'W'}
            </ThemedText>
          </View>
          <ThemedText type="subtitle">{user?.name || 'Walker'}</ThemedText>
          <ThemedText style={styles.emailText}>{user?.email}</ThemedText>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <MenuItem icon="person-outline" label="Personal Information" />
          <MenuItem icon="shield-checkmark-outline" label="Verification Status" />
          <MenuItem icon="card-outline" label="Payout Settings" />
          <MenuItem icon="settings-outline" label="App Settings" />
          <MenuItem icon="help-circle-outline" label="Support" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.tint }]}>
      <View style={styles.menuItemContent}>
        <Ionicons name={icon} size={24} color={colors.tint} />
        <ThemedText style={styles.menuItemLabel}>{label}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.tint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  emailText: {
    opacity: 0.6,
    marginTop: 4,
  },
  menu: {
    gap: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
  },
});
