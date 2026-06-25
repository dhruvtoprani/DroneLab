# Community Model Import Pipeline

DroneLab should support community-imported models, but only through a controlled
pipeline. Do not attach arbitrary uploads directly to runtime products until the
asset has been validated, optimized, licensed, and mapped to a product record.

## MVP Asset Policy

Accepted source formats:

- `.glb`
- `.gltf` with external buffers/textures
- `.obj` only as an intermediate source
- `.stl` only as an intermediate source

Runtime format:

- `.glb`

Required metadata:

- Product ID
- Source author
- Source URL or upload provenance
- License
- Permission notes
- Scale reference in millimeters
- Category
- Model mode: `curated_glb`, `manufacturer_cad`, or `user_submitted`
- Verification status

## Intake Steps

1. Place candidate files under `public/models/community/incoming/` locally.
2. Record source, author, license, and target product ID in an intake note.
3. Inspect the file manually before using it in the app.
4. Convert source assets to `.glb` if needed.
5. Normalize orientation, scale, origin, and material names.
6. Optimize the asset with `gltf-transform` before production use.
7. Save approved runtime files under the relevant category folder:
   `public/models/<category>/`.
8. Attach the model path to the product `modelUrl`.
9. Set `modelMode`, `modelLicense`, and `modelVerified`.
10. Keep generated geometry as the fallback if the model fails to load.

## Validation Checklist

- [ ] License allows web display and redistribution.
- [ ] Asset does not contain trademarks unless intentionally sourced.
- [ ] Polygon count is appropriate for browser rendering.
- [ ] Texture dimensions are reasonable.
- [ ] Origin is usable for DroneLab snap points.
- [ ] Scale matches product dimensions.
- [ ] Materials are named and not excessively complex.
- [ ] Asset loads as `.glb` in a local browser.
- [ ] Generated geometry fallback still works.

## Future Automation

Planned script:

```txt
scripts/models/import-model.ts
```

Planned behavior:

- Validate metadata JSON.
- Convert source files to `.glb`.
- Run `gltf-transform optimize`.
- Generate thumbnails.
- Write `model_assets` database records.
- Produce an import report with warnings and rejected files.

## Current Status

The app is ready to store model provenance fields and render generated geometry
fallbacks. The actual upload/import workflow is not enabled yet.
