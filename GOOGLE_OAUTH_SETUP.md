# Google OAuth Authentication Setup Guide

## Overview
This guide walks through the complete setup and configuration of Google OAuth authentication for the Dog Walker app, including Supabase backend integration and testing.

## Prerequisites Completed ✅
- [x] Google OAuth credentials created (iOS and Web Client IDs)
- [x] Dependencies installed (`@react-native-google-signin/google-signin`, `expo-auth-session`, etc.)
- [x] Environment variables configured in `.env.local`
- [x] App.json configured with Google Sign-In plugin
- [x] AuthStore enhanced with `loginWithGoogle()` method
- [x] Login and Signup screens updated with Google sign-in buttons

## Part 1: Supabase Dashboard Configuration

### Step 1: Access Supabase Authentication Settings
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/cjimkqdybrgnccxsnigd
2. Navigate to **Authentication** → **Providers** in the left sidebar
3. Find **Google** in the list of providers

### Step 2: Enable Google Provider
1. Toggle the **Google Enabled** switch to ON
2. You'll see a configuration form with the following fields

### Step 3: Configure Google OAuth Credentials

#### Required Fields:
- **Client ID (for OAuth)**: `677749677697-aov5te9g82117paf1in0d53t31vqa7ai.apps.googleusercontent.com`
  - This is your Web Client ID from Google Cloud Console
  - Used for the OAuth flow with Supabase

- **Client Secret (for OAuth)**: 
  - You need to get this from your Google Cloud Console
  - Go to: https://console.cloud.google.com/apis/credentials?project=dogwalkerapp-477420
  - Click on your Web Client ID credential
  - Copy the "Client Secret" value
  - Paste it into Supabase

#### Optional but Recommended:
- **Authorized Client IDs**: Add your iOS Client ID here for additional security
  ```
  677749677697-2smko8dc3d9c8oa0n8g44r7dm2klfilg.apps.googleusercontent.com
  ```
  - This allows the native iOS app to authenticate

### Step 4: Configure Redirect URIs
Supabase will automatically provide you with a callback URL. It should look like:
```
https://cjimkqdybrgnccxsnigd.supabase.co/auth/v1/callback
```

**Important**: You must add this callback URL to your Google Cloud Console:

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=dogwalkerapp-477420
2. Click on your **Web Client ID** (the one ending in ...aov5te9g82117paf1in0d53t31vqa7ai)
3. Under **Authorized redirect URIs**, click **+ ADD URI**
4. Add: `https://cjimkqdybrgnccxsnigd.supabase.co/auth/v1/callback`
5. Click **Save**

### Step 5: Save Configuration
1. Click **Save** in the Supabase dashboard
2. Wait for the confirmation message

## Part 2: Verify Google Cloud Console Configuration

### Check Authorized Redirect URIs
Your Web Client ID should have these redirect URIs:
- `https://cjimkqdybrgnccxsnigd.supabase.co/auth/v1/callback` (Supabase callback)
- `http://localhost` (for local testing, if needed)

### Check OAuth Consent Screen
1. Go to **OAuth consent screen** in Google Cloud Console
2. Ensure these scopes are added:
   - `email`
   - `profile`
   - `openid`
3. Add test users if your app is in "Testing" mode

### Check iOS Bundle ID (if testing on iOS)
1. Click on your **iOS Client ID**
2. Verify the **Bundle ID** matches your app: `com.dogwalker.app`
3. The iOS URL Scheme should be: `com.googleusercontent.apps.677749677697-2smko8dc3d9c8oa0n8g44r7dm2klfilg`

## Part 3: Android Configuration

### Generate SHA-1 Fingerprint (Required for Android)
Your Android app needs a SHA-1 fingerprint registered in Google Cloud Console.

#### For Debug Build:
```powershell
cd android
.\gradlew signingReport
```

This will output SHA-1 and SHA-256 fingerprints. Copy the **SHA-1** value.

#### Add to Google Cloud Console:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your **Android Client** (or create one if it doesn't exist)
3. Add your debug SHA-1 fingerprint
4. Package name: `com.dogwalker.app`

**Note**: For production, you'll need to generate and add the release SHA-1 fingerprint.

## Part 4: Testing the Implementation

### Prebuild Native Projects (Required)
Since we added a native module (`@react-native-google-signin/google-signin`), you must prebuild:

```powershell
npx expo prebuild --clean
```

This regenerates the native iOS and Android projects with the Google Sign-In plugin configured.

### Test on iOS Simulator

#### Prerequisites:
- Xcode installed on macOS
- iOS Simulator set up

#### Steps:
1. Start the development server:
   ```powershell
   npx expo start
   ```

2. Press `i` to open in iOS Simulator

3. Navigate to Login or Signup screen

4. Tap the **"Sign in with Google"** button

5. Expected behavior:
   - Google Sign-In sheet appears
   - Select a Google account
   - Consent screen (first time only)
   - Redirects back to app
   - User is logged in and navigates to dashboard

#### Troubleshooting iOS:
- **"Google Sign-In is not configured"**: Run `npx expo prebuild --clean` again
- **"Invalid client ID"**: Check environment variables in `.env.local`
- **"Sign in failed"**: Check Xcode console logs for detailed errors

### Test on Android Emulator

#### Prerequisites:
- Android Studio installed
- Android Emulator with Google Play Services

#### Steps:
1. Start the development server:
   ```powershell
   npx expo start
   ```

2. Press `a` to open in Android Emulator

3. Navigate to Login or Signup screen

4. Tap the **"Sign in with Google"** button

5. Expected behavior:
   - Google account picker appears
   - Select account
   - Consent screen (first time)
   - Returns to app
   - User logged in and navigates to dashboard

#### Troubleshooting Android:
- **"Google Play Services not available"**: Ensure emulator has Play Services installed
- **"Error 10"**: SHA-1 fingerprint not registered in Google Cloud Console
- **"Error 12501"**: Check package name matches exactly: `com.dogwalker.app`
- **"Sign in cancelled"**: User dismissed the Google account picker

### Test on Physical Devices

#### iOS Device:
1. Connect device via USB
2. Ensure device is added to your Apple Developer account
3. Build and run:
   ```powershell
   npx expo run:ios --device
   ```

#### Android Device:
1. Enable USB debugging on device
2. Connect via USB
3. Build and run:
   ```powershell
   npx expo run:android --device
   ```

## Part 5: Verify Supabase Integration

### Check User Creation
After successful Google sign-in:

1. Go to Supabase dashboard → **Authentication** → **Users**
2. You should see a new user with:
   - Email from Google account
   - Provider: `google`
   - `user_metadata` containing full name and avatar URL

### Check Database Records
If you have a `profiles` table or similar:
1. Navigate to **Table Editor** → `profiles`
2. Verify that a profile was created for the new user
3. Check that `full_name` and other fields are populated

### Test Session Persistence
1. Sign in with Google
2. Close the app completely
3. Reopen the app
4. Expected: User should still be logged in (session restored)

## Part 6: Common Issues and Solutions

### Issue: "Google Sign-In configuration failed"
**Solution**: 
- Check that `.env.local` has the correct client IDs
- Restart the development server after changing environment variables
- Run `npx expo start --clear` to clear cache

### Issue: "Network error" during sign-in
**Solution**:
- Check internet connectivity
- Verify Supabase project is accessible
- Check Supabase service status: https://status.supabase.com

### Issue: "Invalid credentials" from Supabase
**Solution**:
- Verify Google OAuth provider is enabled in Supabase
- Check client ID and secret are correctly entered in Supabase
- Ensure redirect URI is added to Google Cloud Console

### Issue: Sign-in works but user not in Supabase
**Solution**:
- Check Supabase logs: Authentication → Logs
- Verify `signInWithIdToken` is being called correctly
- Check for errors in Metro bundler console

### Issue: "Sign in cancelled" immediately
**Solution**:
- On Android: Verify SHA-1 fingerprint is registered
- Check that Google Play Services is up to date
- Try `npx expo prebuild --clean` to regenerate native code

## Part 7: Production Checklist

Before deploying to production:

- [ ] Generate and register production SHA-1 fingerprints (Android)
- [ ] Update OAuth consent screen from "Testing" to "Production" in Google Cloud Console
- [ ] Add privacy policy and terms of service URLs to OAuth consent screen
- [ ] Configure production environment variables securely (not in `.env.local`)
- [ ] Test on multiple devices and OS versions
- [ ] Implement nonce validation for additional security
- [ ] Set up error monitoring (Sentry, etc.) to track sign-in failures
- [ ] Test account deletion and data export (GDPR compliance)
- [ ] Review Google OAuth scopes and request minimum necessary permissions

## Support and Resources

### Documentation:
- React Native Google Sign-In: https://github.com/react-native-google-signin/google-signin
- Supabase Auth: https://supabase.com/docs/guides/auth
- Google OAuth: https://developers.google.com/identity/protocols/oauth2

### Debugging Tools:
- Metro bundler logs: Shows React Native errors
- Xcode console: iOS-specific errors and warnings
- Android Logcat: Android-specific errors (use `adb logcat`)
- Supabase Logs: Authentication → Logs in dashboard

### Need Help?
- Check existing GitHub issues: https://github.com/react-native-google-signin/google-signin/issues
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag with `react-native`, `google-signin`, `supabase`

---

## Implementation Summary

### Files Modified:
1. **stores/authStore.ts**: Added `loginWithGoogle()` method, Google Sign-In initialization, and logout cleanup
2. **app/auth/login.tsx**: Added Google sign-in button with divider
3. **app/auth/signup.tsx**: Added Google sign-in button with divider
4. **.env.local**: Added Google OAuth client IDs
5. **app.json**: Added Google Sign-In plugin with iOS URL scheme

### Architecture:
```
User taps "Sign in with Google"
    ↓
GoogleSignin.signIn() - Native Google Sign-In UI
    ↓
Get idToken from Google response
    ↓
supabase.auth.signInWithIdToken({ provider: 'google', token })
    ↓
Supabase verifies token and creates session
    ↓
User data stored in authStore
    ↓
Navigate to dashboard
```

### Security Features:
- ✅ ID token validation by Supabase
- ✅ Secure token storage (Supabase handles this)
- ✅ Automatic session refresh
- ✅ Proper sign-out from both Google and Supabase
- ✅ Error handling for all failure scenarios
- ✅ Play Services availability check (Android)

---

**Next Steps**: Follow the Supabase Dashboard Configuration section to complete the setup, then test on your preferred platform!
