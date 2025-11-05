# Pet Photo Upload Fix

## Issue
**Error:** `blob.arrayBuffer is not a function (it is undefined)`

This error occurred when trying to upload pet photos because React Native's blob implementation doesn't support the `arrayBuffer()` method that's available in standard web browsers.

## Root Cause
The original implementation attempted to use:
```typescript
const arrayBuffer = await blob.arrayBuffer(); // ❌ Not supported in React Native
```

React Native's blob API is limited compared to web browsers and doesn't include the `arrayBuffer()` method.

## Solution
According to Expo documentation, the proper way to handle file uploads in React Native is to use `FileReader` to convert the blob to base64, then decode it to binary for Supabase Storage upload.

### Fixed Implementation
The new `uploadPetPhoto` function now:
1. **Fetches the image** from the local URI
2. **Converts to base64** using FileReader API (React Native compatible)
3. **Decodes base64 to Uint8Array** using `atob()` and manual byte conversion
4. **Validates file size** using the byte array length
5. **Determines MIME type** from file extension
6. **Uploads to Supabase Storage** using the Uint8Array

```typescript
async function uploadPetPhoto(userId: string, photoUri: string): Promise<string> {
  // Read file as base64 using FileReader (React Native compatible)
  const base64 = await fetch(photoUri)
    .then(res => res.blob())
    .then(blob => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const base64String = base64data.split(',')[1]; // Remove data URL prefix
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });

  // Convert base64 to Uint8Array
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from('pet-photos')
    .upload(filePath, bytes, {
      contentType: contentType,
      upsert: false,
    });
}
```

## Key Changes
1. ✅ **FileReader API**: Used `FileReader.readAsDataURL()` instead of `blob.arrayBuffer()`
2. ✅ **Base64 Conversion**: Convert blob to base64, then decode to binary
3. ✅ **Manual Byte Array**: Create Uint8Array manually using `atob()` and `charCodeAt()`
4. ✅ **MIME Type Detection**: Determine content type from file extension
5. ✅ **Better Logging**: Added comprehensive console logs for debugging

## Testing
To test the fix:
1. Navigate to **Pets** tab
2. Tap **"Add New Pet"**
3. Fill in pet details (name is required)
4. Tap **"Choose Photo"** or **"Take Photo"**
5. Select/take a photo
6. Tap **"Add Pet"**
7. Photo should upload successfully ✅

## Expected Behavior
- ✅ Photo uploads without errors
- ✅ Progress logged in console
- ✅ Pet appears in pets list with photo
- ✅ File size validation works (max 5MB)
- ✅ MIME type validation works (JPEG, PNG, WebP only)

## Related Files
- `stores/petStore.ts` - Fixed `uploadPetPhoto()` function
- `app/pets/add.tsx` - Pet creation form using the store
- `app/(tabs)/pets.tsx` - Pets list displaying uploaded photos

## Technical References
- **Expo FileReader**: React Native compatible File API
- **Supabase Storage**: Accepts Uint8Array for binary uploads
- **Base64 Encoding**: Standard JavaScript `atob()` function
- **Expo Docs**: File upload patterns for React Native

## Additional Fix: Foreign Key Constraint

### Issue
After photo upload succeeded, got this error:
```
ERROR Database insert error: {"code": "23503", "details": "Key is not present in table \"profiles\".", 
"message": "insert or update on table \"pets\" violates foreign key constraint \"pets_owner_id_fkey\""}
```

### Root Cause
The `pets` table has a foreign key to `profiles(id)`, but Supabase Auth doesn't automatically create profile entries when users sign up.

### Solution
Added `ensureProfileExists()` helper function that:
1. Checks if user has a profile in `profiles` table
2. Creates profile if it doesn't exist
3. Called before inserting pet to ensure foreign key constraint is satisfied

### Database Trigger (Recommended)
For production, run `database/auto-create-profile-trigger.sql` in Supabase SQL Editor:
- Automatically creates profile when user signs up
- Backfills profiles for existing users
- Prevents this issue from occurring

## Prevention
For future file uploads:
- ✅ Always use FileReader API in React Native
- ✅ Convert to base64 first, then decode to binary
- ✅ Never use `blob.arrayBuffer()` in React Native
- ✅ Test on physical devices (iOS/Android)
- ✅ Refer to Expo documentation for file handling patterns

For foreign key constraints:
- ✅ Always ensure referenced records exist before insert
- ✅ Use database triggers to auto-create required records
- ✅ Test with fresh user accounts to catch constraint violations
