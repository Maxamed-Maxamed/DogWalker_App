-- Seed Walker Data for Dog Walker App
-- Run this in Supabase SQL Editor

-- Insert 8 professional dog walkers
INSERT INTO walkers (id, full_name, email, phone, photo_url, bio, experience_years, specialties, rating, total_walks, is_available, created_at) VALUES
(
  'c7e9f3a1-2b4d-4c8e-9f1a-3d5e7b9c1a2f',
  'Sarah Johnson',
  'sarah.johnson@dogwalker.com',
  '+1-555-0101',
  'https://i.pravatar.cc/150?img=1',
  'Passionate dog lover with 5+ years of experience. I treat every pup like my own and specialize in high-energy breeds. Former veterinary assistant with pet first aid certification.',
  5,
  ARRAY['High-energy dogs', 'Puppies', 'Basic training', 'Large breeds'],
  5.0,
  342,
  true,
  '2020-01-15'
),
(
  'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  'Marcus Thompson',
  'marcus.thompson@dogwalker.com',
  '+1-555-0102',
  'https://i.pravatar.cc/150?img=12',
  'Professional dog walker and trainer. I focus on positive reinforcement and love working with reactive or anxious dogs. Your pet''s safety and happiness are my top priorities.',
  8,
  ARRAY['Reactive dogs', 'Anxiety support', 'Senior dogs', 'Multiple dog handling'],
  4.9,
  567,
  false,
  '2017-03-22'
),
(
  'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
  'Emily Rodriguez',
  'emily.rodriguez@dogwalker.com',
  '+1-555-0103',
  'https://i.pravatar.cc/150?img=5',
  'Dog mom to three rescue pups! I have a special place in my heart for small breeds and senior dogs. Gentle, patient, and reliable - I''ll care for your furry friend with love.',
  3,
  ARRAY['Small breeds', 'Senior dogs', 'Gentle walks', 'Medication administration'],
  4.8,
  156,
  true,
  '2022-05-08'
),
(
  'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
  'James Kim',
  'james.kim@dogwalker.com',
  '+1-555-0104',
  'https://i.pravatar.cc/150?img=13',
  'Active lifestyle enthusiast who loves long walks and running with dogs. Perfect for high-energy breeds that need extra exercise. Let''s tire out those pups together!',
  4,
  ARRAY['Running', 'High-energy breeds', 'Adventure walks', 'Athletic dogs'],
  4.7,
  289,
  true,
  '2021-02-14'
),
(
  'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
  'Jessica Martinez',
  'jessica.martinez@dogwalker.com',
  '+1-555-0105',
  'https://i.pravatar.cc/150?img=9',
  'Experienced with all breeds and sizes. I grew up on a farm with animals and have been walking dogs professionally for 6 years. Punctual, trustworthy, and detail-oriented.',
  6,
  ARRAY['All breeds', 'Puppy socialization', 'Basic commands', 'Photo updates'],
  4.9,
  421,
  false,
  '2019-07-10'
),
(
  'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
  'David Lee',
  'david.lee@dogwalker.com',
  '+1-555-0106',
  'https://i.pravatar.cc/150?img=15',
  'Weekend warrior and dog enthusiast! I offer flexible scheduling for busy professionals. Your dog will get the exercise and attention they deserve.',
  2,
  ARRAY['Weekend walks', 'Flexible scheduling', 'Medium breeds', 'Park adventures'],
  4.6,
  87,
  false,
  '2023-06-01'
),
(
  'f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
  'Amanda Wilson',
  'amanda.wilson@dogwalker.com',
  '+1-555-0107',
  'https://i.pravatar.cc/150?img=10',
  'Certified veterinary technician who moonlights as a dog walker. I have experience with special needs dogs and can administer medications. Your pet is in expert hands.',
  7,
  ARRAY['Medical needs', 'Special needs dogs', 'Senior care', 'Post-surgery care'],
  5.0,
  234,
  true,
  '2018-11-20'
),
(
  'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
  'Robert Brown',
  'robert.brown@dogwalker.com',
  '+1-555-0108',
  'https://i.pravatar.cc/150?img=14',
  'Retired firefighter with a passion for dogs. I provide reliable, safe walks with a focus on security. Great with protective breeds and large dogs.',
  10,
  ARRAY['Large breeds', 'Protective breeds', 'Security-focused', 'Strength training'],
  4.8,
  1024,
  false,
  '2015-01-01'
);

-- Verify insertion
SELECT id, full_name, email, experience_years, total_walks, is_available FROM walkers ORDER BY created_at;
