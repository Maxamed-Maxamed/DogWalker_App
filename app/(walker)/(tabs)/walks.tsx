import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks';
import { ThemedText } from '@/ui';

export default function WalkerWalksScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">My Walks</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={[styles.placeholder, { backgroundColor: colors.tint + '10' }]}>
          <Ionicons name="map-outline" size={48} color={colors.tint} />
          <ThemedText type="subtitle" style={styles.placeholderTitle}>No Scheduled Walks</ThemedText>
          <ThemedText style={styles.placeholderText}>
            When you accept walk requests, they will appear here.
          </ThemedText>
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
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    gap: 16,
  },
  placeholderTitle: {
    marginTop: 8,
  },
  placeholderText: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});
