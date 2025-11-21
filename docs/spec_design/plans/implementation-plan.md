# Dog Walker App - Implementation Plan
**Project:** Dog Walker MVP  
**Version:** 1.0  
**Created:** November 20, 2025  
**Development Timeline:** 8 weeks  
**Target Platform:** iOS & Android (React Native/Expo)

---

## Goal Description

Build a **production-ready MVP** of the Dog Walker marketplace app in 8 weeks. Based on the [Baseline Specification](../specifications/baseline-specification.md#executive-summary) and tracked in [Development Tasks](../tasks/development-tasks.md#overview), this MVP will deliver core functionality for dog owners to request walks and dog walkers to accept and complete them with real-time GPS tracking, secure payments, and quality ratings.

### Success Criteria
- ✅ End-to-end walk flow functional (request → match → track → complete → pay → rate)
- ✅ Real-time GPS tracking with <1s latency
- ✅ Secure payment processing via Stripe Connect
- ✅ Walker vetting system operational
- ✅ Production deployment to TestFlight and Google Play Console

---

## User Review Required

> [!IMPORTANT]
> **Database Design Decision**
> Using Supabase (PostgreSQL) with Row-Level Security (RLS) for all data access. This provides strong security guarantees but requires careful policy design and testing. Alternative would be custom backend API with application-layer auth. See [System Analysis](../analysis/system-analysis.md) for full trade-off details.
> Using Supabase (PostgreSQL) with Row-Level Security (RLS) for all data access. This provides strong security guarantees but requires careful policy design and testing. Alternative would be custom backend API with application-layer auth. See [System Analysis](../analysis/system-analysis.md#trade-off-analysis) for full trade-off details.

> [!IMPORTANT]
> **Real-time Architecture**
> GPS updates every 5-10 seconds will cause increased battery drain for walkers. This is a known trade-off for premium UX. We can optimize post-MVP with adaptive update frequency.

> [!WARNING]
> **Payment Processing**
> Using Stripe Connect Standard accounts for walkers means Stripe handles all KYC/compliance, but we pay higher fees (~2.9% + $0.30 per transaction + additional Connect fees). This is non-negotiable for legal/compliance reasons.

> [!WARNING]
> **Independent Contractor Classification**
> Walkers must be properly classified as independent contractors, not employees. Legal consultation required before launch to ensure platform compliance with gig economy laws.

> [!CAUTION]
> **Liability Insurance**
> Platform must secure comprehensive liability insurance covering pet injuries, property damage, and walker incidents before accepting first booking. Estimated cost: $5K-15K annually.

---

## Development Guidelines & Tool Usage

> [!IMPORTANT]
> **MCP Tool Integration & Best Practices**
> This project uses Model Context Protocol (MCP) tools for code quality, documentation, and monitoring. All developers must follow these guidelines.

### Context7 MCP - Code Generation & Documentation

**When to Use:** ALWAYS for code generation, setup/configuration steps, or library/API documentation

**Automatic Usage Required For:**
- Generating code from specifications
- Setting up new libraries or frameworks
- Accessing library documentation (Expo, React Native, Supabase, Stripe)
- Configuration file examples
- API reference lookups

**Example Scenarios:**
```typescript
// ✅ CORRECT: When implementing Expo Location tracking
// Use Context7 to get latest Expo Location API documentation
// Context7 will provide accurate method signatures and best practices

// ✅ CORRECT: When setting up Stripe Connect
// Use Context7 to resolve Stripe SDK library ID and get docs
// Ensures using correct API version and parameters
```

**Benefits:**
- Always get latest, accurate library documentation
- Avoid deprecated API usage
- Follow official best practices
- Reduce integration errors

---

### Codacy MCP - Code Quality & Security

**When to Use:** ALWAYS for code review, quality checks, linting, static analysis, or security issues

**Automatic Usage Required For:**
- Code review requests ("Is this code correct?")
- Security validation ("Is this safe?")
- Best practices verification ("Does this follow standards?")
- Pre-commit quality checks
- Pull request reviews

**Example Scenarios:**
```typescript
// ✅ CORRECT: Before committing authentication code
// Run Codacy analysis to check for:
// - Security vulnerabilities (SQL injection, XSS)
// - Code complexity issues
// - Type safety violations
// - Best practice violations

// ✅ CORRECT: When reviewing payment processing code
// Use Codacy to verify:
// - No sensitive data exposure
// - Proper error handling
// - Input validation present
```

**Quality Standards:**
- **Complexity:** Keep cyclomatic complexity < 10
- **Security:** Zero high/critical vulnerabilities
- **Coverage:** Aim for >80% code coverage
- **Duplication:** < 3% code duplication

---

### Sentry MCP - Error Monitoring & Debugging

**When to Use:** ALWAYS for errors, crashes, performance issues, release health, or production behavior

**Automatic Usage Required For:**
- Error investigation ("What went wrong?")
- Crash reports ("Why did the app crash?")
- Performance debugging ("Why is this slow?")
- Release health monitoring ("How is the new version performing?")
- Event details and stack traces
- Production behavior analysis

**Example Scenarios:**
```typescript
// ✅ CORRECT: When user reports app crash
// Query Sentry for:
// - Recent crash events
// - Stack traces
// - Device/OS information
// - Release version affected

// ✅ CORRECT: Monitoring payment processing issues
// Use Sentry to track:
// - Payment intent failures
// - Stripe webhook errors
// - Transaction success rates
```

**Setup Requirements:**
```typescript
// Initialize Sentry in app entry point
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0, // Adjust for production
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
});
```

---

### TypeScript Type Safety Standards

> [!WARNING]
> **No `any` Types Allowed**
> Using `any` disables TypeScript's type checking and hides potential bugs. ALWAYS use `unknown` instead and implement proper type guards.

#### ❌ INCORRECT - Using `any`
```typescript
// BAD: Disables all type checking
function processData(data: any) {
  return data.value.toUpperCase(); // Runtime error if data.value isn't a string
}

// BAD: Untyped API responses
const response: any = await fetch('/api/walks');
```

#### ✅ CORRECT - Using `unknown` with Type Guards
```typescript
// GOOD: Type guard for API response
interface WalkRequest {
  id: string;
  pet_id: string;
  duration_minutes: number;
}

function isWalkRequest(value: unknown): value is WalkRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.pet_id === 'string' &&
    typeof obj.duration_minutes === 'number'
  );
}

// Usage
async function fetchWalkRequest(id: string): Promise<WalkRequest> {
  const response = await fetch(`/api/walks/${id}`);
  const data: unknown = await response.json();
  
  if (!isWalkRequest(data)) {
    throw new Error('Invalid walk request data');
  }
  
  return data; // Now safely typed as WalkRequest
}
```

#### Type Guard Patterns

**1. Object Type Guards**
```typescript
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
```

**2. Array Type Guards**
```typescript
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}
```

**3. Supabase Response Type Guards**
```typescript
import { PostgrestError } from '@supabase/supabase-js';

function isPostgrestError(error: unknown): error is PostgrestError {
  if (!isObject(error)) {
    return false;
  }
  return (
    'message' in error && typeof error.message === 'string' &&
    'code' in error && typeof error.code === 'string' &&
    'details' in error && typeof error.details === 'string'
  );
}

// Usage in error handling
try {
  const { data, error } = await supabase.from('pets').select();
  
  if (error) {
    if (isPostgrestError(error)) {
      console.error(`DB Error [${error.code}]: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
  }
} catch (err: unknown) {
  // Handle unknown errors safely
  console.error('Unexpected error:', err);
}
```

**4. Stripe Response Type Guards**
```typescript
interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

function isStripePaymentIntent(value: unknown): value is StripePaymentIntent {
  if (!isObject(value)) {
    return false;
  }
  return (
    typeof value.id === 'string' &&
    typeof value.amount === 'number' &&
    typeof value.currency === 'string' &&
    typeof value.status === 'string' &&
    typeof value.client_secret === 'string'
  );
}
```

#### Codacy Integration
All code using `unknown` with type guards should pass Codacy's type safety checks. Run Codacy before committing:
```bash
# Codacy will verify:
# ✅ No 'any' types used
# ✅ Type guards properly implemented
# ✅ All unknown values checked before use
```

---

### Tool Integration Workflow

**Development Cycle:**
```
1. Design (Spec Kit) → Use existing specifications
2. Generate Code (Context7) → Get library docs, generate boilerplate
3. Implement (TypeScript) → Use unknown + type guards, no any
4. Review (Codacy) → Check quality, security, best practices
5. Test (Jest/Detox) → Run automated tests
6. Deploy (EAS Build) → Build and release
7. Monitor (Sentry) → Track errors, performance, health
```

**Pre-Commit Checklist:**
- [ ] Context7 used for any new library integrations
- [ ] No `any` types (Codacy will flag these)
- [ ] All `unknown` values have type guards
- [ ] Codacy analysis passes (0 critical issues)
- [ ] Unit tests pass
- [ ] Sentry configured for error tracking

---

## Proposed Changes

### Authentication & User Management Component

#### [MODIFY] [app/_layout.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/_layout.tsx)
**Changes:**
- Add session guard using `useAuthStore`
- Implement role-based redirect logic (owner vs walker)
- Add onboarding status check
- Handle Supabase auth state changes

**Implementation:**
```typescript
// Pseudo-code structure
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      // Fetch user profile
      // Check role and onboarding status
      // Redirect to appropriate dashboard
    } else {
      router.replace('/(public)/login')
    }
  })
  return () => subscription.unsubscribe()
}, [])
```

---

#### [NEW] [stores/useAuthStore.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/stores/useAuthStore.ts)
**Purpose:** Zustand store for authentication state

**State:**
- `session`: Supabase session object
- `user`: User profile data
- `role`: 'owner' | 'walker' | 'admin'
- `loading`: boolean
- `isOnboarded`: boolean

**Actions:**
- `signIn(email, password)`
- `signUp(email, password, role)`
- `signOut()`
- `fetchProfile()`
- `updateProfile(data)`

---

#### [NEW] [app/(public)/login.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(public)/login.tsx)
**Features:**
- Email/password login form
- 2FA support
- "Forgot password" link
- Sign up navigation
- Social auth (Google, Apple) - optional MVP

---

#### [NEW] [app/(public)/signup.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(public)/signup.tsx)
**Features:**
- Role selection (Owner vs Walker)
- Email/password registration
- Terms of service acceptance
- Email verification flow

---

### Pet Management Component (Owner-specific)

#### [NEW] [app/(auth)/(owner)/pets.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(owner)/pets.tsx)
**Features:**
- Display list of owner's pets with photos
- "Add Pet" button
- Edit/delete pet actions
- Pet details view

---

#### [NEW] [stores/usePetStore.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/stores/usePetStore.ts)
**State:**
- `pets`: Pet[]
- `selectedPet`: Pet | null
- `loading`: boolean

**Actions:**
- `fetchPets()`
- `addPet(petData)`
- `updatePet(id, data)`
- `deletePet(id)`
- `selectPet(id)`

---

#### [NEW] [components/PetCard.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/components/PetCard.tsx)
**Purpose:** Reusable pet display card

**Props:**
- `pet`: Pet object
- `onPress`: () => void
- `onEdit`: () => void
- `onDelete`: () => void

---

### Walk Request & Matching Component

#### [NEW] [app/(auth)/(owner)/dashboard.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(owner)/dashboard.tsx)
**Features:**
- Active walk status display
- "Request Walk" button
- Recent walks history
- Upcoming scheduled walks

---

#### [NEW] [app/(auth)/(owner)/request-walk.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(owner)/request-walk.tsx)
**Flow:**
1. Pet selection
2. Duration selection (30/45/60 min)
3. Time selection (now/scheduled)
4. Price display
5. Confirm request
6. Loading state (finding walker...)
7. Match found → Navigate to tracking screen

---

#### [NEW] [stores/useWalkRequestStore.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/stores/useWalkRequestStore.ts)
**State:**
- `status`: 'idle' | 'requesting' | 'matched' | 'in_progress' | 'completed'
- `activeRequest`: WalkRequest | null
- `activeAssignment`: WalkAssignment | null
- `walkerDetails`: Walker | null

**Actions:**
- `createRequest(requestData)`
- `cancelRequest()`
- `subscribeToAssignments()`

**Realtime Subscriptions:**
```typescript
supabase
  .channel('walk_assignments')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'walk_assignments',
    filter: `walk_request_id=eq.${requestId}`
  }, (payload) => {
    // Walker matched!
    setStatus('matched')
    setActiveAssignment(payload.new)
  })
  .subscribe()
```

---

### Walker Job Management Component

#### [NEW] [app/(auth)/(walker)/dashboard.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(walker)/dashboard.tsx)
**Features:**
- Online/offline toggle
- Incoming request notifications
- Active walk status
- Today's earnings display
- Upcoming scheduled walks

---

#### [NEW] [app/(auth)/(walker)/job-request.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(walker)/job-request.tsx)
**Features:**
- Request details (pet info, location, duration, pay)
- 30-second countdown timer
- Accept button
- Reject button
- Map showing pickup location

---

#### [NEW] [stores/useWalkerAvailabilityStore.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/stores/useWalkerAvailabilityStore.ts)
**State:**
- `isOnline`: boolean
- `availableRequests`: WalkRequest[]
- `currentLocation`: { lat, lng } | null

**Actions:**
- `toggleOnline()`
- `fetchAvailableRequests()`
- `acceptRequest(requestId)`
- `rejectRequest(requestId)`

**Realtime Subscriptions:**
```typescript
supabase
  .channel('walk_requests')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'walk_requests',
    filter: `status=eq.pending`
  }, (payload) => {
    // New request available!
    // Check if within radius and notify walker
  })
  .subscribe()
```

---

### GPS Tracking Component

#### [NEW] [app/(auth)/(shared)/tracking.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(shared)/tracking.tsx)
**Features:**
- Full-screen map view
- Walker's current position marker
- Live polyline showing route
- Distance and duration display
- "End Walk" button (walker only)
- Chat button

---

#### [NEW] [stores/useTrackingStore.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/stores/useTrackingStore.ts)
**State:**
- `coordinates`: Array<{lat, lng, timestamp}>
- `distance`: number (meters)
- `duration`: number (seconds)
- `isTracking`: boolean

**Actions:**
- `startTracking()`
- `stopTracking()`
- `addCoordinate({lat, lng, timestamp})`
- `clearCoordinates()`
- `subscribeToWalkTracking(walkId)`

**Walker GPS Tracking:**
```typescript
// Start background location tracking
const subscription = await Location.watchPositionAsync(
  {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000, // 5 seconds
    distanceInterval: 10 // 10 meters
  },
  (location) => {
    const { latitude, longitude } = location.coords
    // Insert to walk_locations table
    supabase.from('walk_locations').insert({
      walk_assignment_id: assignmentId,
      lat: latitude,
      lng: longitude,
      timestamp: new Date().toISOString()
    })
  }
)
```

**Owner Tracking Subscription:**
```typescript
supabase
  .channel(`walk_tracking:${assignmentId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'walk_locations',
    filter: `walk_assignment_id=eq.${assignmentId}`
  }, (payload) => {
    addCoordinate(payload.new)
  })
  .subscribe()
```

---

### Payment Integration Component

#### [NEW] [app/(auth)/(owner)/payment-methods.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(owner)/payment-methods.tsx)
**Features:**
- List of saved cards
- Add new card (Stripe Payment Sheet)
- Set default payment method
- Delete payment method

---

#### [NEW] [stores/usePaymentsStore.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/stores/usePaymentsStore.ts)
**State:**
- `paymentMethods`: PaymentMethod[]
- `defaultMethod`: string | null

**Actions:**
- `fetchPaymentMethods()`
- `addPaymentMethod()`
- `deletePaymentMethod(id)`
- `setDefaultMethod(id)`

---

#### [NEW] [supabase/functions/create-payment-intent/index.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/functions/create-payment-intent/index.ts)
**Purpose:** Edge function to create Stripe Payment Intent

**Flow:**
1. Receive walk assignment ID
2. Calculate total amount (walk duration × rate)
3. Calculate platform fee (20%)
4. Create Payment Intent with application_fee_amount
5. Return client_secret to app

**Example:**
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // $20.00
  currency: 'usd',
  application_fee_amount: 400, // $4.00 platform fee
  transfer_data: {
    destination: walkerStripeAccountId, // Walker's connected account
  },
  metadata: {
    walk_assignment_id: assignmentId
  }
})
```

---

#### [NEW] [supabase/functions/stripe-webhook/index.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/functions/stripe-webhook/index.ts)
**Purpose:** Handle Stripe webhook events

**Events:**
- `payment_intent.succeeded`: Update payment record, mark walk as paid
- `payout.paid`: Update walker payout record
- `account.updated`: Sync walker verification status

---

### Messaging Component

#### [NEW] [app/(auth)/(shared)/chat.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(shared)/chat.tsx)
**Features:**
- Message list (scrollable)
- Text input
- Send button
- Real-time message delivery
- Typing indicators (optional MVP)

---

#### [NEW] [stores/useMessagingStore.ts](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/stores/useMessagingStore.ts)
**State:**
- `messages`: Message[]
- `loading`: boolean

**Actions:**
- `fetchMessages(walkId)`
- `sendMessage(walkId, text)`
- `subscribeToMessages(walkId)`

**Realtime:**
```typescript
supabase
  .channel(`messages:${walkId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `walk_assignment_id=eq.${walkId}`
  }, (payload) => {
    addMessage(payload.new)
  })
  .subscribe()
```

---

### Rating & Review Component

#### [NEW] [app/(auth)/(owner)/rate-walker.tsx](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/app/(auth)/(owner)/rate-walker.tsx)
**Features:**
- 5-star rating selector
- Optional text review
- Submit button
- Walk summary display

**Flow:**
1. Automatically presented after walk completion
2. Owner selects rating (1-5 stars)
3. Optionally adds text review
4. Submits rating
5. Updates walker's average rating
6. Returns to dashboard

---

## Database Schema & Migrations

### Migration Strategy
All database changes will be managed via Supabase CLI migrations:
```bash
supabase migration new <name>
supabase db push
```

---

### [NEW] [supabase/migrations/001_create_users_and_profiles.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/001_create_users_and_profiles.sql)

```sql
-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'walker', 'admin')) NOT NULL,
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Owner profiles
CREATE TABLE public.owner_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Walker profiles
CREATE TABLE public.walker_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  service_radius_km INTEGER DEFAULT 5,
  is_verified BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  last_known_location GEOGRAPHY(POINT, 4326),
  stripe_account_id TEXT,
  average_rating DECIMAL(5,2) DEFAULT 0,
  total_rating_points INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_walks INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_walker_profiles_location ON public.walker_profiles USING GIST(last_known_location);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walker_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Owner can read own profile"
  ON public.owner_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Walker can read own profile"
  ON public.walker_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read verified walker profiles"
  ON public.walker_profiles FOR SELECT
  USING (is_verified = true);
```

---

### [NEW] [supabase/migrations/002_create_pets.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/002_create_pets.sql)

```sql
CREATE TABLE public.pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  weight_kg DECIMAL(5,2),
  temperament TEXT,
  medical_notes TEXT,
  special_instructions TEXT,
  photo_urls TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  vet_name TEXT,
  vet_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own pets"
  ON public.pets FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Walker can read pet details for assigned walks"
  ON public.pets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.walk_assignments wa
      JOIN public.walk_requests wr ON wa.walk_request_id = wr.id
      WHERE wr.pet_id = pets.id
        AND wa.assigned_walker_id = auth.uid()
    )
  );
```

---

### [NEW] [supabase/migrations/003_create_walk_requests.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/003_create_walk_requests.sql)

```sql
CREATE TYPE walk_status AS ENUM (
  'pending', 'matched', 'accepted', 'in_progress', 'completed', 'cancelled'
);

CREATE TABLE public.walk_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  status walk_status DEFAULT 'pending',
  duration_minutes INTEGER NOT NULL,
  scheduled_time TIMESTAMPTZ,
  pickup_location GEOGRAPHY(POINT, 4326) NOT NULL,
  pickup_address TEXT,
  special_instructions TEXT,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_walk_requests_status ON public.walk_requests(status);
CREATE INDEX idx_walk_requests_location ON public.walk_requests USING GIST(pickup_location);

ALTER TABLE public.walk_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own requests"
  ON public.walk_requests FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Walker can read nearby pending requests"
  ON public.walk_requests FOR SELECT
  USING (
    status = 'pending' AND
    EXISTS (
      SELECT 1 FROM public.walker_profiles wp
      WHERE wp.user_id = auth.uid()
        AND wp.is_verified = true
        AND wp.is_online = true
        AND ST_DWithin(
          pickup_location,
          wp.last_known_location,
          wp.service_radius_km * 1000
        )
    )
  );
```

---

### [NEW] [supabase/migrations/004_create_walk_assignments.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/004_create_walk_assignments.sql)

```sql
CREATE TABLE public.walk_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  walk_request_id UUID REFERENCES public.walk_requests(id) ON DELETE CASCADE UNIQUE,
  assigned_walker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  walker_notes TEXT,
  total_distance_meters INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.walk_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read assignments for their requests"
  ON public.walk_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.walk_requests wr
      WHERE wr.id = walk_request_id
        AND wr.owner_id = auth.uid()
    )
  );

CREATE POLICY "Walker can manage own assignments"
  ON public.walk_assignments FOR ALL
  USING (auth.uid() = assigned_walker_id);
```

---

### [NEW] [supabase/migrations/005_create_walk_locations.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/005_create_walk_locations.sql)

```sql
CREATE TABLE public.walk_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  walk_assignment_id UUID REFERENCES public.walk_assignments(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  accuracy_meters DECIMAL(6, 2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_walk_locations_assignment ON public.walk_locations(walk_assignment_id);
CREATE INDEX idx_walk_locations_time ON public.walk_locations(recorded_at);

ALTER TABLE public.walk_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Walker can insert locations for own walks"
  ON public.walk_locations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.walk_assignments wa
      WHERE wa.id = walk_assignment_id
        AND wa.assigned_walker_id = auth.uid()
    )
  );

CREATE POLICY "Owner and walker can read walk locations"
  ON public.walk_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.walk_assignments wa
      JOIN public.walk_requests wr ON wa.walk_request_id = wr.id
      WHERE wa.id = walk_assignment_id
        AND (wr.owner_id = auth.uid() OR wa.assigned_walker_id = auth.uid())
    )
  );
```

---

### [NEW] [supabase/migrations/006_create_payments.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/006_create_payments.sql)

```sql
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  walk_assignment_id UUID REFERENCES public.walk_assignments(id) ON DELETE CASCADE UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  walker_earnings_cents INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read payment for their walks"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.walk_assignments wa
      JOIN public.walk_requests wr ON wa.walk_request_id = wr.id
      WHERE wa.id = walk_assignment_id
        AND wr.owner_id = auth.uid()
    )
  );

CREATE POLICY "Walker can read payment for own walks"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.walk_assignments wa
      WHERE wa.id = walk_assignment_id
        AND wa.assigned_walker_id = auth.uid()
    )
  );
```

---

### [NEW] [supabase/migrations/007_create_reviews.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/007_create_reviews.sql)

```sql
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  walk_assignment_id UUID REFERENCES public.walk_assignments(id) ON DELETE CASCADE UNIQUE,
  walker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can create review for their walks"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Trigger to update walker average rating (incremental aggregation)
CREATE OR REPLACE FUNCTION update_walker_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.walker_profiles
  SET 
    total_rating_points = total_rating_points + NEW.rating,
    total_reviews = total_reviews + 1,
    average_rating = CASE 
      WHEN total_reviews + 1 > 0 THEN ((total_rating_points + NEW.rating)::DECIMAL / (total_reviews + 1))::DECIMAL(3,2)
      ELSE 0
    END,
    total_walks = total_walks + 1
  WHERE user_id = NEW.walker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_walker_rating
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_walker_rating();
```

---

### [NEW] [supabase/migrations/008_create_messages.sql](file:///c:/Users/slluser/Desktop/Dog-Walker/dogwalker/DogWalker/DogWalker/supabase/migrations/008_create_messages.sql)

```sql
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  walk_assignment_id UUID REFERENCES public.walk_assignments(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_assignment ON public.messages(walk_assignment_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.walk_assignments wa
      JOIN public.walk_requests wr ON wa.walk_request_id = wr.id
      WHERE wa.id = walk_assignment_id
        AND (wr.owner_id = auth.uid() OR wa.assigned_walker_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.walk_assignments wa
      JOIN public.walk_requests wr ON wa.walk_request_id = wr.id
      WHERE wa.id = walk_assignment_id
        AND (wr.owner_id = auth.uid() OR wa.assigned_walker_id = auth.uid())
    )
  );
```

---

## Verification Plan

### Automated Tests

#### Unit Tests
```bash
# Run Jest unit tests
npm test

# Tests covering:
# - Zustand stores (useAuthStore, usePetStore, etc.)
# - Utility functions (distance calculations, formatting)
# - Component rendering (PetCard, MessageBubble, etc.)
```

#### Integration Tests
```bash
# Supabase RLS policy tests
supabase test db

# Tests covering:
# - Owners can only see their own pets
# - Walkers can only see nearby pending requests
# - Payment records are correctly restricted
# - Message access is limited to participants
```

#### Edge Function Tests
```bash
# Test Stripe payment intent creation
deno test supabase/functions/create-payment-intent/index.test.ts

# Test Stripe webhook signature validation
deno test supabase/functions/stripe-webhook/index.test.ts
```

#### E2E Tests (Detox)
```bash
# iOS simulator
npm run e2e:ios

# Android emulator
npm run e2e:android

# Test flows:
# - Owner signup → Add pet → Request walk
# - Walker signup → Go online → Accept request → Complete walk
# - GPS tracking updates in real-time
# - Payment processing after walk completion
# - Rating submission
```

---

### Manual Verification

#### Browser Testing (Expo)
1. Start Expo dev server: `npx expo start`
2. Test on iOS simulator (Xcode)
3. Test on Android emulator (Android Studio)
4. Verify real device testing via Expo Go app

#### Stripe Testing
1. Use Stripe test mode with test card: `4242 4242 4242 4242`
2. Create test walker Connected Account
3. Simulate successful payment flow
4. Verify webhook events received and processed
5. Check payment records in database

#### GPS Tracking Testing
1. Use location simulation in Xcode/Android Studio
2. Simulate walk route with multiple waypoints
3. Verify polyline updates in real-time on owner's map
4. Check `walk_locations` table for accurate data
5. Measure latency between walker movement and owner display

#### Real-time Testing
1. Test with 2 devices (owner + walker)
2. Verify walk request appears instantly for walker
3. Verify match notification appears for owner
4. Test messaging between owner and walker
5. Measure WebSocket latency

---

### Deployment & Launch Checklist

#### Pre-Launch
- [ ] All database migrations applied to production Supabase instance
- [ ] All RLS policies tested and validated
- [ ] Stripe webhooks configured with production endpoint
- [ ] Environment variables set in production (API keys, secrets)
- [ ] Push notification certificates configured (iOS APN, Android FCM)
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics configured (optional: Mixpanel, Amplitude)

#### App Store Submission
- [ ] App icon and splash screen finalized
- [ ] App Store screenshots and preview videos created
- [ ] App Store description and keywords optimized (ASO)
- [ ] Privacy policy and terms of service published
- [ ] TestFlight build submitted for internal testing
- [ ] Google Play Console build submitted for internal testing

#### Beta Testing
- [ ] Recruit 10-20 beta testers (mix of owners and walkers)
- [ ] Monitor crash reports and user feedback
- [ ] Fix critical bugs
- [ ] Release updated build

#### Production Launch
- [ ] Submit final build to App Store and Google Play
- [ ] Monitor approval status
- [ ] Prepare launch marketing materials
- [ ] Set up customer support channels
- [ ] Launch to production 🚀

---

**Document Owner:** Technical Lead  
**Reviewers:** Product Manager, QA Lead  
**Status:** Ready for Implementation
