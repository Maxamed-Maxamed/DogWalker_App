-- Dog Walker App - Complete Database Schema
-- Version: 1.0
-- Created: November 3, 2025
-- Database: PostgreSQL (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension for geography types
CREATE EXTENSION IF NOT EXISTS postgis;

-- =======================
-- TABLES
-- =======================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  location GEOGRAPHY(POINT),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pets table
CREATE TABLE pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  weight NUMERIC,
  gender TEXT CHECK (gender IN ('male', 'female')),
  photo_url TEXT,
  temperament TEXT,
  medical_notes TEXT,
  special_instructions TEXT,
  vet_name TEXT,
  vet_phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Walkers table (managed by admin, not user-created)
CREATE TABLE walkers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  experience_years INTEGER,
  specialties TEXT[],
  rating NUMERIC(3,2) DEFAULT 5.0,
  total_walks INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  location GEOGRAPHY(POINT),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  walker_id UUID REFERENCES walkers(id) NOT NULL,
  pet_id UUID REFERENCES pets(id) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
  walk_type TEXT CHECK (walk_type IN ('on_demand', 'scheduled')) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  special_instructions TEXT,
  price_amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Walks table (tracking data)
CREATE TABLE walks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  distance_meters NUMERIC,
  route_polyline TEXT,
  walker_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Walk photos table
CREATE TABLE walk_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  walk_id UUID REFERENCES walks(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  walker_id UUID REFERENCES walkers(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device tokens for push notifications
CREATE TABLE device_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- =======================
-- INDEXES
-- =======================

CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_bookings_owner ON bookings(owner_id);
CREATE INDEX idx_bookings_walker ON bookings(walker_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_walker ON reviews(walker_id);
CREATE INDEX idx_walks_booking ON walks(booking_id);
CREATE INDEX idx_walk_photos_walk ON walk_photos(walk_id);

-- =======================
-- ROW LEVEL SECURITY (RLS)
-- =======================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Pets
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pets" ON pets
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own pets" ON pets
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own pets" ON pets
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own pets" ON pets
  FOR DELETE USING (auth.uid() = owner_id);

-- Walkers (Public read)
ALTER TABLE walkers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view walkers" ON walkers
  FOR SELECT USING (true);

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = owner_id);

-- Walks
ALTER TABLE walks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own walks" ON walks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = walks.booking_id
      AND bookings.owner_id = auth.uid()
    )
  );

-- Walk photos
ALTER TABLE walk_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own walk photos" ON walk_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM walks
      JOIN bookings ON bookings.id = walks.booking_id
      WHERE walks.id = walk_photos.walk_id
      AND bookings.owner_id = auth.uid()
    )
  );

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Device tokens
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tokens" ON device_tokens
  FOR ALL USING (auth.uid() = user_id);

-- =======================
-- FUNCTIONS & TRIGGERS
-- =======================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_walkers_updated_at
  BEFORE UPDATE ON walkers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- STORAGE BUCKETS
-- =======================

-- Create storage buckets (run after schema)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES 
--   ('pet-photos', 'pet-photos', true),
--   ('walker-photos', 'walker-photos', true),
--   ('walk-photos', 'walk-photos', true);

-- Storage policies
-- CREATE POLICY "Anyone can view pet photos" ON storage.objects
--   FOR SELECT USING (bucket_id = 'pet-photos');

-- CREATE POLICY "Authenticated users can upload pet photos" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'pet-photos' AND
--     auth.role() = 'authenticated'
--   );
