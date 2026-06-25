# DroneLab

[![Product](https://img.shields.io/badge/Product-3D_Drone_Builder-C7FF3D?style=for-the-badge)](https://github.com/dhruvtoprani/DroneLab)
[![Engineering](https://img.shields.io/badge/Engineering-Compatibility_Engine-7C5CFF?style=for-the-badge)](https://github.com/dhruvtoprani/DroneLab)
[![Stack](https://img.shields.io/badge/Stack-Next.js_%2B_Three.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Simulation](https://img.shields.io/badge/Focus-Performance_Estimation-FF6B3D?style=for-the-badge)](https://github.com/dhruvtoprani/DroneLab)

DroneLab is a 3D FPV drone builder that helps a hobbyist, student team, or early drone builder choose compatible parts, understand build tradeoffs, and export a bill of materials before buying hardware.

The product turns drone configuration into a visual workflow: choose a mission goal, assemble parts in 3D, catch compatibility issues, estimate performance, and understand whether the build is safe, useful, and worth purchasing.

**Links:** [Source repository](https://github.com/dhruvtoprani/DroneLab) · [Product requirements](docs/PRD.md) · [Current context](docs/CONTEXT.md) · [Next steps](docs/NEXT_STEPS.md) · [Architecture](#architecture) · [Local development](#local-development)

## Problem

FPV drone building is powerful but easy to get wrong.

A beginner has to reason across frame size, motor KV, propeller diameter, battery voltage, ESC current rating, stack mounting, camera fit, payload weight, price, and estimated flight time. Most of that knowledge is scattered across product pages, forums, spreadsheets, and build videos.

DroneLab closes that gap by giving users one place to answer the core build question:

> Will this drone build actually work before I spend money on the parts?

## Who It Helps

| User | Need | DroneLab value |
| --- | --- | --- |
| New FPV builders | Avoid incompatible or unsafe part combinations | Beginner-readable warnings, suggested fixes, and build readiness checks |
| Robotics and student teams | Plan quadcopter builds around mission, payload, and budget constraints | Fast comparison of cost, weight, thrust-to-weight, flight time, and payload reserve |
| FPV hobbyists | Explore tradeoffs before ordering parts | 3D build preview, part swaps, BOM export, and shareable build summaries |
| Drone educators | Teach system-level hardware tradeoffs | Transparent calculations for electrical, mechanical, and performance assumptions |

## Product Goals

DroneLab is designed around five product outcomes:

1. **Make drone building visual.** Users should understand what they are assembling, not just fill out a parts list.
2. **Catch bad builds early.** Compatibility checks should flag unsafe, impossible, or low-confidence combinations before purchase.
3. **Explain engineering tradeoffs.** Every estimate should connect back to cost, weight, current, thrust, flight time, payload, and mission fit.
4. **Support confident iteration.** Users should be able to swap parts and instantly see how the build changes.
5. **Create a clean handoff.** A finished build should produce a BOM, export file, and shareable summary that can move into buying, review, or team planning.

## End State

The long-term version of DroneLab is a mission-based drone configuration and optimization platform:

- Mission-first build setup for freestyle, racing, cinematic, long-range, payload, and beginner drones.
- Real manufacturer-backed part catalog with source confidence and price history.
- Constraint-aware recommendations that rank valid builds by budget, flight time, payload, safety margin, and use case.
- Real GLB/CAD asset pipeline for higher-fidelity part visualization.
- Authenticated workspaces for saved builds, team reviews, and public build sharing.
- Calibration against thrust tests, battery behavior, and real flight logs.
- Explainable AI assistance grounded only in structured product and engineering data.

The current MVP proves the core loop: choose a mission, assemble parts, validate compatibility, estimate performance, export the build, and share a summary.

## Demo Flow

1. Choose a mission profile such as beginner, freestyle, racing, cinematic, long-range, or payload.
2. Select a budget and open the builder.
3. Pick parts across frame, motors, propellers, battery, ESC, flight controller, camera, receiver, VTX, antenna, and optional payload.
4. Watch the generated 3D drone update as parts change.
5. Review live engineering stats for weight, cost, flight time, thrust-to-weight, current draw, and payload reserve.
6. Read compatibility warnings and suggested fixes.
7. Copy a BOM, export CSV/JSON, save locally, or generate a shareable build summary.

## Product Surface

| Surface | Purpose |
| --- | --- |
| Landing page | Explain the product and route users into the builder |
| Three-panel builder | Combine catalog, 3D assembly, and engineering report in one workspace |
| Explore page | Browse curated builds and generated recommendations |
| Public build pages | Share a build summary with compatibility, stats, and BOM export |
| Part detail pages | Inspect normalized specs, source status, and example usage |
| API routes | Support products, build calculations, recommendations, and saved-build contracts |

## Product Snapshot

| Area | Status |
| --- | --- |
| Product type | 3D hardware configurator and engineering checker |
| Core question | Will this drone build actually work before I buy the parts? |
| Builder experience | Catalog, generated 3D assembly, live stats, warnings, exports, and share links |
| Engineering layer | Weight, cost, battery, current, thrust, flight-time, payload, budget, and compatibility calculations |
| Persistence | Local save and encoded share links by default; durable saved builds when `DATABASE_URL` is configured |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| 3D layer | React Three Fiber, Drei, Three.js |
| Data layer | Curated JSON seed catalog, Prisma 7 schema, Supabase/Postgres-ready contract |

## What Works

- Interactive 3D quadcopter assembly using generated geometry.
- WebGL fallback that preserves the engineering workflow if 3D is unavailable.
- Mission profile and budget controls.
- Curated FPV part catalog across all core build categories.
- Compatibility checks for required parts, prop fit, voltage, current, mounting, camera fit, payload, and budget.
- Transparent estimates for weight, cost, thrust-to-weight, current draw, flight time, and payload reserve.
- Beginner-readable warnings and suggested fixes.
- Builder viewport HUD with completion percentage, build status, and readiness guidance.
- Exploded-view interpolation and clickable 3D part focus.
- Local build saving, copyable BOM, CSV export, JSON export, and shareable build URLs.
- Explore gallery with curated and generated recommendations.
- Public build summary pages and part intelligence pages.
- Product, public build, calculation, recommendation, and saved-build APIs.
- Prisma 7 schema, config, migration, and Supabase-ready durable-build path.
- Vitest coverage for the engineering engine and recommendations.
- GitHub Actions CI for lint, test, and build.

## Key Product Decisions

- **Mission first:** The builder starts from what the user wants the drone to do, not from a blank parts spreadsheet.
- **Visual confidence:** Generated 3D geometry makes the build feel tangible before real CAD assets exist.
- **Explainable checks:** Compatibility warnings are written for builders, not just engineers.
- **Fallback resilient:** Encoded share links and local saves keep the app useful without a database.
- **Seed data before scraping:** A curated catalog keeps the first version trustworthy before adding live vendor data.
- **Planning, not certification:** Estimates support education and purchasing decisions, not final safety approval.

## Architecture

```mermaid
flowchart LR
  A[Seed Part Catalog] --> B[Builder State]
  B --> C[3D Assembly]
  B --> D[Compatibility Engine]
  B --> E[Performance Calculations]
  D --> F[Warnings + Suggestions]
  E --> G[Build Stats]
  F --> H[Build Summary / BOM]
  G --> H
  H --> I[CSV / JSON / Share Link]
```

The MVP intentionally uses generated geometry and curated seed data before adding live product sources, external pricing, or real manufacturer CAD files.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **3D:** React Three Fiber, Drei, Three.js
- **State:** Zustand
- **Validation:** Zod
- **Styling:** Tailwind CSS, shadcn-style components
- **Data:** Curated JSON seed catalog
- **Database contract:** Prisma 7 schema and SQL migration for Postgres
- **Engineering engine:** Pure TypeScript calculation and compatibility modules

## Project Structure

```text
DroneLab/
├── src/
│   ├── app/                  # Pages and API routes
│   │   ├── explore/          # Curated and generated build gallery
│   │   ├── builds/           # Public build summaries
│   │   └── parts/            # Part intelligence pages
│   ├── components/builder/   # Catalog, stats, and builder workspace
│   ├── components/builds/    # Build summary UI
│   ├── components/three/     # Generated 3D drone assembly
│   ├── components/ui/        # Reusable UI primitives
│   ├── lib/
│   │   ├── builds/           # Build serialization and BOM export helpers
│   │   ├── compatibility/    # Calculations, checks, scoring, and suggestions
│   │   ├── data/             # Catalog access helpers
│   │   ├── recommendations/  # Brute-force build ranking
│   │   ├── server/           # Saved-build repository abstraction
│   │   └── types/            # Product and build contracts
│   └── store/                # Zustand builder state
├── data/seed/                # Curated starter product catalog
├── docs/                     # PRD, context, dev log, and next steps
├── prisma/                   # Prisma schema and SQL migration contract
└── public/models/            # Future GLB asset pipeline
```

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The builder is available at:

```text
http://localhost:3000/builder
```

## Validation

```bash
npm run lint
npm test
DATABASE_URL=postgresql://user:password@localhost:5432/dronelab npm run db:validate
npm run build
```

## Database Readiness

The app is runnable without external services. Saved builds use server APIs plus encoded share-link fallback unless a durable database is attached.

The Postgres contract is already present:

- `prisma/schema.prisma`
- `prisma.config.ts`
- `prisma/migrations/000001_init/migration.sql`
- `.env.example`

When `DATABASE_URL` is configured, `src/lib/server/buildRepository.ts` uses Prisma 7 with the Postgres driver adapter for durable saved-build CRUD. Without that env var, saved builds fall back to encoded share links so the app remains runnable in local and preview environments.

## Deployment Readiness

DroneLab is structured as a standard Next.js application and can be deployed on Vercel once environment variables are configured.

Required for durable saved builds:

```bash
DATABASE_URL=postgresql://...
```

Without `DATABASE_URL`, the app still supports local saves, encoded share links, CSV export, JSON export, and public summary pages generated from share-link data.

No public production URL is currently recorded in this repository.

## Limitations

- Estimates are approximate and intended for planning and education.
- Seed thrust and current values are illustrative until validated against real source data.
- Flight-time estimates omit battery sag, aerodynamic drag, weather, and detailed throttle curves.
- The MVP does not generate wiring diagrams, firmware configuration, legal guidance, or certification outputs.
- Product pricing and inventory are not live.
- Generated geometry is used until the real GLB/CAD import pipeline is added.

Always verify manufacturer specifications, wiring requirements, firmware setup, safety guidance, and local regulations before purchasing or flying a drone.

## Roadmap

- Add database seed/import scripts for curated products and example builds.
- Add Supabase Auth and authenticated saved-build ownership.
- Expand the catalog with manufacturer-sourced, confidence-tagged real parts.
- Add live/manual price source records and scheduled refresh hooks.
- Implement the controlled GLB import and optimization script from `docs/MODEL_IMPORT_PIPELINE.md`.
- Add center-of-mass and battery-position controls.
- Add build comparison and Pareto tradeoff views.
- Calibrate estimates with real thrust tests and flight logs.
- Add browser coverage for WebGL-disabled and mobile touch states.
