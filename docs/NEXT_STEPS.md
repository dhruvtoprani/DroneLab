# Next Steps

## Current Priority

- [ ] Add database seed/import script for curated products and example builds.
- [ ] Implement controlled community GLB import script from `docs/MODEL_IMPORT_PIPELINE.md`.
- [ ] Add authenticated saved build ownership.
- [ ] Expand the catalog with manufacturer-sourced, confidence-tagged real parts.

## Completed

- [x] Verify the builder across desktop and narrow layouts.
- [x] Add functional BOM copy and CSV export.
- [x] Verify product and calculation API responses.
- [x] Add unit tests for calculations and compatibility rules.
- [x] Add full build JSON export.
- [x] Add Explore builds page.
- [x] Add public build summary pages.
- [x] Add part detail/intelligence pages.
- [x] Add recommendation engine and API.
- [x] Add GitHub Actions CI.
- [x] Add saved-build API contracts with share-link fallback.
- [x] Add Prisma 7 schema, config, and initial SQL migration.
- [x] Add tests for saved-build normalization and repository fallback.
- [x] Add WebGL unsupported-device fallback.
- [x] Attach Postgres-ready Prisma runtime adapter for durable saved builds.
- [x] Apply Supabase production schema and verify durable saved-build APIs.
- [x] Configure Vercel production `DATABASE_URL` for Supabase persistence.
- [x] Polish builder visuals with viewport HUD, richer 3D scene labels, snap markers, and improved diagnostic panels.
- [x] Add smooth exploded-view interpolation and clickable 3D part focus.
- [x] Add community model import policy document and placeholder asset folder.

## Backlog

- [ ] Add Supabase Auth and authenticated user workspaces.
- [ ] Add live/manual `price_sources` data model.
- [ ] Add model asset records and thumbnails.
- [ ] Add admin/import scripts for source curation.
- [ ] Add a reviewed community model submission form after auth exists.

## Bugs

- [ ] Validate touch controls on mobile browsers.

## Later

- [ ] Replace selected generated parts with optimized GLB assets where useful.
- [ ] Add center-of-mass and battery-position controls.
- [ ] Add build comparison and Pareto tradeoff views.
- [ ] Calibrate estimates with real thrust tests and flight logs.
