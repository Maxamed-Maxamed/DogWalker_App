# Local Sentry Test & Verification

These quick steps help you validate Sentry integration locally and verify sourcemap mapping. They are written to be copy-paste ready.

1) Quick runtime test (dev)
- Add a temporary test capture after your Sentry init (e.g. in `app/index.tsx`):

```ts
import * as Sentry from '@sentry/react-native';

// after Sentry.init()
Sentry.captureException(new Error('Sentry test — local development'));
```

- Run the app with `npx expo start` and open the app on a device/emulator. Check Sentry for the test event.

2) Runtime crash button
- Add a button to a screen to trigger an uncaught error:

```tsx
<Button title="Crash test" onPress={() => { throw new Error('Crash test'); }} />
```

3) Create release & upload sourcemaps (local / CI)
- Example sequence (replace `RELEASE_NAME` with the `release` value used in `Sentry.init`):

```bash
# example: myapp@1.2.3
RELEASE_NAME="myapp@1.2.3"

# create release
npx sentry-cli releases new "$RELEASE_NAME"

# set commits (optional)
npx sentry-cli releases set-commits "$RELEASE_NAME" --auto

# upload sourcemaps (upload sources from build output dir)
npx sentry-cli releases files "$RELEASE_NAME" upload-sourcemaps ./ --ext map --ext js --rewrite

# finalize
npx sentry-cli releases finalize "$RELEASE_NAME"
```

Notes:
- For Expo managed apps, run the sourcemap upload step in CI/EAS after build artifact generation. Use `SENTRY_AUTH_TOKEN` stored in CI secrets.
- If you cannot upload sourcemaps locally, runtime events will still appear in Sentry but stack traces may be minified.

4) Verify in Sentry
- Confirm the event's stack traces are mapped to original sources and that the `release` shown for the event matches the `RELEASE_NAME` you uploaded.

5) Want me to run a dry-run here?
- I can attempt a dry-run of `sentry-cli` commands in this environment (it will fail without `SENTRY_AUTH_TOKEN`). If you'd like, I can instead craft a CI snippet for GitHub Actions or an `eas.json` hook to upload sourcemaps during EAS builds.
