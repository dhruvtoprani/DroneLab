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
