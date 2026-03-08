# CLAUDE.md

## What this project is

This app is a **property-scale landscape intelligence engine**.

Its purpose is to take a single address and transform it into a structured model of the site’s real garden conditions, including geometry, environmental layers, and derived **microzones**.

This is **not** a generic map app, not a GIS portal, and not a plant recommendation app yet.

The current goal is to build a trustworthy **site conditions engine** that can later support hyper-local planting advice.

---

## Product priority

The app should answer:

- What are the meaningful garden conditions on this exact property?
- Where are the key microzones?
- What are the major constraints and opportunities for planting and landscape design?

The primary output is not raw layers alone.  
The primary output is **interpreted microzones** and plain-English site insight.

---

## Core product object

The most important object in this system is the **Microzone**.

Do not let the architecture collapse into “map with toggles.”

Raw layers matter, but they are intermediate inputs.  
The real product value is the transformation from:

**address → site features → environmental layers → microzones → insights**

---

## Implementation guidance

Treat the Replit prompt and Replit prototype as **product and UI reference**, not as architectural truth.

Preserve the UX intent, layout strengths, and interaction model where they are good.

Do **not** cargo-cult:
- weak component structure
- ad hoc state management
- implicit data contracts
- messy mock-data shapes
- tightly coupled UI/business logic

Prefer clean architecture over fidelity to generated code.

---

## Current scope

Build the foundation for hyper-local planting advice by modeling site conditions first.

In scope:
- address input
- parcel / lot lines
- building footprint(s)
- neighboring building context where relevant
- hardscape / impervious areas
- walls / fences / edge structures where possible
- major canopy / shade influence where possible
- seasonal sun / shade
- wind exposure and shelter
- rain shadow / roof drip / dry strips
- slope / drainage / ponding likelihood
- heat-reflective and cool wall conditions
- root competition / establishment difficulty
- derived microzones
- plain-English insights
- confidence labeling

Out of scope for now:
- plant recommendations
- full horticultural matching engine
- e-commerce
- generic garden inspiration content

---

## Required architectural principles

### 1. Strong typed domain model
Create explicit domain objects for the main concepts.

At minimum, maintain clean definitions for:
- Property
- SiteFeature
- EnvironmentalLayer
- Microzone
- Insight
- ConfidenceLevel

Do not rely on loosely structured JSON blobs across the app.

### 2. Separate geometry, analysis, and presentation
Keep these concerns distinct:
- geometry acquisition / normalization
- environmental analysis / scoring
- microzone derivation
- UI presentation

Do not bury environmental logic inside React components.

### 3. Build for iteration
Assume the ontology will evolve.

It should be easy to refine:
- zone classification
- support types
- wall / fence logic
- moisture logic
- thermal logic
- confidence scoring

Prefer composable scoring and transformation steps over monolithic logic.

### 4. Preserve explainability
For every derived classification, it should be possible to explain:
- what inputs contributed
- whether the result is authoritative, detected, inferred, or modeled
- why the user is seeing that interpretation

### 5. Keep confidence explicit
Many inputs will be imperfect.

Every important derived result should support confidence labeling such as:
- authoritative
- detected
- inferred
- modeled
- user-confirmed

Never imply false precision.

### 6. Keep the app map-centered but not map-defined
The map is the main interaction surface, but the product is not “the map.”

The system should be able to produce:
- microzone summaries
- site insights
- exportable analysis
- future planting logic

without requiring the map to contain all product intelligence.

---

## UI / UX guidance

The app should feel like a **premium landscape site-analysis studio**.

It should not feel like:
- municipal GIS
- engineering software
- a cluttered weather dashboard
- a generic real-estate map

Preserve these product qualities:
- calm interface
- strong hierarchy
- elegant layer controls
- clear microzone list
- concise insight language
- professional but consumer-readable presentation

Keep map overlays visually restrained and legible.

---

## Data and layer philosophy

Differentiate clearly between:

### Hard / authoritative constraints
Examples:
- parcel geometry
- flood overlay if authoritative
- zoning / easements if sourced authoritatively

### Detected site features
Examples:
- building footprints
- canopy outlines
- impervious surfaces
- walls or fences if extracted from data

### Modeled / inferred conditions
Examples:
- wind shelter
- rain shadow
- root competition
- thermal pockets
- ponding likelihood
- microzone boundaries

The UI and data model should preserve these distinctions.

---

## Preferred build sequence

1. Create the canonical domain model
2. Build a mock-data pipeline that matches the real intended contracts
3. Build the frontend against stable mock contracts
4. Implement layer-by-layer analysis behind those contracts
5. Add microzone derivation
6. Add insight generation
7. Add export / persistence improvements later

Do not over-integrate real external data before the internal data model is coherent.

---

## Expectations for implementation

When making architectural choices:
- prefer clarity over cleverness
- prefer explicitness over magic
- prefer typed contracts over implicit shape-sharing
- prefer small composable analysis steps over giant processors
- prefer refactoring early over patching around drift

When uncertain, optimize for the future planting-intelligence use case.

---

## Documents to use

Use these docs as context:
- `/docs/replit-design-prompt.md`
- `/docs/product-spec.md` if present
- `/docs/ui-notes.md` if present

Treat them as intent/reference documents.

If implementation reality conflicts with them, preserve the product intent and improve the architecture.

---

## Important final rule

The app’s core value is not raw geospatial display.

The app’s core value is:

**turning a property into understandable garden microzones that can later support hyper-local planting advice**