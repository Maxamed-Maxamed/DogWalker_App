// TypeScript type definitions

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'owner' | 'walker';
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  ownerId: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  petId: string;
  walkerId: string;
  ownerId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// Use unknown instead of any for better type safety
export type Session = unknown;
