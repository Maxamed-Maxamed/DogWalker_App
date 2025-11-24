# Database Setup Instructions

This guide will help you set up the PostgreSQL database for the Dog Walker application using Supabase.

## Prerequisites

- Supabase account (free tier works fine)
- Access to your project's Supabase dashboard

## Step 1: Access SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Run Database Schema

Copy and paste the contents of `database/schema.sql` into the SQL editor and run it. This will create:

- **8 Tables**: profiles, pets, walkers, bookings, walks, walk_photos, reviews, device_tokens
- **Row-Level Security (RLS)**: Policies ensuring users can only access their own data
- **Indexes**: Performance optimizations on foreign keys and status fields
- **Triggers**: Auto-update timestamps on all tables
- **Functions**: Helper functions for geospatial calculations

## Step 3: Enable PostGIS Extension (Optional)

If you plan to use distance calculations and geospatial features:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

## Step 4: Set Up Storage Buckets

The schema includes commented configurations for storage buckets. To set them up:

1. Go to **Storage** in your Supabase dashboard
2. Create three buckets:
   - `pet-photos` (Public: Yes)
   - `walker-photos` (Public: Yes)
   - `walk-photos` (Public: Yes)

### Storage Policies

For each bucket, set up the following RLS policies:

**pet-photos bucket:**
- Allow users to upload their own pet photos
- Allow users to update/delete their own pet photos
- Allow public read access to all photos

**walker-photos bucket:**
- Allow admins to upload walker photos
- Allow public read access to all photos

**walk-photos bucket:**
- Allow walkers to upload photos during walks
- Allow owners to view photos from their walks
- Auto-delete old photos after 30 days (optional)

## Step 5: Verify Setup

Run these queries to verify everything is working:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check storage buckets
SELECT * FROM storage.buckets;
```

## Step 6: Update Environment Variables

Make sure your `.env` or environment configuration has the correct Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing the Setup

1. Start your Expo development server
2. Sign up as a new user
3. Try creating a pet profile with a photo
4. Verify the data appears in your Supabase dashboard

## Troubleshooting

### RLS Policies Not Working
- Make sure you're authenticated when testing
- Check that policies are enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

### Photo Upload Failing
- Verify storage buckets are created
- Check bucket policies allow authenticated uploads
- Ensure CORS is configured if testing on web

### Foreign Key Errors
- Make sure you create pets before bookings
- Walkers must be created by admin before bookings

## Next Steps

After database setup is complete:

1. ✅ Database schema created
2. ✅ Storage buckets configured
3. ✅ RLS policies enabled
4. ⏳ Test pet profile creation
5. ⏳ Move on to Week 2: Walker discovery features

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
