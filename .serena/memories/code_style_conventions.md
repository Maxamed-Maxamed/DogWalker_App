# Dog Walker App - Code Style & Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled (`strict: true`)
- **Target**: ES2020 (via expo tsconfig.base)
- **Module**: ES modules
- **JSX**: React 19

## Import Path Convention
- Use `@/` prefix for all internal imports (configured in tsconfig.json)
- Example: `import { ThemedView } from '@/components/themed-view';`
- Never use relative paths like `../../../components`

## Component Conventions

### Functional Components
```typescript
// Always use functional components with TypeScript
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  return <View>...</View>;
}
```

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities/Hooks: camelCase (e.g., `useAuthStore.ts`, `formatDate.ts`)
- Tests: `ComponentName.test.ts`

### Styling Pattern
```typescript
// Always use StyleSheet.create() at end of file
import { StyleSheet } from 'react-native';

export function MyComponent() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

## Theme & Colors
- Access theme via `useColorScheme()` hook
- Use theme colors from `constants/theme.ts`
- Example: `const colors = Colors[colorScheme ?? 'light'];`
- Support both light and dark modes

## Zustand Store Pattern
```typescript
import { create } from 'zustand';

type MyStoreState = {
  value: string;
  setValue: (value: string) => void;
};

export const useMyStore = create<MyStoreState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

## Error Handling
- Use try-catch blocks in async operations
- Throw descriptive errors with context
- Log errors (for debugging in dev mode)
- Show user-friendly error messages in UI
- Example pattern:
```typescript
try {
  // operation
} catch (error) {
  console.error('Operation failed:', error);
  Alert.alert('Error', 'User-friendly message');
}
```

## Naming Conventions
- **PascalCase**: Components, Types, Interfaces, Classes
- **camelCase**: Functions, variables, methods
- **UPPER_SNAKE_CASE**: Constants (use sparingly)
- **Boolean variables**: Prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`)

## Async/Await
- Prefer async/await over .then().catch()
- Always handle errors with try-catch
- Use `useCallback` for memoized event handlers with deps

## React Hooks
- Place hooks at top level of components
- Use custom hooks for reusable logic
- Document hook parameters and return values
- Example:
```typescript
const { user } = useAuthStore();
const [loading, setLoading] = useState(false);
const handlePress = useCallback(() => { ... }, [dependency]);
```

## Type Safety
- Always define Props interfaces
- Use explicit return types on functions
- Avoid `any` type (use `unknown` with type guards instead)
- Export types from modules where applicable

## Navigation Patterns (Expo Router)
- Use typed routes (enabled in app.json)
- Link navigation: `<Link href="/dashboard">Dashboard</Link>`
- Programmatic navigation: `router.push('/dashboard')`
- Navigate between screens with explicit paths

## Component Organization in Files
1. Imports (alphabetically, groups: React, external, internal)
2. Types/Interfaces (Props, State, etc.)
3. Main component function
4. Export statement
5. StyleSheet.create()

Example:
```typescript
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAuthStore } from '@/stores/authStore';

interface DashboardProps {
  title?: string;
}

export function Dashboard({ title }: DashboardProps) {
  // Implementation
}

const styles = StyleSheet.create({
  // Styles
});
```

## Comments & Documentation
- Use JSDoc for exported functions/types
- Comment "why", not "what" the code does
- Avoid obvious comments
- Example:
```typescript
/**
 * Authenticate user with email and password.
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to authenticated user
 */
export async function loginUser(email: string, password: string) {
  // Implementation
}
```

## ESLint Rules
- Based on `eslint-config-expo/flat.js`
- Enforces React best practices
- Catches common mistakes
- Must pass linting before commit

## Formatting
- **Prettier**: Auto-formats on save (recommended)
- **Line Length**: 100 characters (Prettier default)
- **Quotes**: Single quotes (Prettier default)
- **Semicolons**: Yes (Prettier default)
- **Trailing Commas**: ES5 compatible (Prettier default)

## Platform-Specific Code
- Use `Platform.select()` for platform-specific imports/logic
- Use `Platform.OS === 'ios'` for conditionals
- Suffix platform-specific files: `.ios.ts`, `.android.ts`, `.web.ts`
- Example: `icon-symbol.ios.tsx` vs `icon-symbol.tsx`

## Supabase Integration
- Initialize client in `utils/supabase.ts`
- Use typed queries with TypeScript
- Handle auth state via Zustand store
- Always validate response data
- Handle network errors gracefully
