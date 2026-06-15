# DroneLab Product Requirements

## Product Summary

DroneLab is a 3D FPV quadcopter builder that helps users assemble parts visually,
check whether those parts are compatible, estimate performance, understand cost,
and export a bill of materials before purchasing hardware.

The product direction is "PCPartPicker for drones, but in 3D with engineering
simulation."

## MVP Scope

The MVP supports FPV quadcopters, beginning with a polished 5-inch freestyle
workflow. It uses a small curated catalog and parametric browser geometry rather
than a global product database or perfect manufacturer CAD.

Required part categories:

1. Frame
2. Motor
3. Propeller
4. Battery
5. ESC
6. Flight controller
7. FPV camera
8. Receiver
9. VTX
10. Antenna
11. Optional payload

## Core Experience

Users should be able to choose a goal and budget, open a recommended build,
swap parts, inspect the drone in 3D, and immediately see:

- Total weight and cost
- Estimated flight time
- Thrust-to-weight ratio
- Payload margin
- Electrical and mechanical compatibility
- Beginner-readable warnings and suggested fixes
- Recommended use case

The main builder uses a left catalog, center 3D viewport, right engineering
report, and a persistent summary bar.

## Engineering Rules

The calculation engine uses transparent formulas for total weight, battery
energy, battery current capability, thrust, average current, flight time, ESC
safety margin, payload margin, and weighted build scoring. Exact motor thrust
tests are preferred; an explicit approximation is used when no test row exists.

Compatibility checks cover required parts, propeller fit, motor and ESC voltage,
ESC current, battery current, stack mounting, motor mounting, camera size,
battery dimensions, VTX/antenna connectors, useful thrust reserve, budget, and
payload reserve.

All estimates are planning and educational tools. Manufacturer specifications,
wiring requirements, firmware setup, and safety guidance must be verified before
buying or flying.

## Technical Direction

- Next.js App Router and TypeScript
- React Three Fiber, Drei, and Three.js
- Tailwind CSS and shadcn/ui
- Zustand for builder state
- Zod for API validation
- Seed JSON for the initial catalog
- Supabase Postgres and Prisma in the save/share phase

## Delivery Phases

1. Project setup and static builder
2. Typed product catalog and selection state
3. Dynamic generated 3D assembly
4. Compatibility engine
5. Performance estimates
6. Save and share builds
7. Explore curated builds
8. Polish, responsive behavior, and export workflows

## Non-Goals

The MVP does not attempt CFD, perfect aerodynamic prediction, complete firmware
configuration, automatic wiring diagrams, global retailer scraping, live
inventory, legal certification, user CAD parsing, or industrial UAV support.

## Long-Term Direction

DroneLab should evolve into a mission-based optimization engine that can rank
valid builds by budget, payload, flight time, weight, use case, safety margin,
and real-world calibration data. Future work includes a constraint solver,
center-of-mass analysis, wiring guidance, telemetry validation, real CAD
ingestion, public build sharing, comparisons, and explainable AI assistance
grounded only in structured product data.
