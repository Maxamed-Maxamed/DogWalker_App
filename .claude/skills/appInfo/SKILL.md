---
name: dogwalker-platform-skills-agent
description: Skills agent for DogWalker dual-app marketplace platform with security implementations
type: skills-agent
target-audience: developers, team leads, hiring managers
version: 2.0.0
last-updated: 2026-02-03
---

# DogWalker Platform - Skills Agent

**Production-ready skill requirements with security hardening and document handling**

## Core Technology Stack

### Frontend

- **React Native 0.81.5** with Expo SDK 54
- **Expo Router 6.0** for file-based routing
- **TypeScript 5.9** for type safety
- **NativeWind 4.2** for styling
- **expo-document-picker 14.0** for file uploads

### Backend

- **Supabase** - PostgreSQL + Real-time + Auth + Storage
- **PostgreSQL** - Relational database with RLS
- **Stripe** - Payment processing

### Security & Storage

- **expo-secure-store** - Encrypted credentials
- **AsyncStorage** - Non-sensitive data
- **OWASP A02:2021** compliance

---

## 📁 App Folder Structure & Navigation Flow

### Complete File Structure

```
app/
│
├── _layout.tsx                          # Root layout (theme provider, fonts)
├── index.tsx                            # 🚀 Entry point - checks auth & routes
├── +not-found.tsx                       # 404 page
│
├── role-selection.tsx                   # 🎯 Choose Owner or Walker
│
├── owner/                               # 🟦 DOG OWNER PATH
│   │
│   ├── _layout.tsx                      # Owner root layout
│   ├── index.tsx                        # Owner entry redirect
│   ├── splash.tsx                       # 🟦 Owner splash screen
│   │
│   ├── (onboarding)/                    # Owner onboarding flow
│   │   ├── _layout.tsx                  # Onboarding layout (carousel)
│   │   ├── welcome.tsx                  # Screen 1: Welcome
│   │   ├── how-it-works.tsx             # Screen 2: How it works
│   │   ├── safety.tsx                   # Screen 3: Safety first
│   │   └── get-started.tsx              # Screen 4: Get started
│   │
│   ├── (auth)/                          # Owner authentication
│   │   ├── _layout.tsx                  # Auth layout
│   │   ├── signup.tsx                   # Sign up form
│   │   ├── login.tsx                    # Login form
│   │   └── forgot-password.tsx          # Password reset
│   │
│   ├── (setup)/                         # Owner profile setup
│   │   ├── _layout.tsx                  # Setup layout (progress bar)
│   │   ├── personal-info.tsx            # Step 1: Name, phone, photo
│   │   ├── add-dog.tsx                  # Step 2: Add dog profiles
│   │   └── location.tsx                 # Step 3: Location
│   │
│   └── (tabs)/                          # Owner main app (after login)
│       ├── _layout.tsx                  # Tab layout (bottom tabs)
│       ├── home.tsx                     # Tab 1: Browse walkers, book
│       ├── walks.tsx                    # Tab 2: Schedule & track walks
│       ├── messages.tsx                 # Tab 3: Chat with walkers
│       └── profile.tsx                  # Tab 4: Settings, dogs, payment
│
└── walker/                              # 🟩 DOG WALKER PATH
    │
    ├── _layout.tsx                      # Walker root layout
    ├── index.tsx                        # Walker entry redirect
    ├── splash.tsx                       # 🟩 Walker splash screen
    │
    ├── (onboarding)/                    # Walker onboarding flow
    │   ├── _layout.tsx                  # Onboarding layout (carousel)
    │   ├── welcome.tsx                  # Screen 1: Welcome
    │   ├── how-it-works.tsx             # Screen 2: How it works
    │   ├── requirements.tsx             # Screen 3: Requirements
    │   └── get-started.tsx              # Screen 4: Get started
    │
    ├── (auth)/                          # Walker authentication
    │   ├── _layout.tsx                  # Auth layout
    │   ├── signup.tsx                   # Sign up form
    │   ├── login.tsx                    # Login form
    │   └── forgot-password.tsx          # Password reset
    │
    ├── (setup)/                         # Walker profile setup
    │   ├── _layout.tsx                  # Setup layout (progress bar)
    │   ├── personal-info.tsx            # Step 1: Name, phone, DOB, photo
    │   ├── experience.tsx               # Step 2: Bio, experience
    │   ├── availability.tsx             # Step 3: Weekly schedule
    │   ├── verification.tsx             # Step 4: ID, SSN, bank info
    │   └── pending.tsx                  # Step 5: Pending approval
    │
    └── (tabs)/                          # Walker main app (after approval)
        ├── _layout.tsx                  # Tab layout (bottom tabs)
        ├── home.tsx                     # Tab 1: Requests, quick actions
        ├── schedule.tsx                 # Tab 2: Calendar, upcoming walks
        ├── messages.tsx                 # Tab 3: Chat with owners
        └── profile.tsx                  # Tab 4: Availability, earnings
```

### Navigation Flows

#### 1️⃣ App Launch Flow

```
app/index.tsx
├── Check AsyncStorage for 'userRole'
├── Check authentication status
└── Check profile completion
    │
    ├─ No role selected?
    │  └─→ Navigate to: /role-selection
    │
    ├─ Role = 'owner' & not authenticated?
    │  └─→ Navigate to: /owner/splash
    │
    ├─ Role = 'owner' & authenticated & profile incomplete?
    │  └─→ Navigate to: /owner/(setup)/personal-info
    │
    ├─ Role = 'owner' & authenticated & profile complete?
    │  └─→ Navigate to: /owner/(tabs)/home
    │
    ├─ Role = 'walker' & not authenticated?
    │  └─→ Navigate to: /walker/splash
    │
    ├─ Role = 'walker' & authenticated & profile incomplete?
    │  └─→ Navigate to: /walker/(setup)/personal-info
    │
    └─ Role = 'walker' & authenticated & profile complete?
       └─→ Navigate to: /walker/(tabs)/home
```

#### 2️⃣ Dog Owner Complete Flow

```
/role-selection
    │ User taps "I'm a Dog Owner"
    │ Save: AsyncStorage.setItem('userRole', 'owner')
    ↓
/owner/splash
    │ Show owner-themed splash (2-3 seconds)
    │ Blue/Teal branding
    ↓
/owner/(onboarding)/welcome
    │ Swipeable onboarding carousel
    ├─→ /owner/(onboarding)/how-it-works
    ├─→ /owner/(onboarding)/safety
    └─→ /owner/(onboarding)/get-started
    ↓
/owner/(auth)/signup  OR  /owner/(auth)/login
    │ User creates account or logs in
    │ Save auth token
    ↓
/owner/(setup)/personal-info
    │ Step 1 of 3: Name, phone, photo
    ↓
/owner/(setup)/add-dog
    │ Step 2 of 3: Add dog(s)
    │ Can add multiple dogs
    ↓
/owner/(setup)/location
    │ Step 3 of 3: Address, location
    │ Mark profile as complete
    ↓
/owner/(tabs)/home
    │ Main app with bottom tabs
    ├─→ /owner/(tabs)/home       (Browse walkers)
    ├─→ /owner/(tabs)/walks      (Schedule & track)
    ├─→ /owner/(tabs)/messages   (Chat)
    └─→ /owner/(tabs)/profile    (Settings)
```

#### 3️⃣ Dog Walker Complete Flow

```
/role-selection
    │ User taps "I'm a Dog Walker"
    │ Save: AsyncStorage.setItem('userRole', 'walker')
    ↓
/walker/splash
    │ Show walker-themed splash (2-3 seconds)
    │ Green/Orange branding
    ↓
/walker/(onboarding)/welcome
    │ Swipeable onboarding carousel
    ├─→ /walker/(onboarding)/how-it-works
    ├─→ /walker/(onboarding)/requirements
    └─→ /walker/(onboarding)/get-started
    ↓
/walker/(auth)/signup  OR  /walker/(auth)/login
    │ User creates account or logs in
    │ Save auth token
    ↓
/walker/(setup)/personal-info
    │ Step 1 of 4: Name, phone, DOB, photo
    ↓
/walker/(setup)/experience
    │ Step 2 of 4: Bio, experience, dog sizes
    ↓
/walker/(setup)/availability
    │ Step 3 of 4: Weekly schedule
    ↓
/walker/(setup)/verification
    │ Step 4 of 4: ID, SSN, banking
    │ Submit for background check
    ↓
/walker/(setup)/pending
    │ Wait for verification (2-3 days)
    │ Can explore app but can't accept walks
    ↓
/walker/(tabs)/home
    │ Main app with bottom tabs (once approved)
    ├─→ /walker/(tabs)/home       (Requests, dashboard)
    ├─→ /walker/(tabs)/schedule   (Calendar)
    ├─→ /walker/(tabs)/messages   (Chat)
    └─→ /walker/(tabs)/profile    (Earnings, settings)
```

### Key Files Explained

#### 📁 Root Level

**app/\_layout.tsx**

- Root layout for entire app
- Loads fonts, theme provider
- Wraps all screens

**app/index.tsx**

- Entry point of the app
- Checks user state and routes accordingly
- Logic for determining where to navigate

**app/role-selection.tsx**

- First screen for new users
- Two large cards: Owner vs Walker
- Saves role to AsyncStorage

#### 📁 Owner Folder

**app/owner/\_layout.tsx**

- Layout wrapper for all owner screens
- Apply owner theme (blue/teal)

**app/owner/splash.tsx**

- Owner-specific splash screen
- Shows owner branding
- Auto-navigates to onboarding

**app/owner/(onboarding)/\_layout.tsx**

- Carousel layout for onboarding
- Swipe between screens
- Progress dots
- Skip button

**app/owner/(auth)/\_layout.tsx**

- Auth screen wrapper
- Shared header/styling

**app/owner/(setup)/\_layout.tsx**

- Setup flow wrapper
- Progress bar (Step 1 of 3)
- Back navigation

**app/owner/(tabs)/\_layout.tsx**

- Bottom tab navigation
- 4 tabs: Home, Walks, Messages, Profile
- Tab icons and labels
- Owner color theme

#### 📁 Walker Folder

**app/walker/\_layout.tsx**

- Layout wrapper for all walker screens
- Apply walker theme (green/orange)

**app/walker/splash.tsx**

- Walker-specific splash screen
- Shows walker branding
- Auto-navigates to onboarding

**app/walker/(onboarding)/\_layout.tsx**

- Carousel layout for onboarding
- Swipe between screens
- Progress dots
- Skip button

**app/walker/(auth)/\_layout.tsx**

- Auth screen wrapper
- Shared header/styling

**app/walker/(setup)/\_layout.tsx**

- Setup flow wrapper
- Progress bar (Step 1 of 4)
- Back navigation

**app/walker/(tabs)/\_layout.tsx**

- Bottom tab navigation
- 4 tabs: Home, Schedule, Messages, Profile
- Tab icons and labels
- Walker color theme

### Route Groups Explanation

#### What are `(parentheses)`?

Route groups in Expo Router allow you to organize files without affecting the URL structure.

**Example:**

```
app/owner/(auth)/login.tsx → URL: /owner/login
app/owner/(tabs)/home.tsx  → URL: /owner/home
```

The `(auth)` and `(tabs)` don't appear in the URL!

#### Why use them?

✅ **Organization**: Group related screens  
✅ **Shared Layouts**: Each group can have its own `_layout.tsx`  
✅ **Clean URLs**: Keep URLs simple

### State Management

#### What to store in AsyncStorage:

```typescript
// User role
AsyncStorage.setItem("userRole", "owner" | "walker");

// Auth token
AsyncStorage.setItem("authToken", token);

// Profile completion status
AsyncStorage.setItem("profileComplete", "true" | "false");

// User ID
AsyncStorage.setItem("userId", userId);
```

#### Navigation Logic Example:

```typescript
// app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAndNavigate();
  }, []);

  async function checkAndNavigate() {
    const userRole = await AsyncStorage.getItem("userRole");
    const authToken = await AsyncStorage.getItem("authToken");
    const profileComplete = await AsyncStorage.getItem("profileComplete");

    // No role selected - first time user
    if (!userRole) {
      router.replace("/role-selection");
      return;
    }

    // Owner path
    if (userRole === "owner") {
      if (!authToken) {
        router.replace("/owner/splash");
      } else if (profileComplete !== "true") {
        router.replace("/owner/(setup)/personal-info");
      } else {
        router.replace("/owner/(tabs)/home");
      }
      return;
    }

    // Walker path
    if (userRole === "walker") {
      if (!authToken) {
        router.replace("/walker/splash");
      } else if (profileComplete !== "true") {
        router.replace("/walker/(setup)/personal-info");
      } else {
        router.replace("/walker/(tabs)/home");
      }
    }
  }

  return null; // Or a loading spinner
}
```

### Architecture Summary

🎯 **Two completely separate experiences:**

- Owner: `/owner/*` (Blue/Teal theme)
- Walker: `/walker/*` (Green/Orange theme)

📱 **Each role has:**

- Own splash screen
- Own onboarding (4 screens)
- Own auth flow
- Own profile setup
- Own dashboard with tabs

🔀 **Navigation is controlled by:**

1. User role selection
2. Authentication status
3. Profile completion

This gives you a clean, organized structure where each role feels like its own app! 🚀

---

## Recently Implemented ✅ (Feb 2026)

### Security Hardening

- ✅ Auth token cleanup on invalid sessions
- ✅ Async callback handling in intervals
- ✅ Role validation with type guards
- ✅ Stale credential prevention

### Document Upload System

- ✅ expo-document-picker integration
- ✅ File size validation (10MB limit)
- ✅ MIME type whitelisting
- ✅ Loading states & error handling

### Privacy Compliance

- ✅ PII removed from logs (GDPR-ready)
- ✅ Development-only debugging
- ✅ Secure data handling patterns

## Required Skills by Role

### Full-Stack Developer (Expert Level)

```
├── React Native + Expo (Expert)
├── TypeScript (Advanced)
├── Supabase + PostgreSQL (Advanced)
├── Security Patterns (Advanced)
├── Stripe Integration (Advanced)
└── Testing & Deployment (Intermediate)

Time to Productivity: 2-3 weeks
```

### Mobile Developer (Frontend Focus)

```
├── React Native + Expo (Expert)
├── TypeScript (Advanced)
├── UI/UX Implementation (Advanced)
├── Document Handling (Intermediate)
├── State Management (Intermediate)
└── Testing (Intermediate)

Time to Productivity: 1-2 weeks
```

### Backend Developer

```
├── Supabase + PostgreSQL (Expert)
├── TypeScript/Node.js (Advanced)
├── API Design (Advanced)
├── Security (Advanced)
├── Stripe Integration (Advanced)
└── Real-time Systems (Intermediate)

Time to Productivity: 1-2 weeks
```

## Essential Skills Matrix

| Area         | Technology       | Level        | Priority |
| ------------ | ---------------- | ------------ | -------- |
| **Frontend** | React Native     | Expert       | P0       |
|              | Expo Router      | Advanced     | P0       |
|              | TypeScript       | Advanced     | P0       |
|              | Document Picker  | Intermediate | P1       |
| **Backend**  | Supabase         | Advanced     | P0       |
|              | PostgreSQL       | Advanced     | P0       |
|              | RLS Policies     | Intermediate | P0       |
| **Security** | OWASP Patterns   | Advanced     | P0       |
|              | Token Management | Advanced     | P0       |
|              | Type Guards      | Intermediate | P0       |
| **Payments** | Stripe           | Advanced     | P1       |
|              | Webhooks         | Intermediate | P1       |

## Security Best Practices ✅

### Authentication & Authorization

```typescript
// ✅ Token cleanup on errors
catch (error) {
  await removeAuthToken();
  await removeUserData();
  setUser(null);
}

// ✅ Role validation
if (role === "owner" || role === "walker") {
  return role;
}
return null;

// ✅ Async handling
setInterval(() => {
  void (async () => {
    await refreshToken();
  })();
}, INTERVAL);
```

### Document Upload Security

```typescript
// ✅ File validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/*", "application/pdf"];

// ✅ User feedback
Alert.alert("File Too Large", "Max 10MB allowed");

// ✅ MIME type check
if (!ALLOWED_TYPES.includes(doc.mimeType)) {
  return Alert.alert("Invalid Type");
}
```

### Data Protection

```typescript
// ✅ Secure storage
await SecureStore.setItemAsync("auth_token", token);

// ✅ No PII in logs
if (__DEV__) {
  console.log("Action:", action.type);
  // ❌ Don't log: user.email, user.ssn
}
```

## Learning Path (8-Week Sprint)

### Weeks 1-2: Foundation

- [ ] React Native basics
- [ ] Expo Router setup
- [ ] TypeScript essentials
- [ ] Supabase auth

**Deliverable:** Login/signup screens with auth

### Weeks 3-4: Core Features

- [ ] Tab navigation
- [ ] Form components
- [ ] Data fetching
- [ ] State management

**Deliverable:** Owner/Walker dashboards

### Weeks 5-6: Advanced Features

- [ ] Document upload
- [ ] Real-time updates
- [ ] Push notifications
- [ ] Location tracking

**Deliverable:** Walker verification flow

### Weeks 7-8: Production

- [ ] Security audit
- [ ] Testing (>80% coverage)
- [ ] Performance optimization
- [ ] EAS Build deployment

**Deliverable:** Production-ready build

## Required Packages

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.93.3",
    "expo": "~54.0.33",
    "expo-document-picker": "~14.0.8",
    "expo-router": "~6.0.23",
    "expo-secure-store": "~15.0.8",
    "react": "19.1.0",
    "react-native": "0.81.5"
  }
}
```

## Testing Strategy

### Unit Tests (Jest)

```bash
✅ Component rendering
✅ Hook behavior
✅ Utility functions
✅ Type guards
Target: >80% coverage
```

### Integration Tests

```bash
✅ Auth flows
✅ Form submissions
✅ Navigation
✅ API calls
```

### Security Tests

```bash
✅ Token handling
✅ Input validation
✅ File upload limits
✅ Type safety
```

## Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Security audit complete
- [ ] Environment variables set
- [ ] Error tracking configured

### EAS Build

```bash
# Development build
eas build --profile development --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Post-deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify push notifications
- [ ] Test payment flows

## Common Issues & Solutions

### Issue: Token Persistence Fails

**Solution:** Clear stale tokens on error

```typescript
await removeAuthToken();
await removeUserData();
```

### Issue: Document Upload Hangs

**Solution:** Add loading states and timeout

```typescript
const [isUploading, setIsUploading] = useState(false);
```

### Issue: Type Errors in Production

**Solution:** Enable strict mode

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Resources

### Documentation

- Expo: https://docs.expo.dev
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- OWASP: https://owasp.org

### Training

- Expo Router Guide
- Supabase Auth Tutorial
- React Native Security
- TypeScript Deep Dive

## Success Metrics

### Code Quality

- Test coverage: **>80%**
- TypeScript errors: **0**
- ESLint warnings: **<10**
- Codacy grade: **B+**

### Security

- Critical vulnerabilities: **0**
- Auth token leaks: **0**
- PII in logs: **0**
- OWASP compliance: **100%**

### Performance

- App start time: **<2s**
- Navigation: **60 FPS**
- Bundle size: **<50MB**
- Memory usage: **<150MB**

---

**Version 2.0.0** - Production-Ready with Security Enhancements  
**Last Updated:** February 3, 2026
