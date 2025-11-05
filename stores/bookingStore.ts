import { create } from 'zustand';

// Types & Interfaces
export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
export type WalkDuration = 30 | 45 | 60 | 90 | 120;
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface PaymentCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface BookingDetails {
  walkerId: string;
  walkerName: string;
  walkerAvatar: string;
  petIds: string[];
  petNames: string[];
  duration: WalkDuration;
  scheduledDate?: Date;
  scheduledTime?: string;
  isInstantBook: boolean;
  specialInstructions?: string;
  emergencyContactId?: string;
  paymentMethodId?: string;
  totalPrice: number;
  address?: string;
}

export interface Booking {
  id: string;
  walkerId: string;
  walkerName: string;
  walkerAvatar: string;
  petIds: string[];
  petNames: string[];
  duration: WalkDuration;
  scheduledDate: Date;
  scheduledTime: string;
  status: BookingStatus;
  specialInstructions?: string;
  emergencyContact?: EmergencyContact;
  paymentMethod: PaymentCard;
  totalPrice: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  walkRoute?: { lat: number; lng: number }[];
  walkPhotos?: string[];
  walkerNotes?: string;
  rating?: number;
  review?: string;
}

interface BookingStore {
  // Current booking flow state
  currentBooking: Partial<BookingDetails> | null;
  
  // All user bookings
  bookings: Booking[];
  
  // Payment methods
  paymentMethods: PaymentCard[];
  
  // Emergency contacts
  emergencyContacts: EmergencyContact[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Booking flow actions
  startBooking: (walkerId: string, walkerName: string, walkerAvatar: string) => void;
  updateBookingDetails: (details: Partial<BookingDetails>) => void;
  clearCurrentBooking: () => void;
  
  // Booking CRUD
  createBooking: (details: BookingDetails) => Promise<string>;
  getBookingById: (id: string) => Booking | undefined;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cancelBooking: (id: string) => Promise<void>;
  rateBooking: (id: string, rating: number, review?: string) => void;
  
  // Filtered bookings
  getUpcomingBookings: () => Booking[];
  getActiveBooking: () => Booking | undefined;
  getPastBookings: () => Booking[];
  getBookingsByStatus: (status: BookingStatus) => Booking[];
  
  // Fetch/refresh bookings
  fetchBookings: () => Promise<void>;
  
  // Payment methods
  addPaymentMethod: (card: Omit<PaymentCard, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  
  // Emergency contacts
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
}

// Mock data
const mockPaymentMethods: PaymentCard[] = [
  {
    id: '1',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
  },
  {
    id: '2',
    last4: '5555',
    brand: 'Mastercard',
    expiryMonth: 8,
    expiryYear: 2025,
    isDefault: false,
  },
];

const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    phone: '+1 (555) 123-4567',
    relationship: 'Veterinarian',
  },
  {
    id: '2',
    name: 'John Smith',
    phone: '+1 (555) 987-6543',
    relationship: 'Family',
  },
];

const mockBookings: Booking[] = [
  {
    id: '1',
    walkerId: '1',
    walkerName: 'Sarah J.',
    walkerAvatar: 'https://i.pravatar.cc/150?img=1',
    petIds: ['1'],
    petNames: ['Max'],
    duration: 60,
    scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    scheduledTime: '2:00 PM',
    status: 'confirmed',
    specialInstructions: 'Max loves the park on 5th Avenue',
    address: '123 Main St, New York, NY 10001',
    totalPrice: 25,
    paymentMethod: mockPaymentMethods[0],
    emergencyContact: mockEmergencyContacts[0],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: '2',
    walkerId: '2',
    walkerName: 'Marcus T.',
    walkerAvatar: 'https://i.pravatar.cc/150?img=12',
    petIds: ['2'],
    petNames: ['Bella'],
    duration: 45,
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    scheduledTime: '10:00 AM',
    status: 'completed',
    address: '123 Main St, New York, NY 10001',
    totalPrice: 22.5,
    paymentMethod: mockPaymentMethods[0],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    rating: 5,
    review: 'Excellent service! Bella had a great time.',
    walkPhotos: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    ],
  },
];

export const useBookingStore = create<BookingStore>((set, get) => ({
  currentBooking: null,
  bookings: mockBookings,
  paymentMethods: mockPaymentMethods,
  emergencyContacts: mockEmergencyContacts,
  isLoading: false,
  error: null,

  // Booking flow actions
  startBooking: (walkerId, walkerName, walkerAvatar) => {
    set({
      currentBooking: {
        walkerId,
        walkerName,
        walkerAvatar,
        isInstantBook: false,
        petIds: [],
        petNames: [],
      },
      error: null,
    });
  },

  updateBookingDetails: (details) => {
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        ...details,
      },
    }));
  },

  clearCurrentBooking: () => {
    set({ currentBooking: null, error: null });
  },

  // Booking CRUD
  createBooking: async (details) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newBooking: Booking = {
        id: Date.now().toString(),
        walkerId: details.walkerId,
        walkerName: details.walkerName,
        walkerAvatar: details.walkerAvatar,
        petIds: details.petIds,
        petNames: details.petNames,
        duration: details.duration,
        scheduledDate: details.scheduledDate || new Date(),
        scheduledTime: details.scheduledTime || 'ASAP',
        status: 'pending',
        specialInstructions: details.specialInstructions,
        address: details.address || '123 Main St, New York, NY 10001',
        totalPrice: details.totalPrice,
        paymentMethod: get().paymentMethods.find((pm) => pm.id === details.paymentMethodId) || get().paymentMethods[0],
        emergencyContact: get().emergencyContacts.find((ec) => ec.id === details.emergencyContactId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => ({
        bookings: [newBooking, ...state.bookings],
        currentBooking: null,
        isLoading: false,
      }));

      return newBooking.id;
    } catch (error) {
      set({ error: 'Failed to create booking', isLoading: false });
      throw error;
    }
  },

  getBookingById: (id) => {
    return get().bookings.find((booking) => booking.id === id);
  },

  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status,
              updatedAt: new Date(),
              ...(status === 'in-progress' ? { startedAt: new Date() } : {}),
              ...(status === 'completed' ? { completedAt: new Date() } : {}),
            }
          : booking
      ),
    }));
  },

  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id
            ? { ...booking, status: 'cancelled', updatedAt: new Date() }
            : booking
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel booking', isLoading: false });
      throw error;
    }
  },

  rateBooking: (id, rating, review) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? { ...booking, rating, review, updatedAt: new Date() }
          : booking
      ),
    }));
  },

  // Filtered bookings
  getUpcomingBookings: () => {
    const now = new Date();
    return get()
      .bookings.filter(
        (booking) =>
          (booking.status === 'confirmed' || booking.status === 'pending') &&
          booking.scheduledDate > now
      )
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  },

  getActiveBooking: () => {
    return get().bookings.find((booking) => booking.status === 'in-progress');
  },

  getPastBookings: () => {
    const now = new Date();
    return get()
      .bookings.filter(
        (booking) =>
          booking.status === 'completed' ||
          booking.status === 'cancelled' ||
          (booking.scheduledDate < now && booking.status !== 'in-progress')
      )
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
  },

  getBookingsByStatus: (status) => {
    return get().bookings.filter((booking) => booking.status === status);
  },

  // Fetch/refresh bookings
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // In a real app, this would fetch from the server
      // For now, the mock data is already loaded
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch bookings', isLoading: false });
      throw error;
    }
  },

  // Payment methods
  addPaymentMethod: (card) => {
    const newCard: PaymentCard = {
      ...card,
      id: Date.now().toString(),
    };

    set((state) => ({
      paymentMethods: [...state.paymentMethods, newCard],
    }));
  },

  removePaymentMethod: (id) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.filter((pm) => pm.id !== id),
    }));
  },

  setDefaultPaymentMethod: (id) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    }));
  },

  // Emergency contacts
  addEmergencyContact: (contact) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };

    set((state) => ({
      emergencyContacts: [...state.emergencyContacts, newContact],
    }));
  },

  removeEmergencyContact: (id) => {
    set((state) => ({
      emergencyContacts: state.emergencyContacts.filter((ec) => ec.id !== id),
    }));
  },

  updateEmergencyContact: (id, contact) => {
    set((state) => ({
      emergencyContacts: state.emergencyContacts.map((ec) =>
        ec.id === id ? { ...ec, ...contact } : ec
      ),
    }));
  },
}));

// Utility functions
export const calculateWalkPrice = (duration: WalkDuration, pricePerHour: number): number => {
  return (duration / 60) * pricePerHour;
};

// Fetch exact price from walker_pricing table
export const fetchWalkPrice = async (walkerId: string, duration: WalkDuration): Promise<number> => {
  try {
    const { supabase } = await import('@/utils/supabase');
    
    const { data, error } = await supabase
      .from('walker_pricing')
      .select('price_amount')
      .eq('walker_id', walkerId)
      .eq('duration_minutes', duration)
      .single();
    
    if (error || !data) {
      console.warn(`No pricing found for walker ${walkerId}, duration ${duration}. Using fallback.`);
      return calculateWalkPrice(duration, 25); // Fallback to $25/hr
    }
    
    return Number(data.price_amount);
  } catch (error) {
    console.error('Error fetching walk price:', error);
    return calculateWalkPrice(duration, 25); // Fallback
  }
};

export const formatBookingDate = (date: Date): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
};

export const getStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case 'pending':
      return '#F59E0B';
    case 'confirmed':
      return '#0a7ea4';
    case 'in-progress':
      return '#10B981';
    case 'completed':
      return '#6B7280';
    case 'cancelled':
      return '#EF4444';
    default:
      return '#9CA3AF';
  }
};

export const getStatusLabel = (status: BookingStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};
