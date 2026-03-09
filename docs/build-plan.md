# Build Plan

## Purpose

This document defines the practical implementation plan for the first real version of the app.

It exists to reduce drift during implementation and make clear:
- what the MVP actually is
- what should be mocked first
- what abstractions must exist early
- what is intentionally deferred
- how to use the pulled-down Replit design responsibly

This app is a **site conditions engine** for future hyper-local planting advice.

The current goal is to turn an address into:
- a base site model
- a set of environmental layers
- a set of derived microzones
- a concise set of plain-English site insights

We are **not** building plant recommendations yet.

---

## Source materials for implementation

Use the following as inputs to implementation:

- `/docs/replit-design-prompt.md` — original design intent
- pulled-down Replit prototype/design code — visual and interaction reference
- `/CLAUDE.md` — architectural and product guardrails
- this file — execution priorities and scope

### Important rule for Replit output
Treat the pulled-down Replit design as:
- a **UI and interaction reference**
- a **useful starting shell**
- a **source of layout, visual hierarchy, and component inspiration**

Do **not** treat it as:
- the canonical architecture
- the canonical domain model
- the canonical API shape
- the canonical source of truth for analysis logic
- a reason to preserve weak component boundaries or ad hoc data structures

Preserve what is good in the Replit design:
- layout
- interaction feel
- map-centered workflow
- panel structure
- microzone presentation
- loading and empty states
- overall visual quality

Be willing to refactor or replace:
- state structure
- data contracts
- component decomposition
- mock payload shapes
- analysis flow
- any UI code that tightly couples product logic to presentation

---

## MVP goal

The MVP should let a user enter an address and receive a convincing, structured site analysis that explains the main garden conditions on the property.

The MVP does **not** need to be geospatially perfect.

The MVP does need to be:
- coherent
- legible
- explainable
- architecturally clean
- extensible toward future planting intelligence

The MVP should demonstrate the transformation:

**address → property model → environmental layers → microzones → insights**

---

## What success looks like

A successful MVP should allow a user to:

1. Enter an address
2. See a base site plan with parcel and building footprint
3. Toggle key environmental layers
4. View a set of named microzones on the property
5. Click a microzone and understand:
   - light
   - moisture
   - wind
   - heat
   - support / edge condition
   - competition / establishment difficulty
   - confidence
6. Read concise plain-English site insights
7. Understand that this app is the foundation for later planting suggestions

---

## MVP scope

### In scope for MVP

#### Input and site setup
- address search input
- resolved example property result
- base property metadata
- parcel / lot outline
- building footprint(s)
- nearby building context in simplified form

#### Core analysis layers
- base geometry
- sun / shade
- wind exposure / shelter
- water / drainage / dry-wet tendency
- heat / wall-adjacency / reflective exposure
- structure / support opportunities
- competition / establishment difficulty

#### Core outputs
- microzone generation
- microzone list
- microzone detail panel
- site summary insights
- confidence labeling

#### UI
- map-centered workspace
- layer controls
- season switch
- left summary panel
- right detail panel or drawer
- polished loading / analysis state
- empty state
- demo/export actions in UI

---

## Explicitly out of scope for MVP

Do not spend serious implementation time on these yet:
- plant recommendation engine
- plant database
- horticultural filtering logic
- user accounts
- collaborative editing
- advanced persistence
- production-grade export pipeline
- precise national parcel coverage
- exact fence/wall detection from hard real-world data
- heavy real-time geospatial computation in browser
- full mobile optimization beyond a reasonable responsive layout

These can be scaffolded visually, but not deeply built.

---

## Recommended implementation strategy

Build this in phases.

### Phase 1: audit and extract from the Replit design
Before substantial feature work, inspect the pulled-down Replit code and separate:
- reusable presentational components
- layout structure worth preserving
- mock data shapes worth replacing
- state management worth refactoring
- logic that should move out of UI components

Goal: keep the visual strengths while preventing architectural drift.

### Phase 2: canonical domain model
Before doing much real analysis or data integration, define the main types and intended contracts.

At minimum, define:
- Property
- SiteFeature
- EnvironmentalLayer
- Microzone
- Insight
- ConfidenceLevel

This should happen early, before Replit-generated mock structures fossilize into the app.

### Phase 3: adapt frontend shell to stable mock contracts
Refactor the Replit UI shell so it renders from clean, stable mock contracts rather than ad hoc generated shapes.

The frontend should initially be built against the intended contract, even if the data is mocked.

### Phase 4: analysis pipeline behind the contract
Implement the real or semi-real logic gradually behind the stable frontend-facing contracts.

Prioritize:
- property geometry normalization
- layer computation
- microzone derivation
- insight generation

### Phase 5: data integration refinement
After the internal model is coherent, improve real data ingestion and confidence handling.

---

## Canonical objects for v1

These are the objects that should exist from the beginning, even if some fields are mocked at first.

## Property
Represents the analyzed property as a whole.

Suggested fields:
- id
- inputAddress
- resolvedAddress
- centroid
- parcelGeometry
- buildingGeometries
- areaStats
- regionMetadata
- analysisMetadata

## SiteFeature
Represents physical mapped features.

Suggested types:
- building
- neighboring_building
- impervious_surface
- wall
- fence
- canopy
- paved_edge
- roof_edge
- foundation_edge

Suggested fields:
- id
- type
- geometry
- source
- confidence
- attributes

## EnvironmentalLayer
Represents a computed or sourced analysis surface.

Suggested layer types:
- solar_exposure
- shade
- wind_exposure
- shelter
- moisture_tendency
- drainage_tendency
- heat_exposure
- reflective_heat
- support_opportunity
- root_competition

Suggested fields:
- id
- type
- season
- geometryRepresentation
- sourceInputs
- methodology
- confidence
- summaryStats

## Microzone
This is the core product object.

Suggested fields:
- id
- name
- geometry
- seasonality
- lightClass
- moistureClass
- windClass
- heatClass
- supportClass
- competitionClass
- confidence
- rationale
- tags

## Insight
Represents a plain-English summary or recommendation-quality observation, but without plant suggestions yet.

Suggested fields:
- id
- title
- body
- scope
- relatedMicrozoneIds
- importance
- confidence

## ConfidenceLevel
Use a consistent vocabulary:
- authoritative
- detected
- inferred
- modeled
- user_confirmed

---

## Initial supported classifications

To avoid drift, use a constrained vocabulary at first.

### Light classes
- full_sun
- part_sun
- part_shade
- bright_shade
- deep_shade

### Moisture classes
- dry
- moderately_dry
- balanced
- moist
- wet

### Wind classes
- exposed
- moderate
- sheltered

### Heat classes
- cool
- neutral
- warm
- heat_reflective

### Support classes
- open_bed
- wall_adjacent
- fence_line
- trellis_capable
- foundation_strip
- canopy_edge

### Competition classes
- low
- moderate
- high

Keep these enums tight in v1.

---

## Initial layer set for v1

Do not try to support every imaginable landscape layer immediately.

Start with these:

### 1. Base geometry
- parcel
- building footprints
- nearby buildings
- key edges / support structures if available or mocked

### 2. Solar / shade
- seasonal shade
- direct light tendency
- warm south/west exposure zones
- cool north-side conditions

### 3. Wind / shelter
- exposed edges
- sheltered pockets
- directional prevailing-wind interpretation

### 4. Water / moisture tendency
- dry strips near overhangs or walls
- likely wetter low areas
- runoff tendency / ponding tendency
- moisture-retentive zones

### 5. Heat / reflection
- reflective hardscape adjacency
- warm walls
- cool walls
- enclosed heat pockets

### 6. Competition / establishment difficulty
- canopy-adjacent competition
- narrow constrained strips
- hardscape-adjacent establishment difficulty

### 7. Structure / support opportunity
- fence lines
- wall-adjacent growing edges
- trellis / espalier opportunity zones

That is enough for a strong first system.

---

## How microzones should work in v1

Do not overcomplicate this initially.

Microzones do not need to come from sophisticated raster clustering in v1.

A reasonable v1 approach is:
1. compute or mock core layer signals
2. identify meaningful zones by heuristic overlap
3. produce a small number of legible named zones
4. ensure each zone has a clear rationale

The priority is usefulness and explainability, not analytical elegance.

### Microzone requirements for v1
- each zone must be visually legible on the map
- each zone must have a distinct reason to exist
- each zone must use the constrained enums above
- each zone must carry rationale text
- each zone must be explainable from underlying layers

Aim for roughly:
- 4 to 8 microzones for a typical property demo
- not dozens of tiny polygons

---

## Insight generation in v1

Insights should be generated from the microzones and layer summaries.

They should sound like:
- “Best full-sun planting area is in the southeast interior yard.”
- “West boundary appears more exposed to drying wind.”
- “North side is cooler and shadier, with slower drying.”
- “South wall creates a warmer, more protected edge.”
- “Rear low point may retain more moisture after rainfall.”
- “Tree competition is likely strongest along the northeast edge.”

Keep them concise and useful.

Do not turn them into plant advice yet.

---

## Replit integration rule

The pulled-down Replit prototype should accelerate UI development, but not define the product model.

Use the Replit code for:
- page structure
- panel layout
- map workspace styling
- interaction ideas
- loading and empty states
- presentational components worth keeping

Do not preserve it unquestioningly if it conflicts with:
- the canonical domain model
- stable analysis contracts
- explainability
- microzone-centered architecture
- future extensibility toward planting intelligence

If necessary, rebuild parts of the Replit shell cleanly rather than extending weak structure.

---

## Mock-data-first rule

For the first meaningful build, it is acceptable and preferred to:
- hardcode one or more demo properties
- hardcode or semi-hardcode site features
- hardcode or simulate microzones
- mock environmental layers with believable data structures

The purpose is to lock down:
- product structure
- UI behavior
- domain model
- interaction model
- explanation model

before chasing real-world data complexity.

Mock honestly. Do not pretend the data is more real than it is.

---

## Data integration priorities after mock version

When moving beyond the first mock-driven version, prioritize integrations in this order:

1. address geocoding
2. parcel / property geometry
3. building footprints
4. nearby building context
5. simple solar / shade logic
6. simple wall / edge logic
7. simple moisture / runoff heuristics
8. simple wind exposure heuristics
9. microzone derivation from real inputs
10. broader data refinement later

Avoid trying to solve full national data completeness too early.

---

## Frontend / backend split

### Frontend should own
- address input flow
- loading / analysis states
- map rendering
- layer toggles
- microzone selection
- insights display
- legends and explanations

### Backend or analysis layer should own
- geometry normalization
- layer generation
- microzone derivation
- confidence assignment
- insight generation logic
- transformation into stable frontend contracts

Do not put environmental reasoning inside UI components.

---

## Folder structure guidance

Claude may adapt this, but the repo should roughly separate:
- app / routes
- ui components
- domain models / types
- mock data
- analysis logic
- mapping / rendering helpers
- docs

One reasonable shape might look like:

- `/app` or `/src/app`
- `/components`
- `/lib/domain`
- `/lib/analysis`
- `/lib/map`
- `/lib/mock-data`
- `/lib/utils`
- `/docs`

Keep domain logic and UI logic clearly separated.

---

## What to optimize for

When making tradeoffs, optimize for:
1. clean architecture
2. stable internal contracts
3. explainability
4. product clarity
5. future planting-intelligence extensibility

Optimize less for:
- perfect geospatial realism
- maximal data coverage
- feature breadth
- clever modeling
- visual effects

---

## Common failure modes to avoid

Avoid these:

### 1. Building a map app instead of a site-intelligence app
The map is the interface, not the product.

### 2. Letting raw layers become the final output
Layers are inputs. Microzones and insights are the real output.

### 3. Letting Replit-generated structures become the default architecture
The Replit prototype is a reference shell, not the domain model.

### 4. Over-integrating messy external data too early
Use stable mock contracts first.

### 5. Mixing analysis logic into React components
Keep scoring and derivation logic out of the presentation layer.

### 6. Creating too many vague zone types
Keep the classification system constrained in v1.

### 7. Pretending inferred outputs are authoritative
Carry confidence through the system visibly.

---

## Definition of done for the first meaningful version

The first meaningful version is done when:

- a user can enter or choose a property
- the app displays a coherent base site plan
- the app displays several meaningful analysis layers
- the app displays 4–8 clear microzones
- each microzone has a useful detail panel
- the app produces concise site insights
- the app clearly communicates confidence and rationale
- the codebase is clean enough to support future planting logic

That is enough to move into the next phase.

---

## Session-by-Session Execution Plan

The phases above are implemented across 10 discrete sessions. Each session ends with a deployable checkpoint.

### Amendments to original phases
1. Phases 1-2 compressed into Session 1 (audit is lightweight, domain model is well-specified)
2. Phase 3 split across Sessions 2-4 (frontend wiring, map rendering, layer overlays)
3. Phase 4 split into Sessions 5 (pipeline) + 6 (geocoding) + 8 (insights/confidence)
4. Loading animation gets its own session (Session 7)
5. `.replit` deployment config fixed in Session 1 (static → autoscale)

### Decisions
- **Geocoding:** Google Maps Geocoding API (Session 6)
- **Geometry data:** Free only — OpenStreetMap + Microsoft Building Footprints (Session 9)
- **Demo property:** "1428 Elm Street, Portland, OR 97201"

### Session list
1. **Foundation** — Domain types + first API endpoint + deployment fix ✅
2. **Frontend API wiring** — React Query, replace inline mock data ✅
3. **Data-driven map** — SVG rendering from API geometry ✅
4. **Layer overlays** — Visual SVG overlays for each layer mode ✅
5. **Analysis pipeline** — Server-side composable analysis ✅
6. **Geocoding** — Real address search via Google Maps API ✅
7. **Loading animation** — Premium staged analysis progress ✅
8. **Insights + confidence** — Enrich UI with generated insights, confidence badges ✅
9. **UI polish: Zoom/Pan** — Map zoom, pan, scroll interactions ✅
10. **UI polish: Mobile** — Responsive mobile layout, bottom sheet ✅
11. **UI polish: Export** — Export dialog, PDF/image output ✅
12. **Real geometry from OSM** — Parcel + building data from OpenStreetMap, scale-aware analysis ✅
13. **Geometry enrichment + calibration** — Improve parcel synthesis, add Microsoft Building Footprints fallback
14. **Edge cases + final QA** — Error handling, responsive fixes, full walkthrough

### Dependency graph
```
S1 → S2 → S3 → S4 → S5 → S6 ↔ S7 → S8 → S9 → S10
```

### Critical files
| File | Role |
|------|------|
| `shared/domain.ts` | Canonical types — entire app depends on this |
| `server/routes.ts` | API layer |
| `server/mock-data/demo-property.ts` | Demo data seed |
| `server/analysis/pipeline.ts` (Session 5) | Core analysis orchestrator |
| `server/analysis/microzones.ts` (Session 5) | Heart of the product |
| `client/src/components/MapCanvas.tsx` (Session 3) | Largest rewrite: CSS → SVG |
| `client/src/pages/Home.tsx` | State management hub |
| `.replit` | Deployment config |