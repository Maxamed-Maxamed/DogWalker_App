// **
//  * User and Authentication Types
//  * Defines the core data structures for the dog walking application
//  */

/**
 * Role types for users in the system
 */
export type UserRole = "owner" | "walker";

/**
 * Onboarding progress status for new users
 */
export type OnboardingStatus = "not_started" | "in_progress" | "completed";

/**
 * Authentication status
 */
export type AuthStatus = "not_authenticated" | "authenticated";

/**
 * Initial setup progress status
 */
export type SetupStatus = "not_started" | "in_progress" | "completed";

/**
 * Walker identity and background verification status
 */
export type WalkerVerificationStatus = "pending" | "approved" | "rejected";

/**
 * Vaccination status of a dog
 */
export type VaccinationStatus = "up_to_date" | "expired" | "unknown";

/**
 * Walk status throughout its lifecycle
 */
export type WalkStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

/**
 * Payment method types
 */
export type PaymentMethodType = "credit_card" | "debit_card" | "bank_account";

/**
 * Background check status
 */
export type BackgroundCheckStatus = "pending" | "approved" | "rejected";

/**
 * Location information for dog owners
 */
export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zipCode: string;
}

/**
 * Base user interface with common properties
 */
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

/**
 * Owner user interface extending BaseUser
 */
export interface Owner extends BaseUser {
  role: "owner";
  location?: Location;
  dogs: Dog[];
  paymentMethods: PaymentMethod[];
}

/**
 * Bank account information for walker payments
 */
export interface BankInfo {
  accountNumber?: string;
  routingNumber?: string;
  accountHolderName?: string;
}

/**
 * Verification documents for walkers
 */
export interface VerificationDocuments {
  idVerified: boolean;
  backgroundCheckStatus: BackgroundCheckStatus;
}

/**
 * Walker user interface extending BaseUser
 */
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
  bankInfo?: BankInfo;
  verificationDocuments?: VerificationDocuments;
}

/**
 * Dog information owned by users
 */
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
  vaccinationStatus?: VaccinationStatus;
  createdAt: Date;
}

/**
 * GPS coordinates for walk tracking
 */
export interface GpsCoordinate {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

/**
 * Walk/service record between owner and walker
 */
export interface Walk {
  id: string;
  ownerId: string;
  walkerId: string;
  dogIds: string[];
  status: WalkStatus;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  distance?: number;
  route?: GpsCoordinate[];
  notes?: string;
  rating?: number;
  review?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Message between users for communication
 */
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  conversationId: string;
}

/**
 * Stored payment method for transactions
 */
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4: string;
  isDefault: boolean;
  expirationDate?: string;
}

/**
 * Time slot for walker availability
 */
export interface TimeSlot {
  startTime: string; // HH:MM format (e.g., "09:00")
  endTime: string; // HH:MM format (e.g., "17:00")
  available: boolean;
}

/**
 * Weekly availability schedule for walkers
 */
export interface WeeklySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

/**
 * Union type representing any user in the system
 */
export type User = Owner | Walker;