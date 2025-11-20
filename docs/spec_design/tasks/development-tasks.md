# Dog Walker App - Development Tasks
**Project:** Dog Walker MVP  
**Version:** 1.0  
**Timeline:** 8 weeks (4 x 2-week sprints)  
**Last Updated:** November 20, 2025

---

## Overview

This document breaks down the Dog Walker MVP implementation into prioritized, actionable tasks organized by 2-week sprints. Each task includes acceptance criteria and estimated effort.

### Task Legend
- ⏱️ **Effort:** S (Small: 0.5-1 day), M (Medium: 1-3 days), L (Large: 3-5 days)
- 🎯 **Priority:** P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- 📦 **Type:** FE (Frontend), BE (Backend), INFRA (Infrastructure), TEST (Testing)

---

## Sprint 1: Foundation & Authentication (Weeks 1-2)

### Infrastructure Setup

- [ ] **INFRA-001: Initialize Supabase Project** ⏱️ S | 🎯 P0
  - Create Supabase project on supabase.com
  - Note project URL and anon key
  - Configure project settings (timezone, region)
  - **Acceptance:** Supabase dashboard accessible

- [ ] **INFRA-002: Set Up Database Migrations** ⏱️ S | 🎯 P0
  - Install Supabase CLI: `npm install -g supabase`
  - Initialize Supabase locally: `supabase init`
  - Link to remote project: `supabase link`
  - **Acceptance:** `supabase status` shows connected project

- [ ] **INFRA-003: Configure Stripe Account** ⏱️ M | 🎯 P0
  - Create Stripe account
  - Enable Stripe Connect (Standard accounts)
  - Get API keys (publishable, secret, webhook secret)
  - Configure webhook endpoint (create placeholder)
  - **Acceptance:** Stripe dashboard shows test mode active

- [ ] **INFRA-004: Set Up CI/CD Pipeline** ⏱️ M | 🎯 P1
  - Create GitHub Actions workflow (`.github/workflows/ci.yml`)
  - Add lint, typecheck, and test steps
  - Configure EAS Build for automated builds
  - **Acceptance:** PR triggers automated checks

- [ ] **INFRA-005: Configure Sentry Error Monitoring** ⏱️ M | 🎯 P0
  - Create Sentry account and project
  - Install `@sentry/react-native` package
  - Initialize Sentry in `app/_layout.tsx`
  - Configure DSN and environment settings
  - Test error reporting with sample error
  - **Acceptance:** Errors appear in Sentry dashboard

- [ ] **INFRA-006: Set Up Codacy Integration** ⏱️ S | 🎯 P1
  - Connect GitHub repository to Codacy
  - Configure code quality gates (complexity < 10, no critical issues)
  - Set up PR checks for Codacy analysis
  - Review and fix initial code quality issues
  - **Acceptance:** Codacy analyzes PRs automatically

- [ ] **INFRA-007: Configure TypeScript Strict Mode** ⏱️ M | 🎯 P0
  - Update `tsconfig.json` with strict settings
  - Enable `strict: true`, `noImplicitAny: true`
  - Add ESLint rule: `@typescript-eslint/no-explicit-any: error`
  - Create `utils/typeGuards.ts` with common type guard functions
  - **Acceptance:** TypeScript catches `any` usage, build fails on type errors

---

### Database Schema (Core Tables)

- [ ] **BE-001: Create Users & Profiles Migration** ⏱️ M | 🎯 P0
  - Run: `supabase migration new users_and_profiles`
  - Implement `users`, `owner_profiles`, `walker_profiles` tables
  - Add RLS policies for profile access
  - Test with `supabase db push`
  - **Acceptance:** Tables visible in Supabase dashboard, RLS policies active

- [ ] **BE-002: Create Pets Table Migration** ⏱️ S | 🎯 P0
  - Run: `supabase migration new pets`
  - Implement `pets` table with all fields
  - Add RLS policies (owner can CRUD own pets)
  - **Acceptance:** Can insert/query pets via SQL editor

- [ ] **BE-003: Create Walk Requests Migration** ⏱️ M | 🎯 P0
  - Run: `supabase migration new walk_requests`
  - Implement `walk_requests` table
  - Add PostGIS extension for location queries
  - Add indexes on `status` and `pickup_location`
  - Add RLS policies
  - **Acceptance:** Can create walk requests, location queries work

- [ ] **BE-004: Create Walk Assignments Migration** ⏱️ S | 🎯 P0
  - Run: `supabase migration new walk_assignments`
  - Implement `walk_assignments` table
  - Add RLS policies
  - **Acceptance:** Can assign walks to walkers

---

### Authentication & User Management

- [ ] **FE-001: Create Auth Store (Zustand)** ⏱️ M | 🎯 P0
  - Create `stores/useAuthStore.ts`
  - Implement state: `session`, `user`, `role`, `loading`
  - Implement actions: `signIn`, `signUp`, `signOut`, `fetchProfile`
  - Add Supabase auth state listener
  - **Acceptance:** Store updates on login/logout

- [ ] **FE-002: Create Login Screen** ⏱️ M | 🎯 P0
  - Create `app/(public)/login.tsx`
  - Build email/password form
  - Integrate with `useAuthStore.signIn()`
  - Add error handling and loading states
  - Add "Forgot Password" and "Sign Up" links
  - **Acceptance:** Can log in with test account

- [ ] **FE-003: Create Signup Screen** ⏱️ M | 🎯 P0
  - Create `app/(public)/signup.tsx`
  - Add role selection (Owner vs Walker)
  - Build email/password registration form
  - Integrate with `useAuthStore.signUp()`
  - Trigger email verification
  - **Acceptance:** Can create new account

- [ ] **FE-004: Implement Session Guard** ⏱️ M | 🎯 P0
  - Modify `app/_layout.tsx`
  - Add auth state check on app mount
  - Redirect to login if no session
  - Redirect to appropriate dashboard based on role
  - **Acceptance:** Unauthenticated users redirected to login

- [ ] **FE-005: Create Owner Onboarding Flow** ⏱️ L | 🎯 P0
  - Create `app/(auth)/onboarding/owner/index.tsx`
  - Collect: full name, phone, address
  - Save to `owner_profiles` table
  - Mark `is_onboarded = true`
  - **Acceptance:** New owner completes profile setup

- [ ] **FE-006: Create Walker Onboarding Flow** ⏱️ L | 🎯 P0
  - Create `app/(auth)/onboarding/walker/index.tsx`
  - Collect: full name, phone, bio, experience
  - Submit for verification (status: `pending`)
  - **Acceptance:** Walker application submitted

---

### Testing & Verification (Sprint 1)

- [ ] **TEST-001: Write Auth Store Unit Tests** ⏱️ S | 🎯 P1
  - Test `signIn` success and error cases
  - Test `signUp` flow
  - Test `signOut` clears state
  - **Acceptance:** `npm test` passes for auth store

- [ ] **TEST-002: Test RLS Policies** ⏱️ M | 🎯 P0
  - Write SQL tests for each RLS policy
  - Verify owners can't see other owners' pets
  - Verify walkers can't modify other profiles
  - **Acceptance:** `supabase test db` passes

---

## Sprint 2: Pet Management & Walk Requests (Weeks 3-4)

### Pet Management (Owner)

- [ ] **FE-007: Create Pet Store (Zustand)** ⏱️ S | 🎯 P0
  - Create `stores/usePetStore.ts`
  - Implement state: `pets[]`, `selectedPet`, `loading`
  - Implement actions: `fetchPets`, `addPet`, `updatePet`, `deletePet`
  - **Acceptance:** Store syncs with database

- [ ] **FE-008: Create Pets List Screen** ⏱️ M | 🎯 P0
  - Create `app/(auth)/(owner)/pets.tsx`
  - Display list of owner's pets with photos
  - Add "Add Pet" button
  - Add edit/delete actions
  - **Acceptance:** Can view all pets

- [ ] **FE-009: Create Add/Edit Pet Screen** ⏱️ M | 🎯 P0
  - Create `app/(auth)/(owner)/pet-form.tsx`
  - Build form with all pet fields
  - Add photo upload to Supabase Storage
  - Integrate with `usePetStore`
  - **Acceptance:** Can add and edit pets

- [ ] **FE-010: Create PetCard Component** ⏱️ S | 🎯 P1
  - Create `components/PetCard.tsx`
  - Display pet photo, name, breed, age
  - Make component reusable
  - **Acceptance:** PetCard renders correctly

---

### Walk Request System

- [ ] **FE-011: Create Walk Request Store** ⏱️ M | 🎯 P0
  - Create `stores/useWalkRequestStore.ts`
  - Implement state: `status`, `activeRequest`, `activeAssignment`
  - Implement actions: `createRequest`, `cancelRequest`
  - Add Realtime subscription for assignment updates
  - **Acceptance:** Store subscribes to walk_assignments channel

- [ ] **FE-012: Create Owner Dashboard** ⏱️ M | 🎯 P0
  - Create `app/(auth)/(owner)/dashboard.tsx`
  - Show active walk status
  - Add "Request Walk" button
  - Display recent walks
  - **Acceptance:** Dashboard shows correct data

- [ ] **FE-013: Create Request Walk Screen** ⏱️ L | 🎯 P0
  - Create `app/(auth)/(owner)/request-walk.tsx`
  - Add pet selection
  - Add duration selection (30/45/60 min)
  - Add time selection (now/scheduled)
  - Calculate and display price
  - Submit walk request to database
  - **Acceptance:** Can create walk request

- [ ] **BE-005: Implement Walk Matching Logic** ⏱️ L | 🎯 P0
  - Create database function: `match_walker_to_request()`
  - Filter by online status
  - Filter by radius (PostGIS `ST_DWithin`)
  - Sort by distance, rating, completion rate
  - Return best-matched walker
  - **Acceptance:** Function returns correct walker

- [ ] **BE-006: Create Walk Assignment Trigger** ⏱️ M | 🎯 P0
  - Create trigger on `walk_requests` INSERT
  - Call `match_walker_to_request()`
  - Create `walk_assignment` record
  - Broadcast to Realtime channel
  - **Acceptance:** New request auto-creates assignment

---

### Walker Job Management

- [ ] **FE-014: Create Walker Availability Store** ⏱️ M | 🎯 P0
  - Create `stores/useWalkerAvailabilityStore.ts`
  - Implement state: `isOnline`, `availableRequests[]`
  - Implement actions: `toggleOnline`, `acceptRequest`, `rejectRequest`
  - Add Realtime subscription for new requests
  - **Acceptance:** Walker receives request notifications

- [ ] **FE-015: Create Walker Dashboard** ⏱️ M | 🎯 P0
  - Create `app/(auth)/(walker)/dashboard.tsx`
  - Add online/offline toggle
  - Show incoming requests count
  - Display today's earnings
  - Show active walk
  - **Acceptance:** Dashboard updates in real-time

- [ ] **FE-016: Create Job Request Modal** ⏱️ L | 🎯 P0
  - Create `app/(auth)/(walker)/job-request.tsx`
  - Display request details (pet, location, duration, pay)
  - Add 30-second countdown timer
  - Add Accept button
  - Add Reject button
  - Show pickup location on map
  - **Acceptance:** Walker can accept/reject request

- [ ] **FE-017: Implement Request Timeout** ⏱️ M | 🎯 P1
  - Auto-reject request after 30 seconds
  - Rollover to next walker in queue
  - Update request status
  - **Acceptance:** Timeout logic works correctly

---

### Testing & Verification (Sprint 2)

- [ ] **TEST-003: Test Pet CRUD Operations** ⏱️ S | 🎯 P1
  - Test adding pet
  - Test editing pet
  - Test deleting pet
  - Verify RLS policies
  - **Acceptance:** All CRUD operations work

- [ ] **TEST-004: Test Walk Matching Algorithm** ⏱️ M | 🎯 P0
  - Create test data (multiple walkers at various distances)
  - Verify closest walker matched first
  - Verify offline walkers excluded
  - Verify rating priority
  - **Acceptance:** Matching logic verified

- [ ] **TEST-005: E2E Test: Owner Request Flow** ⏱️ M | 🎯 P1
  - Test: Login → Select pet → Request walk → Wait for match
  - Verify UI updates
  - Verify database records created
  - **Acceptance:** Detox test passes

---

## Sprint 3: GPS Tracking & Payments (Weeks 5-6)

### GPS Tracking System

- [ ] **BE-007: Create Walk Locations Migration** ⏱️ S | 🎯 P0
  - Run: `supabase migration new walk_locations`
  - Implement `walk_locations` table
  - Add indexes on `walk_assignment_id` and `recorded_at`
  - Add RLS policies
  - **Acceptance:** Can insert location points

- [ ] **FE-018: Create Tracking Store** ⏱️ M | 🎯 P0
  - Create `stores/useTrackingStore.ts`
  - Implement state: `coordinates[]`, `distance`, `duration`
  - Implement actions: `startTracking`, `stopTracking`, `addCoordinate`
  - Add Realtime subscription for location updates
  - **Acceptance:** Store accumulates GPS points

- [ ] **FE-019: Implement Walker GPS Tracking** ⏱️ L | 🎯 P0
  - Configure Expo Location permissions
  - Start background location tracking on "Start Walk"
  - Stream coordinates to database every 5-10 seconds
  - Calculate distance using Haversine formula
  - Stop tracking on "End Walk"
  - **Acceptance:** Walker location logged to database

- [ ] **FE-020: Create Tracking Map Screen** ⏱️ L | 🎯 P0
  - Create `app/(auth)/(shared)/tracking.tsx`
  - Integrate Google Maps / Apple MapKit
  - Display walker's current position marker
  - Render live polyline from coordinate array
  - Show distance and duration
  - Add "End Walk" button (walker only)
  - **Acceptance:** Owner sees live walk progress

- [ ] **FE-021: Implement Battery Optimization** ⏱️ M | 🎯 P1
  - Pause GPS updates if location unchanged for 30s
  - Use lower accuracy when stationary
  - Resume high accuracy on movement
  - **Acceptance:** Battery drain reduced

---

### Payment Integration

- [ ] **BE-008: Create Payments Migration** ⏱️ S | 🎯 P0
  - Run: `supabase migration new payments`
  - Implement `payments` table
  - Add RLS policies
  - **Acceptance:** Can insert payment records

- [ ] **BE-009: Create Payment Intent Edge Function** ⏱️ L | 🎯 P0
  - Create `supabase/functions/create-payment-intent/index.ts`
  - Integrate Stripe SDK
  - Calculate total amount and platform fee
  - Create Payment Intent with `application_fee_amount`
  - Return `client_secret`
  - **Acceptance:** Edge function returns valid Payment Intent

- [ ] **BE-010: Create Stripe Webhook Handler** ⏱️ L | 🎯 P0
  - Create `supabase/functions/stripe-webhook/index.ts`
  - Verify webhook signature
  - Handle `payment_intent.succeeded`
  - Update payment status in database
  - Handle `payout.paid`
  - **Acceptance:** Webhook events processed correctly

- [ ] **FE-022: Create Payments Store** ⏱️ M | 🎯 P0
  - Create `stores/usePaymentsStore.ts`
  - Implement state: `paymentMethods[]`, `defaultMethod`
  - Implement actions: `fetchPaymentMethods`, `addPaymentMethod`
  - **Acceptance:** Store syncs with Stripe

- [ ] **FE-023: Create Payment Methods Screen** ⏱️ M | 🎯 P0
  - Create `app/(auth)/(owner)/payment-methods.tsx`
  - Display saved cards
  - Integrate Stripe Payment Sheet
  - Add card via Stripe UI
  - Set default payment method
  - **Acceptance:** Can add and manage cards

- [ ] **FE-024: Implement Walk Completion Payment** ⏱️ L | 🎯 P0
  - Trigger payment on "End Walk"
  - Call `create-payment-intent` Edge Function
  - Confirm Payment Intent
  - Show payment success/failure
  - Update walk status to `completed`
  - **Acceptance:** Payment processed on walk completion

- [ ] **BE-011: Implement Weekly Walker Payouts** ⏱️ M | 🎯 P1
  - Create cron job (Supabase pg_cron)
  - Aggregate walker earnings for the week
  - Create Stripe Payout to walker's connected account
  - Log payout in database
  - **Acceptance:** Automated payouts work

---

### Testing & Verification (Sprint 3)

- [ ] **TEST-006: Test GPS Tracking Accuracy** ⏱️ M | 🎯 P0
  - Simulate walk route in emulator
  - Verify location points logged correctly
  - Measure latency (target: <1s)
  - Verify polyline renders correctly
  - **Acceptance:** GPS accurate within ±10m

- [ ] **TEST-007: Test Stripe Payment Flow** ⏱️ M | 🎯 P0
  - Use Stripe test card: `4242 4242 4242 4242`
  - Complete walk and trigger payment
  - Verify Payment Intent created
  - Verify webhook received
  - Verify payment record in database
  - **Acceptance:** End-to-end payment works

- [ ] **TEST-008: E2E Test: Complete Walk Flow** ⏱️ L | 🎯 P0
  - Test: Owner request → Walker accept → Start walk → GPS tracking → End walk → Payment → Rating
  - Verify all state transitions
  - Verify database records
  - **Acceptance:** Complete flow works end-to-end

---

## Sprint 4: Messaging, Ratings & Polish (Weeks 7-8)

### Messaging System

- [ ] **BE-012: Create Messages Migration** ⏱️ S | 🎯 P0
  - Run: `supabase migration new messages`
  - Implement `messages` table
  - Add indexes and RLS policies
  - **Acceptance:** Can insert messages

- [ ] **FE-025: Create Messaging Store** ⏱️ M | 🎯 P0
  - Create `stores/useMessagingStore.ts`
  - Implement state: `messages[]`, `loading`
  - Implement actions: `fetchMessages`, `sendMessage`
  - Add Realtime subscription
  - **Acceptance:** Messages sync in real-time

- [ ] **FE-026: Create Chat Screen** ⏱️ L | 🎯 P0
  - Create `app/(auth)/(shared)/chat.tsx`
  - Display message history
  - Add text input and send button
  - Auto-scroll to latest message
  - Show sender names and timestamps
  - **Acceptance:** Can send and receive messages

---

### Ratings & Reviews

- [ ] **BE-013: Create Reviews Migration** ⏱️ M | 🎯 P0
  - Run: `supabase migration new reviews`
  - Implement `reviews` table
  - Add trigger to update walker rating
  - Add RLS policies
  - **Acceptance:** Rating trigger updates walker profile

- [ ] **FE-027: Create Rate Walker Screen** ⏱️ M | 🎯 P0
  - Create `app/(auth)/(owner)/rate-walker.tsx`
  - Add 5-star rating selector
  - Add optional text review
  - Display walk summary
  - Submit rating to database
  - **Acceptance:** Can rate walker after walk

- [ ] **FE-028: Display Walker Ratings** ⏱️ S | 🎯 P1
  - Show average rating on walker profile
  - Display review count
  - Show recent reviews (3-5 latest)
  - **Acceptance:** Ratings visible on profile

---

### Admin Portal (Basic)

- [ ] **FE-029: Create Admin Login** ⏱️ S | 🎯 P1
  - Create admin-only login (check `role = 'admin'`)
  - Redirect to admin dashboard
  - **Acceptance:** Admin can access portal

- [ ] **FE-030: Create Walker Application Review Screen** ⏱️ M | 🎯 P1
  - Create `app/(auth)/(admin)/walker-applications.tsx`
  - Display pending walker applications
  - Show background check status
  - Add Approve/Reject buttons
  - Update `is_verified` status
  - **Acceptance:** Admin can approve walkers

---

### Polish & UX Improvements

- [ ] **FE-031: Add Push Notifications** ⏱️ M | 🎯 P0
  - Configure Expo push notifications
  - Send notification on walk match
  - Send notification on walk start/end
  - Send notification on new message
  - **Acceptance:** Push notifications work on device

- [ ] **FE-032: Add Loading States** ⏱️ M | 🎯 P1
  - Add skeleton loaders for lists
  - Add spinners for async actions
  - Add pull-to-refresh on dashboards
  - **Acceptance:** Loading UX is smooth

- [ ] **FE-033: Add Error Handling** ⏱️ M | 🎯 P1
  - Add global error boundary
  - Show user-friendly error messages
  - Add retry logic for failed requests
  - **Acceptance:** Errors handled gracefully

- [ ] **FE-034: Accessibility (A11y)** ⏱️ M | 🎯 P2
  - Add screen reader labels
  - Ensure sufficient color contrast
  - Add keyboard navigation support
  - Test with VoiceOver/TalkBack
  - **Acceptance:** Meets WCAG 2.1 Level AA

---

### Final Testing & Deployment

- [ ] **TEST-009: Load Testing** ⏱️ M | 🎯 P1
  - Simulate 1000 concurrent users
  - Test database query performance
  - Test Realtime channel limits
  - Identify bottlenecks
  - **Acceptance:** System handles target load

- [ ] **TEST-010: Security Audit** ⏱️ M | 🎯 P0
  - Review all RLS policies
  - Test unauthorized access attempts
  - Verify payment security
  - Check for SQL injection vulnerabilities
  - **Acceptance:** No critical security issues

- [ ] **INFRA-008: Production Deployment** ⏱️ L | 🎯 P0
  - Apply all migrations to production Supabase
  - Configure production Stripe webhooks
  - Set production environment variables
  - Deploy Edge Functions
  - **Acceptance:** Production environment ready

- [ ] **INFRA-009: App Store Submission** ⏱️ L | 🎯 P0
  - Build production app with EAS
  - Submit to TestFlight
  - Submit to Google Play Console (Internal Testing)
  - Monitor approval status
  - **Acceptance:** Apps submitted for review

---

## Post-Launch (Week 9+)

### Monitoring & Support

- [ ] **INFRA-010: Set Up Production Error Monitoring** ⏱️ M | 🎯 P0
  - Integrate Sentry for crash reporting
  - Set up error alerts
  - Create error dashboard
  - **Acceptance:** Errors tracked in Sentry

- [ ] **INFRA-011: Set Up Analytics** ⏱️ M | 🎯 P2
  - Integrate analytics (Mixpanel/Amplitude)
  - Track key events (signups, requests, completions)
  - Create analytics dashboard
  - **Acceptance:** User behavior tracked

---

## Summary

**Total Tasks:** 80+  
**Critical Path:** Infrastructure → Auth → Pets → Walk Requests → GPS → Payments → Ratings  
**Launch Blockers:** All P0 tasks must be completed  
**Nice-to-Haves:** P2-P3 tasks can be deferred to post-launch

---

**Document Owner:** Project Manager  
**Last Updated:** November 20, 2025  
**Sprint Start:** Week 1 of 8
