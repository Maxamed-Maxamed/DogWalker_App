# Week 2 Execution Plan

## Overview
Week 2 focuses on walker discovery and booking foundations while enforcing the architecture/state/observability guardrails established in Week 1. Each day targets one high-impact theme so progress stays measurable and Codacy/Sentry checks remain lightweight.

## Daily Task Breakdown

| Day | Objective | Key Tasks | Reference & Verification |
| --- | --- | --- | --- |
| **Day 1** | Architecture layering | Document bootstrap → auth → tabs flow, capture decisions in `document/MVP_Development_Plan.md`. | Review Expo Router guidance via Context7 (`/expo/expo`), log questions; run MCP Codacy analysis on touched docs. |
| **Day 2** | Harden Zustand stores | Audit `stores/appStateStore.ts`, `authStore.ts`, `navigationStore.ts`, `splashScreenStore.tsx`; add selectors/tests. | Consult Context7 (`/pmndrs/zustand`) for best practices; verify changes with Codacy MCP. |
| **Day 3** | Navigation & onboarding polish | Refine `(tabs)` layout, deep links, onboarding slides (`app/(tabs)/*.tsx`, `app/welcome/*`). | Pull Context7 Expo Router deep-link docs; rerun Codacy MCP after edits. |
| **Day 4** | API + env validation | Add `utils/env.ts`, centralized API client, Supabase wrappers; sync with `database/schema.sql`. | Use Context7 (`/supabase/supabase`) references; if deps change run Codacy MCP with `tool=trivy`. |
| **Day 5** | Maintainability & hygiene | Extract shared UI (auth/pets), trim screens >300 LOC, add lint/test scaffolding. | Reference Context7 (`/facebook/react`) for composition patterns; ensure Codacy clean run. |
| **Day 6** | Observability & Sentry | Wire `utils/monitoring/sentry.ts`, `components/ui/ErrorBoundary.tsx`, stores for breadcrumbs/transactions. | Consult Context7 (`/getsentry/sentry-javascript`); exercise MCP Sentry tools for smoke tests. |
| **Day 7** | QA & regression sweep | Manual/automated runs (`pnpm test`, Expo flows), document findings in `document/WEEK_1_COMPLETION.md`. | Capture defects, run Codacy + Sentry smoke checks, summarize results. |

## Execution Notes
- Keep each day’s pull request scoped to the listed files to simplify Codacy review comments.
- When Context7 references introduce new APIs, capture the link + summary in `document/MVP_Development_Plan.md` for future onboarding.
- After every edit, call the Codacy MCP analysis for the touched files (and Trivy when dependencies change). If Codacy tools remain unavailable, document the attempt in `document/ERROR_FIXES.md` and notify the team.
- Where Sentry instrumentation is added, validate via MCP Sentry tools (issue simulation, trace lookup) and log IDs for traceability.

## Day 1 Deliverables – November 14, 2025

- **Architecture inventory recorded** in `document/MVP_Development_Plan.md` under “Architecture Inventory – November 14, 2025,” covering root layout, entry orchestration, tab surfaces, and Zustand store responsibilities with references to Expo Router guidance (Context7 `/expo/expo`).
- **Gap backlog captured** in the same document (“Architecture Gap Backlog – November 14, 2025”) with issues GW-001 → GW-005 covering navigation-store drift, missing guarded route groups, bootstrap diagnostics, onboarding persistence verification, and absent booking route scaffolding.
- **Next steps**: prioritize GW-001/GW-002 during navigation hardening, feed GW-003 requirements into Day 2 bootstrap refactor, and open booking route scaffolding task before Day 4 navigation work.
