# Seven-Day Architecture Execution Plan

Each day builds on the previous one (Rubik's-cube style). Finish deliverables before advancing so later layers have a stable base. Run targeted `codacy_cli_analyze` on every edited file and keep Sentry online for regression capture.

## Day 1 – Architecture & Scope Alignment
- Inventory current stacks (`app/_layout.tsx`, stores, navigation) and confirm business priorities.
- Capture gaps/risks as issues; align acceptance criteria and Codacy/Sentry checkpoints.
- Deliverables: updated architecture notes in `document/` + prioritized backlog of gaps.

## Day 2 – Bootstrap & Initialization Hardening
- Refine `bootstrapStore` into declarative phases; ensure idempotent retries.
- Instrument bootstrap with Sentry spans + logs via `useErrorStore`.
- Deliverables: refactored bootstrap flow, tests for failure modes, Codacy clean report.

## Day 3 – State Store Expansion
- Introduce booking/payment stores mirroring `{loading,error,data}` contract.
- Centralize selectors + error fan-out; document store APIs.
- Deliverables: new stores + unit tests + ADR covering state topology.

## Day 4 – Navigation & UI Guards
- Add feature route groups (`app/booking/_layout.tsx`, etc.) with guard components.
- Enforce design tokens + Themed components across new screens.
- Deliverables: navigation map diagram, screen stubs, design-token lint checks.

## Day 5 – Service & API Layering
- Create `services/` modules wrapping Supabase/REST calls with validation, retries, Sentry breadcrumbs.
- Define error taxonomy + secure storage usage per service.
- Deliverables: service scaffolding, sample integration tests, security checklist updates.

## Day 6 – Observability & Performance
- Apply `Sentry.startSpan` to critical flows, enable performance dashboards.
- Add bootstrap duration metric + replay review workflow.
- Deliverables: observability SOP, alerts for slow init, documented response playbook.

## Day 7 – Quality Gate & Wrap-up
- Run full Codacy + tests; fix complexity/duplication regressions.
- Host demo/readout; archive learnings in `document/WEEK_X_COMPLETION.md`.
- Deliverables: final report, merged PRs, backlog of next-phase items.
