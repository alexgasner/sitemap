# Landscape Site Intelligence App — Replit Design Mode Prompt

Build a polished responsive web prototype for a new app called **Site Layers**.

This app is **not** a generic map app and **not** a GIS portal. It is a **property-scale landscape intelligence tool** that takes a single address and converts it into a layered site analysis for future hyper-local planting advice.

The purpose of the prototype is to show how an address can become a **microclimate and landscape constraints map**. We are **not** adding planting recommendations yet. This version should focus on analyzing the property and generating meaningful **garden microzones**.

The prototype should feel like a **premium landscape architect’s digital site analysis studio**:
- elegant
- map-centered
- highly legible
- calm and modern
- professional but consumer-friendly
- analytical without feeling technical or bureaucratic

Do **not** make this feel like:
- Zillow
- Google Maps
- a city zoning portal
- a municipal GIS viewer
- a cluttered engineering dashboard

It should feel like a refined design-analysis product for serious home gardeners, designers, and homeowners.

---

## Core product idea

A user enters a property address.

The app then:
1. resolves the parcel / lot lines
2. resolves the building footprint(s)
3. builds a clean base site plan
4. overlays key environmental and spatial constraints
5. synthesizes the property into **garden microzones**
6. explains the property in plain English

The product is a **foundation for future hyper-local planting advice**, so the prototype must clearly show:
- where the sunny zones are
- where the shady zones are
- where wind exposure is strongest
- where the site is protected
- where rain shadow or roof drip affects moisture
- where warm wall-adjacent zones exist
- where wet or poorly drained conditions are likely
- where trellis / espalier / climber opportunities exist
- where root competition is likely
- where the best planting zones may be

Again: **do not add specific plant recommendations yet**.

---

## Main UX concept

The app should be centered on a **layered property map** with strong side panels and clean layer controls.

### Required primary layout
Use a desktop-first three-part structure:

1. **Top header**
2. **Left insight panel**
3. **Central map canvas**
4. **Right contextual panel or bottom drawer**

### Exact layout behavior
- **Header** spans full width
- **Left panel** contains property summary, microzones, and insights
- **Center** is the main interactive map / site drawing
- **Right panel** or bottom drawer shows selected layer details or selected microzone details
- On mobile, stack these cleanly with the map still feeling central

This should feel like a design tool, not a simple search page.

---

## App structure

Use this exact page structure:

1. Header
2. Address search bar
3. Main analysis workspace
   - left summary panel
   - center map
   - right detail panel
4. Bottom layer legend / controls area if needed
5. Export / save actions

Do not invent a radically different layout.

---

## Header

### Include
- App name: **Site Layers**
- Subtitle: **Landscape intelligence for site-specific garden design**
- Minimal top navigation
- Small actions on right:
  - Export
  - Save analysis
  - Settings

### Style
- clean
- restrained
- not tall
- premium
- subtle typography
- no loud branding

---

## Address search experience

At the top of the analysis view, provide a clean address search bar.

### Include
- address input
- search button
- example placeholder like:
  - **Enter a property address**
- optional recent addresses dropdown
- optional “Use example property” shortcut for demo purposes

### Empty state
Before the user searches, show a calm empty state on the map with copy like:

**Enter an address to generate a layered landscape site analysis.**

Below that, lightly preview the kinds of layers the app will create:
- lot lines
- building footprint
- sun / shade
- wind exposure
- drainage
- walls / trellis edges
- microzones

This empty state should feel elegant, not dead.

---

## Main map canvas

This is the heart of the prototype.

The center of the app should show a **clean, layered site drawing** rather than a generic satellite map.

### Required base visual elements
- lot / parcel outline
- building footprint(s)
- neighboring building massing nearby
- hardscape / impervious areas if represented
- walls / fences / edge structures where inferred
- major tree canopy if shown
- subtle scale / north arrow
- refined legend behavior

### Map style direction
- clean neutral land background
- soft lot outlines
- dark restrained building footprints
- subtle greens / tans / grays
- analytical overlays rendered elegantly
- no noisy basemap labels
- no cartographic clutter
- no hyper-saturated colors

### Interaction expectations
User should be able to:
- zoom and pan
- toggle layers
- switch seasonal mode
- click on microzones
- click on a layer in the legend to focus it
- inspect why a zone is classified a certain way

---

## Required analysis modes

The prototype should support clear visual modes or layer combinations.

### Required layer/mode categories
1. Base Plan
2. Sun / Shade
3. Wind / Shelter
4. Water / Drainage
5. Heat / Walls / Rain Shadow
6. Microzones
7. Composite Garden Conditions

These should be accessible from a clean layer control system.

---

## Left panel: property summary and zone navigation

The left panel should be a fixed structured panel containing:

### 1. Property summary card
Include:
- resolved address
- lot size if shown
- building coverage visual summary
- quick overall site summary in 3–5 bullets

Example tone:
- Front yard appears exposed and heat-reflective
- North side is cooler and more shaded
- Rear southeast area has strongest open sun
- West boundary is relatively windy
- South wall creates a protected warm microclimate

### 2. Key constraints section
A compact list of major limitations:
- strong wind exposure
- deep shade
- poor drainage
- root competition
- narrow planting strips
- hot reflective hardscape edge
- rain shadow zones

### 3. Key opportunities section
A compact list of major positive zones:
- best full-sun planting zone
- warm wall-adjacent zone
- sheltered courtyard zone
- best climber / espalier edge
- best screen planting edge
- best moisture-retentive zone

### 4. Microzones list
This is extremely important.

Show a scrollable list of named zones, for example:
- Zone A — South Wall Warm Pocket
- Zone B — Exposed West Edge
- Zone C — Cool North Side Shade
- Zone D — Wet Rear Corner
- Zone E — Open Sunny Planting Bed
- Zone F — Tree Competition Zone

Each item should show mini tags for:
- light
- moisture
- wind
- heat
- support / structure

Clicking a microzone should highlight it on the map and populate the right panel.

---

## Right panel or bottom drawer: selected detail view

When a user selects a microzone or a layer, show a detail panel.

### If a microzone is selected, show:
- microzone name
- polygon highlighted on map
- light class
- moisture class
- wind exposure
- heat class
- support condition
- root competition level
- seasonal notes
- confidence level
- short explanation paragraph

### Example detail structure
**Zone B — South Wall Warm Pocket**  
- Light: Full sun  
- Moisture: Dry  
- Wind: Sheltered  
- Heat: Elevated  
- Support: Wall-adjacent / trellis-capable  
- Competition: Low  
- Confidence: Medium  

**Interpretation:**  
This zone receives strong solar exposure and benefits from reflected warmth from the south-facing wall. It appears relatively protected from prevailing winds but may dry quickly because of wall adjacency and reduced rainfall exposure.

### If a layer is selected, show:
- layer title
- what it means
- why it matters for landscape design
- confidence type:
  - authoritative
  - detected
  - inferred
  - modeled

This confidence language is required.

---

## Required layers to visualize

The prototype should show a layered environmental analysis for the property.

### Group 1: Base geometry
These must exist:
- parcel / lot lines
- building footprint(s)
- neighboring buildings
- impervious areas / paved surfaces
- walls / fences / edge structures
- major tree canopy

### Group 2: Light and shade
These are core:
- seasonal solar exposure
- shade cast by building(s)
- shade cast by neighboring structures
- tree shade if present
- direct sun hours
- bright shade vs deep shade
- morning sun vs afternoon sun if feasible in the prototype

### Group 3: Wind and shelter
These are core:
- prevailing wind direction
- exposed zones
- sheltered pockets
- wind tunnel areas between structures
- desiccating exposed edges

### Group 4: Water behavior
These are core:
- runoff direction
- low spots / ponding likelihood
- slope-driven drainage
- roof drip concentration
- rain shadow / dry overhang strips
- moisture-retentive zones

### Group 5: Heat and thermal modifiers
These are core:
- south / west heat-reflective walls
- cool north wall zones
- heat-retentive hardscape edge
- warm enclosed pockets
- frost-prone low spots

### Group 6: Structure / support / edge opportunity
These are core:
- walls suitable for climbers or espalier
- fences / screening edges
- trellis-capable zones
- narrow foundation strips
- vertical growing opportunities

### Group 7: Competition / establishment difficulty
These are core:
- root competition near large trees
- constrained planting strips
- compacted edge conditions
- difficult establishment zones

---

## Microzone generation

This is the most important product feature after the map itself.

The prototype must synthesize the property into a set of named **microzones**.

These microzones should be visible as outlined polygons or clear highlighted areas on the map.

### Each microzone should have these fields
- name
- geometry
- light class
- moisture class
- wind class
- heat class
- support / edge class
- competition class
- seasonal note
- confidence

### Example allowed classifications

#### Light
- Full sun
- Part sun
- Part shade
- Bright shade
- Deep shade

#### Moisture
- Dry
- Moderately dry
- Balanced
- Moist
- Wet

#### Wind
- Exposed
- Moderate
- Sheltered

#### Heat
- Cool
- Neutral
- Warm
- Heat-reflective

#### Support / edge
- Open bed
- Wall-adjacent
- Fence line
- Trellis-capable
- Foundation strip
- Under canopy edge

#### Competition
- Low
- Moderate
- High root competition

### Example microzone names
- South Wall Warm Pocket
- Exposed West Boundary
- Cool North Foundation Shade
- Wet Rear Drainage Pocket
- Open Sunny Interior Bed
- Tree Root Competition Zone
- Sheltered Courtyard Edge
- Trellis Opportunity Fence Line

The prototype should make these feel like the app’s key output.

---

## Composite garden conditions mode

In addition to raw layers, the app should include a **Composite Garden Conditions** mode.

This should combine the underlying environmental logic into a gardener-readable map.

### Example outputs
- best full-sun zone
- best protected warm zone
- driest zone
- wettest zone
- windiest zone
- best screening edge
- best climber-support edge
- highest root-competition zone
- most balanced all-purpose planting zone

This mode should feel especially valuable and product-like.

---

## Seasonal controls

The user should be able to switch between seasonal views.

### Required seasonal modes
- Winter
- Spring / Fall
- Summer

These should affect:
- sun / shade interpretation
- heat / exposure feel
- wind interpretation language
- overall microzone notes

The seasonal switch should be prominent but elegant.

---

## Layer controls and legend

Do not use a clunky GIS checkbox list.

Create a clean, premium layer-control system.

### Preferred behavior
- segmented buttons or elegant toggles for major modes
- expandable fine-grain legend panel if needed
- chips or tabs for the major analytical categories
- clear visual explanation for active layers

### Required categories in control system
- Base
- Light
- Wind
- Water
- Heat
- Structures
- Microzones

The legend should be easy to read and visually calm.

---

## Required design language

### Overall feel
- premium design tool
- calm analysis workspace
- strong information hierarchy
- lots of breathing room
- subtle color coding
- sophisticated spatial graphics

### Color guidance
Use restrained colors:
- neutral off-white or very light gray background
- charcoal / slate for built form
- muted green for vegetation
- warm yellow-gold for sun exposure
- cool blue for moisture / drainage
- muted purple-gray or subtle directional arrows for wind
- soft red-orange only for heat / reflective exposure
- subtle outlined polygons for microzones

No saturated rainbow GIS palette.

---

## Mobile behavior

The mobile version should still feel intentional.

### Mobile rules
- stack panels cleanly
- keep map central
- turn side panels into drawers or tabs
- preserve layer controls in a compact segmented UI
- keep microzones tappable and legible
- do not let the experience collapse into a generic mobile map

---

## Required empty state and demo behavior

Because this is a prototype, include a believable demo state.

### Prototype behavior
If the user enters an address, transition into a polished “analysis in progress” state, then show a complete generated site analysis.

### Include loading experience
A calm staged loading sequence such as:
- Resolving parcel
- Detecting structures
- Computing sun / shade
- Modeling wind and moisture
- Generating garden microzones

This should feel premium and intelligent.

---

## Save / export actions

Include UI for:
- Export PDF
- Save analysis
- Share link

These do not need full backend functionality in the prototype, but they should exist in the design.

---

## Important product rules

### Non-negotiable
- This app is about **site conditions**, not plant recommendations yet
- The central product output is **microzones**
- The app must show both raw layers and interpreted garden logic
- Confidence labeling must be visible
- The design must feel premium and curated
- The app must not feel like a generic mapping product

### Explicitly avoid
- dense GIS checkboxes
- engineering-dashboard clutter
- generic satellite-first UI
- arbitrary cards everywhere
- over-explaining with too much text
- plant recommendation lists

---

## Prototype goal

Generate a **high-fidelity frontend prototype** that makes the product feel real.

The prototype should convincingly show:
- how an address becomes a site analysis
- how environmental layers stack together
- how microzones are derived
- how this product could become a foundation for hyper-local planting advice later

Focus on:
- strong map-centered layout
- elegant panels
- beautiful layer rendering
- clear microzone logic
- refined landscape-design aesthetic
- product clarity over technical completeness

Do not simplify this into a generic property map.
Follow this structure and logic exactly.