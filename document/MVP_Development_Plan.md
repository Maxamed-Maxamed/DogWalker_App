# **Dog Walker App - MVP Development Plan & Task Roadmap**

**Version:** 1.0  
**Created:** November 3, 2025  
**Project Type:** Pet Owner-Focused Dog Walking Service (Your Own Business)  
**Current Status:** Foundation Complete (15% MVP Ready)

---

## 📋 **Table of Contents**

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [MVP Feature Scope](#mvp-feature-scope)
4. [Development Phases](#development-phases)
5. [Detailed Task Breakdown](#detailed-task-breakdown)
6. [Technical Requirements](#technical-requirements)
7. [Database Schema](#database-schema)
8. [Success Metrics](#success-metrics)
9. [Risk Mitigation](#risk-mitigation)
10. [Launch Checklist](#launch-checklist)

---

## 🎯 **Executive Summary**

### **Business Model**
Dog Walker is YOUR local dog walking business where:
- You hire and vet 5-10 professional walkers
- Pet owners book walks through your app
- You control pricing, quality, and operations
- Target: Start local, prove model, then scale

### **Current Progress**
✅ **Complete (15%)**:
- Authentication system (login, signup, session management)
- Supabase backend integration
- Navigation structure (tabs, stacks)
- Onboarding experience
- Theme system
- State management (Zustand)

❌ **Missing (85%)**:
- Pet profile management
- Walker discovery & profiles
- Booking system
- Payment processing
- GPS tracking
- In-app messaging
- Ratings & reviews
- Walk history

### **MVP Timeline**
- **Phase 1 (Weeks 1-2):** Pet Profiles & Dashboard
- **Phase 2 (Weeks 3-4):** Walker Discovery & Booking
- **Phase 3 (Weeks 5-6):** Payment & Tracking
- **Phase 4 (Weeks 7-8):** Polish & Launch

**Target:** 8 weeks to functional MVP with first paying customers

---

## 📊 **Current State Analysis**

### ✅ **What You Have**

#### **Authentication & User Management**
- ✅ Supabase authentication integration
- ✅ Login screen with email/password
- ✅ Signup screen with name, email, password
- ✅ Auth store (Zustand) with session management
- ✅ Secure token storage (iOS SecureStore)
- ✅ Auto-restore sessions on app launch
- ⚠️ Forgot password (mock only, needs real implementation)

#### **Navigation & Routing**
- ✅ Expo Router with file-based routing
- ✅ Smart entry flow (Welcome → Login → Dashboard)
- ✅ Tab navigation (Dashboard, Explore tabs)
- ✅ Stack navigation for auth flows
- ✅ First-launch detection for onboarding

#### **UI & Components**
- ✅ Theme system (light/dark mode support)
- ✅ Themed components (ThemedView, ThemedText)
- ✅ Professional onboarding screens (5 slides with animations)
- ✅ Haptic feedback on interactions
- ✅ Icons and assets (newlogo, happydog)

---

## 🧱 **Architecture Inventory – November 14, 2025**

| Layer | Current Implementation | Notes |
| --- | --- | --- |
| Root layout | `app/_layout.tsx` hosts the global `Stack`, theme provider, splash overlay, and bootstrap wiring. Routing instrumentation registers with Sentry but no guards or initial route hints are configured. | Expo Router docs (Context7 `/expo/expo`, Common Navigation Patterns) recommend declaring `initialRouteName` / anchors to keep deep links behind auth gates. |
| Entry orchestration | `app/index.tsx` routes users after `useBootstrapStore` completes. Redirect logic prioritizes authenticated tabs, then onboarding, then auth screens. Failure surfaces a static error message. | Bootstrap phases (`initializing`, `ready`, `error`) are coarse and lack per-system diagnostics for AppState vs Auth. |
| Auth & welcome flows | `app/auth/_layout.tsx` and `app/welcome/_layout.tsx` mount simple stacks with hidden headers. Screens rely on router redirects rather than guarded stacks. | No modal presentation or anchoring; welcome stack manually enumerates `index` and `onboarding`. |
| Tab surface | `app/(tabs)/_layout.tsx` defines Dashboard, Pets, Explore tabs with shared Haptic tab button and themed colors. There is no linkage to `useNavigationStore`, so tab state is entirely local to React Navigation. | `unstable_settings` is not exported for the group, so deep links may skip essential entry steps. |
| State stores | `stores/bootstrapStore.ts`, `appStateStore.ts`, `authStore.ts`, `navigationStore.ts`, `splashScreenStore.tsx`, `petStore.ts` provide initialization, onboarding persistence, session restore, navigation tab tracking, splash visibility, and pet CRUD. | Stores follow ad-hoc contracts (e.g., `{phase,error}` vs `{isLoading,isInitialized}`), and only `bootstrapStore` coordinates sequencing. No selectors or shared `{loading,error,data}` shape yet. |
| Splash + monitoring | `CustomSplashScreen` plus `SplashScreenProvider` overlay while Expo splash is held. Sentry wrapper decorates `RootLayout`, but bootstrap timings/spans are not recorded. | Day 2 plan calls for declarative bootstrap phases with instrumentation. |

---

## ⚠️ **Architecture Gap Backlog – November 14, 2025**

1. **GW-001 – Navigation store drift (`stores/navigationStore.ts` vs `app/(tabs)/_layout.tsx`)**  
    Store only tracks `dashboard`/`explore`, so any tab state derived from it will ignore the new Pets tab. No observer ties store updates to `Tabs`, leaving future cross-tab actions without a source of truth.
2. **GW-002 – Missing guarded route groups (`app/_layout.tsx`)**  
    Current stack exposes `(tabs)` and `auth` peers without `Stack.Protected` or an anchor. Deep links can bypass `app/index.tsx` redirects, contradicting Expo Router guidance (Context7 `/expo/expo`, Protected Routes) and trust/safety requirements.
3. **GW-003 – Bootstrap diagnostics gap (`stores/bootstrapStore.ts`)**  
    Bootstrap is a single try/catch around AppState + Auth. There are no per-phase timestamps, retries, or Sentry spans, making it hard to identify whether onboarding persistence, Supabase restore, or secure storage is failing. Acceptance criterion: capture phase-level duration + error context before Day 2 refactor.
4. **GW-004 – Theme/onboarding persistence not validated (`stores/appStateStore.ts`, `app/index.tsx`)**  
    `firstLaunch` relies on AsyncStorage but there is no verification hook ensuring `completeOnboarding()` runs (no call site in onboarding flow today). Risk: returning users may be trapped in welcome loop until manual storage clear.
5. **GW-005 – Walker flows missing placeholder issues**  
    Dashboard references booking CTA and future walker tracking, yet there is no service or route group for booking (`app/booking/*`). Need backlog item to introduce route guard + stub screens before integrating live data.

---

## 🎯 **MVP Feature Scope**

### **Phase 1: Core Pet Owner Experience**

#### **1.1 Pet Profile Management**
**User Story:** "As a pet owner, I want to create profiles for my dogs so walkers know their needs."

**Features:**
- Create pet profile (name, breed, age, weight, photo)
- Add medical information (allergies, medications)
- Specify temperament & behavior notes
- Add emergency vet contact
- Manage multiple pets per account
- Edit/delete pet profiles

**Success Criteria:**
- Owner can create at least 1 pet profile
- Photos upload successfully to Supabase storage
- Data persists and loads correctly

---

## 📅 **Development Phases - Detailed Timeline**

### **PHASE 1: Foundation & Pet Profiles (Weeks 1-2)**

#### **Week 1: Database & Pet Profiles**

**Monday-Tuesday: Supabase Database Setup**
- [ ] Create Supabase database schema
- [ ] Configure Row-Level Security (RLS) policies
- [ ] Create storage bucket for pet photos
- [ ] Test database connections

**Wednesday-Thursday: Pet Profile Creation**
- [ ] Create `stores/petStore.ts` (Zustand)
- [ ] Create `components/pets/PetProfileCard.tsx`
- [ ] Create `components/pets/PetForm.tsx`

**Friday: Pet Profile Screens**
- [ ] Create pet management tab
- [ ] Create add/edit pet screens
- [ ] Implement photo upload

---

## 🗄️ **Database Schema**

See full schema in separate SQL file: `database/schema.sql`

---

## 📈 **Success Metrics**

### **Week 1-2 Goals**
- ✅ 5 test users create accounts
- ✅ 10+ pet profiles created
- ✅ Dashboard loads in under 2 seconds
- ✅ Pet photo upload success rate > 95%

---

**Good luck building your Dog Walker business! 🐕 You've got this!**

---

*Document Version: 1.0*  
*Last Updated: November 3, 2025*
