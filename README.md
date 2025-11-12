# 🐕 Dog Walker App

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-000000.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/d43aca97a4bd4671ac58c657eda50c7e)]
![JSON](https://img.shields.io/badge/JSON-000000.svg)
![Markdown](https://img.shields.io/badge/Markdown-000000.svg?logo=markdown)
![npm](https://img.shields.io/badge/npm-CB3837.svg?logo=npm&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?logo=prettier&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?logo=javascript&logoColor=black)
![Bash](https://img.shields.io/badge/Bash-4EAA25.svg?logo=gnu-bash&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB.svg?logo=react&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?logo=githubactions&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020.svg?logo=expo&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?logo=eslint&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991.svg?logo=openai&logoColor=white)
![YAML](https://img.shields.io/badge/YAML-CB171E.svg?logo=yaml&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933.svg?logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB.svg?logo=python&logoColor=white)
[![Supabase](https://img.shields.io/badge/Supabase-000000.svg?logo=supabase&logoColor=white)](https://supabase.com/docs)


**Safe, trusted dog walking at your fingertips** 🎯

Dog Walker is a technology-first platform engineered to become the most trusted and convenient dog walking service for pet owners. This React Native/Expo app provides pet owners with peace of mind through a seamless, safe, and transparent booking experience with professional dog walking services.

## 🌟 Features

### Core Features
- **🔐 Secure Authentication** - Pet owner registration with profile creation
- **🐾 Pet Profiles** - Detailed pet information (breed, age, medical history, photos)
- **📱 Instant Booking** - Book available professional walkers on-demand
- **📅 Advanced Scheduling** - Recurring walks and future bookings
- **📍 Live GPS Tracking** - Real-time walk tracking with map interface
- **📸 Photo Updates** - Timestamped photos during walks
- **💳 Secure Payments** - Multiple payment methods with transparent pricing
- **🔔 Push Notifications** - Booking confirmations, walk updates, and alerts

### Trust & Safety Features
- **✅ Multi-Stage Walker Vetting** - Comprehensive background checks and verification
- **🤝 Meet & Greet Option** - Free introductory meetings before first walk
- **🚨 24/7 Emergency Support** - Dedicated emergency contact and support
- **📊 Walk Verification** - GPS data, timestamps, and photos verify completion
- **🔒 Two-Factor Authentication** - Secure account access for all users
- **🏥 Emergency Contacts** - Vet info and emergency contacts accessible to walkers

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router v6 with file-based routing (typed routes)
- **Language**: TypeScript with strict mode enabled
- **State Management**: Zustand for auth, app state, and navigation
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: StyleSheet API with custom theme system
- **Storage**: Expo SecureStore (native) and AsyncStorage (web)
- **Package Manager**: pnpm with workspace configuration
- **Platform Support**: iOS, Android, and Web

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio (for emulators)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Maxamed-Maxamed/DogWalker_App.git
   cd DogWalker_App
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Edit .env.local and add your Supabase credentials:
   # EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   # EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   pnpm start
   ```

5. **Run on your preferred platform**
   ```bash
   # iOS Simulator (Mac only)
   pnpm ios
   
   # Android Emulator
   pnpm android
   
   # Web browser
   pnpm web
   ```

### Development Commands

```bash
# Start development server
pnpm start

# Platform-specific development
pnpm ios          # iOS Simulator
pnpm android      # Android Emulator  
pnpm web          # Web browser

# Code quality
pnpm lint         # ESLint checks
pnpm type-check   # TypeScript checks

# Reset project (when needed)
pnpm reset-project
```

## 📁 Project Structure

```
app/
├── _layout.tsx              # Root layout with theme provider
├── index.tsx                # App entry point
├── (tabs)/                  # Main tab navigation
│   ├── _layout.tsx         # Tab layout configuration
│   ├── dashboard.tsx       # Pet owner dashboard
│   └── explore.tsx         # Walker discovery
├── auth/                   # Authentication flow
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── profile-setup/          # User profile setup
│   ├── index.tsx
│   ├── phone.tsx
│   ├── photo.tsx
│   └── location.tsx
└── welcome/                # Onboarding flow
    ├── index.tsx
    ├── onboarding.tsx
    └── get-started.tsx

components/                 # Reusable UI components
├── ui/                    # Base UI components
│   ├── icon-symbol.tsx
│   └── collapsible.tsx
├── themed-text.tsx        # Themed text component
├── themed-view.tsx        # Themed view component
└── haptic-tab.tsx         # Tab with haptic feedback

constants/
└── theme.ts               # Design system and theme configuration

hooks/                     # Custom React hooks
├── use-color-scheme.ts
└── use-theme-color.ts

stores/                    # Zustand state stores
├── authStore.ts           # Authentication state
├── appStateStore.ts       # App initialization and settings
└── navigationStore.ts     # Navigation state

utils/                     # Utility functions
├── supabase.ts            # Supabase client configuration
└── supabaseTest.ts        # Connection testing utilities
```

## 🎨 Design System

The app follows a clean, professional design inspired by Uber's simplicity:

- **Colors**: Black and white primary palette with blue accents
- **Typography**: Platform-native fonts (SF Pro, Roboto)
- **Theming**: Dual theme support (light/dark) with `useColorScheme()`
- **Components**: Consistent themed components (`ThemedView`, `ThemedText`)
- **Accessibility**: Full accessibility support with proper contrast and touch targets

## 🌐 Navigation Architecture

Built with Expo Router v6 using file-based routing:

- **Root Layout**: Theme provider and stack navigation
- **Tab Navigation**: Main app navigation using bottom tabs
- **Authentication Flow**: Login, register, forgot password screens
- **Onboarding Flow**: Welcome and user setup screens
- **Deep Linking**: Support for `dogwalker://` and `https://dogwalker.app` schemes

## 🔐 Security & Privacy

- **Data Protection**: Chunked secure storage with Expo SecureStore (bypasses 2KB limit)
- **Authentication**: Supabase Auth with JWT tokens and automatic refresh
- **Session Management**: Persistent sessions with secure token storage
- **API Security**: Row-level security policies in Supabase
- **Privacy**: GDPR/CCPA compliant data handling
- **Vulnerability Scanning**: Automated security checks with Codacy
- **Environment Security**: Sensitive keys stored in .env.local (not committed)

## 🧪 Testing Strategy

- **Unit Tests**: 70% coverage target with Jest
- **Integration Tests**: 20% coverage for critical flows
- **E2E Tests**: 10% coverage for complete user journeys
- **Performance Tests**: Bundle size and render performance monitoring

## 📱 Supported Platforms

- **iOS**: 13.0+ (iPhone and iPad)
- **Android**: API 21+ (Android 5.0+)
- **Web**: Modern browsers with React Native Web

## 🚀 Deployment

- **Development**: Expo Development Build
- **Staging**: Expo Application Services (EAS) Preview
- **Production**: App Store and Google Play Store via EAS Build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@dogwalker.app
- **Issues**: [GitHub Issues](https://github.com/Maxamed-Maxamed/DogWalker_App/issues)
- **Documentation**: [Project Wiki](https://github.com/Maxamed-Maxamed/DogWalker_App/wiki)

---

**Made with ❤️ for pet owners who want the best care for their furry friends** 🐕‍🦺
