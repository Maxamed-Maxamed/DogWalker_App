-- Additional Tables for Dog Walker App Features
-- Run this AFTER schema.sql to add missing functionality

-- =======================
-- FAVORITES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS favorite_walkers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  walker_id UUID REFERENCES walkers(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, walker_id)
);

CREATE INDEX idx_favorite_walkers_user ON favorite_walkers(user_id);
CREATE INDEX idx_favorite_walkers_walker ON favorite_walkers(walker_id);

-- RLS Policies for favorites
ALTER TABLE favorite_walkers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON favorite_walkers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add own favorites" ON favorite_walkers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" ON favorite_walkers
  FOR DELETE USING (auth.uid() = user_id);

-- =======================
-- WALKER AVAILABILITY TABLE
-- =======================
CREATE TABLE IF NOT EXISTS walker_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  walker_id UUID REFERENCES walkers(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_walker_availability_walker ON walker_availability(walker_id);
CREATE INDEX idx_walker_availability_day ON walker_availability(day_of_week);

-- RLS: Public read for availability
ALTER TABLE walker_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view walker availability" ON walker_availability
  FOR SELECT USING (true);

-- =======================
-- WALKER PRICING TABLE
-- =======================
CREATE TABLE IF NOT EXISTS walker_pricing (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  walker_id UUID REFERENCES walkers(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price_amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(walker_id, duration_minutes)
);

CREATE INDEX idx_walker_pricing_walker ON walker_pricing(walker_id);

-- RLS: Public read for pricing
ALTER TABLE walker_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view walker pricing" ON walker_pricing
  FOR SELECT USING (true);

-- =======================
-- SEED PRICING DATA
-- =======================
INSERT INTO walker_pricing (walker_id, duration_minutes, price_amount) VALUES
-- Sarah Johnson ($25/hr)
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 30, 12.50),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 45, 18.75),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 60, 25.00),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 90, 37.50),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 120, 50.00),

-- Marcus Thompson ($30/hr)
('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 30, 15.00),
('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 45, 22.50),
('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 60, 30.00),
('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 90, 45.00),
('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 120, 60.00),

-- Emily Rodriguez ($20/hr)
('b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 30, 10.00),
('b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 45, 15.00),
('b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 60, 20.00),
('b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 90, 30.00),
('b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 120, 40.00),

-- James Kim ($22/hr)
('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 30, 11.00),
('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 45, 16.50),
('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 60, 22.00),
('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 90, 33.00),
('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 120, 44.00);

-- =======================
-- SEED AVAILABILITY DATA (Sample for Sarah Johnson)
-- =======================
INSERT INTO walker_availability (walker_id, day_of_week, start_time, end_time, is_available) VALUES
-- Sarah - Monday to Friday 9am-6pm
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 1, '09:00', '18:00', true),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 2, '09:00', '18:00', true),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 3, '09:00', '18:00', true),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 4, '09:00', '18:00', true),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 5, '09:00', '18:00', true),
('c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f', 6, '10:00', '16:00', true),

-- Amanda - Monday, Tuesday, Thursday, Friday (afternoons)
('f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 1, '12:00', '20:00', true),
('f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 2, '12:00', '20:00', true),
('f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 4, '12:00', '20:00', true),
('f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 5, '12:00', '20:00', true),
('f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 6, '09:00', '17:00', true);

-- Verify data
SELECT w.full_name, wp.duration_minutes, wp.price_amount 
FROM walkers w 
JOIN walker_pricing wp ON w.id = wp.walker_id 
ORDER BY w.full_name, wp.duration_minutes;
