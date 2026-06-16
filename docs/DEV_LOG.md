# Dev Log

## Entry 001

Date: 2026-06-15

Summary:

- Initialized the Next.js 16 application with TypeScript, Tailwind CSS, and shadcn/ui.
- Added all React Three Fiber, Drei, Zustand, Zod, and icon dependencies.
- Created typed product and build domains.
- Added a curated seed catalog for every MVP part category.
- Implemented build calculations, compatibility checks, scoring, classification,
  and suggestions.
- Built the generated 3D quadcopter assembly and the three-panel builder.
- Added the landing page and initial product/build calculation APIs.
- Added local build saving, copyable BOM text, and CSV export.
- Verified desktop and mobile layouts, part swapping, blocking warnings, exploded
  view, API output, reset, and local save behavior.

Files changed:

- `src/app/*`
- `src/components/builder/*`
- `src/components/three/*`
- `src/lib/compatibility/*`
- `src/lib/data/*`
- `src/lib/types/*`
- `src/store/*`
- `data/seed/*`
- `docs/*`

Key decisions:

- Use generated geometry as the primary MVP rendering path.
- Keep the engineering engine pure TypeScript and independent of React.
- Use a compact manual catalog before introducing external product sources.
- Treat motor thrust rows as comparison-oriented seed data, not manufacturer claims.

Bugs fixed:

- Corrected the Tailwind v4/shadcn Geist font token configuration.
- Avoided npm's capital-letter package-name restriction by scaffolding through a
  temporary lowercase directory.
- Lowered the desktop builder breakpoint so standard laptop widths retain the
  intended three-panel workspace.
- Corrected suggestion fallback behavior when an unrecognized compatibility
  warning is present.

Open questions:

- Supabase project and authentication strategy are not configured yet.
- Saved builds currently require the database phase.
- Real product sourcing and model licensing require a separate curation pass.

## Entry 002

Date: 2026-06-16

Summary:

- Added a brute-force recommendation engine that ranks valid catalog combinations.
- Added `/explore` with generated recommendations and curated example builds.
- Added public build summary pages at `/builds/[id]`.
- Added part intelligence pages at `/parts/[id]`.
- Added shareable encoded build URLs that can reopen in the builder.
- Added JSON export in the builder alongside BOM text and CSV.
- Added public builds and recommendations APIs.
- Added Vitest coverage and GitHub Actions CI.
- Extended product types for source URLs, confidence levels, live price readiness,
  and model provenance metadata.

Files changed:

- `src/app/explore/page.tsx`
- `src/app/builds/[id]/page.tsx`
- `src/app/parts/[id]/page.tsx`
- `src/app/api/builds/public/route.ts`
- `src/app/api/builds/recommend/route.ts`
- `src/components/builds/BuildSummary.tsx`
- `src/lib/builds/*`
- `src/lib/recommendations/*`
- `src/lib/compatibility/*.test.ts`
- `.github/workflows/ci.yml`

Key decisions:

- Use URL-encoded builds as an immediate share path before database persistence.
- Keep recommendation scoring deterministic and source-data-driven.
- Use generated model fallback as the guaranteed rendering path while adding
  metadata fields for curated GLB and manufacturer CAD later.

Bugs fixed:

- Added Vitest alias configuration so tests resolve the same `@/*` imports as Next.js.

Open questions:

- Vendor/live price integrations still need allowed APIs or explicit source
  agreements.
- Real CAD/GLB ingestion still needs licensing and conversion policy.

## Entry 003

Date: 2026-06-16

Summary:

- Added saved-build API routes for create, read, update, and duplicate flows.
- Added shared build input validation and normalization for `frameId` and
  internal category-key payload styles.
- Added a server-side build repository abstraction with an honest share-link
  fallback when durable database persistence is not configured.
- Updated the builder Save action to call `/api/builds`, keep local backup, and
  copy the best available build link.
- Added Prisma 7 database schema, Prisma config, and SQL migration artifacts for
  products, builds, model assets, and price sources.
- Added database validation scripts and `.env.example`.
- Added tests for saved-build payload normalization and repository fallback.

Files changed:

- `src/app/api/builds/*`
- `src/app/builds/[id]/page.tsx`
- `src/components/builder/BuilderApp.tsx`
- `src/lib/builds/savedBuildSchema.ts`
- `src/lib/server/buildRepository.ts`
- `src/lib/types/build.ts`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `prisma/migrations/000001_init/migration.sql`
- `.env.example`
- `package.json`

Key decisions:

- Do not claim durable production persistence until a real `DATABASE_URL` and
  Prisma runtime adapter are attached.
- Keep encoded share URLs as the reliable production fallback on Vercel.
- Use Prisma 7's `prisma.config.ts` datasource pattern instead of the old
  `url = env("DATABASE_URL")` schema syntax.
- Avoid a Prisma `postinstall` hook so Vercel builds do not require database
  secrets during dependency installation.

Bugs fixed:

- Centralized build part normalization so calculate, save, update, and duplicate
  paths treat API-style and internal-style part IDs consistently.

Open questions:

- Choose Supabase, Neon, or Prisma Postgres as the production database provider.
- Add the Prisma runtime adapter package for the chosen provider and replace the
  repository fallback with durable CRUD.
- Decide whether public build publishing requires authentication in the next
  checkpoint or can ship as anonymous public builds first.
