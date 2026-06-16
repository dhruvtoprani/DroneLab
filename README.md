# DroneLab

[![Product](https://img.shields.io/badge/Product-3D_Drone_Builder-C7FF3D?style=for-the-badge)](https://github.com/dhruvtoprani/DroneLab)
[![Engineering](https://img.shields.io/badge/Engineering-Compatibility_Engine-7C5CFF?style=for-the-badge)](https://github.com/dhruvtoprani/DroneLab)
[![Stack](https://img.shields.io/badge/Stack-Next.js_%2B_Three.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Simulation](https://img.shields.io/badge/Focus-Performance_Estimation-FF6B3D?style=for-the-badge)](https://github.com/dhruvtoprani/DroneLab)

DroneLab is a 3D FPV drone builder that lets users assemble a quadcopter, validate part compatibility, estimate flight performance, and understand total build cost before buying hardware.

It frames drone building as a product and engineering problem: how can a user choose modular hardware parts, see how they fit together, and understand whether the system is safe, performant, and worth building?

**Links:** [Source repository](https://github.com/dhruvtoprani/DroneLab) · [Product requirements](docs/PRD.md) · [Current context](docs/CONTEXT.md) · [Next steps](docs/NEXT_STEPS.md)

## Product Thesis

FPV drones are modular, technical, and easy to mismatch. A builder has to reason across frame size, motor KV, propeller diameter, battery voltage, ESC current rating, flight controller mounting, camera fit, payload weight, cost, and expected flight time.

DroneLab turns that scattered decision process into one visual workflow:

> Build the drone in 3D, catch compatibility problems, and estimate performance before spending money on parts.

## Product Snapshot

| Area | Signal |
| --- | --- |
| Product type | 3D hardware configurator and engineering checker |
| Core question | Will this drone build actually work before I buy the parts? |
| User surface | Three-panel builder with part catalog, 3D assembly, and live stats |
| Engineering layer | Weight, cost, battery, current, thrust, flight-time, and payload calculations |
| PM signal | Turning a complex technical buying/building workflow into an understandable product experience |

## What DroneLab Demonstrates

- Interactive 3D quadcopter assembly using generated geometry
- Curated FPV part catalog across all core build categories
- Compatibility checks for fit, voltage, current, mounting, payload, and budget
- Transparent performance estimates for weight, cost, thrust-to-weight, and flight time
- Beginner-readable warnings and suggested fixes
- Mission profile and budget controls
- Local build saving
- Copyable BOM, CSV export, JSON export, and shareable build URLs
- Explore gallery with curated and generated recommendations
- Public build summary pages
- Part intelligence/detail pages
- Product, public builds, build-calculation, and recommendation APIs
- Saved-build API contracts with create/read/update/duplicate endpoints
- Prisma 7 schema, config, and SQL migration for the planned Postgres layer
- Vitest coverage for the engineering engine and recommendations
- GitHub Actions CI for lint, test, and build
- Product thinking around modular hardware, simulation, and decision support

## Current Feature Set

| Feature | Status | Purpose |
| --- | --- | --- |
| Landing page | Implemented MVP | Explain the product and route users into the builder |
| Three-panel builder | Implemented MVP | Combine catalog, 3D scene, and engineering stats |
| Generated 3D drone assembly | Implemented MVP | Visualize selected parts without relying on external CAD |
| Seed product catalog | Implemented MVP | Cover frame, motors, props, battery, ESC, FC, camera, receiver, VTX, antenna, and payload |
| Compatibility engine | Implemented MVP | Catch unsafe or invalid part combinations |
| Performance estimates | Implemented MVP | Estimate cost, weight, flight time, current, thrust, and payload reserve |
| BOM copy and CSV export | Implemented MVP | Let users carry the build into a shopping/planning workflow |
| JSON export and share links | Implemented | Move builds between summary pages and the builder without a backend |
| Local build save | Implemented MVP | Preserve one working build without backend dependency |
| Explore page | Implemented | Browse curated builds and generated recommendations |
| Public build summary pages | Implemented | Inspect a build, review compatibility, and export BOMs |
| Part detail pages | Implemented | Show normalized specs, source status, and example usage |
| Recommendation engine | Implemented | Generate best builds from user goal and budget |
| Saved build APIs | Implemented contract | Create, read, update, and duplicate builds with share-link fallback |
| Prisma/Postgres schema | Implemented contract | Define products, builds, model assets, and price sources |
| Automated tests and CI | Implemented | Guard core engineering calculations and production build health |
| Durable database persistence | Next checkpoint | Attach production Postgres and wire Prisma runtime CRUD |
| Real GLB/CAD model pipeline | Planned | Upgrade selected generated parts into realistic assets |

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **3D:** React Three Fiber, Drei, Three.js
- **State:** Zustand
- **Validation:** Zod
- **Styling:** Tailwind CSS, shadcn-style components
- **Data:** Curated JSON seed catalog
- **Database contract:** Prisma 7 schema and SQL migration for Postgres
- **Engineering Engine:** Pure TypeScript calculation and compatibility modules

## User Journey

1. A user opens the builder and selects a mission profile such as beginner, freestyle, racing, cinematic, long-range, or payload.
2. The user picks parts from the catalog.
3. DroneLab assembles the selected drone in 3D.
4. The stats panel updates weight, cost, flight time, thrust-to-weight ratio, current draw, and payload reserve.
5. Compatibility warnings explain what is wrong and suggest fixes.
6. The user exports a bill of materials or saves the build locally.
7. The Save action calls the build API and copies a shareable URL; when a
   production database is attached, the same API can return durable build pages.

## System Concept

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
```

The MVP intentionally uses generated geometry and curated seed data before adding live product sources, external pricing, or real manufacturer CAD files.

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

The app is runnable without external services. Saved builds currently use a
server API plus encoded share-link fallback unless a durable database is attached.

The Postgres contract is already present:

- `prisma/schema.prisma`
- `prisma.config.ts`
- `prisma/migrations/000001_init/migration.sql`
- `.env.example`

Next persistence step: configure `DATABASE_URL` in the deployment environment,
choose the Prisma 7 runtime adapter for the database provider, and replace the
repository fallback in `src/lib/server/buildRepository.ts` with durable CRUD.

## Future Work

- Add WebGL unsupported-device fallback
- Attach production Postgres and durable Prisma-backed persistence
- Add authenticated saved build workspaces
- Add live/manual price source records and scheduled refresh hooks
- Expand the catalog with manufacturer-sourced, confidence-tagged real parts
- Add controlled GLB/CAD ingestion and optimization scripts
- Add center-of-mass and battery-position controls
- Add build comparison and Pareto tradeoff views
- Calibrate estimates with real thrust tests and flight logs

## Portfolio Positioning

DroneLab shows the ability to turn a complex engineering workflow into a polished product surface. It combines product strategy, 3D web development, hardware systems thinking, typed data modeling, compatibility logic, and simulation-style estimation into one focused portfolio project.

## Status

Functional portfolio product slice. The local builder, generated 3D assembly,
seed catalog, compatibility checks, performance estimates, recommendations,
shareable summaries, part detail pages, saved-build API contracts, Prisma schema,
exports, tests, and CI are implemented. Future work focuses on attaching durable
database persistence, real sourced parts, live price records, real model assets,
and stronger engineering optimization.

## Disclaimer

DroneLab estimates are approximate and intended for planning and education. Always verify manufacturer specifications, wiring requirements, firmware setup, safety guidelines, and local regulations before purchasing or flying a drone.
