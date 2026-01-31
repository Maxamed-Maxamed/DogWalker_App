export type UserRole = "owner" | "walker";

export type OnboardingStatus = "not_started" | "in_progress" | "completed";
export type AuthStatus = "not_authenticated" | "authenticated";
export type SetupStatus = "not_started" | "in_progress" | "completed";
export type WalkerVerificationStatus = "pending" | "approved" | "rejected";

export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
  createdAt: Date;
  onboardingStatus: OnboardingStatus;
  setupStatus: SetupStatus;
}

export interface Owner extends BaseUser {
  role: "owner";
  location?: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode: string;
  };
  dogs: Dog[];
  paymentMethods: PaymentMethod[];
}

export interface Walker extends BaseUser {
  role: "walker";
  bio?: string;
  experience?: string;
  dateOfBirth?: Date;
  verificationStatus: WalkerVerificationStatus;
  availability: WeeklySchedule;
  hourlyRate?: number;
  rating?: number;
  totalWalks?: number;
  bankInfo?: {
    accountNumber?: string;
    routingNumber?: string;
    accountHolderName?: string;
  };
  verificationDocuments?: {
    idVerified: boolean;
    backgroundCheckStatus: "pending" | "approved" | "rejected";
  };
}

export interface Dog {
  id: string;
  ownerId: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  photoUrl?: string;
  specialNeeds?: string;
  temperament?: string;
  vaccinationStatus?: "up_to_date" | "expired" | "unknown";
  createdAt: Date;
}

export interface Walk {
  id: string;
  ownerId: string;
  walkerId: string;
  dogIds: string[];
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  distance?: number;
  route?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  }[];
  notes?: string;
  rating?: number;
  review?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  conversationId: string;
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "bank_account";
  last4: string;
  isDefault: boolean;
  expirationDate?: string;
}

export interface WeeklySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  available: boolean;
}

export type User = Owner | Walker;
