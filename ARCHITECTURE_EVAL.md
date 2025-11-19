# Sentry Integration — Architecture Evaluation

Summary
- Goal: Integrate Sentry into the Expo React Native app to capture JS errors, native crashes, and performance traces while protecting user privacy and minimizing cost/overhead.

Approach & Thinking Modes
- Sequential (linear): enumerate steps required for safe, reliable integration and release management (init early, configure environment/release, upload sourcemaps, verify in CI/EAS).
- Rubik's (multi-dimensional): analyze trade-offs across dimensions — reliability, performance, privacy, cost, operability — and propose a balanced configuration.

Choices Considered
1. Client-only JS reporting (lightweight)
   - Pros: simple, low cost, immediate visibility of JS errors.
   - Cons: misses native crashes, limited stacktrace fidelity without sourcemaps.

2. Full client + native SDK (recommended)
   - Pros: captures native crashes, sessions, better fidelity; Sentry's React Native SDK supports both JS and native with single integration.
   - Cons: slightly larger binary surface area, needs release/sourcemap pipeline.

3. Client instrumentation + server-side error aggregation (hybrid)
   - Pros: can limit PII on client and enrich events server-side; useful for sensitive data masking and centralizing SDK decisions.
   - Cons: higher latency to surface issues, requires backend for event forwarding and increases infra complexity.

Trade-off Matrix (key dimensions)
- Reliability: Full client+native wins — captures the most failure modes.
- Performance: Use sampling (tracesSampleRate) and environment gating to keep overhead low.
- Privacy/Compliance: Prefer client-side scrubbing + server-side filters for PII. Do not send raw location/payment info. Use beforeSend to redact fields.
- Cost: Limit session capture and tracing in prod (low sampling until needed). Use rate limits and environment-specific settings.
- Operability: Automated release/sourcemap upload (EAS/CI) is required for readable stack traces — invest in CI secret management (`SENTRY_AUTH_TOKEN`).

Recommended Configuration (practical)
- Initialize Sentry as early as possible in `app/index.tsx` with `autoInitializeNativeSdk: true`.
- Set `release` from Expo `slug@version` and set `environment` from build (__DEV__ toggles during development).
- Keep `tracesSampleRate` 0 in dev, small (e.g. 0.05–0.2) in production; increase temporarily when debugging.
- Implement `beforeSend` to scrub PII and enable `enableNative` for native crash capture.
- Add `sentry-cli` release scripts and upload sourcemaps during CI/EAS builds. Store `SENTRY_AUTH_TOKEN` in CI secrets — never commit it.

Operational Checklist
- CI: add `SENTRY_AUTH_TOKEN` and run `npm run sentry:release:all` after build artifact generation (EAS build, or web/metro bundle step).
- Local testing: use a dev DSN or disable sends via `environment === 'development'` or `SENTRY_SEND=false` env var.
- Monitoring: add SLA for error triage and alerting thresholds in Sentry (errors/day, crash rate spikes).
- Privacy: document all captured fields and implement code-level scrubbing for sensitive keys.

Alternatives & When To Use Them
- If you cannot upload sourcemaps: use stack-walking and source context, but plan to add sourcemaps as soon as possible.
- If app must avoid any third-party crash reporting: implement a server-side error ingestion pipeline (higher operational overhead) and consider on-prem Sentry hosting.

Risks & Mitigations
- Risk: PII leakage — Mitigate with `beforeSend` and strict SDK config, audit event payloads in Sentry.
- Risk: Cost from tracing/session capture — Mitigate with low sampling + budget alerts.
- Risk: Broken sourcemaps → unreadable traces — Mitigate by automating `sentry-cli` upload in CI with reproducible release names.

Conclusion
- For this Expo-managed app, the balanced choice is Full client+native Sentry SDK with careful sampling, PII scrubbing, and automated release/sourcemap uploads in CI/EAS. This provides the best visibility into real crashes while keeping operational cost and privacy risks manageable.

Next steps
- Complete CI/EAS pipeline steps to upload releases and sourcemaps. Verify a test release and mapped stack traces in Sentry.
- Run focused Codacy security fixes for the high-priority SCA findings (see Codacy SRM results).
