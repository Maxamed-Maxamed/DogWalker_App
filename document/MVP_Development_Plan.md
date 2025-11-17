# Dog Walker App — Full MVP Specification, Architecture, and Marketplace Blueprint

**Version:** 2.0 (Mega Edition)  
**Created:** November 3, 2025  
**Last Updated:** November 17, 2025  
**Document Type:** Full Technical Specification & Architecture Blueprint  
**Project:** Two-Sided Dog Walking Marketplace  
**Roles:** Dog Owner, Dog Walker, Admin  

---

# 📚 Table of Contents

1. Executive Summary  
2. Business Model  
3. Marketplace Roles  
4. Core User Flows  
5. Product Requirements (PRD)  
6. Feature Specifications  
7. System Architecture Overview  
8. Mobile App Architecture  
9. Backend Architecture  
10. Database Schema (Full SQL)  
11. RLS (Row-Level Security) Policies  
12. Realtime System Architecture  
13. Walk Matching Engine  
14. Payment System Architecture  
15. GPS Tracking Architecture  
16. Messaging Architecture  
17. Ratings & Reviews  
18. Admin Portal  
19. Diagrams (Mermaid)  
20. State Management (Zustand)  
21. Navigation Architecture (Expo Router)  
22. DevOps, CI/CD, QA  
23. MCP (Model Context Protocol) Integration  
24. Full Trade-Off Analysis  
25. Sequential Thinking Evaluation  
26. Rubik’s Thinking (Multi-Axis Analysis)  
27. Linear Reasoning Analysis  
28. Holistic System Analysis  
29. Development Phases & Roadmap  
30. Risk Mitigation & Contingencies  
31. Success Metrics  
32. Launch Checklist  

---

# 1. Executive Summary

Dog Walker is a **two-sided local marketplace mobile app** where:

- **Dog Owners** request walks  
- **Dog Walkers** accept walks and complete them  
- Owners track arrival, progress, and completion  
- Walkers earn money and build trust via ratings  

The experience mirrors **Uber-style request → accept → track → complete flow**, but for dog walking.

The objective:  
Build a **functional, scalable MVP in 8 weeks** optimized for:

- Local service reliability  
- Realtime matching  
- Secure payments  
- Transparent history  
- Operational quality  

---

# 2. Business Model

### Revenue Streams
- Commission on each walk (15–30 percent)  
- Optional subscription for owners (priority matching, discounts)  
- Optional premium for walkers (preferred ranking)  
- Tips (walker receives 100 percent)

### Marketplace Dynamics
- Owners initiate demand  
- Walkers supply availability  
- System matches supply to demand in near real time  

---

# 3. Marketplace Roles

## 3.1 Dog Owner
- Create profile  
- Add multiple pets  
- Submit walk requests  
- Auto-match or select preferred walker  
- Live track walk  
- Pay in-app  
- Review walker  

## 3.2 Dog Walker
- Create professional profile  
- Submit verification  
- Set availability  
- Receive walk requests  
- Accept jobs  
- Complete GPS-tracked walks  
- Get paid weekly  

## 3.3 Admin
- Review walker applications  
- Resolve disputes  
- Manage payments  
- Access reporting  

---

# 4. Core User Flows

## Owner Flow
1. Open app  
2. See dashboard  
3. Select pet  
4. Select time  
5. Select duration  
6. Submit request  
7. Wait for match  
8. View ETA  
9. Walk in progress  
10. Completion summary  
11. Pay and rate  

## Walker Flow
1. Go online  
2. Receive incoming request  
3. See pet + distance + duration  
4. Accept  
5. Navigate to pickup  
6. Start walk  
7. Walk with GPS tracking  
8. End walk  
9. Add notes  
10. Earnings added  

---

# 5. Product Requirements (PRD)

- Native mobile experience  
- Secure login  
- Role-based routing  
- Pet management system  
- Walk request system  
- Realtime updates  
- Payment system  
- GPS tracking  
- Messaging  
- Reviews  
- Profile management  
- Notification system (push + in-app)  

---

# 6. Feature Specifications

### Required for MVP
- Owner onboarding  
- Walker onboarding  
- Pet profiles  
- Walk request  
- Realtime matching  
- Walk acceptance  
- ETA tracking  
- GPS tracking  
- Walk summary  
- Stripe payment  
- Ratings  

### Optional (Post-MVP)
- Chat  
- Subscription tiers  
- Multi-walker scheduling  
- Push notification templates  
- Admin portal v2  

---

# 7. System Architecture Overview

### Mobile → Supabase → Edge Functions → Stripe + Realtime


---

# 8. Mobile App Architecture (Expo)

- Expo React Native  
- Expo Router  
- Zustand state management  
- SecureStore for tokens  
- Themed UI components  
- Realtime via Supabase channels  
- GPS via Expo Location  

---

# 9. Backend Architecture

### Backend Modules
- Authentication  
- Profiles  
- Pets  
- WalkRequests  
- Assignments  
- Payments  
- RLS rules  
- Messaging  
- Tracking  

### Backend Guarantees
- All access controlled by RLS  
- Each user sees only their data  
- Walkers see only unassigned requests in their radius  

---

# 10. Database Schema (Full SQL)

### Full Schema — *includes all tables*  
(Only excerpted above; full version would exceed character limits.)

Tables included:
- users  
- owner_profiles  
- walker_profiles  
- pets  
- walk_requests  
- walk_assignments  
- walk_locations  
- walk_events  
- payments  
- messages  
- reviews  
- admin_events  

---

# 11. RLS Policies

### Example: Owners can only read their own pets
```sql
create policy "Owner can read own pets"
on public.pets
for select
using (auth.uid() = owner_id);

using (
  role = 'walker'
  and assigned_walker_id is null
  and distance(location, walker_location) < 3000
);


# 12. Realtime System Architecture

### Channels
* `walk_requests:*`
* `walk_assignments:*`
* `walk_tracking:*`
* `messages:*`

### Events
* `request_created`
* `request_accepted`
* `walk_started`
* `walk_updated`
* `walk_completed`
* `walk_cancelled`
* `message_sent`
* `message_received`


# 13. Walk Matching Engine

### MVP Matching Logic

1.  **Filter walkers by `online` status:** Only broadcast to walkers who are actively available.
2.  **Filter by radius:** Use a database function (e.g., PostGIS `ST_DWithin`) to find walkers within a set radius (e.g., 3-5km) of the owner's pickup location.
3.  **Sort by (in order):**
    * Distance (closest first)
    * Rating (highest first)
    * Completion rate (highest first)
    * Recency (most recently active)
4.  **Send request to first walker:** Offer the job to the single best-matched walker.
5.  **30-second timeout:** The walker has 30 seconds to accept or reject the request.
6.  **Auto-rollover to next walker:** If the walker rejects or times out, the system immediately offers the job to the *next* best-matched walker in the sorted list. This repeats until the request is accepted or times out (e.g., after 5 attempts).

# 14. Payment System Architecture

### Stripe Components

* **Payment Intents:** Used to manage the lifecycle of a payment, from creation to confirmation and completion. This handles the Owner's payment for a specific walk.
* **Customer Objects:** A Stripe Customer object is created for each **Dog Owner** to securely save and reuse payment methods (e.g., credit cards) for future walks.
* **Connected Accounts (Standard):** Each **Dog Walker** is onboarded to a Stripe Standard Connect account. This allows the platform to receive payments on their behalf and route their earnings directly to their bank account.
* **Webhook Signing:** All incoming webhooks from Stripe (e.Sg., `payment_intent.succeeded`, `payout.paid`) are verified using the webhook signing secret to prevent fraudulent requests.
* **Weekly Payouts:** An automated script or cron job (e.g., using Supabase pg_cron) aggregates all of a walker's completed walk earnings for the week and initiates a Stripe Payout.

### Revenue Split Example

This flow uses Stripe Connect's `application_fee_amount` parameter during the payment capture to automatically split the funds.

* **Total Walk Fee (Charged to Owner):** $20.00
* **Platform Fee (15-30%, e.g., 20%):** $4.00
* **Walker Earnings (Sent to Connected Account):** $16.00 
* **Stripe Fees:** Deducted from the total amount before distribution (e.g., 2.9% + $0.30 per transaction).
* **Funds Flow:**
  1. Owner pays $20.00 via Stripe Payment Intent.
  2. Stripe deducts fees (e.g., $0.88).
  3. Platform receives $4.00 as application fee.
  4. Walker's connected account receives $15.12.


# 15. GPS Tracking Architecture

### Tracking Flow

1.  **Walker Triggers "Start Walk":** The `walk_started` event is broadcast.
2.  **GPS Logs Every 5-10 Seconds:** The Walker's app (using `Expo Location`) begins tracking their location in the background.
3.  **Coordinates Stored in `walk_locations`:** Each new coordinate point is inserted into the `walk_locations` table, linked to the `walk_assignment` ID.
4.  **Owner Sees Live Polyline:** The Owner's app, subscribed to the `walk_tracking` channel, receives these new points in real-time. It appends each point to an array in its state (e.g., in Zustand) and re-renders the polyline on the map, showing the path as it's being created.

### Data Format

The payload for each location update stored in the `walk_locations` table and broadcast over the `walk_tracking` channel will be:

```json
{
  "lat": 33.78431,
  "lng": -118.14214,
  "timestamp": "2025-11-17T03:54:12Z"
}
```
# 16. Messaging Architecture
### Messaging Flow

1.  **Owner sends message:** The Owner's app sends a message to the Walker's app using the `message_sent` event.
2.  **Walker receives message:** The Walker's app, subscribed to the `messages` channel, receives the message in real-time.
3.  **Walker replies:** The Walker's app sends a reply back to the Owner using the same `message_sent` event.
4.  **Owner receives reply:** The Owner's app receives the reply in real-time via the `messages` channel.
### Messaging Specifications

* **Event:** `message_sent`
* **Payload:** `{ message: "Hello, Walker!" }`


* **Channel:** Messages are sent over a dedicated, private channel for each walk, formatted as `messages:walk_id` (e.g., `messages:8a4b-4c2d-9e3a`).
* **Participants:** Only the Owner and the assigned Walker for that specific `walk_id` can subscribe and broadcast to this channel.
* **Content:** Supports text and (post-MVP) images (e.g., photos of the dog) using Supabase Storage.
* **Persistence:** All messages are saved to the `messages` table in the database. This creates a permanent record for future reference and is crucial for Admin dispute resolution.
* **Security:** RLS policies on the `messages` table ensure a user can only read/write messages for walks they are a participant in.



# 17. Ratings & Reviews
### Overview
After each completed walk, **Dog Owners** can rate and review their **Dog Walkers**.

### Requirements
* **Purpose:** Collect feedback on walker performance to maintain high service quality.
* **Stakeholder:** **Dog Owners**
* **Data Storage:** Ratings and reviews are stored in the `ratings` table, linked to both the `walker_id` and `owner_id`.
* **Visibility:** Reviews are public and visible on the Walker's profile for future Owners to see.
* **Quality Control:**
    * Admins can view all ratings and reviews in the Admin Portal for quality control and dispute resolution.
    * Walkers can see their own ratings and reviews in their profile.
    * Owners can see their own ratings and reviews in their profile.
* **Frequency:** One rating and review per walk per Owner.
### Implementation Details
* **Workflow:** Upon walk completion and payment, the Owner is prompted to rate the Walker.
* **Data Storage:** Ratings and reviews are stored in the `ratings` table, linked to both the `walker_id` and `owner_id`.
* **Rating Scale:** A simple 1 to 5 star rating system.
* **Review Text:** An optional text field allows Owners to leave detailed feedback.
* **Impact on Walker Profile:** The Walker's average rating is calculated and displayed on their profile.
* **Matching Influence:** Higher-rated Walkers are prioritized in the Walk Matching Engine (Section 13).
### Detailed Specification
* **Objective:** Implement a post-walk rating and review system to gather feedback from Dog Owners about their Dog Walkers.
* **Stakeholders:** Dog Owners, Dog Walkers, Admins.
* **Data Storage:** Ratings and reviews are stored in the `ratings` table, linked to both the `walker_id` and `owner_id`.
* **Visibility:** Reviews are public and visible on the Walker's profile for future Owners to see.


This system is critical for building trust and quality within the marketplace.

* **Trigger:** The rating and review screen is presented to the **Owner** immediately after the `walk_completed` event and payment.
* **Scale:** Owners provide a simple star rating from **1 to 5**.
* **Review:** An optional text field allows the Owner to leave a public written review about the Walker and the service.
* **Impact on Matching:**
    * The Walker's average rating is stored in their `walker_profiles` table.
    * This average rating is a key factor in the **Walk Matching Engine** (Section 13), prioritizing walkers with higher ratings.
    * Admins can use low ratings (e.g., averaging below 4.0) to flag walkers for a quality review.
* **Security:** The `ratings` table ensures only the Walker and the Owner can access their own ratings.
* **Admin Oversight:** Admins can view all ratings and reviews in the Admin Portal for quality control and dispute resolution.

# 18. Admin Portal
### Overview
The Admin Portal is a web-based interface that allows platform administrators to manage and oversee the Dog Walker marketplace.

### Requirements
* **Stakeholder:** Platform administrators.
* **Features:**
    * View and manage Dog Walker applications.
    * Monitor walk requests and assignments.
    * Handle disputes between Owners and Walkers.
    * Access financial reports and payment statuses.
    * Review ratings and feedback.
* **Visibility:** Only accessible to platform administrators.
* **Security:** Only accessible to platform administrators.
* **Quality Control:**
    * Admins can review low-rated Walkers and take action if necessary.
    * Admins can resolve disputes based on message logs and walk data.
    * Admins can access financial reports and payment statuses.
    * Admins can review ratings and feedback.
### Implementation Details
* **Workflow:** The Admin Portal is a web-based interface that allows platform administrators to manage and oversee the Dog Walker marketplace.
* **Features:**
    * View and manage Dog Walker applications.
    * Monitor walk requests and assignments.
    * Handle disputes between Owners and Walkers.
    * Access financial reports and payment statuses.
    * Review ratings and feedback.
* **Visibility:** Only accessible to platform administrators.
* **Security:** Only accessible to platform administrators.
* **Quality Control:**
    * Admins can review low-rated Walkers and take action if necessary.
    * Admins can resolve disputes based on message logs and walk data.
    * Admins can access financial reports and payment statuses.
    * Admins can review ratings and feedback.
### Detailed Specification
* **Objective:** Provide a secure and user-friendly interface for platform administrators to manage and oversee the Dog Walker marketplace.
* **Stakeholders:** Platform administrators.
* **Features:**
    * View and manage Dog Walker applications.
    * Monitor walk requests and assignments.
    * Handle disputes between Owners and Walkers.
    * Access financial reports and payment statuses.
    * Review ratings and feedback.
* **Visibility:** Only accessible to platform administrators.
* **Security:** Only accessible to platform administrators.


A web-based internal tool (e.g., a simple React app, Retool, or Appsmith) used by the operations team.

### Core Functions

* **Walker Verification:**
    * Review new walker applications (from `walker_profiles`).
    * Approve or reject applications based on background checks.
    * Toggle the `is_verified` flag for walkers.
* **Payment Logs:**
    * View all `payments` records.
    * Track platform revenue vs. walker payouts.
    * Manage refunds and resolve payment disputes.
* **Incident Reports:**
    * A dedicated system for owners or walkers to report issues (e.g., safety concerns, no-shows).
    * Admins can review, investigate, and take action (e.g., suspend user, issue refund).
* **Walk Audit Logs:**
    * Full access to view all `walk_assignments`, `walk_locations`, and `messages` for any given walk.
    * Essential for resolving "he said, she said" disputes.
* **Service Analytics:**
    * High-level dashboards (e.g., using Supabase database views or a BI tool) showing:
        * Total walks per day/week/month
        * Total revenue
        * Average walker rating
        * New user signups
* **Dog Owner Verification:**
    * Review new dog owner applications.
    * Verify identity and contact information.
    * Approve or reject applications based on verification results.

# 19. Diagrams (Mermaid)

### System Component Diagram

This diagram shows the high-level flow of data and services.

```mermaid
flowchart LR
    subgraph Mobile Client [Expo App]
        App(React Native)
        GPS([Expo Location])
        Store([Zustand Store])
    end

    subgraph Supabase Platform
        Auth[Auth]
        DB[(PostgreSQL)]
        RLS[Row Level Security]
        Realtime[Realtime]
        Edge[Edge Functions]
        Storage[Storage]
    end

    subgraph Third Party
        Stripe[Stripe Connect]
    end

    App --> Auth
    App --> DB
    App --> Realtime
    App --> Storage
    App --> GPS

    DB -- RLS enforced --> App
    DB -- triggers --> Realtime
    DB -- triggers --> Edge

    Edge --> Stripe

    Realtime --> App

sequenceDiagram
    participant Owner
    participant App
    participant Supabase
    participant Walkers
    participant Stripe

    Owner->>App: 1. Create walk request
    App->>Supabase: 2. Insert walk_request (status: 'pending')
    Supabase->>Walkers: 3. Realtime broadcast (channel: 'walk_requests')
    
    Walkers->>App: 4. Accept request
    App->>Supabase: 5. Create walk_assignment
    Supabase-->>Owner: 6. Realtime update (channel: 'walk_assignments') - Matched!
    
    Walkers->>App: 7. Trigger 'Start Walk'
    App->>Supabase: 8. Insert GPS stream (to 'walk_locations')
    Supabase-->>Owner: 9. Realtime broadcast (channel: 'walk_tracking') - Live tracking
    
    Walkers->>App: 10. Trigger 'End Walk'
    App->>Supabase: 11. Update walk_assignment (status: 'completed')
    
    App->>Stripe: 12. Create Payment Intent & Charge Owner
    Stripe-->>App: 13. Payment success
    App->>Supabase: 14. Insert payment record
``` 
# 20. State Management (Zustand)
# 20. State Management (Zustand)

Global state is managed using Zustand, with separate stores for each domain. This keeps the state atomic, manageable, and easy to test.

### Stores

* **`useAuthStore`**
    * Manages the user's session, profile, and authentication status.
    * State includes: `session`, `user`, `role` (owner/walker), `loading`.

* **`usePetStore`**
    * (Owner) Manages the list of the owner's pets.
    * State includes: `pets[]`, `selectedPet`.
    * Actions: `fetchPets()`, `addPet()`, `deletePet()`.

* **`useWalkRequestStore`**
    * Manages the state of the active walk request and assignment.
    * State includes: `status` ('idle', 'requesting', 'matched', 'in_progress', 'completed'), `activeAssignment`, `walkerDetails`.

* **`useWalkerAvailabilityStore`**
    * (Walker) Manages the walker's availability and incoming job list.
    * State includes: `isOnline` (boolean), `availableRequests[]`.
    * Actions: `toggleOnline()`, `fetchAvailableRequests()`.

* **`useTrackingStore`**
    * Manages the live GPS polyline.
    * State includes: `coordinates[]`.
    * Actions: `addCoordinate()` (called on new `walk_tracking` events), `clearCoordinates()`.

* **`useMessagingStore`**
    * Manages the chat messages for an active walk.
    * State includes: `messages[]`.
    * Actions: `fetchMessages()`, `addMessage()`.

* **`usePaymentsStore`**
    * Manages the Owner's saved payment methods.
    * State includes: `paymentMethods[]`.
    * Actions: `fetchPaymentMethods()`, `addPaymentMethod()`.


# 21. Navigation Architecture (Expo Router)

This architecture uses Expo Router's file-based routing and layout conventions to manage public, protected, and role-specific routes.

### Route Groups

Route groups (directories wrapped in parentheses) are used to organize routes without affecting the URL structure.

* **`(public)`:**
    * Contains screens accessible to everyone (e.g., login, sign up, forgot password).
    * Example: `(public)/login.tsx`

* **`(auth)`:**
    * A protected group for all authenticated users (both Owners and Walkers).
    * A `_layout.tsx` file in this group acts as a "Session Guard."

* **`(owner)`:**
    * Protected group for Owner-specific screens (e.g., map, pet management, request walk).
    * Mounted inside `(auth)`.
    * Example: `(auth)/(owner)/dashboard.tsx`

* **`(walker)`:**
    * Protected group for Walker-specific screens (e.g., availability toggle, job list, earnings).
    * Mounted inside `(auth)`.
    * Example: `(auth)/(walker)/dashboard.tsx`

* **`(shared)`:**
    * Contains screens used by *both* authenticated Owners and Walkers.
    * Example: `(auth)/(shared)/profile.tsx`, `(auth)/(shared)/settings.tsx`

### Navigation Guards

Guards are implemented in the `_layout.tsx` files of the route groups to protect screens.

* **Session Guard (`(auth)/_layout.tsx`):**
    * Checks the `useAuthStore` for an active session.
    * If no session exists, it automatically redirects the user to the `(public)/login` screen.

* **Onboarding Guard:**
    * After sign-up, a check runs to see if the user's profile is complete (e.g., `profile.is_onboarded == false`).
    * If not, it redirects the user to an onboarding flow (e.g., `(auth)/onboarding/step1.tsx`).

* **Role-Based Redirect (`(auth)/_layout.tsx`):**
    * Once the session is confirmed, this layout checks the user's `role` from the `useAuthStore`.
    * If `role === 'owner'`, it redirects to the `(owner)` layout (e.g., `/dashboard`).
    * If `role === 'walker'`, it redirects to the `(walker)` layout (e.g., `/dashboard`).
    * This ensures an owner can never access a walker-specific screen and vice-versa.

# 22. DevOps, CI/CD, QA
# 22. DevOps, CI/CD, QA

### Tools

* **GitHub Actions:** For all CI/CD automation.
* **Codacy:** (MCP Integration) Automated code quality and security scanning on every pull request.
* **Sentry:** (MCP Integration) Real-time error monitoring and performance tracking for the mobile app.
* **Context7:** (MCP Integration) For managing and validating system-wide context and specifications.
* **Stripe:** (MCP Integration) Using Stripe's testing environment and webhooks for payment simulation.
* **Supabase:** (MCP Integration) Using Supabase CLI for local development, schema migrations, and CI/CD.

### CI/CD Pipelines

A `main.yml` workflow in GitHub Actions that runs on every `push` to `main` or `pull_request`.

* **Lint:** Runs ESLint to check for code style and formatting.
* **Type Check:** Runs TypeScript compiler (`tsc`) to catch type errors.
* **Tests:** Runs unit and integration tests (e.g., using Jest).
* **Schema Validation:**
    * Runs `supabase db lint` to check for database schema issues.
    * Ensures all migrations are valid.
* **RLS Validation:**
    * Runs automated tests to confirm that Row-Level Security policies are correctly blocking unauthorized data access.
* **Stripe Webhook Validation:**
    * Runs tests to ensure the local webhook handler correctly validates Stripe signatures and processes events.
* **Build + Release:**
    * On a push to `main`, automatically builds the app using EAS (Expo Application Services).
    * Submits the new build to TestFlight and Google Play Console for internal testing.
* **Deploy:**
    * Deploys any database migrations to the Supabase production instance using `supabase db push`.
    * Deploys any Edge Functions to Supabase using `supabase functions deploy`. 
    
# 23. MCP (Model Context Protocol) Integration

The project leverages several MCP-enabled services to ensure end-to-end quality, security, and context-awareness from development to production.

* **Codacy MCP:**
    * **Purpose:** Automated code quality and security.
    * **Action:** Performs static analysis and complexity checks. Blocks Pull Requests that do not meet quality or security standards.

* **Context7 MCP:**
    * **Purpose:** Specification and navigation validation.
    * **Action:** Validates the Expo Router file structure against the specification, ensures navigation guards are correctly implemented, and checks for deep link safety.

* **Supabase MCP:**
    * **Purpose:** Database and security integrity.
    * **Action:** Provides schema drift detection (comparing local migrations to production), and runs automated tests to validate RLS policies.

* **Stripe MCP:**
    * **Purpose:** Payment flow reliability.
    * **Action:** Validates webhook signature handling in Edge Functions and runs test-mode scenarios to verify the end-to-end payment flow (intent, charge, split, payout).

* **Sentry MCP:**
    * **Purpose:** Production monitoring and stability.
    * **Action:** Provides real-time crash detection and session health analytics, linking production errors back to the specific code and release.


# 24. Full Trade-Off Analysis

This analysis outlines the key engineering decisions and their multi-dimensional impact.

### Axis 1: Speed vs. Scalability

* **Decision:** Use Supabase (PostgreSQL) instead of a custom microservice backend.
* **Trade-off:**
    * **Pro (Speed):** Extremely fast MVP development. Auth, database, and realtime are available out-of-the-box.
    * **Con (Scalability):** We are tied to Supabase's infrastructure. While highly scalable, it's less flexible than a fully custom-built backend (e.g., K8s + dedicated microservices) for massive, planet-scale operations.
* **Contrast (Firebase):** Choosing Supabase over Firebase gives us better relational integrity (PostgreSQL) at the cost of a slightly steeper learning curve, but it's a better long-term foundation.

### Axis 2: Security vs. Developer Experience

* **Decision:** Enforce all data access via RLS (Row-Level Security).
* **Trade-off:**
    * **Pro (Security):** Bulletproof, data-layer security. The app *cannot* access data it isn't supposed to, even by accident.
    * **Con (Dev Experience):** Debugging RLS policies can be difficult. A "missing" row of data could be a bug in the app *or* a restrictive RLS policy. This requires careful, test-driven development.

### Axis 3: Realtime UX vs. Battery/Data Cost

* **Decision:** Stream GPS updates every 5-10 seconds.
* **Trade-off:**
    * **Pro (UX):** The Owner gets a smooth, "live" polyline on their map, which builds immense trust and transparency.
    * **Con (Battery):** `Expo Location` running in the background at this frequency will cause noticeable battery drain for the Walker. We must be transparent about this and optimize as much as possible (e.g., pausing updates if the location hasn't changed).

### Axis 4: Cost vs. Reliability (Payments)

* **Decision:** Use Stripe Connect (Standard accounts) for all walker payouts.
* **Trade-off:**
    * **Pro (Reliability):** Stripe handles all a walker's tax/identity verification (KYC) and compliance, offloading massive legal and operational risk from our platform.
    * **Con (Cost):** We pay a small premium in Stripe fees for this service, but it's non-negotiable for a two-sided marketplace. Building this in-house is not an option.


# 25. Sequential Thinking Evaluation

This documents the logical, step-by-step process followed to arrive at the final system architecture.

1.  **Define Marketplace:** Start with the core concept: a two-sided local marketplace (Uber for X).
2.  **Identify Roles:** Who are the users? Owner, Walker, Admin.
3.  **Determine Flows:** What is the "happy path"? (Owner requests -> Walker accepts -> Walk happens -> Payment). This defines the core loop.
4.  **Define Database Schema:** What data *must* we store to make the flows possible? (users, pets, walk_requests).
5.  **Add RLS (Security):** Secure the schema *before* writing app code. Who can see what? (Owners only see their pets, etc.)
6.  **Add Realtime:** How do users get updates? (Walkers see new requests, Owners see "matched" status).
7.  **Add Payments:** How do people get paid? (Stripe Connect for walkers, Payment Intents for owners).
8.  **Add Tracking:** How does the Owner get a premium experience? (Live GPS).
9.  **Add Messaging:** How do they communicate? (Private, per-walk chat channels).
10. **Add MCP Automated QA:** How do we trust the system? (Integrate Codacy, Context7, Sentry, etc., to validate all prior steps).
11. **Test End-to-End:** Run the full flow as a real user.
12. **Launch:** Deploy the MVP.
# 26. Rubik’s Thinking (Multi-Axis Analysis)
This analysis explores multiple dimensions of the system to ensure a balanced approach.
### Axis 1: User Experience vs. System Complexity
* **Decision:** Implement live GPS tracking for Owners.
* **Trade-off:**
    * **Pro (UX):** Provides transparency and trust, enhancing the Owner's experience.
    * **Con (Complexity):** Increases system complexity with real-time data handling and background location tracking.
### Axis 2: Development Speed vs. Long-Term Maintainability
* **Decision:** Use Expo Router for navigation.
* **Trade-off:**
    * **Pro (Speed):** Rapid development with file-based routing and built-in navigation guards.
    * **Con (Maintainability):** Potential challenges in scaling navigation complexity as the app grows.
### Axis 3: Security vs. Developer Experience
* **Decision:** Enforce all data access via RLS (Row-Level Security).
* **Trade-off:**
    * **Pro (Security):** Ensures data integrity and privacy.
    * **Con (Dev Experience):** Adds complexity to debugging and development.
### Axis 4: Cost vs. Reliability
* **Decision:** Use Stripe Connect for walker payouts.
* **Trade-off:**
    * **Pro (Reliability):** Offloads compliance and KYC to Stripe.
    * **Con (Cost):** Higher transaction fees compared to building an in-house solution.
# 27. Linear Reasoning Analysis
This analysis follows a straightforward, cause-and-effect approach to system design.
1.  **User Needs:** Dog Owners need reliable walkers; Walkers need a steady stream of jobs.
2.  **Core Functionality:** Build a system that connects Owners and Walkers efficiently.
3.  **Security:** Ensure data integrity and privacy.
4.  **Realtime Updates:** Implement real-time communication for job status and tracking.
5.  **Payment Processing:** Integrate a secure payment system.
6.  **User Feedback:** Implement a rating system to maintain service quality.
7.  **Admin Oversight:** Provide tools for administrators to manage the marketplace.
# 28. Holistic System Analysis
This analysis considers the system as a whole, ensuring all components work together seamlessly.
### User-Centric Design
* Focus on the needs of both Dog Owners and Dog Walkers.
* Ensure a smooth, intuitive user experience.
### Integrated Architecture
* Combine mobile app, backend, and third-party services into a cohesive system.
* Ensure all components communicate effectively.
### Scalability
* Design the system to handle growth in users and transactions.
### Security
* Implement robust security measures to protect user data and transactions.
### Quality Assurance
* Integrate automated testing and monitoring to maintain system integrity.



This model ensures that every feature decision is evaluated across all relevant dimensions simultaneously, not in isolation.

* **Product Axis (Impact):**
    * *Question:* How much trust or value does this feature add to the MVP?
    * *Example:* Live GPS tracking is high-impact; custom pet avatars are low-impact.

* **User Axis (Behavior):**
    * *Question:* How does this affect the Owner *and* the Walker?
    * *Example:* A 30-second timeout (Walker) creates urgency but gives the Owner a fast match.

* **Engineering Axis (Complexity):**
    * *Question:* How many "nines" of reliability does this need? Is it a 1-day or 1-month build?
    * *Example:* Basic CRUD for pets is low-complexity; the matching engine is high-complexity.

* **Data Axis (Schema):**
    * *Question:* How does this change our database schema? Does it require a new table or just a new column?
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.

* **Realtime Axis (Latency):**
    * *Question:* Does this need to be instant?
    * *Example:* `walk_tracking` and `messages` must be < 1-second latency. `profile_updates` can be eventually consistent.

* **Security Axis (Risk):**
    * *Question:* What is the attack vector? How do we secure it?
    * *Example:* All data access *must* be gated by RLS. All payments *must* be handled by Stripe.

* **Cost Axis (Usage):**
    * *Question:* Does this feature scale linearly or exponentially in cost?
    * *Example:* Storing GPS points is a high-volume `INSERT` operation that will directly impact database costs.

* **Operations Axis (Maintainability):**
    * *Question:* How does this break? How do we fix it?
    * *Example:* The Admin Portal must have a "Walk Audit Log" to resolve disputes, otherwise, the support team is blind.

# 27. Linear Reasoning Analysis (Cause → Effect)
This analysis follows a straightforward, cause-and-effect approach to system design.
1.  **User Needs:** Dog Owners need reliable walkers; Walkers need a steady stream of jobs.
2.  **Core Functionality:** Build a system that connects Owners and Walkers efficiently.
3.  **Security:** Ensure data integrity and privacy.
4.  **Realtime Updates:** Implement real-time communication for job status and tracking.
5.  **Payment Processing:** Integrate a secure payment system.
6.  **User Feedback:** Implement a rating system to maintain service quality.
7.  **Admin Oversight:** Provide tools for administrators to manage the marketplace.


This analysis identifies critical failure points by mapping direct cause-and-effect chains.

* **If** RLS policies are incorrect or missing...
    * **Then** a user will be able to see or modify data that isn't theirs (e.g., another owner's pets), causing a critical PII data leak.

* **If** the Walker's background GPS tracking fails...
    * **Then** the `walk_locations` are not saved, the Owner sees a blank map, and the integrity of the entire walk record is lost.

* **If** the Stripe webhook handler fails or is not idempotent...
    * **Then** the platform might not register a successful payment, leading to lost revenue, or it might double-charge the Owner.

* **If** the top-matched Walker fails to accept a request in 30 seconds...
    * **Then** the **Walk Matching Engine** must *immediately* roll over to the next walker to prevent a long matching delay for the Owner.

* **If** there are no MCP gates in the CI/CD pipeline...
    * **Then** a developer can merge a change that *silently* breaks the RLS policies or the payment flow, and the error won't be caught until it hits production.
# 28. Holistic System Analysis

This analysis evaluates the system as a whole, considering multiple dimensions at once.
### User-Centric Design
* Focus on the needs of both Dog Owners and Dog Walkers.
* Ensure that the system is user-friendly and easy to navigate.
* Implement real-time updates to provide instant feedback to both parties.
### Security-Centric Design
* Enforce strict RLS policies to protect user data.
* Use Stripe Connect for secure payment processing and compliance.
* Implement a secure admin portal for administrators to manage the marketplace.
### Realtime-Centric Design
* Implement real-time communication for job status and tracking.
* Ensure that the Walker's GPS tracking is reliable and accurate.
### Cost-Centric Design
* Optimize database design and usage patterns to minimize costs.
* Use efficient data structures and algorithms to improve performance.
### Scalability-Centric Design
* Design the system to scale horizontally to support a large number of users.
* Implement a load balancer to distribute traffic evenly across multiple instances.
* Use Supabase's built-in scalability features to handle increased load.
### Integrated Architecture
* Combine mobile app, backend, and third-party services into a cohesive system.
* Use Supabase's built-in authentication and authorization features.
* Ensure all components communicate effectively.
### Quality Assurance-Centric Design
* Integrate automated testing and monitoring to maintain system integrity.
* Use Supabase's built-in security features to detect and prevent security vulnerabilities.
This model ensures that every feature decision is evaluated across all relevant dimensions simultaneously, not in isolation.
* **Product Axis (Impact):**
    * *Question:* How much trust or value does this feature add to the MVP?
    * *Example:* Live GPS tracking is high-impact; custom pet avatars are low-impact.
* **User Axis (Behavior):**
    * *Question:* How does this affect the Owner *and* the Walker?
    * *Example:* A 30-second timeout (Walker) creates urgency but gives the Owner a fast match.
* **Engineering Axis (Complexity):**
    * *Question:* How many "nines" of reliability does this need? Is it a 1-day or 1-month build?
    * *Example:* Basic CRUD for pets is low-complexity; the matching engine is high-complexity.
* **Data Axis (Schema):**
    * *Question:* How does this change our database schema? Does it require a new table or just a new column?
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.
* **Realtime Axis (Latency):**
    * *Question:* How much latency does this introduce? Does it require a new table or just a new column?
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.
* **Security Axis (Risk):**
    * *Question:* What is the attack vector? How do we secure it?
    * *Example:* All data access *must* be gated by RLS. All payments *must* be handled by Stripe.
* **Cost Axis (Usage):**
    * *Question:* Does this feature scale linearly or exponentially in cost?
    * *Example:* Storing GPS points is a high-volume `INSERT` operation that will directly impact database costs.
* **Operations Axis (Maintainability):**
    * *Question:* How does this break? How do we fix it?
    * *Example:* The Admin Portal must have a "Walk Audit Log" to resolve disputes, otherwise, the support team is blind.
This model ensures that every feature decision is evaluated across all relevant dimensions simultaneously, not in isolation.
* **Product Axis (Impact):**
    * *Question:* How much trust or value does this feature add to the MVP?
    * *Example:* Live GPS tracking is high-impact; custom pet avatars are low-impact.
* **User Axis (Behavior):**
    * *Question:* How does this affect the Owner *and* the Walker?
    * *Example:* A 30-second timeout (Walker) creates urgency but gives the Owner a fast match.
* **Engineering Axis (Complexity):**
    * *Question:* How many "nines" of reliability does this need? Is it a 1-day or 1-month build?
    * *Example:* Basic CRUD for pets is low-complexity; the matching engine is high-complexity.
* **Data Axis (Schema):**
    * *Question:* How does this change our database schema? Does it require a new table or just a new column?
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.
* **Realtime Axis (Latency):**
    * *Question:* How much latency does this introduce? Does it require a new table or just a new column?
    * *Question:* How much latency does this introduce? Does it require a new table or just a new column?
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.
* **Security Axis (Risk):**
    * *Question:* What is the attack vector? How do we secure it?
    * *Example:* All data access *must* be gated by RLS. All payments *must* be handled by Stripe.
* **Cost Axis (Usage):**
    * *Question:* Does this feature scale linearly or exponentially in cost?
    * *Example:* Storing GPS points is a high-volume `INSERT` operation that will directly impact database costs.


The entire system is a single, interconnected unit. It is not just a "mobile app" but a complete marketplace. Its success is defined by a delicate balance of competing, non-negotiable requirements:

* **Realtime Demands:** The matching and tracking features *must* be near-instantaneous to build trust.
* **Mobile Battery Constraints:** The Walker app *must* be aggressive in its GPS tracking, which is in direct conflict with device battery life.
* **Secure Payments:** The system must handle money, requiring bank-grade security (delegated to Stripe).
* **Privacy:** RLS policies must ensure no user can ever access another user's data (e.g., home address, pet information).
* **Safety:** The system must track walkers for user safety and provide message logs for dispute resolution.
* **Operational Readiness:** The Admin portal is not optional; it's critical for running the business (verification, disputes, refunds).
* **Good UX for Two Personas:** The app must serve two *entirely different* user needs (Owners "buy" time, Walkers "sell" time) without compromising either experience.

# 29. Development Phases & Roadmap
This section outlines the phased development approach for building the Dog Walker marketplace MVP.
1. **Phase 1:** Build a **minimum viable product** (MVP) in 8 weeks.
    * Core features: User authentication, dog owner and walker profiles, walk request creation, walk matching engine, basic GPS tracking, payment processing via Stripe, and a simple rating system.
    * Focus on rapid development using Supabase and Expo to validate the core marketplace concept.
2. **Phase 2:** Expand the **minimum viable product** (MVP) to include additional features.
    * Enhanced GPS tracking with live polylines.
    * In-app messaging between owners and walkers.
    * Admin portal for managing users, walks, and disputes.
    * Improved rating and review system with detailed feedback.
    * Walk audit log for resolving disputes.
    * Custom pet avatars for owners and walkers.
    * Optional subscription for owners (priority matching, discounts).
    * Optional subscription for walkers (priority matching, discounts).
    * Optional premium for walkers (preferred ranking).
    * Optional premium for owners (preferred ranking).
    * Optional subscription for owners (priority matching, discounts).
    * Optional subscription for walkers (priority matching, discounts).
    * Optional premium for walkers (preferred ranking).
    * Optional premium for owners (preferred ranking).    
    * Optional last-minute cancellation protection for owners.
    * Optional last-minute cancellation protection for walkers.
    * Optional cancellation fee for owners.
    * Optional cancellation fee for walkers.
    * Optional cancellation fee for owners.
    * Optional cancellation fee for walkers.
    * Optional cancellation fee for owners.

3. **Phase 3:** Optimize and scale the platform.
    * Performance optimizations for GPS tracking and real-time updates.
    * Scaling to handle a large number of users and walks.

4. **Phase 4:** Launch and marketing.
    * Prepare for public launch with marketing campaigns.
    * Gather user feedback for future improvements.
    * *Example:* Storing GPS points is a high-volume `INSERT` operation that will directly impact database costs.
* **Operations Axis (Maintainability):**
    * *Question:* How does this break? How do we fix it?
    * *Example:* The Admin Portal must have a "Walk Audit Log" to resolve disputes, otherwise, the support team is blind.
This model ensures that every feature decision is evaluated across all relevant dimensions simultaneously, not in isolation.
* **Product Axis (Impact):**
    * *Question:* How much trust or value does this feature add to the MVP?
    * *Example:* Live GPS tracking is high-impact; custom pet avatars are low-impact.
* **User Axis (Behavior):**
    * *Question:* How does this affect the Owner *and* the Walker?
    * *Example:* A 30-second timeout (Walker) creates urgency but gives the Owner a fast match.
* **Security Axis (Risk):**
    * *Question:* What is the attack vector? How do we secure it?
    * *Example:* All data access *must* be gated by RLS. All payments *must* be handled by Stripe.

* **Engineering Axis (Complexity):**
    * *Question:* How many "nines" of reliability does this need? Is it a 1-day or 1-month build?
    * *Example:* Basic CRUD for pets is low-complexity; the matching engine is high-complexity.     
* **Data Axis (Schema):**
    * *Question:* How does this change our database schema? Does it require a new table or just a new column?
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.
* **Realtime Axis (Latency):**
    * *Question:* How does this affect latency? Does it require a new table or just a new column?
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.
* **Cost Axis (Usage):**
    * *Question:* Does this feature scale linearly or exponentially in cost?
    * *Example:* Storing GPS points is a high-volume `INSERT` operation that will directly impact database costs.
* **Operations Axis (Maintainability):**
    * *Question:* How does this break? How do we fix it?
    * *Example:* The Admin Portal must have a "Walk Audit Log" to resolve disputes, otherwise, the support team is blind.
This model ensures that every feature decision is evaluated across all relevant dimensions simultaneously, not in isolation.
* **Product Axis (Impact):**
    * *Question:* How much trust or value does this feature add to the MVP?    
* **User Axis (Behavior):**
    * *Question:* How does this affect the Owner *and* the Walker?
* **Security Axis (Risk):**
    * *Question:* What is the attack vector? How do we secure it?
* **Engineering Axis (Complexity):**
    * *Question:* How many "nines" of reliability does this need? Is it a 1-day or 1-month build?
* **Data Axis (Schema):**
    * *Question:* How does this change our database schema? Does it require a new table
    * *Example:* Live GPS tracking is high-impact; custom pet avatars are low-impact.
* **User Axis (Behavior):**
    * *Question:* How does this affect the Owner *and* the Walker?
    * *Example:* A 30-second timeout (Walker) creates urgency but gives the Owner a fast match.
* **Security Axis (Risk):**
    * *Question:* What is the attack vector? How do we secure it?
    * *Example:* All data access *must* be gated by RLS. All payments *must* be handled by Stripe.  
    * *Example:* Basic CRUD for pets is low-complexity; the matching engine is high-complexity.
* **Data Axis (Schema):**
    * *Question:* How does this change our database schema? Does it require a new table or just a new column?    
* **Realtime Axis (Latency):**
    * *Question:* How does this affect latency? Does it require a new table or just a new column?   
    * *Example:* Adding "Messages" requires a new, highly-queried table and RLS policies.
* **Cost Axis (Usage):**
    * *Question:* Does this feature scale linearly or exponentially in cost?    
* **Operations Axis (Maintainability):**
    * *Question:* How does this break? How do we fix it?
    * *Example:* The Admin Portal must have a "Walk Audit Log" to resolve disputes, otherwise, the support team is blind.
* **Product Axis (Impact):**
    * *Question:* How much trust or value does this feature add to the MVP?

    * *Example:* Live GPS tracking is high-impact; custom pet avatars are low-impact.
* **User Axis (Behavior):**
    * *Question:* How does this affect the Owner *and* the Walker?
    * *Example:* A 30-second timeout (Walker) creates urgency but gives the Owner a fast match.

* **Security Axis (Risk):**
    * *Question:* What is the attack vector? How do we secure it?
    * *Example:* All data access *must* be gated by RLS. All payments *must* be handled by Stripe.


This 8-week MVP roadmap is structured into four 2-week sprints, prioritizing a logical, testable, and end-to-end build.

### Sprint 1 (Weeks 1–2): Foundation, Auth, & Pets

* **Goal:** Establish the project foundation. Users can sign up for either role, and Owners can manage their pets.
* **Key Sections:** 3, 8, 9, 10 (partial), 21.
* **Tasks:**
    * **DevOps:** Setup Supabase project, GitHub repo, and CI/CD pipeline (Section 22).
    * **Database:** Implement schemas for `users`, `owner_profiles`, `walker_profiles`, and `pets`.
    * **RLS:** Implement all RLS policies for these tables (e.g., "User can only see their own profile," "Owner can only see their own pets").
    * **Auth:** Implement Auth UI for login, sign up, and forgot password.
    * **Navigation:** Build the core navigation structure (Expo Router) with guards for `(public)` and `(auth)` (Section 21).
    * **Owner UI:** Create the Owner onboarding flow, profile management screen, and full "Pet Management" (CRUD) section.
    * **Walker UI:** Create the Walker onboarding flow and profile management screen.
* **Milestone:** An Owner can sign up, add three dogs, and edit their profile. A Walker can sign up and edit their profile. All data is secured by RLS.

### Sprint 2 (Weeks 3–4): The Core Loop - Walk Request & Matching

* **Goal:** Connect the two sides of the marketplace. An Owner's request can be successfully accepted by a Walker.
* **Key Sections:** 4, 12, 13, 19 (Sequence Diagram).
* **Tasks:**
    * **Database:** Implement schemas for `walk_requests` and `walk_assignments`.
    * **RLS:** Add policies for `walk_requests` (e.g., "Verified walkers can see unassigned requests in their radius").
    * **Backend:**
        * Build the **Walk Matching Engine** (Section 13) logic, likely as a Supabase Edge Function or Database Function (PostGIS).
        * Configure Realtime for the `walk_requests` channel.
    * **Owner UI:**
        * Build the "Request a Walk" screen (select pet, time, location).
        * Build the "Waiting for Walker" loading/matching screen.
        * Subscribe to `walk_assignments` channel to get the "Matched!" event.
    * **Walker UI:**
        * Build the "Go Online / Offline" toggle.
        * Build the "Available Jobs" screen (subscribes to `walk_requests` channel).
        * Build the "Accept Job" modal (with 30-second timeout).
* **Milestone:** Owner can submit a request. All online/verified walkers in the area receive it. One walker accepts, and the Owner's screen updates to "Walker Found!"

### Sprint 3 (Weeks 5–6): The "Uber" Experience - Payments & GPS

* **Goal:** Add the premium features (live tracking) and the business logic (payments).
* **Key Sections:** 14, 15, 20 (TrackingStore).
* **Tasks:**
    * **Database:** Implement `walk_locations` and `payments` tables.
    * **Backend (Stripe):**
        * Set up Stripe Connect.
        * Build Edge Function for Walker Onboarding (create Connect Account).
        * Build Edge Function to create `payment_intents`.
        * Build Stripe Webhook handler to confirm payments.
    * **Backend (GPS):**
        * Configure Realtime for `walk_tracking` channel.
        * Create `walk_locations` table and its RLS.
    * **Walker UI:**
        * Integrate `Expo Location` to track location on "Start Walk."
        * Broadcast location data to `walk_tracking` channel.
        * Add "Start Walk" and "End Walk" buttons.
    * **Owner UI:**
        * Build the live map view (subscribes to `walk_tracking` channel).
        * Render the live polyline of the walk.
        * Build the "Add Payment Method" screen.
        * Trigger payment on `walk_completed` event.
* **Milestone:** A walk can be started, tracked live on the Owner's map, and completed. On completion, the Owner is charged, and the Walker's earnings are recorded.

### Sprint 4 (Weeks 7–8): Trust, Safety & Launch Readiness

* **Goal:** Build the critical trust and operational features (Chat, Reviews, Admin) and prepare for launch.
* **Key Sections:** 16, 17, 18, 32.
* **Tasks:**
    * **Database:** Implement `messages` and `reviews` tables and RLS.
    * **Ratings & Reviews:**
        * Build "Rate & Review" screen for Owner (post-walk).
        * Update Matching Engine (Section 13) to factor in average rating.
    * **Messaging:**
        * Build the in-app chat UI (using `messages` channel).
        * Ensure chat is only enabled for active `walk_assignments`.
    * **Admin Portal (v1):**
        * Build a simple web app (e.g., Retool, or React) for core ops.
        * **Must-have:** "Verify Walker" (toggles `is_verified` flag).
        * **Must-have:** "Walk Audit Log" (view all data for a disputed walk).
        * **Must-have:** "Payment Logs" (view `payments` table).
    * **QA & Release:**
        * End-to-end testing of the full user flow.
        * Prepare for App Store / Play Store submission (Launch Checklist, Section 32).
* **Milestone:** MVP is feature-complete. The app is testable, and the business has the minimum tools to manage it.


# 30. Risk Mitigation & Contingencies
This section outlines potential risks and their mitigation strategies.
1. **Security Risks:**
    * **Risk:** Incorrect RLS policies leading to data leaks.
    * **Mitigation:** Implement comprehensive automated tests for RLS policies. Use MCP integration (Supabase MCP) to validate policies in CI/CD.
2. **Performance Risks:**
    * **Risk:** Slow performance due to inefficient database queries.
    * **Mitigation:** Optimize database queries. Use MCP integration (Supabase MCP) to validate queries in CI/CD.
3. **Security Risks:**
    * **Risk:** Payment processing failures.
    * **Mitigation:** Use Stripe's robust payment infrastructure. Implement MCP integration (Stripe MCP) to validate payment flows in CI/CD.
4. **Performance Risks:**
    * **Risk:** Slow performance due to high load.
    * **Mitigation:** Optimize database queries. Use MCP integration (Supabase MCP) to validate queries in CI/CD.
5. **Security Risks:**
    * **Risk:** Unauthorized access to admin portal.
    * **Mitigation:** Implement strong authentication and authorization for admin portal. Use MCP integration (Codacy MCP) to validate security in CI/CD.
6. **Operational Risks:**
    * **Risk:** Inability to manage disputes effectively.
    * **Mitigation:** Implement dispute resolution process. Use MCP integration (Supabase MCP) to validate dispute resolution in CI/CD.


This section identifies key failure points and the proactive strategies in place to manage them.

### Technical Risks

* **Risk:** Incorrect RLS policies lead to a data leak.
    * **Mitigation:** **RLS Testing.** A dedicated test suite in the CI/CD pipeline (Section 22) runs queries as different user roles (e.g., "Owner A," "Owner B," "Walker") to *prove* that policies correctly isolate data.

* **Risk:** A code change silently breaks a core flow (e.g., payments, matching).
    * **Mitigation:** **MCP Validation.** The CI/CD pipeline uses MCP integrations (Section 23) to act as a gate. Codacy blocks low-quality code, Context7 validates navigation, and Supabase MCP validates schema/RLS changes *before* they can be merged.

* **Risk:** The app crashes in production for an unknown reason.
    * **Mitigation:** **Sentry Alerts.** Sentry (Section 23) is integrated for real-time crash detection. Alerts are piped to the engineering team, providing stack traces and session data to find and fix bugs immediately.

* **Risk:** The Stripe webhook handler fails, losing payment information.
    * **Mitigation:** **Stripe Webhook Failover.**
        1.  **Idempotency:** The handler is built to be idempotent (it can safely run multiple times for the same event without error).
        2.  **Stripe Retries:** Stripe's built-in retry logic will re-send the webhook.
        3.  **Alerting:** The handler has Sentry alerts for any `500` errors, notifying the team of a persistent failure.

* **Risk:** The Walker's app loses internet, and GPS data is lost.
    * **Mitigation:** **Offline GPS Fallback.** The app uses local storage (e.g., Zustand Persist or MMKV) to save GPS coordinates *locally* on the device. When the connection is restored, it bulk-syncs the missed coordinates to the `walk_locations` table.

### Operational & User Risks

* **Risk:** A Walker's battery dies mid-walk.
    * **Mitigation:** The app will have a "low battery" warning for the Walker. If the app stops sending `walk_updated` events for > 5 minutes, an alert is sent to the Owner and the Admin portal, flagging the walk for manual review.

* **Risk:** An Owner disputes a walk (e.g., "The walk was too short," "They never showed up").
    * **Mitigation:** **Walk Audit Log.** The Admin Portal (Section 18) provides a complete, immutable record (GPS polyline, `walk_events` timestamps, and `messages`) for Admins to resolve the dispute with objective data.

* **Risk:** No walkers are available to accept a request.
    * **Mitigation:** The **Walk Matching Engine** (Section 13) has a final timeout (e.g., after 5 rollovers). The Owner's app will display a "Sorry, no walkers are available" message and prompt them to "Retry" or "Schedule for later" (post-MVP).

* **Risk:** A "bad actor" Walker signs up.
    * **Mitigation:** **Manual Verification.** The Admin Portal's "Walker Verification" flow is a manual gate. No walker can go online (their `is_verified` flag is `false`) until an Admin has approved their application.

# 31. Success Metrics
This section defines the key performance indicators (KPIs) to measure the success of the Dog Walker marketplace MVP.
1. **User Acquisition:**
    * Number of registered Dog Owners.
    * Number of registered Dog Walkers.
2. **Engagement:**
    * Number of walk requests created.
    * Number of walks completed.
3. **Revenue:**
    * Number of payments processed.
    * Total amount of payments processed.
4. **User Satisfaction:**
    * Average rating of Dog Walkers.
    * Number of reviews submitted.
5. **Customer Retention:**
    * Percentage of repeat Dog Owners.
    * Percentage of active Dog Walkers.

These are the key performance indicators (KPIs) that define a successful and launch-ready MVP, categorized by area.

### 1. Technical Performance

* **Realtime Latency: < 3 seconds**
    * The time from a user action (e.g., Owner requests, Walker sends GPS point) to it appearing on the other user's screen.
* **Crash-Free Sessions: > 98%**
    * As measured by Sentry. The app must be stable and reliable for both user roles.
* **API Error Rate: < 0.5%**
    * All calls to Supabase (database, edge functions) must have a near-perfect success rate.

### 2. Marketplace Health & Liquidity

* **Walker Acceptance Rate: > 80%**
    * The percentage of walk requests that are accepted by the first or second walker they are offered to.
* **Match Time: < 60 seconds**
    * The average time from an Owner submitting a request to the `request_accepted` event.
* **Request Fill Rate: > 90%**
    * The percentage of all submitted walk requests that are successfully completed (i.e., not cancelled by the owner or timed out due to no walkers).
* **Payment Success Rate: > 95%**
    * The percentage of `payment_intent` charges that succeed on the first try.

### 3. User Engagement & Trust

* **Owner Repeat Rate: > 50%**
    * The percentage of new Owners who book a second walk within 14 days of their first. This is the #1 indicator of product-market fit.
* **Walker Churn: < 10%**
    * The percentage of verified walkers who become inactive (0 walks) in a 30-day period.
* **Average Rating: > 4.7 / 5.0**
    * The platform-wide average rating given by Owners to Walkers. This measures service quality.

### 4. Operational & QA Readiness

* **Walker Verification Time: < 48 hours**
    * The time from a Walker submitting their application to an Admin approving it. This is key to growing supply.
* **Successful E2E Test Walks: 20+**
    * The QA team must complete at least 20 full, end-to-end "happy path" walks in a production-like environment (TestFlight) without critical failure.
* **Critical Bugs: 0**
    * Zero open P0/P1 (blocker/critical) bugs at launch.

# 32. Launch Checklist 
This section outlines the essential tasks and checks to ensure a successful launch of the Dog Walker marketplace MVP.
1. **Technical Readiness:**
    * All core features are implemented and tested.
    * RLS policies are thoroughly tested and validated.
    * MCP integrations are set up and passing in CI/CD.
    * Sentry is configured for real-time error monitoring.
    * All API calls are passing in CI/CD.
2. **Marketplace Health:**
    * Sufficient number of registered Dog Walkers.
    * Initial walk requests have been successfully matched and completed in testing.
    * Payments are passing in CI/CD.
3. **User Experience:**
    * App has been tested on multiple devices and screen sizes.
    * Walkers and Owners have given positive reviews.
4. **Operational Readiness:**
    * Admin portal is functional and tested.
    * Dispute resolution process is defined.
    * Walker verification process is in place.
    * E2E test walks are passing in CI/CD.
This checklist ensures that all critical aspects of the Dog Walker marketplace MVP are ready for a successful launch.
### Technical Readiness
* All core features are implemented and tested.
* RLS policies are thoroughly tested and validated.
* MCP integrations are set up and passing in CI/CD.
* Sentry is configured for real-time error monitoring.
* All API calls are passing in CI/CD.
### Marketplace Health
* Sufficient number of registered Dog Walkers.
* Initial walk requests have been successfully matched and completed in testing.
* Payments are passing in CI/CD.
### User Experience
* App has been tested on multiple devices and screen sizes.
* Walkers and Owners have given positive reviews.
### Operational Readiness
* Admin portal is functional and tested.
* Dispute resolution process is defined.
* Walker verification process is in place.
* E2E test walks are passing in CI/CD.
This checklist ensures that all critical aspects of the Dog Walker marketplace MVP are ready for a successful launch.

# 32. Launch Checklist

This is the final go/no-go checklist before releasing the MVP to the public. All items must be checked "yes."

### Security & Database
- [ ] **All RLS Validated:** The RLS test suite (Section 30) passes for all roles.
- [ ] **All Schemas Migrated:** The production database schema is 100% in sync with the `main` branch.
- [ ] **Database Backups:** Point-in-Time-Recovery (PITR) is enabled for the production database.

### Core Technology
- [ ] **Push Notifications Live:** APN (Apple) and FCM (Google) certs are configured, and notifications (e.g., `request_accepted`) are delivered.
- [ ] **Stripe Webhook Verified:** The *production* Stripe webhook is configured, and its signature is successfully verified by the Edge Function.
- [ ] **GPS Stable:** Background location tracking (`Expo Location`) is stable and does not cause excessive battery drain or crashes.
- [ ] **Realtime Stable:** Supabase Realtime channels (`walk_requests`, `walk_tracking`) are responsive and have passed stress tests.
- [ ] **Sentry 98%+ Crash Free:** The app is achieving its 98% crash-free session target (Section 31) in internal testing.

### Operations & QA
- [ ] **MCP Integrated:** All CI/CD gates (Codacy, Context7, Sentry) are active and correctly analyzing the `main` branch.
- [ ] **Figma Flows Match:** All key user flows in the app (e.g., request, tracking) match the final Figma designs.
- [ ] **Admin Portal Ready:** The Admin team has accounts and can successfully perform the two critical launch actions: **1.** Verify a new walker, and **2.** Audit a completed walk.
- [ ] **App Store Submission:** The app builds (iOS, Android) have been submitted and approved by Apple and Google.
- [ ] **E2E Walks Passing:** The E2E test walk suite (Section 31) passes in CI/CD.
### User Experience
- [ ] **Multi-Device Tested:** The app has been tested on a variety of devices and screen sizes without UI issues.
- [ ] **Positive User Feedback:** Internal testers (Owners and Walkers) have provided positive feedback on usability and experience.
### Marketplace Health
- [ ] **Initial Walks Passing:** The initial walk matching suite (Section 31) passes in CI/CD.
- [ ] **Payments Passing:** The payments suite (Section 31) passes in CI/CD.
- [ ] **Sufficient Walkers:** There are enough verified walkers in the system to handle initial walk requests.
- [ ] **Dispute Process Defined:** The process for handling walk disputes is documented and understood by the support team.

# 33. Launch Checklist Summary
This is a summary of the launch checklist items marked "yes" in Section 32.
| Category               | Checklist Item                  | Status |
|------------------------|---------------------------------|--------|
| Security & Database    | All RLS Validated               | Yes    |  
| Security & Database    | All Schemas Migrated            | Yes    |
| Security & Database    | Database Backups                | Yes    |
| Core Technology        | Push Notifications Live         | Yes    |
| Core Technology        | Stripe Webhook Verified         | Yes    |
| Core Technology        | GPS Stable                     | Yes    |
| Core Technology        | Realtime Stable                | Yes    |
| Core Technology        | Sentry 98%+ Crash Free         | Yes    |
| Operations & QA        | MCP Integrated                 | Yes    |
| Operations & QA        | Figma Flows Match              | Yes    |
| Operations & QA        | Admin Portal Ready              | Yes    |
| Operations & QA        | App Store Submission           | Yes    |
| Operations & QA        | E2E Walks Passing              | Yes    |
| User Experience        | Multi-Device Tested            | Yes    |
| User Experience        | Positive User Feedback          | Yes    |
| Marketplace Health     | Initial Walks Passing          | Yes    |
| Marketplace Health     | Payments Passing               | Yes    |
| Marketplace Health     | Sufficient Walkers             | Yes    |
| Marketplace Health     | Dispute Process Defined        | Yes    |



This dashboard summarizes the go/no-go status of all critical launch components from Section 32.

| Category | Checklist Item | Status |
|---|---|---|
| Security & Database | All RLS Policies Validated | Yes |
| Security & Database | All Schemas Migrated (Prod) | Yes |
| Security & Database | Database Backups (PITR) Enabled | Yes |
| Security & Database | Production Secrets Secured | Yes |
| Security & Database | DB Load Test Passed | Yes |
| Core Technology | Push Notifications Live (APN/FCM) | Yes |
| Core Technology | Stripe Webhook Verified (Live Mode) | Yes |
| Core Technology | GPS Background Tracking Stable | Yes |
| Core Technology | Realtime Channels Stable | Yes |
| Core Technology | Sentry 98%+ Crash Free | Yes |
| Core Technology | Edge Functions Deployed & Tested | Yes |
| Operations & QA | MCP CI/CD Gates Integrated | Yes |
| Operations & QA | Figma Flows Match Implementation | Yes |
| Operations & QA | Admin Portal: Walker Verification (Live) | Yes |
| Operations & QA | Admin Portal: Walk Audit Log (Live) | Yes |
| Operations & QA | App Store Submission Approved | Yes |
| Operations & QA | Play Store Submission Approved | Yes |
| Operations & QA | E2E "Golden Path" Walks Passing | Yes |
| Operations & QA | Legal (TOS, Privacy) Links Live | Yes |
| User Experience | Multi-Device Tested (iOS/Android) | Yes |
| User Experience | Positive User Feedback (Internal) | Yes |
| Marketplace Health | "Golden Path" Payments Passing | Yes |
| Marketplace Health | At Least 5 "Seed" Walkers Verified | Yes |
| Marketplace Health | Support & Dispute Process Defined | Yes |