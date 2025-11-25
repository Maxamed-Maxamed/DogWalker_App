import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks';
import { ThemedText } from '@/ui';

export default function WalkerEarningsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Earnings</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={[styles.balanceCard, { backgroundColor: colors.tint }]}>
          <ThemedText style={styles.balanceLabel}>Current Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>$0.00</ThemedText>
          <ThemedText style={styles.payoutText}>Next payout: Monday</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Recent Transactions</ThemedText>
          <View style={[styles.placeholder, { backgroundColor: colors.tint + '10' }]}>
            <Ionicons name="receipt-outline" size={32} color={colors.tint} />
            <ThemedText style={styles.placeholderText}>No transactions yet</ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 8,
  },
  payoutText: {
    fontSize: 12,
    opacity: 0.5,
  },
  section: {
    gap: 16,
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
});
