import { WalkerCard } from '@/components/walkers/WalkerCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWalkerStore } from '@/stores/walkerStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ViewMode = 'list' | 'map';

export default function BrowseScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const {
    filteredWalkers,
    isLoading,
    error,
    filters,
    fetchWalkers,
    searchWalkers,
    filterWalkers,
    toggleFavorite,
    clearFilters,
  } = useWalkerStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    fetchWalkers();
  }, [fetchWalkers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchWalkers(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchWalkers]);

  const handleToggleFavorite = useCallback((walkerId: string) => {
    toggleFavorite(walkerId);
  }, [toggleFavorite]);

  const handleApplyFilters = () => {
    filterWalkers(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setTempFilters({
      maxDistance: undefined,
      minRating: undefined,
      availableNow: false,
      maxPrice: undefined,
      minPrice: undefined,
    });
    setShowFilters(false);
  };

  const hasActiveFilters = 
    filters.maxDistance !== undefined ||
    filters.minRating !== undefined ||
    filters.availableNow ||
    filters.maxPrice !== undefined ||
    filters.minPrice !== undefined;

  if (isLoading && filteredWalkers.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Finding dog walkers near you...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWalkers}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Find Dog Walkers</Text>
        <Text style={[styles.headerSubtitle, { color: colors.tabIconDefault }]}>
          {filteredWalkers.length} walker{filteredWalkers.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
          <Ionicons name="search-outline" size={20} color={colors.tabIconDefault} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name or specialty..."
            placeholderTextColor={colors.tabIconDefault}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
          />
          {localSearchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setLocalSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* View Toggle & Filters */}
      <View style={styles.controlsContainer}>
        {/* View Mode Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'list' && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === 'list' ? '#0a7ea4' : colors.tabIconDefault}
            />
            <Text
              style={[
                styles.viewButtonText,
                viewMode === 'list' && styles.viewButtonTextActive,
                { color: viewMode === 'list' ? '#0a7ea4' : colors.tabIconDefault },
              ]}
            >
              List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'map' && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons
              name="map"
              size={20}
              color={viewMode === 'map' ? '#0a7ea4' : colors.tabIconDefault}
            />
            <Text
              style={[
                styles.viewButtonText,
                viewMode === 'map' && styles.viewButtonTextActive,
                { color: viewMode === 'map' ? '#0a7ea4' : colors.tabIconDefault },
              ]}
            >
              Map
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons
            name="filter"
            size={20}
            color={hasActiveFilters ? '#fff' : colors.tabIconDefault}
          />
          {hasActiveFilters && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {Object.values(filters).filter(v => v !== undefined && v !== false).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>
      </View>

      {/* Walker List */}
      {viewMode === 'list' ? (
        <FlatList
          data={filteredWalkers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WalkerCard
              walker={item}
              onFavoritePress={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={colors.tabIconDefault} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No walkers found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>
                Try adjusting your search or filters
              </Text>
              {hasActiveFilters && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={handleClearFilters}
                >
                  <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      ) : (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={64} color={colors.tabIconDefault} />
          <Text style={[styles.mapPlaceholderText, { color: colors.text }]}>
            Map view coming soon!
          </Text>
          <Text style={[styles.mapPlaceholderSubtext, { color: colors.tabIconDefault }]}>
            This feature will be implemented in a future update
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.filterModal, { backgroundColor: colors.background }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent}>
              {/* Distance Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Maximum Distance
                </Text>
                <View style={styles.filterOptions}>
                  {[1, 2, 5, 10].map((distance) => (
                    <TouchableOpacity
                      key={distance}
                      style={[
                        styles.filterChip,
                        tempFilters.maxDistance === distance && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setTempFilters({ ...tempFilters, maxDistance: distance })
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          tempFilters.maxDistance === distance && styles.filterChipTextActive,
                        ]}
                      >
                        {distance} mi
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Rating Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Minimum Rating
                </Text>
                <View style={styles.filterOptions}>
                  {[3, 4, 4.5, 4.8].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.filterChip,
                        tempFilters.minRating === rating && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setTempFilters({ ...tempFilters, minRating: rating })
                      }
                    >
                      <Ionicons name="star" size={14} color="#FCD34D" />
                      <Text
                        style={[
                          styles.filterChipText,
                          tempFilters.minRating === rating && styles.filterChipTextActive,
                        ]}
                      >
                        {rating}+
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>Price Range</Text>
                <View style={styles.filterOptions}>
                  {[
                    { min: 0, max: 20, label: '$0-20' },
                    { min: 20, max: 25, label: '$20-25' },
                    { min: 25, max: 30, label: '$25-30' },
                    { min: 30, max: 999, label: '$30+' },
                  ].map((range) => (
                    <TouchableOpacity
                      key={range.label}
                      style={[
                        styles.filterChip,
                        tempFilters.minPrice === range.min &&
                          tempFilters.maxPrice === range.max &&
                          styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          minPrice: range.min,
                          maxPrice: range.max,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          tempFilters.minPrice === range.min &&
                            tempFilters.maxPrice === range.max &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Availability Toggle */}
              <View style={styles.filterSection}>
                <TouchableOpacity
                  style={styles.availabilityToggle}
                  onPress={() =>
                    setTempFilters({
                      ...tempFilters,
                      availableNow: !tempFilters.availableNow,
                    })
                  }
                >
                  <View style={styles.availabilityToggleLeft}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={tempFilters.availableNow ? '#10B981' : colors.tabIconDefault}
                    />
                    <Text style={[styles.filterLabel, { color: colors.text, marginBottom: 0 }]}>
                      Available Now Only
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.toggle,
                      tempFilters.availableNow && styles.toggleActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        tempFilters.availableNow && styles.toggleThumbActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    padding: 20,
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
    marginTop: 16,
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 4,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  viewButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewButtonTextActive: {
    fontWeight: '600',
  },
  filterButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#0a7ea4',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  sortButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  clearFiltersButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 4,
  },
  filterChipActive: {
    borderColor: '#0a7ea4',
    backgroundColor: '#E0F2FE',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  availabilityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
