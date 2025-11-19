# Sentry Setup (DogWalker)

This file documents how to create releases and upload sourcemaps for Sentry.

Prerequisites
- `sentry-cli` available (installed via official Sentry installer or npm)
- `SENTRY_AUTH_TOKEN` set in environment or CI secrets
- `EXPO_PUBLIC_SENTRY_DSN` set in `.env.local` for runtime

Local usage
1. Ensure `SENTRY_AUTH_TOKEN` is available locally. Example (PowerShell):

```powershell
setx SENTRY_AUTH_TOKEN "${env:SENTRY_AUTH_TOKEN}"
# Or set in current session: $env:SENTRY_AUTH_TOKEN = 'token-here'
```

2. Build your app (for EAS/production builds prefer EAS):

```bash
# Example with EAS
eas build -p ios --profile production
# Or for Android
eas build -p android --profile production
```

3. After build completes and you have your bundle / sourcemaps, run the release scripts:

```bash
# Creates a release, sets commits, uploads sourcemaps, and finalizes
npm run sentry:release:all
```

Notes
- For Expo Managed workflow, prefer adding sourcemap upload to your CI/EAS pipeline where `SENTRY_AUTH_TOKEN` is stored in CI secrets.
- Do not commit `SENTRY_AUTH_TOKEN` to source control. Keep it in CI secret store or local env files ignored by Git.
- Verify events in Sentry under the configured project and environment.
