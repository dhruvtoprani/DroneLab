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
- Saved-build route handlers in `src/app/api/builds`
- Server-side saved-build repository abstraction in `src/lib/server`
- Prisma 7 schema/config/migration files in `prisma/` and `prisma.config.ts`

## Current Data Model

Products are discriminated unions keyed by category. Builds store a goal, budget,
and a partial category-to-product-ID map. Calculation output contains engineering
stats, warnings, suggestions, status, scores, and recommended use case.

Motor performance prefers an exact motor, propeller, and cell-count thrust row.
When no row exists, the calculation engine uses a documented rough fallback.

Database-ready tables are defined for `products`, `builds`, `model_assets`, and
`price_sources`. Prisma 7 is configured through `prisma.config.ts`; the
datasource URL must not live in `schema.prisma`.

## Current Build Status

Implemented:

- Landing page
- Three-panel builder
- Generated frame, motors, propellers, battery, boards, camera, antenna, and payload
- Orbit, zoom, hover highlighting, and exploded view
- WebGL unsupported-device fallback for the 3D viewport
- Live part selection and mission profile controls
- Full seed coverage for MVP categories
- Core performance and compatibility calculations
- Product listing/detail APIs and build calculation API
- Saved-build create/read/update/duplicate APIs
- Builder save action that calls the server and copies a shareable link
- Prisma schema, config, and SQL migration for the planned Postgres layer
- Local build save, BOM copy, and CSV export
- JSON export and shareable encoded build URLs
- Explore page with curated and generated build recommendations
- Public build summary pages
- Part intelligence pages
- Recommendation and public builds APIs
- Vitest tests and GitHub Actions CI
- Desktop and 390px mobile browser verification

Partially implemented:

- Durable database persistence. API contracts and schema exist, but production
  still needs a database provider and Prisma runtime adapter.

Not implemented:

- Auth
- GLB model pipeline
- Live vendor pricing and availability
- Manufacturer-sourced real catalog expansion

## Important Decisions

- Keep the application runnable without external services.
- Keep encoded share URLs as the production-safe fallback until durable
  persistence is attached.
- Use Prisma 7's config-file datasource pattern.
- Use seed data and generated geometry before adding live vendor data or CAD.
- Keep calculations deterministic and beginner-readable.
- Keep all advanced simulation out of the MVP path.

## Known Risks

- Seed thrust and current values are illustrative and need real source validation.
- Flight-time estimates intentionally omit battery sag, aerodynamic drag, and
  detailed throttle curves.
- Mobile touch behavior still requires verification.
- Saved-build API responses are not durable across server restarts until a real
  Postgres database is wired into the repository.

## Next Major Steps

1. Attach production Postgres and replace the repository fallback with durable
   Prisma CRUD.
2. Add database seed/import scripts for curated products and example builds.
3. Expand catalog with real sourced parts and confidence metadata.
4. Add controlled GLB asset ingestion and optimization scripts.
5. Add live/manual price source records and scheduled refresh hooks.
6. Add browser coverage for WebGL-disabled and mobile touch states.
