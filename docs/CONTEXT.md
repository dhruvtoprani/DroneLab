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
- Lazy Prisma client initialization with the Postgres adapter
- Supabase Postgres is the production database, connected through the Supabase
  transaction pooler via Vercel's sensitive `DATABASE_URL` environment variable

## Current Data Model

Products are discriminated unions keyed by category. Builds store a goal, budget,
and a partial category-to-product-ID map. Calculation output contains engineering
stats, warnings, suggestions, status, scores, and recommended use case.

Motor performance prefers an exact motor, propeller, and cell-count thrust row.
When no row exists, the calculation engine uses a documented rough fallback.

Database-ready tables are defined for `products`, `builds`, `model_assets`, and
`price_sources`. Prisma 7 is configured through `prisma.config.ts`; the
datasource URL must not live in `schema.prisma`.

The initial schema has been applied to the Supabase production project. Runtime
saved builds use Prisma with `@prisma/adapter-pg`; Supabase pooler URLs receive
an explicit TLS config in `src/lib/server/prisma.ts` so Vercel functions can
connect reliably.

## Current Build Status

Implemented:

- Landing page
- Three-panel builder
- Generated frame, motors, propellers, battery, boards, camera, antenna, and payload
- Orbit, zoom, hover highlighting, and exploded view
- Technical 3D scene polish: landing-pad floor rings, part labels, snap markers,
  standoffs, screw details, prop motion discs, and missing-part ghost outlines
- Smooth exploded-view interpolation for selected part positions
- Clickable 3D part focus: selecting a generated part isolates it visually and
  switches the catalog to the matching category
- WebGL unsupported-device fallback for the 3D viewport
- Live part selection and mission profile controls
- Builder viewport HUD with completion percentage, build status, and readiness
  guidance
- Catalog build checklist progress and focus-based part highlighting
- Engineering report score breakdown and electrical margin diagnostics
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
- Durable saved-build create/read/update/duplicate through Prisma and Supabase
  Postgres when `DATABASE_URL` is configured
- Vercel production has `DATABASE_URL` configured for Supabase persistence
- Community model import policy documented in `docs/MODEL_IMPORT_PIPELINE.md`
- `public/models/community/` exists as the local intake placeholder folder

Not implemented:

- Auth
- Product catalog database seeding/import
- Automated GLB model import/optimization pipeline
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
- Prefer product-experience improvements that clarify the current engineering
  model before adding new feature surfaces.
- Community/imported models must pass license, scale, optimization, and
  provenance checks before they can become runtime GLB assets.

## Known Risks

- Seed thrust and current values are illustrative and need real source validation.
- Flight-time estimates intentionally omit battery sag, aerodynamic drag, and
  detailed throttle curves.
- Mobile touch behavior still requires verification.
- Three.js emits local development deprecation warnings from dependencies, but
  the polished builder had no observed app runtime errors during browser smoke
  testing.
- Browser verification for the part-selection checkpoint was blocked by the
  in-app browser security policy for `127.0.0.1:3000`.
- Saved builds still fall back to encoded share links in local/preview
  environments without `DATABASE_URL`.
- The production database contains runtime saved builds, but products are still
  loaded from static JSON until the catalog import path is added.

## Next Major Steps

1. Add database seed/import scripts for curated products and example builds.
2. Add Supabase Auth and saved-build ownership.
3. Expand catalog with real sourced parts and confidence metadata.
4. Implement the controlled GLB import and optimization script from
   `docs/MODEL_IMPORT_PIPELINE.md`.
5. Add live/manual price source records and scheduled refresh hooks.
6. Add browser coverage for WebGL-disabled and mobile touch states.
