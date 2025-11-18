export interface Booking {
  id: string;
  owner_id: string;
  walker_id?: string | null;
  pet_id: string;
  scheduled_at: string; // ISO
  duration_minutes: number;
  status: 'requested' | 'accepted' | 'cancelled' | 'completed' | 'in_progress';
  price_cents?: number;
  created_at: string;
  updated_at: string;
}

export interface Walk {
  id: string;
  booking_id: string;
  walker_id: string;
  started_at?: string | null;
  ended_at?: string | null;
  distance_meters?: number | null;
  route_geojson?: any | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalkPhoto {
  id: string;
  walk_id: string;
  walker_id: string;
  file_path: string;
  public_url?: string;
  created_at: string;
}

export type WalkerId = string;

// Domain model for a Walker (canonical type used across the app/back-end integrations)
export interface Walker {
  id: string;
  display_name?: string;
  avatar_url?: string | null;
  distance_km?: number | null;
  avg_rating?: number | null;
  bio?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  services?: string[] | null;
  created_at?: string;
  updated_at?: string;
}
