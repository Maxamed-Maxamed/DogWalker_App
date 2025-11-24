-- Storage Policies for Dog Walker App
-- Run this AFTER creating the storage buckets in Supabase

-- =======================
-- PET PHOTOS BUCKET POLICIES
-- =======================

-- Allow anyone to view pet photos (public bucket)
CREATE POLICY "Anyone can view pet photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-photos');

-- Allow authenticated users to upload their own pet photos
CREATE POLICY "Users can upload pet photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own pet photos
CREATE POLICY "Users can update own pet photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own pet photos
CREATE POLICY "Users can delete own pet photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

-- =======================
-- WALKER PHOTOS BUCKET POLICIES
-- =======================

-- Allow anyone to view walker photos (public bucket)
CREATE POLICY "Anyone can view walker photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'walker-photos');

-- Allow authenticated users to upload walker photos
CREATE POLICY "Users can upload walker photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'walker-photos' 
  AND auth.role() = 'authenticated'
);

-- =======================
-- WALK PHOTOS BUCKET POLICIES
-- =======================

-- Allow anyone to view walk photos (public bucket)
CREATE POLICY "Anyone can view walk photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'walk-photos');

-- Allow authenticated users to upload walk photos
CREATE POLICY "Users can upload walk photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'walk-photos' 
  AND auth.role() = 'authenticated'
);

-- Allow users to view their own walk photos
CREATE POLICY "Users can update walk photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'walk-photos' 
  AND auth.role() = 'authenticated'
);
