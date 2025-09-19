# Dog Walker App - AI Coding Instructions

## Project Overview & Vision
Dog Walker is a technology-first platform engineered to become the most trusted and convenient dog walking service on the market. This React Native/Expo marketplace app serves as an "Uber for dog walking," providing pet owners with peace of mind through a seamless, safe, and transparent booking experience, while empowering a community of vetted, passionate dog lovers with flexible and rewarding work.

**Vision**: Create a holistic ecosystem for pet care that extends beyond dog walking, eventually integrating services like pet sitting, grooming, training resources, and a marketplace for pet products.

**Target User Personas**:
- **Urban Professional (Pet Owner)**: Anna, 28-35, works long hours, owns high-energy dogs, needs last-minute and scheduled walks, values real-time tracking and vetted walkers
- **Busy Parent/Family (Pet Owner)**: The Millers, 35-45, juggling multiple commitments, needs consistent scheduled walks and easy multi-pet management
- **Gig Economy Worker (Dog Walker)**: Ben, 22-28, student/freelancer seeking flexible income, values easy-to-use app with transparent earnings and quick payouts
- **Professional Pet Caregiver (Dog Walker)**: Sarah, 30-40, experienced in pet care, seeking steady work stream with fair compensation and platform support

**Business Model**: Multi-revenue approach with commission-based primary model (20-25% standard, 15-18% for high-performers), subscription tiers, dynamic pricing, and strategic partnerships

## Core Features to Implement

### Authentication & User Management
- **Dual user registration** (Owner/Walker with role selection)
- **Role-based dashboards** with conditional routing
- **User profiles** with photos, ratings, reviews, and availability (walkers)
- **Authentication state management** with Zustand

### Booking & Scheduling System
- **Instant booking** system with real-time walker availability
- **Advanced scheduling** for recurring walks
- **Walk confirmation** with photos and timestamped updates
- **Push notifications** for booking confirmations, walk updates, and payments

### Real-time Features
- **Live GPS tracking** during walks with map interface
- **Background location services** for walk monitoring
- **In-app messaging** between owners and walkers
- **Photo updates** during walks with timestamped location

### Payment & Commission System
- **Automated payment processing** with 15-20% platform commission
- **Commission calculation** and payout system
- **Multiple payment methods** with secure processing
- **Subscription tiers** and premium features

### Trust & Safety Features (Core Differentiator)
- **Multi-Stage Walker Vetting Process**:
  1. Online application and initial screening
  2. Comprehensive background and driving history checks
  3. Dog handling quiz and safety protocol assessment
  4. Video interview for communication skills and professionalism
  5. Reference checks for previous pet care experience
- **"Meet & Greet" Option**: Free introductory meetings before first walk
- **24/7 Emergency Support Line**: Dedicated emergency contact and support
- **Walk Verification**: GPS data, timestamps, and photos verify completion
- **Two-Factor Authentication**: Secure account access for all users
- **Emergency Contact Integration**: Vet info and emergency contacts accessible to walkers

## Design Requirements
- **Clean black and white interface** inspired by Uber
- **Professional, trustworthy aesthetic** focusing on simplicity
- **Map-centric design** for tracking and walker selection
- **Minimal color palette** with blue accents for interactive elements
- **Clear call-to-action buttons** with consistent navigation patterns

## Tech Stack & Current Architecture
- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router v6 with file-based routing (using typed routes)
- **Language**: TypeScript with strict mode enabled  
- **State Management**: Zustand (to implement for navigation/auth state)
- **Styling**: StyleSheet API with custom theme system
- **Platform Support**: iOS, Android, and Web
- **Package Manager**: pnpm (workspace configuration exists)

### Planned Architecture Integration
**Backend Architecture**: Microservices with Node.js & Python
- **Node.js (Express.js/NestJS)**: Real-time features (chat, location updates, WebSocket connections)
- **Python (Django/Flask)**: Complex business logic, matching algorithms, data processing
- **PostgreSQL**: Primary database for user profiles, bookings, transactions, ratings
- **Redis**: Caching, real-time messaging queues, session management
- **WebSockets/Socket.IO**: Real-time GPS tracking, instant chat, live notifications

**Cloud & Services**:
- **AWS/GCP/Azure**: Scalable infrastructure with managed services
- **Google Maps Platform**: GPS tracking, route calculation, walker location
- **Stripe/Braintree**: Secure payment processing with commission splits
- **Docker & Kubernetes**: Containerization and orchestration for microservices

**Mobile Integration**:
- **Real-time Services**: Background location tracking, live GPS
- **Push Notifications**: Expo Notifications for booking updates
- **Maps**: React Native Maps for tracking interface
- **Photo Upload**: Cloud storage with compression and optimization

## Navigation Architecture (Current vs Target)

### Target Navigation Flow
**Main Stacks**: Auth, Onboarding, Owner, Walker, Admin  
**Default Flow**: Splash → Auth → Role Selection → Onboarding → Main Dashboard  
**Conditional Routing**: Owner flow vs Walker flow based on user role
**State Management**: Zustand for navigation state, user role, authentication status

### Current Implementation (file-based routing)
- `app/_layout.tsx` - Root layout with theme provider and stack navigation
- `app/(tabs)/_layout.tsx` - Tab-based navigation using `@react-navigation/bottom-tabs`
- `app/auth/_layout.tsx` - Authentication flow (login, register, forgot-password)
- `app/welcome/_layout.tsx` - Onboarding flow (index, onboarding, get-started)

**Navigation anchor**: Set to `(tabs)` via `unstable_settings.anchor` in root layout.

### TODO Implementation Tasks
1. **Add Zustand stores**: AppStateStore, NavigationStore for role-based routing
2. **Create role selection screen** after authentication
3. **Implement dual dashboards**: Owner vs Walker interfaces  
4. **Add splash screen** with authentication state initialization
5. **Setup conditional routing** based on user role (owner/walker)

## Advanced Feature Specifications

### Core Features Implementation
**User Profiles**:
- **Pet Owners**: Detailed dog profiles (breed, age, weight, temperament, medical history, vaccination status, specific instructions, preferred routes, multiple photos)
- **Dog Walkers**: Comprehensive profiles with experience, availability, photos, bio, special skills, earned badges

**Walk Booking & Management**:
- **On-Demand Bookings**: Immediate walk requests with nearest available walker
- **Scheduled Bookings**: Advance booking with preferred dates and times
- **Customizable Duration**: 30min, 45min, 60min, or custom walk lengths
- **Intelligent Matching**: Algorithm matching owners with available, highly-rated nearby walkers

**Real-time Communication & Tracking**:
- **In-App Chat**: Secure, direct messaging between owner and walker
- **Real-time GPS Tracking**: Interactive map showing walk progress, route, current location
- **Push Notifications**: Walker accepted, arrived, walk started/ended, messages, emergencies

**Payment & Financial System**:
- **Secure Payment Processing**: Stripe integration for credit/debit cards and digital wallets
- **Transparent Pricing**: Clear cost breakdown before confirmation
- **Earnings Tracker**: Detailed breakdown for walkers with payment history and payout options

### Community & Engagement Features
- **Walker Badges & Tiers**: Gamified system ("5-Star Walker," "Puppy Pro," "Senior Dog Specialist")
- **Preferred Walker Feature**: Owners can mark favorites for consistent relationships
- **Walk Packs/Group Walks**: Multiple dogs from same household/neighborhood
- **Shareable Walk Summaries**: Auto-generated cards with route map, distance, duration, photos
- **In-App Content**: Pet care tips, local dog-friendly events, app updates

### Advanced Pet Owner Features
- **Package Deals**: Discounted walk bundles ("5-Walk Saver Pack," "Monthly Unlimited Pass")
- **Detailed Walker Profiles**: Experience with specific breeds, temperaments, health conditions
- **IoT Integration**: Future integration with smart pet collars (Fi, Whistle)

## Key Development Patterns

### Theming System
Comprehensive theme system in `constants/theme.ts`:
- Dual theme support (light/dark) via `Colors` object
- Platform-specific font configurations via `Fonts` object
- Custom hook `useColorScheme()` for theme detection
- Themed components: `ThemedView`, `ThemedText` with `lightColor`/`darkColor` props

### Component Patterns
- **Reusable UI**: Components in `components/ui/` (e.g., `IconSymbol`)
- **Themed Components**: Use `useThemeColor` hook for dynamic color application
- **Platform Integration**: `HapticTab` component shows iOS-specific haptic feedback patterns
- **SafeAreaView**: Consistently used for proper screen boundaries

### TypeScript Configuration
- Path mapping: `@/*` resolves to root directory
- Strict mode enabled
- Expo-specific types included via `expo-env.d.ts`

## Development Guidelines

### When Implementing Core Features
1. **Authentication**: Extend current auth flow with role selection and Zustand state
2. **Dual Interfaces**: Create separate Owner/Walker dashboard routes with conditional navigation
3. **Real-time Features**: Integrate location tracking, live maps, and push notifications
4. **Payment System**: Build commission calculation logic with secure payment processing
5. **Trust Features**: Implement rating/review system with photo verification

### Code Style & Conventions
- **Import Patterns**: Use `@/` prefix for internal imports (configured in tsconfig.json)
- **Component Structure**: Functional components with TypeScript interfaces and StyleSheet.create()
- **Authentication Screens**: SafeAreaView wrapper, useState for forms, Alert.alert() for errors
- **Navigation**: Use router.replace() for post-auth routing, Link for internal navigation
- **Platform-specific**: Use process.env.EXPO_OS checks and Platform.select() appropriately

### Development Workflow
```bash
# Development server
npx expo start

# Platform-specific launches  
npx expo start --android
npx expo start --ios
npx expo start --web

# Clean project reset
npm run reset-project
```

### App Configuration Notes
- **Scheme**: "dogwalker" for deep linking
- **New Architecture**: Enabled for React Native performance
- **Experiments**: Typed routes and React Compiler enabled
- **Assets**: Logo at `@/assets/images/Logo.jpeg`, adaptive icons configured

### Business Logic Implementation
- **Commission System**: 15-20% automatic calculation on completed walks
- **Dual User Types**: Owner and Walker roles with different permissions and interfaces
- **Real-time Tracking**: GPS monitoring with map interface during active walks
- **Trust Building**: Photo verification, ratings, reviews, and walker background checks
- **Payment Processing**: Automated splits with secure multi-payment method support

## Monetization & Financial Strategy

### Revenue Streams
**Primary: Commission-Based Model**
- **Standard Commission**: 20-25% of each walk fee
- **Tiered Commission**: Reduced rates (15-18%) for high-performing walkers
- **Dynamic/Surge Pricing**: Peak hours, holidays, high-demand areas

**Subscription Models**:
- **"Dog Walker Plus" (Owners)**: $9.99/month or $99/year
  - Waived booking fees on all walks
  - 10% discount on walk prices
  - Priority access to highly-rated walkers
  - Free "Meet & Greet" sessions
  - Enhanced customer support

**Premium Services**:
- **Preferred Walker Booking Fee**: Small fee for consistent walker requests
- **Last-Minute Cancellation Protection**: Optional add-on coverage

**B2B & Partnership Opportunities**:
- **Corporate Employee Benefits**: Company partnerships for employee perks
- **Real Estate Partnerships**: Exclusive service for residential communities
- **Affiliate Marketplace**: Commission on pet product referrals
- **Data Monetization**: Anonymized market insights (with user consent)

### Market Positioning & Competitive Advantage
**vs. Rover**: More rigorous vetting, superior UX, stronger on-demand focus
**vs. Wag!**: Enhanced safety protocols, community building, reliable service quality
**Key Differentiators**:
- Hyper-focus on safety and trust through multi-stage vetting
- Superior user experience with cleaner, faster interface
- Strong community building and walker recognition programs
- Advanced technology integration (React Native, real-time features)

## Security Best Practices & Vulnerability Prevention

### Authentication & Authorization Security
**Critical Vulnerabilities to Prevent:**
- Weak password policies and storage
- JWT token exposure and improper validation
- Role-based access control bypasses
- Session hijacking and fixation attacks

**Implementation Guidelines:**
```typescript
// Secure password requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true
};

// JWT token security
const JWT_CONFIG = {
  issuer: 'dogwalker-app',
  audience: 'dogwalker-users',
  expiresIn: '15m', // Short-lived access tokens
  refreshTokenExpiry: '7d',
  algorithm: 'RS256' // Use asymmetric encryption
};
```

**Best Practices:**
- Implement multi-factor authentication (MFA) for both owners and walkers
- Use secure session management with HttpOnly, Secure, and SameSite cookies
- Implement proper role-based permissions (Owner/Walker/Admin with granular permissions)
- Add account lockout after failed login attempts
- Use biometric authentication where available (Touch ID/Face ID)

### Data Storage & Encryption Security
**Critical Vulnerabilities:**
- Plaintext storage of sensitive data
- Weak encryption algorithms
- Insecure local storage usage
- Unencrypted database fields

**Expo SecureStore Implementation:**
```typescript
import * as SecureStore from 'expo-secure-store';

// Secure storage for sensitive data
const storeSecureData = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value, {
    requireAuthentication: true,
    authenticationPrompt: 'Authenticate to access your data'
  });
};

// Never store in AsyncStorage: passwords, tokens, payment info, location history
```

**Data Classification & Protection:**
- **Highly Sensitive**: Payment cards, SSNs, biometric data → End-to-end encryption
- **Sensitive**: Location data, personal info, chat messages → Database encryption
- **Internal**: App preferences, cache → Standard secure storage
- **Public**: Dog profiles, ratings → Standard database storage

### API Security & External Integrations
**Critical API Vulnerabilities:**
- Missing rate limiting and DDoS protection
- Inadequate input validation
- API key exposure in client code
- Insecure third-party integrations

**Security Headers Implementation:**
```typescript
// Required security headers for API responses
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
```

**API Integration Security:**
- Use API Gateway with authentication and rate limiting
- Implement request signing for sensitive operations
- Validate all API responses before processing
- Use certificate pinning for critical API calls
- Implement proper error handling (don't expose stack traces)

### Input Validation & Sanitization
**High-Risk Input Points:**
- User registration forms
- Dog profile creation
- Payment information
- Location data
- Photo uploads
- Chat messages

**Validation Implementation:**
```typescript
import { z } from 'zod';

// Strict input validation schemas
const UserRegistrationSchema = z.object({
  email: z.string().email().max(254),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/), // E.164 format
  name: z.string().min(2).max(50).regex(/^[a-zA-Z\s'-]+$/),
  role: z.enum(['OWNER', 'WALKER']),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  })
});

// File upload validation
const validateImageUpload = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedDimensions = { maxWidth: 2048, maxHeight: 2048 };
  
  if (!allowedTypes.includes(file.type)) throw new Error('Invalid file type');
  if (file.size > maxSize) throw new Error('File too large');
  // Additional dimension and content validation required
};
```

### Rate Limiting & Abuse Prevention
**Critical Protection Areas:**
- Authentication endpoints (login/register)
- Payment processing
- Location tracking updates
- Photo uploads
- Messaging system

**Rate Limiting Strategy:**
```typescript
// Rate limiting configuration
const RATE_LIMITS = {
  authentication: '5 requests per 15 minutes per IP',
  booking: '10 requests per hour per user',
  messaging: '100 messages per hour per user',
  locationUpdates: '1 request per 10 seconds per walker',
  photoUploads: '20 uploads per day per user'
};

// Implement exponential backoff for failed requests
const retryWithBackoff = async (fn: Function, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};
```

### Secrets Management
**Never Store in Code/Config:**
- API keys (Stripe, Google Maps, push notification services)
- Database connection strings
- Encryption keys
- Third-party service credentials

**Expo Secrets Management:**
```typescript
// Use Expo's environment variables
const config = {
  stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_KEY,
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL,
  // Server-side only (never expose to client)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY, // Backend only
  databaseUrl: process.env.DATABASE_URL, // Backend only
};

// Validate required environment variables
const validateEnvVars = () => {
  const required = ['EXPO_PUBLIC_STRIPE_KEY', 'EXPO_PUBLIC_API_URL'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
```

### Location & Real-time Security
**GPS Tracking Vulnerabilities:**
- Location spoofing and manipulation
- Unauthorized location access
- Location data leakage
- Real-time tracking abuse

**Security Implementation:**
```typescript
// Secure location handling
const trackWalkLocation = async (walkId: string, location: Location) => {
  // Validate location accuracy and timestamp
  if (location.accuracy > 50 || Date.now() - location.timestamp > 30000) {
    throw new Error('Invalid location data');
  }
  
  // Encrypt location data before storage
  const encryptedLocation = await encryptLocationData(location);
  
  // Rate limit location updates
  await rateLimitLocationUpdate(walkId);
  
  // Store with expiration (auto-delete old location data)
  await storeLocationWithTTL(walkId, encryptedLocation, 24 * 60 * 60); // 24 hours
};
```

### Payment Security (Critical)
**PCI DSS Compliance Requirements:**
- Never store card data in the app
- Use tokenization for all payment processing
- Implement 3D Secure authentication
- Monitor for fraudulent transactions

**Secure Payment Implementation:**
```typescript
// Payment processing security
const processPayment = async (paymentData: PaymentIntent) => {
  // Input validation
  validatePaymentAmount(paymentData.amount);
  
  // Use Stripe's secure tokenization
  const paymentMethod = await stripe.createPaymentMethod({
    type: 'card',
    card: elements.getElement(CardElement)
  });
  
  // Server-side payment confirmation (never on client)
  const response = await secureApiCall('/api/payments/confirm', {
    paymentMethodId: paymentMethod.id,
    walkId: paymentData.walkId,
    // Include anti-fraud data
    deviceFingerprint: await getDeviceFingerprint(),
    geoLocation: await getCurrentLocation()
  });
  
  return response;
};
```

### Deployment & Hosting Security
**Infrastructure Security Checklist:**
- Use HTTPS everywhere with valid SSL certificates
- Implement WAF (Web Application Firewall)
- Set up monitoring and intrusion detection
- Regular security patches and updates
- Database encryption at rest and in transit
- Backup encryption and secure storage

**Expo/React Native Specific Security:**
```typescript
// App.json security configuration
{
  "expo": {
    "android": {
      "usesCleartextTraffic": false,
      "requestsLegacyExternalStorage": false,
      "networkSecurityConfig": "./network-security-config.xml"
    },
    "ios": {
      "requireFullScreen": true,
      "supportsTablet": false // If not supporting tablets
    }
  }
}

// Disable debugging in production
if (__DEV__) {
  // Development only code
} else {
  // Disable all debugging features
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
```

### Security Monitoring & Incident Response
**Implement Security Logging:**
- Authentication attempts (success/failure)
- Payment transactions
- Location access and updates
- File uploads and downloads
- API rate limit violations
- Suspicious user behavior patterns

**Incident Response Plan:**
1. **Detection**: Automated monitoring and alerting
2. **Containment**: Immediate user account suspension if needed
3. **Investigation**: Log analysis and forensics
4. **Recovery**: System restoration and security patches
5. **Lessons Learned**: Security improvements and training

**Regular Security Practices:**
- Weekly dependency vulnerability scans
- Monthly penetration testing
- Quarterly security code reviews
- Annual third-party security audits
- Continuous security training for development team

## Software Engineering Best Practices

### Code Quality & Architecture
**SOLID Principles Implementation:**
- **Single Responsibility**: Each component/function has one clear purpose
- **Open/Closed**: Components extensible without modification
- **Liskov Substitution**: Proper inheritance and interface compliance
- **Interface Segregation**: Small, focused interfaces over large ones
- **Dependency Inversion**: Depend on abstractions, not concretions

**Clean Code Standards:**
```typescript
// ✅ Good: Descriptive naming and clear structure
const calculateWalkCommission = (walkPrice: number, commissionRate: number): number => {
  if (walkPrice <= 0 || commissionRate < 0 || commissionRate > 1) {
    throw new Error('Invalid walk price or commission rate');
  }
  return walkPrice * commissionRate;
};

// ❌ Bad: Unclear naming and no validation
const calc = (p: number, r: number) => p * r;
```

**Error Handling & Resilience:**
- Implement proper error boundaries in React components
- Use try-catch blocks with specific error types
- Provide user-friendly error messages
- Log errors for debugging without exposing sensitive data
- Implement fallback UI states

### Testing Strategy
**Test Pyramid Implementation:**
```typescript
// Unit Tests (70% of tests)
describe('WalkBookingService', () => {
  it('should calculate correct commission for walk booking', () => {
    const result = calculateWalkCommission(100, 0.15);
    expect(result).toBe(15);
  });
});

// Integration Tests (20% of tests)
describe('Authentication Flow', () => {
  it('should complete owner registration and redirect to dashboard', async () => {
    // Test full auth flow integration
  });
});

// End-to-End Tests (10% of tests)
describe('Complete Walk Booking Flow', () => {
  it('should allow owner to book walker and complete payment', async () => {
    // Test complete user journey
  });
});
```

**Performance Optimization:**
- Implement lazy loading for route components
- Use React.memo() for expensive components
- Optimize image loading with proper sizing and compression
- Implement infinite scrolling for walker lists
- Use Expo's performance monitoring tools

### Code Organization & Structure
**Feature-Based Architecture:**
```
src/
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── booking/
│   ├── tracking/
│   └── payments/
├── shared/
│   ├── components/
│   ├── utils/
│   ├── hooks/
│   └── constants/
└── stores/
    ├── authStore.ts
    ├── navigationStore.ts
    └── bookingStore.ts
```

**Custom Hooks Pattern:**
```typescript
// Reusable business logic in custom hooks
const useWalkBooking = () => {
  const [booking, setBooking] = useState<WalkBooking | null>(null);
  const [loading, setLoading] = useState(false);
  
  const createBooking = useCallback(async (bookingData: BookingData) => {
    setLoading(true);
    try {
      const result = await bookingService.create(bookingData);
      setBooking(result);
      return result;
    } catch (error) {
      handleBookingError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { booking, loading, createBooking };
};
```

## UI/UX Design Excellence

### Design System & Consistency
**Design Token Implementation:**
```typescript
// Design tokens for consistent UI
export const DesignTokens = {
  colors: {
    primary: {
      black: '#000000',
      white: '#FFFFFF',
      blue: '#007AFF', // iOS blue for actions
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        500: '#6B7280',
        900: '#111827'
      }
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  }
};
```

### Uber-Inspired Interface Patterns
**Clean, Minimal Design Principles:**
- **White Space**: Generous spacing for breathing room and focus
- **Typography Hierarchy**: Clear size and weight differentiation
- **Consistent Navigation**: Tab bar with clear icons and labels
- **Card-Based Layout**: Clean cards for walkers, bookings, and profiles
- **Action-Oriented**: Prominent CTAs with blue accent color

**Component Design Patterns:**
```typescript
// Primary Action Button (Uber-style)
const PrimaryButton: FC<PrimaryButtonProps> = ({ title, onPress, loading, disabled }) => (
  <TouchableOpacity
    style={[
      styles.primaryButton,
      disabled && styles.disabled
    ]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <Text style={styles.primaryButtonText}>{title}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  }
});
```

### User Experience Optimization
**Micro-Interactions & Feedback:**
- Haptic feedback for important actions (iOS)
- Loading states for all async operations
- Success/error toast notifications
- Smooth transitions between screens
- Pull-to-refresh functionality

**Accessibility Standards (WCAG 2.1 AA):**
```typescript
// Accessible component implementation
const AccessibleButton: FC<AccessibleButtonProps> = ({ 
  title, 
  onPress, 
  accessibilityLabel,
  accessibilityHint 
}) => (
  <TouchableOpacity
    onPress={onPress}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel || title}
    accessibilityHint={accessibilityHint}
    style={styles.button}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
```

**Mobile-First Design Considerations:**
- Touch target minimum 44px (iOS) / 48dp (Android)
- Thumb-friendly navigation zones
- Optimized for one-handed use
- Context-aware bottom sheets
- Native platform conventions

### Trust-Building UI Elements
**Safety & Transparency Features:**
- Walker photo verification badges
- Real-time location sharing indicators
- Secure payment icons and messaging
- Rating and review prominence
- Emergency contact accessibility

**Progressive Disclosure:**
- Simple initial flow, advanced features discoverable
- Contextual help and onboarding
- Smart defaults for common use cases
- Gradual feature introduction

### Performance-Focused UI
**Optimized Rendering:**
```typescript
// Optimized list rendering for walker search
const WalkerList: FC<WalkerListProps> = ({ walkers }) => {
  const renderWalker = useCallback(({ item }: { item: Walker }) => (
    <WalkerCard walker={item} />
  ), []);

  return (
    <FlatList
      data={walkers}
      renderItem={renderWalker}
      keyExtractor={(item) => item.id}
      getItemLayout={getItemLayout} // For better performance
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
```

**Image Optimization:**
- Use Expo Image for better performance
- Implement proper image caching
- Provide placeholder states
- Optimize image sizes for different screen densities

### User Journey Optimization
**Onboarding Excellence:**
1. **Value Proposition**: Clear benefits on welcome screen
2. **Role Selection**: Easy Owner vs Walker choice
3. **Quick Setup**: Minimal required information
4. **Trust Building**: Safety features explanation
5. **First Success**: Guide to first booking/job

**Navigation Patterns:**
- Bottom tab navigation for primary functions
- Stack navigation for task flows
- Modal presentations for forms
- Deep linking support for notifications

## Key Challenges & Mitigation Strategies

### Operational Challenges
**"Chicken-and-Egg" Problem**: Need walkers to attract owners, need owners to retain walkers
- **Solution**: "Recruit walkers first" strategy with sign-up bonuses and guaranteed minimum earnings
- **Focus**: Achieve liquidity in small, concentrated geographic areas before expanding

**Supply/Demand Imbalances**: Peak hours, holidays, seasonal variations
- **Solution**: Dynamic pricing (surge for owners, boost pay for walkers)
- **Tools**: Scheduling features for recurring walker availability

### Trust & Safety Challenges
**Pet Safety & Walker Reliability**: Risk of lost pets, injuries, property damage
- **Solution**: Rigorous multi-stage vetting, comprehensive liability insurance
- **Support**: 24/7 emergency line, clear incident reporting procedures

**Building Owner Trust**: Protective pet owners need confidence
- **Solution**: Transparency (GPS tracking, photo updates, detailed reports)
- **Features**: Prominent reviews, "Meet & Greet" option, vetting process visibility

### Key Performance Indicators (KPIs)

**Growth Metrics**:
- Active users (owners & walkers) - monthly/weekly
- Walk completion rate and volume
- Gross Booking Value (GBV) before commission
- Geographic expansion rate
- New user acquisition rate

**Engagement Metrics**:
- Walks per active owner (loyalty indicator)
- Walker acceptance rate (supply efficiency)
- User retention rates (owners & walkers)
- Average session duration and frequency

**Quality Metrics**:
- Average walk ratings (both directions)
- Incident rate per X walks
- Customer support resolution time
- Net Promoter Score (NPS)
- App store ratings and reviews

**Financial Metrics**:
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (LTV)
- Net revenue after commissions
- Profit margins and unit economics
