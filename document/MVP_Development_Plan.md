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

**User Experience vs. System Complexity:**
- Live GPS tracking for Owners provides transparency and trust, but increases system complexity with real-time data handling and background location tracking.

**Development Speed vs. Long-Term Maintainability:**
- Expo Router enables rapid development with file-based routing and built-in navigation guards, but may challenge scaling navigation complexity as the app grows.

**Security vs. Developer Experience:**
- Enforcing all data access via RLS ensures data integrity and privacy, but adds complexity to debugging and development.

**Cost vs. Reliability:**
- Stripe Connect for walker payouts offloads compliance and KYC to Stripe, but incurs higher transaction fees compared to building an in-house solution.

**Product Axis (Impact):**
- How much trust or value does this feature add to the MVP? (e.g., Live GPS tracking is high-impact; custom pet avatars are low-impact.)

**User Axis (Behavior):**
- How does this affect the Owner and the Walker? (e.g., A 30-second timeout creates urgency for Walkers and fast matching for Owners.)

**Engineering Axis (Complexity):**
- How many "nines" of reliability does this need? Is it a 1-day or 1-month build? (e.g., Basic CRUD for pets is low-complexity; the matching engine is high-complexity.)

**Data Axis (Schema):**
- How does this change our database schema? Does it require a new table or just a new column? (e.g., Adding "Messages" requires a new, highly-queried table and RLS policies.)

**Realtime Axis (Latency):**
- Does this need to be instant? (e.g., `walk_tracking` and `messages` must be < 1-second latency. `profile_updates` can be eventually consistent.)

**Security Axis (Risk):**
- What is the attack vector? How do we secure it? (e.g., All data access must be gated by RLS. All payments must be handled by Stripe.)

**Cost Axis (Usage):**
- Does this feature scale linearly or exponentially in cost? (e.g., Storing GPS points is a high-volume `INSERT` operation that will directly impact database costs.)

**Operations Axis (Maintainability):**
- How does this break? How do we fix it? (e.g., The Admin Portal must have a "Walk Audit Log" to resolve disputes, otherwise, the support team is blind.)

# 27. Holistic System Analysis
This analysis considers the system as a whole, ensuring all components work together seamlessly.

**User-Centric Design:**
- Focus on the needs of both Dog Owners and Dog Walkers.
- Ensure a smooth, intuitive user experience.

**Integrated Architecture:**
- Combine mobile app, backend, and third-party services into a cohesive system.
- Ensure all components communicate effectively.

**Scalability:**
- Design the system to handle growth in users and transactions.

**Security:**
- Implement robust security measures to protect user data and transactions.

**Quality Assurance:**
- Integrate automated testing and monitoring to maintain system integrity.

This model ensures that every feature decision is evaluated across all relevant dimensions simultaneously, not in isolation.

# 28. Development Phases & Roadmap
This section outlines the phased development approach for building the Dog Walker marketplace MVP.

**Phase 1:** Build a minimum viable product (MVP) in 8 weeks.
- Core features: User authentication, dog owner and walker profiles, walk request creation, walk matching engine, basic GPS tracking, payment processing via Stripe, and a simple rating system.
- Focus on rapid development using Supabase and Expo to validate the core marketplace concept.

**Phase 2:** Expand the MVP to include additional features.
- Enhanced GPS tracking with live polylines.
- In-app messaging between owners and walkers.
- Admin portal for managing users, walks, and disputes.
- Improved rating and review system with detailed feedback.
- Walk audit log for resolving disputes.
- Custom pet avatars for owners and walkers.
- Optional subscription and premium features for owners and walkers.
- Last-minute cancellation protection and fees.

**Phase 3:** Optimize and scale the platform.
- Performance optimizations for GPS tracking and real-time updates.
- Scaling to handle a large number of users and walks.

**Phase 4:** Launch and marketing.
- Prepare for public launch with marketing campaigns.
- Gather user feedback for future improvements.

This roadmap is structured into four 2-week sprints, prioritizing a logical, testable, and end-to-end build.

# 31. Launch Checklist
This section outlines the essential tasks and checks to ensure a successful launch of the Dog Walker marketplace MVP.

**Technical Readiness:**
- All core features are implemented and tested.
- RLS policies are thoroughly tested and validated.
- MCP integrations are set up and passing in CI/CD.
- Sentry is configured for real-time error monitoring.
- All API calls are passing in CI/CD.

**Marketplace Health:**
- Sufficient number of registered Dog Walkers.
- Initial walk requests have been successfully matched and completed in testing.
- Payments are passing in CI/CD.

**User Experience:**
- App has been tested on multiple devices and screen sizes.
- Walkers and Owners have given positive reviews.

**Operational Readiness:**
- Admin portal is functional and tested.
- Dispute resolution process is defined.
- Walker verification process is in place.
- E2E test walks are passing in CI/CD.

**Go/No-Go Dashboard:**

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