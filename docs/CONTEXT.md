# Project Context

## Product Summary

DroneLab is a 3D FPV drone builder and engineering checker. The current product
focus is a polished 5-inch quadcopter flow that lets a user swap parts and see
compatibility, cost, weight, thrust-to-weight, flight time, and payload reserve
update immediately.

## Current Architecture

- Next.js 16 App Router in `src/app`
- Client-side builder shell in `src/components/builder`
- React Three Fiber generated assembly in `src/components/three`
- Zustand state in `src/store/useBuildStore.ts`
- Pure calculation and compatibility modules in `src/lib/compatibility`
- Typed product/build contracts in `src/lib/types`
- Curated JSON catalog in `data/seed`
- Initial read-only product and build calculation route handlers in `src/app/api`

## Current Data Model

Products are discriminated unions keyed by category. Builds store a goal, budget,
and a partial category-to-product-ID map. Calculation output contains engineering
stats, warnings, suggestions, status, scores, and recommended use case.

Motor performance prefers an exact motor, propeller, and cell-count thrust row.
When no row exists, the calculation engine uses a documented rough fallback.

## Current Build Status

Implemented:

- Landing page
- Three-panel builder
- Generated frame, motors, propellers, battery, boards, camera, antenna, and payload
- Orbit, zoom, hover highlighting, and exploded view
- Live part selection and mission profile controls
- Full seed coverage for MVP categories
- Core performance and compatibility calculations
- Product listing/detail APIs and build calculation API
- Local build save, BOM copy, and CSV export
- JSON export and shareable encoded build URLs
- Explore page with curated and generated build recommendations
- Public build summary pages
- Part intelligence pages
- Recommendation and public builds APIs
- Vitest tests and GitHub Actions CI
- Desktop and 390px mobile browser verification

Not implemented:

- Database persistence and auth
- GLB model pipeline
- Live vendor pricing and availability
- Manufacturer-sourced real catalog expansion

## Important Decisions

- Keep the application runnable without external services.
- Use seed data and generated geometry before adding live vendor data or CAD.
- Keep calculations deterministic and beginner-readable.
- Keep all advanced simulation out of the MVP path.

## Known Risks

- Seed thrust and current values are illustrative and need real source validation.
- Flight-time estimates intentionally omit battery sag, aerodynamic drag, and
  detailed throttle curves.
- Browser WebGL support and mobile touch behavior still require verification.

## Next Major Steps

1. Add Supabase/Prisma persistence and authenticated saved builds.
2. Add WebGL fallback state.
3. Expand catalog with real sourced parts and confidence metadata.
4. Add controlled GLB asset ingestion and optimization scripts.
5. Add live/manual price source records and scheduled refresh hooks.
