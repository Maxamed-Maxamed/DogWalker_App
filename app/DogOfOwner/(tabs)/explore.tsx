import { Stack, router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { searchWalkers } from '@/services/walkerService';

type Walker = {
  id: string;
  name: string;
  avatar?: string;
  distanceKm: number;
  rating: number;
  bio?: string;
  lat?: number;
  lng?: number;
  services?: string[];
};

// Simple analytics placeholder
function sendAnalytics(event: string, payload?: Record<string, any>) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) console.log('ANALYTICS', event, payload);
}

// Note: Using `searchWalkers` from `walkerService` for real data.

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [maxDistanceKm] = useState<number | undefined>(undefined);

  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewOnMap, setViewOnMap] = useState(false);

  const load = useCallback(
    async (next = false) => {
      setError(null);
      setLoading(true);
      try {
        const currentPage = next ? page + 1 : 1;
        const resp = await searchWalkers(currentPage, pageSize, query);
        // Map DB rows to UI Walker shape with sensible fallbacks
        const mapped = (resp.walkers || []).map((r: any) => ({
          id: String(r.id ?? r.walker_id ?? r.user_id ?? ''),
          name: r.display_name || r.name || r.full_name || 'Walker',
          avatar: r.avatar_url || r.photo_url || r.profile_image_url || undefined,
          distanceKm: typeof r.distance_km === 'number' ? r.distance_km : (r.distanceKm ?? 0),
          rating: typeof r.rating === 'number' ? r.rating : (r.avg_rating ?? 0),
          bio: r.bio || r.description || undefined,
          lat: typeof r.lat === 'number' ? r.lat : (r.latitude ?? undefined),
          lng: typeof r.lng === 'number' ? r.lng : (r.longitude ?? undefined),
          services: r.services || r.offered_services || undefined,
        } as Walker));

        setTotal(resp.total);
        setPage(currentPage);
        setWalkers((prev) => (next ? [...prev, ...mapped] : mapped));
        sendAnalytics('explore.load', { page: currentPage, query, filters: { serviceFilter, minRating, maxDistanceKm } });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load walkers';
        setError(msg);
        sendAnalytics('explore.error', { message: msg });
      } finally {
        setLoading(false);
      }
    },
    [page, query, serviceFilter, minRating, maxDistanceKm]
  );

  useEffect(() => {
    // load first page when filters change
    void load(false);
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading) return;
    if (walkers.length >= total) return;
    void load(true);
  }, [loading, walkers, total, load]);

  const onSelectWalker = (w: Walker) => {
    sendAnalytics('explore.select_walker', { id: w.id, name: w.name });
    // navigate to walker detail (typed routes may be strict; cast to any to avoid mismatch)
    router.push((`/DogOfOwner/walker/${w.id}`) as any);
  };

  const renderWalker = ({ item }: { item: Walker }) => (
    <Pressable
      onPress={() => onSelectWalker(item)}
      accessibilityLabel={`Open profile for ${item.name}`}
      style={[styles.card, { backgroundColor: colors.background }]}
    >
      <View style={styles.row}>
        <View style={styles.avatarPlaceholder} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <IconSymbol name="person.fill" size={36} color={colors.text} />
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.rowSpace}>
            <Text style={[styles.name, { color: colors.text }]} accessibilityRole="header">{item.name}</Text>
            <Text style={[styles.distance, { color: colors.text + '99' }]}>{item.distanceKm} km</Text>
          </View>
          <Text style={[styles.rating, { color: colors.text + '99' }]} accessibilityLabel={`Rating ${item.rating}`}>⭐ {item.rating}</Text>
          <Text numberOfLines={2} style={[styles.bio, { color: colors.text + 'CC' }]}>{item.bio}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Stack.Screen options={{ title: 'Explore Walkers' }} />

      <View style={styles.searchRow}>
          <TextInput
          placeholder="Search walkers, bios..."
          placeholderTextColor={colors.text + '88'}
          value={query}
          onChangeText={(t) => setQuery(t)}
          accessibilityLabel="Search walkers"
          style={[styles.searchInput, { color: colors.text, backgroundColor: colors.background }]}
        />
        <Pressable onPress={() => setViewOnMap((v) => !v)} accessibilityLabel="Toggle map view" style={styles.mapToggle}>
          <Text style={{ color: colors.tint }}>{viewOnMap ? 'List' : 'Map'}</Text>
        </Pressable>
      </View>

      <View style={styles.filtersRow}>
        <Pressable onPress={() => { setServiceFilter(undefined); }} style={styles.filterPill} accessibilityLabel="Clear service filter">
          <Text>All</Text>
        </Pressable>
        <Pressable onPress={() => setServiceFilter('walk')} style={styles.filterPill} accessibilityLabel="Filter: Walk service">
          <Text>Walk</Text>
        </Pressable>
        <Pressable onPress={() => setServiceFilter('overnight')} style={styles.filterPill} accessibilityLabel="Filter: Overnight service">
          <Text>Overnight</Text>
        </Pressable>
        <Pressable onPress={() => setMinRating((r) => (r ? undefined : 4))} style={styles.filterPill} accessibilityLabel="Filter: 4+ rating">
          <Text>4+</Text>
        </Pressable>
      </View>

      {loading && walkers.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={{ color: colors.text + '99', marginTop: 8 }}>Loading walkers…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={{ color: colors.text }}>Error: {error}</Text>
          <Pressable onPress={() => void load(false)} style={{ marginTop: 8 }}>
            <Text style={{ color: colors.tint }}>Retry</Text>
          </Pressable>
        </View>
      ) : walkers.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: colors.text }}>No walkers found.</Text>
        </View>
      ) : viewOnMap ? (
        <View style={styles.mapPlaceholder} accessibilityLabel="Map showing walker locations">
          <Text style={{ color: colors.text + '99' }}>Map view (placeholder)</Text>
          {/* TODO: Replace with MapView and pins using walker lat/lng */}
        </View>
      ) : (
        <FlatList
          data={walkers}
          keyExtractor={(i) => i.id}
          renderItem={renderWalker}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            walkers.length < total ? <ActivityIndicator style={{ margin: 12 }} color={colors.tint} /> : null
          )}
          accessibilityLabel="List of walkers"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  searchInput: { flex: 1, borderRadius: 8, padding: 10 },
  mapToggle: { paddingHorizontal: 12, paddingVertical: 8 },
  filtersRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  filterPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#EEE' },
  list: { paddingBottom: 40 },
  card: { padding: 12, borderRadius: 8, marginBottom: 10, elevation: 1 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  rowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatar: { width: 56, height: 56 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  distance: { fontSize: 12 },
  rating: { fontSize: 12, marginTop: 4 },
  bio: { fontSize: 13, marginTop: 6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapPlaceholder: { flex: 1, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
});
