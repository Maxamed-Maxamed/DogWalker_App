# Dog Walker App - Project Overview

## Purpose
A React Native/Expo mobile app providing pet owners with a safe, trusted dog walking service platform. Features instant booking, live GPS tracking, professional walker vetting, and secure payments.

## Target User
Pet owners (ages 25-70) in urban/suburban areas who need convenient, trustworthy dog walking services.

## Tech Stack

### Frontend
- **Framework**: React Native 0.81.5 with Expo SDK 54
- **Navigation**: Expo Router v6 (file-based routing with typed routes)
- **Language**: TypeScript 5.9 (strict mode enabled)
- **State Management**: Zustand 5.0.8 (lightweight state store)
- **Styling**: React Native StyleSheet API (custom theme system)
- **UI Libraries**: @rneui/themed, expo vector icons

### Backend/Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT tokens
- **Real-time**: Supabase Real-time for live updates
- **Storage**: Expo SecureStore (chunked for >2KB tokens), AsyncStorage (web fallback)

### Platform Support
- iOS 13.0+ (uses @react-navigation/bottom-tabs, safe-area-context)
- Android API 21+ (edge-to-edge enabled)
- Web (React Native Web 0.21)

### Key Dependencies
- `@supabase/supabase-js` (2.77.0) - Backend client
- `@react-navigation/*` (7.x) - Navigation primitives
- `expo-*` packages (15.0, 16.0, etc.) - Platform APIs
- `react-native-reanimated` (4.1) - Animations
- `openai` (6.7) - AI integration (future feature)

### Package Manager
- **pnpm** with workspace configuration

### Development Tools
- **Linter**: ESLint 9.25 with expo config
- **Formatter**: Prettier 3.6
- **Code Quality**: Codacy CLI (0.2.0) integrated
- **Version Control**: Git

## Development Environment
- Node.js 18+
- Expo CLI (installed globally)
- iOS: XCode with simulators (Mac only)
- Android: Android Studio with emulators
- Web: Browser-based with hot reload

## Code Structure
- `app/` - Expo Router pages (file-based routing)
- `components/` - Reusable React Native components
- `stores/` - Zustand state stores (auth, app, navigation, pets)
- `hooks/` - Custom React hooks (theme, color scheme)
- `constants/` - Design tokens and theme system
- `utils/` - Helper functions (Supabase client, tests)
- `assets/` - Images, animations, fonts
- `android/`, `ios/` - Platform-specific native code

## Key Conventions
- **Imports**: Use `@/` prefix for internal imports (configured in tsconfig.json)
- **Components**: Functional components with TypeScript interfaces
- **File Extensions**: `.tsx` for components, `.ts` for utilities/types
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Styling**: StyleSheet.create() with theme colors from constants/theme.ts
