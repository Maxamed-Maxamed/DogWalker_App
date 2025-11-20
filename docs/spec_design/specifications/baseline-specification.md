# Dog Walker App - Baseline Specification
**Project:** Dog Walker - Two-Sided Dog Walking Marketplace  
**Version:** 1.0  
**Created:** November 20, 2025  
**Status:** Active Development  
**Target Timeline:** 8-week MVP

---

## Executive Summary

Dog Walker is a **two-sided local marketplace mobile app** connecting dog owners with vetted, professional dog walkers. The platform delivers an Uber-style experience for dog walking services, focusing on trust, transparency, and real-time tracking.

### Vision
To become the most trusted and convenient dog walking service, establishing DogWalker as the indispensable app for modern pet owners.

### Core Value Propositions
- **For Dog Owners:** Peace of mind through vetted walkers, real-time GPS tracking, and transparent service
- **For Dog Walkers:** Flexible income with quick payouts and efficient job matching
- **For Platform:** Commission-based marketplace with sustainable unit economics

---

## User Personas

### Primary Users

#### 1. Dog Owner: "Anna" - Urban Professional
- **Demographics:** 28-35 years old, city professional
- **Pet:** High-energy dog (e.g., Vizsla)
- **Needs:** Last-minute and scheduled walks for unpredictable schedule
- **Values:** Real-time tracking, detailed reports, photo updates, vetted walkers
- **Pain Points:** Unreliable services, lack of transparency, trust concerns
- **Willingness to Pay:** Premium for reliability and quality

#### 2. Dog Owner: "The Millers" - Busy Family
- **Demographics:** 35-45 years old, juggling work and family
- **Pet:** Medium-sized family dog
- **Needs:** Consistent scheduled walks, occasional last-minute bookings
- **Values:** Reliability, multiple pet profile management, ease of use
- **Pain Points:** Scheduling conflicts, managing multiple commitments
- **Willingness to Pay:** Moderate, values consistency

#### 3. Dog Walker: "Ben" - Gig Economy Worker
- **Demographics:** 22-28 years old, student or freelancer
- **Motivation:** Flexible income while loving dogs
- **Needs:** Easy-to-use app, transparent earnings, quick payouts
- **Values:** Efficiency, fair compensation, flexible schedule
- **Pain Points:** Complex onboarding, slow payments, hidden fees
- **Income Target:** Supplemental income fitting around studies/work

#### 4. Dog Walker: "Sarah" - Professional Pet Caregiver
- **Demographics:** 30-40 years old, experienced pet care professional
- **Motivation:** Expand client base, reduce administrative overhead
- **Needs:** Steady work stream, fair compensation, platform support
- **Values:** Safety features, professional development, walker protection
- **Pain Points:** Client acquisition, payment collection, liability concerns
- **Income Target:** Primary or significant secondary income

---

## Core Features Specification

### 1. User Authentication & Profiles

#### Owner Profiles
- **Registration:** Email/phone with 2FA
- **Profile Data:**
  - Personal information (name, contact, address)
  - Payment methods (Stripe integration)
  - Preferred walkers list
- **Pet Profiles:**
  - Multiple pets per owner
  - Detailed info: breed, age, weight, temperament
  - Medical history and vaccination status
  - Special instructions and behavioral notes
  - Multiple photos per pet
  - Emergency contact and vet information

#### Walker Profiles
- **Registration:** Multi-stage vetting process
- **Profile Data:**
  - Professional bio and experience
  - Availability schedule
  - Service area and radius
  - Special skills/certifications
  - Badge and tier system
- **Verification Requirements:**
  - Background checks (criminal, driving)
  - Dog handling quiz
  - Video interview
  - Reference checks
  - Identity verification

#### Admin Access
- **Capabilities:**
  - Review and approve/reject walker applications
  - Monitor platform activity
  - Resolve disputes
  - Access reporting and analytics

### 2. Walk Request & Booking System

#### Request Types
- **On-Demand:** Immediate walk with nearest available walker
- **Scheduled:** Advance booking with date/time selection
- **Recurring:** Repeat bookings for regular schedules

#### Request Parameters
- **Pet Selection:** Choose from owner's registered pets
- **Duration:** 30 min, 45 min, 60 min, or custom
- **Time:** Immediate or scheduled
- **Location:** Pickup/dropoff address
- **Special Instructions:** Optional notes for walker

#### Walker Matching Engine
**Priority Algorithm:**
1. Filter by `online` status (available walkers)
2. Filter by radius (3-5km from pickup location using PostGIS)
3. Sort by:
   - Distance (closest first)
   - Rating (highest first)
   - Completion rate (highest first)
   - Recent activity (most recent first)
4. Offer to best-matched walker
5. 30-second timeout for acceptance
6. Auto-rollover to next walker if rejected/timeout
7. Maximum 5 attempts before request expires

### 3. Real-time GPS Tracking

#### Implementation
- **Technology:** Expo Location with background tracking
- **Update Frequency:** GPS coordinates every 5-10 seconds
- **Data Storage:** `walk_locations` table with timestamp, lat/lng
- **Real-time Broadcast:** WebSocket updates via Supabase Realtime

#### Owner Experience
- **Live Map:** Interactive map with walker's current position
- **Route Polyline:** Accumulated path showing complete walk route
- **Distance Calculation:** Total distance walked
- **Duration Tracking:** Real-time elapsed time

#### Walker Experience
- **Background Tracking:** Automatic GPS logging during walk
- **Battery Optimization:** Pause updates if location unchanged
- **Navigation:** Directions to pickup/dropoff locations

### 4. In-App Messaging

#### Features
- **Private Channels:** One channel per walk (`messages:walk_id`)
- **Participants:** Owner and assigned walker only
- **Message Types:** Text messages (images post-MVP)
- **Persistence:** All messages saved to database
- **Real-time Delivery:** Instant message delivery via WebSockets

#### Security
- **Access Control:** RLS policies restrict access to participants
- **Audit Trail:** Permanent record for dispute resolution
- **Admin Access:** Read-only for support and investigations

### 5. Payment System

#### Owner Payment Flow
1. **Payment Method:** Save credit/debit card via Stripe
2. **Walk Completion:** Automatic charge on walk completion
3. **Pricing Transparency:** Clear breakdown before confirmation
4. **Receipt:** Detailed receipt with walk summary

#### Revenue Split
- **Example Walk Fee (Gross):** $20.00
- **Stripe Fees (~2.9% + $0.30):** $0.88
- **Net Amount:** $19.12
- **Walker Earnings (e.g., 80% of Gross):** $16.00
- **Platform Earnings (Net - Walker):** $3.12

#### Walker Payout System
- **Connected Accounts:** Stripe Standard Connect per walker
- **Payout Schedule:** Weekly automated payouts
- **KYC Compliance:** Stripe handles tax/identity verification
- **Earnings Dashboard:** Real-time earnings tracking

### 6. Ratings & Reviews

#### Post-Walk Rating
- **Trigger:** Presented after walk completion and payment
- **Scale:** 1-5 stars
- **Review Field:** Optional text review
- **Frequency:** One rating per walk per owner

#### Impact
- **Walker Profile:** Public display of average rating
- **Matching Algorithm:** Higher-rated walkers prioritized
- **Quality Control:** Low ratings trigger admin review
- **Transparency:** Reviews visible on walker profiles

---

## Technical Requirements

### Platform
- **Mobile:** iOS and Android (React Native/Expo)
- **Backend:** Supabase (PostgreSQL, Realtime, Edge Functions)
- **Payments:** Stripe Connect
- **Maps:** Google Maps Platform / Apple MapKit
- **Notifications:** Push notifications (Expo)

### Security
- **Authentication:** Supabase Auth with 2FA
- **Data Access:** Row-Level Security (RLS) on all tables
- **Payment Security:** PCI-compliant via Stripe
- **Data Encryption:** End-to-end for sensitive data

### Performance
- **Real-time Latency:** <1 second for critical events
- **GPS Accuracy:** ±10 meters
- **App Load Time:** <2 seconds
- **Offline Support:** Basic functionality (view history)

---

## User Flows

### Owner Flow: Request a Walk
1. Open app → Authenticated dashboard
2. Select "Request Walk" button
3. Choose pet from list
4. Select walk duration (30/45/60 min)
5. Choose "Now" or schedule time
6. Review price and walker matching
7. Confirm request
8. Wait for walker match (realtime updates)
9. View walker ETA and profile
10. Track walk in progress (live GPS)
11. Receive completion notification
12. Review walk summary (distance, route, duration)
13. Rate walker (1-5 stars + optional review)
14. Automatic payment processed

### Walker Flow: Accept and Complete Walk
1. Toggle "Online" to receive requests
2. Receive incoming walk request notification
3. View request details (pet info, distance, duration, pay)
4. Accept request (30-second window)
5. Navigate to pickup location
6. Arrive → Trigger "Start Walk"
7. Walk with automatic GPS tracking
8. End walk → Trigger "Complete Walk"
9. Add optional notes for owner
10. Earnings automatically added to balance
11. Weekly payout to bank account

### Admin Flow: Verify Walker
1. Access admin portal
2. View pending walker applications
3. Review background check results
4. Watch video interview recording
5. Verify dog handling quiz score
6. Check references
7. Approve or reject application
8. Send notification to walker

---

## Success Criteria

### Phase 1 (MVP - 8 Weeks)
- [ ] User authentication functional for owners and walkers
- [ ] Pet profile management (CRUD operations)
- [ ] Walk request creation and submission
- [ ] Real-time walker matching engine operational
- [ ] GPS tracking with live polyline display
- [ ] Payment processing via Stripe functional
- [ ] Rating system implemented
- [ ] Basic admin portal for walker verification

### Quality Metrics
- **Matching Success Rate:** >85% of requests matched within 5 minutes
- **GPS Accuracy:** ±10 meters for 95% of location points
- **Payment Success Rate:** >99% successful transactions
- **App Crash Rate:** <1% of sessions
- **Average Rating:** >4.2 stars (owners rating walkers)

### User Acquisition Targets (Month 1)
- **Walkers:** 50-100 active walkers in launch city
- **Owners:** 200-300 registered owners
- **Walks Completed:** 100+ walks in first month

---

## Out of Scope (Post-MVP)

### Phase 2 Features
- Group walks ("Walk Packs")
- Pet sitting services
- Grooming booking
- IoT collar integration (Fi, Whistle)
- Advanced subscription tiers
- Multi-city expansion
- Corporate partnerships
- Affiliate marketplace

### Future Enhancements
- AI-powered walker recommendations
- Automated incident detection
- Video check-ins
- Advanced analytics dashboard
- White-label platform for pet businesses

---

## Constraints & Assumptions

### Constraints
- **Budget:** Development budget of $100K-$350K for MVP
- **Timeline:** 8-week development cycle
- **Geographic:** Initial launch in single city/metro area
- **Platform:** Mobile-first (iOS/Android), no web app initially
- **Team:** Small development team (2-4 engineers)

### Assumptions
- Sufficient dog walker supply can be recruited pre-launch
- Pet owners are willing to pay premium for vetted, tracked service
- GPS tracking battery drain is acceptable to walkers
- Stripe Connect meets all payment processing needs
- Supabase can scale to handle expected load

### Risks
- **Operational:** Chicken-and-egg problem (walkers vs owners)
- **Safety:** Liability for pet incidents or injuries
- **Legal:** Independent contractor classification for walkers
- **Competition:** Established players (Rover, Wag!)
- **Technical:** Real-time GPS performance and battery drain

---

## Acceptance Criteria

### Functional
- ✅ All core user flows complete end-to-end
- ✅ No critical bugs in production
- ✅ RLS policies tested and validated
- ✅ Payment flows tested with Stripe test mode
- ✅ GPS tracking accurate and real-time

### Non-Functional
- ✅ App passes iOS App Store review
- ✅ App passes Google Play Store review
- ✅ Meets WCAG 2.1 Level AA accessibility
- ✅ Passes security audit (OWASP Mobile Top 10)
- ✅ Load tested for 1000 concurrent users

### Business
- ✅ Walker vetting process operational
- ✅ Customer support system established
- ✅ Liability insurance secured
- ✅ Terms of service and privacy policy finalized
- ✅ App Store Optimization (ASO) complete

---

## Glossary

- **Walk Request:** Owner-initiated request for a dog walk
- **Walk Assignment:** Accepted walk linking owner, walker, and pet
- **RLS:** Row-Level Security - PostgreSQL security model
- **GBV:** Gross Booking Value - Total transaction value
- **KYC:** Know Your Customer - Identity verification
- **ETA:** Estimated Time of Arrival
- **GPS:** Global Positioning System
- **Polyline:** Visual representation of walk route on map

---

**Document Owner:** Development Team  
**Last Review:** November 20, 2025  
**Next Review:** December 1, 2025
