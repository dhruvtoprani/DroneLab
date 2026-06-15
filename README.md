# DroneLab

DroneLab is a 3D FPV drone builder that helps users assemble a quadcopter,
validate part compatibility, estimate performance, and understand cost before
buying hardware.

The product direction is:

> PCPartPicker for drones, but in 3D with engineering simulation.

## Current Version

The current implementation includes:

- Responsive landing page and three-panel builder
- Generated 3D quadcopter rendered with React Three Fiber
- Orbit controls, part highlighting, and exploded view
- Curated catalog covering all 11 MVP part categories
- Live weight, cost, flight-time, thrust, current, and payload calculations
- Mechanical and electrical compatibility checks
- Beginner-readable warnings and suggested fixes
- Mission profile and budget controls
- Local build saving
- Copyable BOM and CSV export
- Product and build-calculation APIs

The included product data and engineering estimates are illustrative and intended
for planning and education. Always verify manufacturer specifications and safety
guidance before purchasing or flying.

## Tech Stack

- Next.js 16 and React 19
- TypeScript
- React Three Fiber, Drei, and Three.js
- Tailwind CSS and shadcn/ui
- Zustand
- Zod

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The builder is available at
[http://localhost:3000/builder](http://localhost:3000/builder).

## Validation

```bash
npm run lint
npm run build
```

## Project Structure

```txt
src/app/                  Pages and API route handlers
src/components/builder/   Catalog, stats, and builder workspace
src/components/three/     Generated 3D assembly
src/lib/compatibility/    Calculations, checks, scoring, and suggestions
src/lib/data/             Seed catalog access
src/lib/types/            Product and build contracts
src/store/                Zustand builder state
data/seed/                Curated starter products and example builds
docs/                     PRD, development log, context, and next steps
public/models/            Future GLB asset pipeline
```

## Documentation

- [Product requirements](docs/PRD.md)
- [Current project context](docs/CONTEXT.md)
- [Development log](docs/DEV_LOG.md)
- [Next steps](docs/NEXT_STEPS.md)
