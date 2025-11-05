import { create } from 'zustand';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface WalkerBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}

export interface WalkerReview {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  rating: number;
  comment: string;
  walkDate: Date;
  petName?: string;
  photos?: string[];
}

export interface Availability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  timeSlots: {
    start: string; // "09:00"
    end: string;   // "17:00"
  }[];
  isAvailable: boolean;
}

export interface WalkerProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
  bio: string;
  experience: number; // years
  specialties: string[];
  badges: WalkerBadge[];
  rating: number;
  reviewCount: number;
  completedWalks: number;
  pricePerHour: number;
  distance: number; // miles from user
  isAvailableNow: boolean;
  availability: Availability[];
  phoneNumber?: string;
  email?: string;
  joinedDate: Date;
  responseTime: string; // "Usually responds within 1 hour"
  isFavorite: boolean;
  photos: string[]; // Gallery photos
  reviews: WalkerReview[];
}

export interface Walker {
  id: string;
  displayName: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  distance: number;
  isAvailableNow: boolean;
  specialties: string[];
  isFavorite: boolean;
}

export interface WalkerFilters {
  maxDistance?: number;
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  availableNow?: boolean;
  specialties?: string[];
}

export type SortOption = 'distance' | 'rating' | 'price-low' | 'price-high' | 'reviews';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_WALKERS: WalkerProfile[] = [
  {
    id: 'walker-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    displayName: 'Sarah J.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionate dog lover with 5+ years of experience. I treat every pup like my own and specialize in high-energy breeds. Former veterinary assistant with pet first aid certification.',
    experience: 5,
    specialties: ['High-energy dogs', 'Puppies', 'Basic training', 'Large breeds'],
    badges: [
      {
        id: 'badge-1',
        name: '5-Star Walker',
        icon: '⭐',
        description: 'Maintained 5-star rating for 6 months',
        earnedAt: new Date('2024-06-01'),
      },
      {
        id: 'badge-2',
        name: 'Pet First Aid Certified',
        icon: '🏥',
        description: 'Certified in pet first aid and CPR',
        earnedAt: new Date('2023-03-15'),
      },
    ],
    rating: 5.0,
    reviewCount: 127,
    completedWalks: 342,
    pricePerHour: 25,
    distance: 0.8,
    isAvailableNow: true,
    availability: [
      { day: 'monday', timeSlots: [{ start: '09:00', end: '18:00' }], isAvailable: true },
      { day: 'tuesday', timeSlots: [{ start: '09:00', end: '18:00' }], isAvailable: true },
      { day: 'wednesday', timeSlots: [{ start: '09:00', end: '18:00' }], isAvailable: true },
      { day: 'thursday', timeSlots: [{ start: '09:00', end: '18:00' }], isAvailable: true },
      { day: 'friday', timeSlots: [{ start: '09:00', end: '18:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [{ start: '10:00', end: '16:00' }], isAvailable: true },
      { day: 'sunday', timeSlots: [], isAvailable: false },
    ],
    joinedDate: new Date('2020-01-15'),
    responseTime: 'Usually responds within 30 minutes',
    isFavorite: false,
    photos: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
    ],
    reviews: [
      {
        id: 'review-1',
        ownerId: 'owner-1',
        ownerName: 'Michael Chen',
        rating: 5,
        comment: 'Sarah is amazing! My Golden Retriever Max loves her. She sends great photo updates and is always on time.',
        walkDate: new Date('2024-10-28'),
        petName: 'Max',
      },
    ],
  },
  {
    id: 'walker-2',
    firstName: 'Marcus',
    lastName: 'Thompson',
    displayName: 'Marcus T.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Professional dog walker and trainer. I focus on positive reinforcement and love working with reactive or anxious dogs. Your pet\'s safety and happiness are my top priorities.',
    experience: 8,
    specialties: ['Reactive dogs', 'Anxiety support', 'Senior dogs', 'Multiple dog handling'],
    badges: [
      {
        id: 'badge-3',
        name: 'Certified Dog Trainer',
        icon: '🎓',
        description: 'Professional dog training certification',
        earnedAt: new Date('2018-05-20'),
      },
      {
        id: 'badge-4',
        name: '500+ Walks',
        icon: '🏆',
        description: 'Completed over 500 successful walks',
        earnedAt: new Date('2022-09-01'),
      },
    ],
    rating: 4.9,
    reviewCount: 203,
    completedWalks: 567,
    pricePerHour: 30,
    distance: 1.2,
    isAvailableNow: false,
    availability: [
      { day: 'monday', timeSlots: [{ start: '07:00', end: '20:00' }], isAvailable: true },
      { day: 'tuesday', timeSlots: [{ start: '07:00', end: '20:00' }], isAvailable: true },
      { day: 'wednesday', timeSlots: [{ start: '07:00', end: '20:00' }], isAvailable: true },
      { day: 'thursday', timeSlots: [{ start: '07:00', end: '20:00' }], isAvailable: true },
      { day: 'friday', timeSlots: [{ start: '07:00', end: '20:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [{ start: '08:00', end: '18:00' }], isAvailable: true },
      { day: 'sunday', timeSlots: [{ start: '08:00', end: '18:00' }], isAvailable: true },
    ],
    joinedDate: new Date('2017-03-22'),
    responseTime: 'Usually responds within 1 hour',
    isFavorite: false,
    photos: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    ],
    reviews: [],
  },
  {
    id: 'walker-3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    displayName: 'Emily R.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Dog mom to three rescue pups! I have a special place in my heart for small breeds and senior dogs. Gentle, patient, and reliable - I\'ll care for your furry friend with love.',
    experience: 3,
    specialties: ['Small breeds', 'Senior dogs', 'Gentle walks', 'Medication administration'],
    badges: [
      {
        id: 'badge-5',
        name: 'Early Bird',
        icon: '🌅',
        description: 'Available for early morning walks',
        earnedAt: new Date('2023-01-10'),
      },
    ],
    rating: 4.8,
    reviewCount: 89,
    completedWalks: 156,
    pricePerHour: 20,
    distance: 0.5,
    isAvailableNow: true,
    availability: [
      { day: 'monday', timeSlots: [{ start: '06:00', end: '10:00' }, { start: '16:00', end: '19:00' }], isAvailable: true },
      { day: 'tuesday', timeSlots: [{ start: '06:00', end: '10:00' }, { start: '16:00', end: '19:00' }], isAvailable: true },
      { day: 'wednesday', timeSlots: [{ start: '06:00', end: '10:00' }, { start: '16:00', end: '19:00' }], isAvailable: true },
      { day: 'thursday', timeSlots: [{ start: '06:00', end: '10:00' }, { start: '16:00', end: '19:00' }], isAvailable: true },
      { day: 'friday', timeSlots: [{ start: '06:00', end: '10:00' }, { start: '16:00', end: '19:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [], isAvailable: false },
      { day: 'sunday', timeSlots: [], isAvailable: false },
    ],
    joinedDate: new Date('2022-05-08'),
    responseTime: 'Usually responds within 2 hours',
    isFavorite: true,
    photos: [
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400',
    ],
    reviews: [],
  },
  {
    id: 'walker-4',
    firstName: 'James',
    lastName: 'Kim',
    displayName: 'James K.',
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'Active lifestyle enthusiast who loves long walks and running with dogs. Perfect for high-energy breeds that need extra exercise. Let\'s tire out those pups together!',
    experience: 4,
    specialties: ['Running', 'High-energy breeds', 'Adventure walks', 'Athletic dogs'],
    badges: [
      {
        id: 'badge-6',
        name: 'Marathon Walker',
        icon: '🏃',
        description: 'Completed 1000+ miles of dog walks',
        earnedAt: new Date('2023-08-15'),
      },
    ],
    rating: 4.7,
    reviewCount: 145,
    completedWalks: 289,
    pricePerHour: 22,
    distance: 1.8,
    isAvailableNow: true,
    availability: [
      { day: 'monday', timeSlots: [{ start: '06:00', end: '09:00' }, { start: '17:00', end: '20:00' }], isAvailable: true },
      { day: 'tuesday', timeSlots: [{ start: '06:00', end: '09:00' }, { start: '17:00', end: '20:00' }], isAvailable: true },
      { day: 'wednesday', timeSlots: [{ start: '06:00', end: '09:00' }, { start: '17:00', end: '20:00' }], isAvailable: true },
      { day: 'thursday', timeSlots: [{ start: '06:00', end: '09:00' }, { start: '17:00', end: '20:00' }], isAvailable: true },
      { day: 'friday', timeSlots: [{ start: '06:00', end: '09:00' }, { start: '17:00', end: '20:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [{ start: '07:00', end: '12:00' }], isAvailable: true },
      { day: 'sunday', timeSlots: [{ start: '07:00', end: '12:00' }], isAvailable: true },
    ],
    joinedDate: new Date('2021-02-14'),
    responseTime: 'Usually responds within 1 hour',
    isFavorite: false,
    photos: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    ],
    reviews: [],
  },
  {
    id: 'walker-5',
    firstName: 'Jessica',
    lastName: 'Martinez',
    displayName: 'Jessica M.',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Experienced with all breeds and sizes. I grew up on a farm with animals and have been walking dogs professionally for 6 years. Punctual, trustworthy, and detail-oriented.',
    experience: 6,
    specialties: ['All breeds', 'Puppy socialization', 'Basic commands', 'Photo updates'],
    badges: [
      {
        id: 'badge-7',
        name: 'Verified Pro',
        icon: '✓',
        description: 'Background check and references verified',
        earnedAt: new Date('2019-01-01'),
      },
      {
        id: 'badge-8',
        name: 'Top Rated',
        icon: '🌟',
        description: 'Top 10% rated walker',
        earnedAt: new Date('2024-01-01'),
      },
    ],
    rating: 4.9,
    reviewCount: 178,
    completedWalks: 421,
    pricePerHour: 24,
    distance: 2.1,
    isAvailableNow: false,
    availability: [
      { day: 'monday', timeSlots: [{ start: '10:00', end: '16:00' }], isAvailable: true },
      { day: 'tuesday', timeSlots: [{ start: '10:00', end: '16:00' }], isAvailable: true },
      { day: 'wednesday', timeSlots: [{ start: '10:00', end: '16:00' }], isAvailable: true },
      { day: 'thursday', timeSlots: [{ start: '10:00', end: '16:00' }], isAvailable: true },
      { day: 'friday', timeSlots: [{ start: '10:00', end: '16:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [], isAvailable: false },
      { day: 'sunday', timeSlots: [{ start: '09:00', end: '15:00' }], isAvailable: true },
    ],
    joinedDate: new Date('2019-07-10'),
    responseTime: 'Usually responds within 45 minutes',
    isFavorite: false,
    photos: [
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400',
    ],
    reviews: [],
  },
  {
    id: 'walker-6',
    firstName: 'David',
    lastName: 'Lee',
    displayName: 'David L.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Weekend warrior and dog enthusiast! I offer flexible scheduling for busy professionals. Your dog will get the exercise and attention they deserve.',
    experience: 2,
    specialties: ['Weekend walks', 'Flexible scheduling', 'Medium breeds', 'Park adventures'],
    badges: [],
    rating: 4.6,
    reviewCount: 43,
    completedWalks: 87,
    pricePerHour: 18,
    distance: 3.5,
    isAvailableNow: false,
    availability: [
      { day: 'monday', timeSlots: [], isAvailable: false },
      { day: 'tuesday', timeSlots: [], isAvailable: false },
      { day: 'wednesday', timeSlots: [], isAvailable: false },
      { day: 'thursday', timeSlots: [], isAvailable: false },
      { day: 'friday', timeSlots: [{ start: '17:00', end: '20:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [{ start: '08:00', end: '18:00' }], isAvailable: true },
      { day: 'sunday', timeSlots: [{ start: '08:00', end: '18:00' }], isAvailable: true },
    ],
    joinedDate: new Date('2023-06-01'),
    responseTime: 'Usually responds within 3 hours',
    isFavorite: false,
    photos: [],
    reviews: [],
  },
  {
    id: 'walker-7',
    firstName: 'Amanda',
    lastName: 'Wilson',
    displayName: 'Amanda W.',
    avatar: 'https://i.pravatar.cc/150?img=10',
    bio: 'Certified veterinary technician who moonlights as a dog walker. I have experience with special needs dogs and can administer medications. Your pet is in expert hands.',
    experience: 7,
    specialties: ['Medical needs', 'Special needs dogs', 'Senior care', 'Post-surgery care'],
    badges: [
      {
        id: 'badge-9',
        name: 'Vet Tech',
        icon: '💉',
        description: 'Certified Veterinary Technician',
        earnedAt: new Date('2018-01-01'),
      },
      {
        id: 'badge-10',
        name: 'Special Care',
        icon: '❤️',
        description: 'Specialized in special needs dogs',
        earnedAt: new Date('2020-01-01'),
      },
    ],
    rating: 5.0,
    reviewCount: 96,
    completedWalks: 234,
    pricePerHour: 28,
    distance: 1.5,
    isAvailableNow: true,
    availability: [
      { day: 'monday', timeSlots: [{ start: '12:00', end: '20:00' }], isAvailable: true },
      { day: 'tuesday', timeSlots: [{ start: '12:00', end: '20:00' }], isAvailable: true },
      { day: 'wednesday', timeSlots: [], isAvailable: false },
      { day: 'thursday', timeSlots: [{ start: '12:00', end: '20:00' }], isAvailable: true },
      { day: 'friday', timeSlots: [{ start: '12:00', end: '20:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [{ start: '09:00', end: '17:00' }], isAvailable: true },
      { day: 'sunday', timeSlots: [], isAvailable: false },
    ],
    joinedDate: new Date('2018-11-20'),
    responseTime: 'Usually responds within 20 minutes',
    isFavorite: true,
    photos: [
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400',
    ],
    reviews: [],
  },
  {
    id: 'walker-8',
    firstName: 'Robert',
    lastName: 'Brown',
    displayName: 'Robert B.',
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: 'Retired firefighter with a passion for dogs. I provide reliable, safe walks with a focus on security. Great with protective breeds and large dogs.',
    experience: 10,
    specialties: ['Large breeds', 'Protective breeds', 'Security-focused', 'Strength training'],
    badges: [
      {
        id: 'badge-11',
        name: '10 Year Veteran',
        icon: '🎖️',
        description: 'Over 10 years of experience',
        earnedAt: new Date('2024-01-01'),
      },
      {
        id: 'badge-12',
        name: 'Safety First',
        icon: '🛡️',
        description: 'Perfect safety record',
        earnedAt: new Date('2015-01-01'),
      },
    ],
    rating: 4.8,
    reviewCount: 267,
    completedWalks: 1024,
    pricePerHour: 26,
    distance: 2.8,
    isAvailableNow: false,
    availability: [
      { day: 'monday', timeSlots: [{ start: '08:00', end: '17:00' }], isAvailable: true },
      { day: 'tuesday', timeSlots: [{ start: '08:00', end: '17:00' }], isAvailable: true },
      { day: 'wednesday', timeSlots: [{ start: '08:00', end: '17:00' }], isAvailable: true },
      { day: 'thursday', timeSlots: [{ start: '08:00', end: '17:00' }], isAvailable: true },
      { day: 'friday', timeSlots: [{ start: '08:00', end: '17:00' }], isAvailable: true },
      { day: 'saturday', timeSlots: [], isAvailable: false },
      { day: 'sunday', timeSlots: [], isAvailable: false },
    ],
    joinedDate: new Date('2015-01-01'),
    responseTime: 'Usually responds within 1 hour',
    isFavorite: false,
    photos: [
      'https://images.unsplash.com/photo-1598133893773-de3574464ef0?w=400',
    ],
    reviews: [],
  },
];

// ============================================================================
// Zustand Store
// ============================================================================

interface WalkerStoreState {
  // State
  walkers: WalkerProfile[];
  filteredWalkers: WalkerProfile[];
  selectedWalker: WalkerProfile | null;
  isLoading: boolean;
  error: string | null;
  filters: WalkerFilters;
  sortBy: SortOption;
  searchQuery: string;

  // Actions
  fetchWalkers: () => Promise<void>;
  getWalkerById: (id: string) => WalkerProfile | undefined;
  setSelectedWalker: (walker: WalkerProfile | null) => void;
  filterWalkers: (filters: WalkerFilters) => void;
  searchWalkers: (query: string) => void;
  sortWalkers: (sortBy: SortOption) => void;
  toggleFavorite: (walkerId: string) => void;
  clearFilters: () => void;
  getAvailableWalkers: () => WalkerProfile[];
  getFavoriteWalkers: () => WalkerProfile[];
}

export const useWalkerStore = create<WalkerStoreState>((set, get) => ({
  // Initial State
  walkers: [],
  filteredWalkers: [],
  selectedWalker: null,
  isLoading: false,
  error: null,
  filters: {},
  sortBy: 'distance',
  searchQuery: '',

  // Fetch Walkers (simulated API call)
  fetchWalkers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      set({
        walkers: MOCK_WALKERS,
        filteredWalkers: MOCK_WALKERS,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch walkers',
        isLoading: false,
      });
    }
  },

  // Get Walker by ID
  getWalkerById: (id: string) => {
    return get().walkers.find((walker) => walker.id === id);
  },

  // Set Selected Walker
  setSelectedWalker: (walker: WalkerProfile | null) => {
    set({ selectedWalker: walker });
  },

  // Filter Walkers
  filterWalkers: (filters: WalkerFilters) => {
    const { walkers, sortBy } = get();
    let filtered = [...walkers];

    // Apply filters
    if (filters.maxDistance !== undefined) {
      filtered = filtered.filter((w) => w.distance <= filters.maxDistance!);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter((w) => w.rating >= filters.minRating!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((w) => w.pricePerHour <= filters.maxPrice!);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((w) => w.pricePerHour >= filters.minPrice!);
    }

    if (filters.availableNow) {
      filtered = filtered.filter((w) => w.isAvailableNow);
    }

    if (filters.specialties && filters.specialties.length > 0) {
      filtered = filtered.filter((w) =>
        filters.specialties!.some((specialty) =>
          w.specialties.some((ws) => ws.toLowerCase().includes(specialty.toLowerCase()))
        )
      );
    }

    // Apply current sort
    filtered = sortWalkersByOption(filtered, sortBy);

    set({ filters, filteredWalkers: filtered });
  },

  // Search Walkers
  searchWalkers: (query: string) => {
    const { walkers, filters, sortBy } = get();
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      // If search is empty, reapply filters
      get().filterWalkers(filters);
      set({ searchQuery: '' });
      return;
    }

    let filtered = walkers.filter(
      (walker) =>
        walker.displayName.toLowerCase().includes(lowerQuery) ||
        walker.firstName.toLowerCase().includes(lowerQuery) ||
        walker.lastName.toLowerCase().includes(lowerQuery) ||
        walker.bio.toLowerCase().includes(lowerQuery) ||
        walker.specialties.some((s) => s.toLowerCase().includes(lowerQuery))
    );

    // Apply current filters to search results
    if (filters.maxDistance !== undefined) {
      filtered = filtered.filter((w) => w.distance <= filters.maxDistance!);
    }
    if (filters.minRating !== undefined) {
      filtered = filtered.filter((w) => w.rating >= filters.minRating!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((w) => w.pricePerHour <= filters.maxPrice!);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((w) => w.pricePerHour >= filters.minPrice!);
    }
    if (filters.availableNow) {
      filtered = filtered.filter((w) => w.isAvailableNow);
    }

    // Apply sort
    filtered = sortWalkersByOption(filtered, sortBy);

    set({ searchQuery: query, filteredWalkers: filtered });
  },

  // Sort Walkers
  sortWalkers: (sortBy: SortOption) => {
    const { filteredWalkers } = get();
    const sorted = sortWalkersByOption([...filteredWalkers], sortBy);
    set({ sortBy, filteredWalkers: sorted });
  },

  // Toggle Favorite
  toggleFavorite: (walkerId: string) => {
    set((state) => ({
      walkers: state.walkers.map((walker) =>
        walker.id === walkerId
          ? { ...walker, isFavorite: !walker.isFavorite }
          : walker
      ),
      filteredWalkers: state.filteredWalkers.map((walker) =>
        walker.id === walkerId
          ? { ...walker, isFavorite: !walker.isFavorite }
          : walker
      ),
      selectedWalker:
        state.selectedWalker?.id === walkerId
          ? { ...state.selectedWalker, isFavorite: !state.selectedWalker.isFavorite }
          : state.selectedWalker,
    }));
  },

  // Clear Filters
  clearFilters: () => {
    const { walkers, sortBy } = get();
    const sorted = sortWalkersByOption([...walkers], sortBy);
    set({
      filters: {},
      filteredWalkers: sorted,
      searchQuery: '',
    });
  },

  // Get Available Now Walkers
  getAvailableWalkers: () => {
    return get().walkers.filter((w) => w.isAvailableNow);
  },

  // Get Favorite Walkers
  getFavoriteWalkers: () => {
    return get().walkers.filter((w) => w.isFavorite);
  },
}));

// ============================================================================
// Helper Functions
// ============================================================================

function sortWalkersByOption(walkers: WalkerProfile[], sortBy: SortOption): WalkerProfile[] {
  const sorted = [...walkers];

  switch (sortBy) {
    case 'distance':
      return sorted.sort((a, b) => a.distance - b.distance);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'price-low':
      return sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
    case 'price-high':
      return sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
    case 'reviews':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
}

// ============================================================================
// Utility Functions (for components)
// ============================================================================

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 5280).toFixed(0)} ft away`;
  }
  return `${distance.toFixed(1)} mi away`;
};

export const formatPrice = (pricePerHour: number, duration: number = 1): string => {
  const total = pricePerHour * duration;
  return `$${total.toFixed(0)}`;
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.8) return '#10B981'; // green
  if (rating >= 4.5) return '#3B82F6'; // blue
  if (rating >= 4.0) return '#F59E0B'; // amber
  return '#EF4444'; // red
};

export const getAvailabilityStatus = (walker: WalkerProfile): string => {
  if (walker.isAvailableNow) return 'Available now';
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayAvailability = walker.availability.find((a) => a.day === today);
  
  if (todayAvailability?.isAvailable) {
    return `Available today ${todayAvailability.timeSlots[0]?.start || ''}`;
  }
  
  return 'Schedule available';
};
