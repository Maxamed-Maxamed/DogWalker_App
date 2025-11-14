# Dog Walker App - Development Commands

## Project Initialization & Setup

### First Time Setup
```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials:
# EXPO_PUBLIC_SUPABASE_URL=<your_url>
# EXPO_PUBLIC_SUPABASE_ANON_KEY=<your_key>

# Clean install (if needed)
pnpm reset-project
```

## Running the Application

### Development Mode
```bash
# Start Expo dev server (default)
pnpm start

# iOS Simulator (macOS only)
pnpm ios

# Android Emulator
pnpm android

# Web Browser
pnpm web

# Specific platform with clear console
pnpm start --clear
```

## Code Quality & Linting

### ESLint & TypeScript
```bash
# Run ESLint (built-in expo lint command)
pnpm lint

# Type checking (TypeScript)
pnpm tsc --noEmit

# Both together
pnpm lint && pnpm tsc --noEmit
```

### Codacy Analysis (For Code Quality Review)
```bash
# Run Codacy CLI analysis on a file
codacy-analyze-cli analyze --file <file-path>

# Full repository analysis
codacy-analyze-cli analyze

# Security vulnerability scan (Trivy)
codacy-analyze-cli analyze --tool trivy

# Upload results to Codacy dashboard
codacy-analyze-cli analyze --upload
```

### Formatting (Prettier)
```bash
# Check formatting
pnpm prettier --check .

# Auto-format files
pnpm prettier --write .

# Format specific file
pnpm prettier --write <file-path>
```

## Git Workflow

### Branching
```bash
# View branches
git branch -a

# Create feature branch
git checkout -b feature/<feature-name>

# View current branch
git branch --show-current
```

### Committing
```bash
# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/<feature-name>
```

### Useful Git Commands
```bash
# View status
git status

# View diff
git diff

# View log
git log --oneline -n 10

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View remote origin
git remote -v
```

## Database & Supabase

### Supabase CLI (if installed)
```bash
# View current project
supabase status

# Database schema
# Check database/schema.sql for current schema

# Run migrations
supabase migration list
```

## Testing Commands (Future Implementation)

```bash
# Jest (when configured)
pnpm test

# Test with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## Build & Deployment

### Creating Production Builds (EAS)
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for web
pnpm web

# Preview build (staging)
eas build --platform ios --profile preview
```

## Useful Development Shortcuts

### Clear Cache & Rebuild
```bash
# Clear Expo cache
pnpm start --clear

# Reset project completely
pnpm reset-project

# Clean node_modules and reinstall
rm -r node_modules pnpm-lock.yaml && pnpm install
```

### Platform-Specific Issues
```bash
# iOS specific cache clean
pnpm ios --clear

# Android specific cache clean
pnpm android --clear

# View logs
pnpm start --clear
```

## Windows-Specific Commands

```bash
# List running processes (find emulator PID)
Get-Process | Where-Object {$_.ProcessName -like "*emulator*"}

# Kill Android emulator
Get-Process emulator | Stop-Process -Force

# Open file explorer to project
explorer .

# Environment variable check
$env:EXPO_PUBLIC_SUPABASE_URL
```

## Important Notes
- Always run `pnpm start` before running platform-specific commands
- After modifying dependencies, run `pnpm install` to update lockfile
- Environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in client code
- TypeScript strict mode is enabled - all types must be explicit
- All files use UTF-8 encoding
