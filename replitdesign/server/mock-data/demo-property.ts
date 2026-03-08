import type { Property } from "../../shared/domain";

/**
 * Demo property: "1428 Elm Street"
 *
 * A typical suburban residential lot facing south.
 * Coordinate system: 0-1000 relative units.
 * Origin (0,0) is top-left (northwest corner).
 * X increases east, Y increases south.
 *
 * Layout sketch:
 * ┌─────────────────────────────────┐
 * │  N                              │
 * │         ┌──────────┐            │
 * │         │ BUILDING │   Tree ○   │
 * │         │          │            │
 * │         └──────────┘            │
 * │   Driveway                      │
 * │  S (street)                     │
 * └─────────────────────────────────┘
 */

export const demoProperty: Property = {
  id: "demo-001",
  inputAddress: "1428 Elm Street",
  resolvedAddress: "1428 Elm Street, Portland, OR 97201",
  centroid: { lat: 45.5152, lon: -122.6784 },

  parcelGeometry: {
    points: [
      { x: 50, y: 50 },
      { x: 950, y: 50 },
      { x: 950, y: 950 },
      { x: 50, y: 950 },
    ],
  },

  siteFeatures: [
    {
      id: "feat-building",
      type: "building",
      geometry: {
        points: [
          { x: 250, y: 250 },
          { x: 650, y: 250 },
          { x: 650, y: 550 },
          { x: 250, y: 550 },
        ],
      },
      source: "mock",
      confidence: "modeled",
      attributes: { stories: 2, material: "wood_frame" },
    },
    {
      id: "feat-driveway",
      type: "impervious_surface",
      geometry: {
        points: [
          { x: 100, y: 550 },
          { x: 250, y: 550 },
          { x: 250, y: 950 },
          { x: 100, y: 950 },
        ],
      },
      source: "mock",
      confidence: "modeled",
      attributes: { material: "concrete" },
    },
    {
      id: "feat-neighbor-east",
      type: "neighboring_building",
      geometry: {
        points: [
          { x: 960, y: 200 },
          { x: 1100, y: 200 },
          { x: 1100, y: 600 },
          { x: 960, y: 600 },
        ],
      },
      source: "mock",
      confidence: "modeled",
      attributes: { stories: 2 },
    },
    {
      id: "feat-canopy",
      type: "canopy",
      geometry: {
        points: [
          { x: 720, y: 150 },
          { x: 870, y: 150 },
          { x: 900, y: 250 },
          { x: 870, y: 350 },
          { x: 720, y: 350 },
          { x: 690, y: 250 },
        ],
      },
      source: "mock",
      confidence: "modeled",
      attributes: { species: "deciduous", canopyDiameterFt: 30 },
    },
    {
      id: "feat-fence-west",
      type: "fence",
      geometry: {
        points: [
          { x: 50, y: 50 },
          { x: 60, y: 50 },
          { x: 60, y: 950 },
          { x: 50, y: 950 },
        ],
      },
      source: "mock",
      confidence: "inferred",
      attributes: { heightFt: 6, material: "wood" },
    },
  ],

  environmentalLayers: [
    // Solar exposure — summer
    {
      id: "layer-solar-summer",
      type: "solar_exposure",
      season: "summer",
      zones: [
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 650, y: 550 },
              { x: 950, y: 750 },
              { x: 950, y: 950 },
              { x: 250, y: 950 },
            ],
          },
          intensity: 0.9,
          label: "High sun — south yard",
        },
        {
          geometry: {
            points: [
              { x: 650, y: 400 },
              { x: 950, y: 400 },
              { x: 950, y: 750 },
              { x: 650, y: 550 },
            ],
          },
          intensity: 0.7,
          label: "Moderate sun — east side",
        },
      ],
      sourceInputs: ["building_footprint", "compass_orientation"],
      methodology: "Heuristic shadow projection from building geometry and cardinal orientation",
      confidence: "modeled",
    },
    // Shade — summer
    {
      id: "layer-shade-summer",
      type: "shade",
      season: "summer",
      zones: [
        {
          geometry: {
            points: [
              { x: 250, y: 100 },
              { x: 650, y: 100 },
              { x: 650, y: 250 },
              { x: 250, y: 250 },
            ],
          },
          intensity: 0.8,
          label: "Building north shadow",
        },
        {
          geometry: {
            points: [
              { x: 690, y: 150 },
              { x: 900, y: 150 },
              { x: 900, y: 400 },
              { x: 690, y: 400 },
            ],
          },
          intensity: 0.7,
          label: "Tree canopy shade",
        },
      ],
      sourceInputs: ["building_footprint", "canopy_outline"],
      methodology: "Shadow projection from building and canopy geometry",
      confidence: "modeled",
    },
    // Wind exposure — all seasons
    {
      id: "layer-wind-summer",
      type: "wind_exposure",
      season: "summer",
      zones: [
        {
          geometry: {
            points: [
              { x: 50, y: 50 },
              { x: 250, y: 50 },
              { x: 250, y: 250 },
              { x: 50, y: 250 },
            ],
          },
          intensity: 0.4,
          label: "Sheltered — fence + building lee",
        },
        {
          geometry: {
            points: [
              { x: 650, y: 550 },
              { x: 950, y: 550 },
              { x: 950, y: 950 },
              { x: 650, y: 950 },
            ],
          },
          intensity: 0.85,
          label: "Exposed — open south-east",
        },
      ],
      sourceInputs: ["building_footprint", "fence_lines", "parcel_edges"],
      methodology: "Wind shelter estimated from building wind-shadow and boundary structures",
      confidence: "modeled",
    },
    // Moisture tendency
    {
      id: "layer-moisture-summer",
      type: "moisture_tendency",
      season: "summer",
      zones: [
        {
          geometry: {
            points: [
              { x: 750, y: 750 },
              { x: 950, y: 750 },
              { x: 950, y: 950 },
              { x: 750, y: 950 },
            ],
          },
          intensity: 0.85,
          label: "Likely wet — low rear corner",
        },
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 350, y: 550 },
              { x: 350, y: 700 },
              { x: 250, y: 700 },
            ],
          },
          intensity: 0.2,
          label: "Dry strip — south wall base / roof overhang",
        },
      ],
      sourceInputs: ["building_footprint", "parcel_geometry", "roof_edges"],
      methodology: "Moisture tendency from roof runoff, building proximity, and assumed low-point drainage",
      confidence: "modeled",
    },
    // Heat exposure — summer
    {
      id: "layer-heat-summer",
      type: "heat_exposure",
      season: "summer",
      zones: [
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 650, y: 550 },
              { x: 650, y: 700 },
              { x: 250, y: 700 },
            ],
          },
          intensity: 0.85,
          label: "Warm — south wall reflected heat",
        },
        {
          geometry: {
            points: [
              { x: 100, y: 550 },
              { x: 250, y: 550 },
              { x: 250, y: 950 },
              { x: 100, y: 950 },
            ],
          },
          intensity: 0.7,
          label: "Heat-reflective — driveway adjacency",
        },
      ],
      sourceInputs: ["building_footprint", "impervious_surfaces", "compass_orientation"],
      methodology: "Heat from wall reflection, hardscape re-radiation, and solar gain on south-facing surfaces",
      confidence: "modeled",
    },

    // ---- Winter layers ----
    {
      id: "layer-solar-winter",
      type: "solar_exposure",
      season: "winter",
      zones: [
        {
          geometry: {
            points: [
              { x: 250, y: 650 },
              { x: 650, y: 650 },
              { x: 950, y: 850 },
              { x: 950, y: 950 },
              { x: 250, y: 950 },
            ],
          },
          intensity: 0.55,
          label: "Low-angle winter sun — south yard only",
        },
      ],
      sourceInputs: ["building_footprint", "compass_orientation"],
      methodology: "Low winter sun angle casts longer building shadows; only far south yard receives direct light",
      confidence: "modeled",
    },
    {
      id: "layer-shade-winter",
      type: "shade",
      season: "winter",
      zones: [
        {
          geometry: {
            points: [
              { x: 150, y: 50 },
              { x: 700, y: 50 },
              { x: 700, y: 350 },
              { x: 150, y: 350 },
            ],
          },
          intensity: 0.9,
          label: "Extended building shadow — winter",
        },
        {
          geometry: {
            points: [
              { x: 250, y: 350 },
              { x: 650, y: 350 },
              { x: 650, y: 550 },
              { x: 250, y: 550 },
            ],
          },
          intensity: 0.5,
          label: "Partial shade from low sun angle",
        },
      ],
      sourceInputs: ["building_footprint", "canopy_outline"],
      methodology: "Extended shadow projection from low winter sun angle",
      confidence: "modeled",
    },
    {
      id: "layer-wind-winter",
      type: "wind_exposure",
      season: "winter",
      zones: [
        {
          geometry: {
            points: [
              { x: 50, y: 50 },
              { x: 250, y: 50 },
              { x: 250, y: 250 },
              { x: 50, y: 250 },
            ],
          },
          intensity: 0.35,
          label: "Sheltered — fence + building lee",
        },
        {
          geometry: {
            points: [
              { x: 650, y: 550 },
              { x: 950, y: 550 },
              { x: 950, y: 950 },
              { x: 650, y: 950 },
            ],
          },
          intensity: 0.95,
          label: "Very exposed — winter storms from SW",
        },
      ],
      sourceInputs: ["building_footprint", "fence_lines", "parcel_edges"],
      methodology: "Winter wind exposure heightened; prevailing storms from southwest",
      confidence: "modeled",
    },
    {
      id: "layer-moisture-winter",
      type: "moisture_tendency",
      season: "winter",
      zones: [
        {
          geometry: {
            points: [
              { x: 700, y: 700 },
              { x: 950, y: 700 },
              { x: 950, y: 950 },
              { x: 700, y: 950 },
            ],
          },
          intensity: 0.95,
          label: "Waterlogged — winter drainage pooling",
        },
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 400, y: 550 },
              { x: 400, y: 750 },
              { x: 250, y: 750 },
            ],
          },
          intensity: 0.15,
          label: "Dry — rain shadow from building overhang",
        },
        {
          geometry: {
            points: [
              { x: 50, y: 550 },
              { x: 250, y: 550 },
              { x: 250, y: 950 },
              { x: 50, y: 950 },
            ],
          },
          intensity: 0.6,
          label: "Moderate moisture — driveway runoff",
        },
      ],
      sourceInputs: ["building_footprint", "parcel_geometry", "roof_edges"],
      methodology: "Winter increases overall moisture; low-point pooling intensifies",
      confidence: "modeled",
    },
    {
      id: "layer-heat-winter",
      type: "heat_exposure",
      season: "winter",
      zones: [
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 650, y: 550 },
              { x: 650, y: 650 },
              { x: 250, y: 650 },
            ],
          },
          intensity: 0.4,
          label: "Mild warmth — south wall residual heat",
        },
      ],
      sourceInputs: ["building_footprint", "compass_orientation"],
      methodology: "Reduced solar gain in winter; south wall retains some thermal advantage",
      confidence: "modeled",
    },

    // ---- Spring/Fall layers ----
    {
      id: "layer-solar-spring",
      type: "solar_exposure",
      season: "spring_fall",
      zones: [
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 650, y: 550 },
              { x: 950, y: 700 },
              { x: 950, y: 950 },
              { x: 250, y: 950 },
            ],
          },
          intensity: 0.75,
          label: "Good sun — south yard",
        },
        {
          geometry: {
            points: [
              { x: 650, y: 400 },
              { x: 950, y: 400 },
              { x: 950, y: 700 },
              { x: 650, y: 550 },
            ],
          },
          intensity: 0.55,
          label: "Moderate sun — east side",
        },
      ],
      sourceInputs: ["building_footprint", "compass_orientation"],
      methodology: "Moderate sun angle; building shadow intermediate between summer and winter",
      confidence: "modeled",
    },
    {
      id: "layer-shade-spring",
      type: "shade",
      season: "spring_fall",
      zones: [
        {
          geometry: {
            points: [
              { x: 200, y: 80 },
              { x: 680, y: 80 },
              { x: 680, y: 280 },
              { x: 200, y: 280 },
            ],
          },
          intensity: 0.7,
          label: "Building shadow — moderate length",
        },
        {
          geometry: {
            points: [
              { x: 690, y: 150 },
              { x: 900, y: 150 },
              { x: 900, y: 400 },
              { x: 690, y: 400 },
            ],
          },
          intensity: 0.5,
          label: "Tree canopy — partial leaf cover",
        },
      ],
      sourceInputs: ["building_footprint", "canopy_outline"],
      methodology: "Intermediate shadow length; deciduous canopy partially leafed",
      confidence: "modeled",
    },
    {
      id: "layer-wind-spring",
      type: "wind_exposure",
      season: "spring_fall",
      zones: [
        {
          geometry: {
            points: [
              { x: 50, y: 50 },
              { x: 250, y: 50 },
              { x: 250, y: 250 },
              { x: 50, y: 250 },
            ],
          },
          intensity: 0.4,
          label: "Sheltered — fence + building lee",
        },
        {
          geometry: {
            points: [
              { x: 650, y: 550 },
              { x: 950, y: 550 },
              { x: 950, y: 950 },
              { x: 650, y: 950 },
            ],
          },
          intensity: 0.75,
          label: "Exposed — open south-east",
        },
      ],
      sourceInputs: ["building_footprint", "fence_lines", "parcel_edges"],
      methodology: "Moderate seasonal winds; patterns similar to summer but less intense",
      confidence: "modeled",
    },
    {
      id: "layer-moisture-spring",
      type: "moisture_tendency",
      season: "spring_fall",
      zones: [
        {
          geometry: {
            points: [
              { x: 750, y: 750 },
              { x: 950, y: 750 },
              { x: 950, y: 950 },
              { x: 750, y: 950 },
            ],
          },
          intensity: 0.75,
          label: "Wet — spring rains collect here",
        },
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 350, y: 550 },
              { x: 350, y: 700 },
              { x: 250, y: 700 },
            ],
          },
          intensity: 0.2,
          label: "Dry strip — roof overhang",
        },
      ],
      sourceInputs: ["building_footprint", "parcel_geometry", "roof_edges"],
      methodology: "Spring/fall rainfall moderate; drainage patterns similar to summer",
      confidence: "modeled",
    },
    {
      id: "layer-heat-spring",
      type: "heat_exposure",
      season: "spring_fall",
      zones: [
        {
          geometry: {
            points: [
              { x: 250, y: 550 },
              { x: 650, y: 550 },
              { x: 650, y: 700 },
              { x: 250, y: 700 },
            ],
          },
          intensity: 0.6,
          label: "Moderate warmth — south wall",
        },
        {
          geometry: {
            points: [
              { x: 100, y: 550 },
              { x: 250, y: 550 },
              { x: 250, y: 950 },
              { x: 100, y: 950 },
            ],
          },
          intensity: 0.45,
          label: "Mild heat — driveway",
        },
      ],
      sourceInputs: ["building_footprint", "impervious_surfaces", "compass_orientation"],
      methodology: "Moderate solar gain; wall and hardscape effects less pronounced than summer",
      confidence: "modeled",
    },
  ],

  microzones: [
    {
      id: "zone-a",
      name: "South Wall Warm Pocket",
      geometry: {
        points: [
          { x: 250, y: 550 },
          { x: 650, y: 550 },
          { x: 650, y: 700 },
          { x: 250, y: 700 },
        ],
      },
      lightClass: "full_sun",
      moistureClass: "moderately_dry",
      windClass: "sheltered",
      heatClass: "warm",
      supportClass: "wall_adjacent",
      competitionClass: "low",
      confidence: "modeled",
      rationale:
        "The south-facing wall of the building creates a warm, sheltered microclimate. Reflected heat from the wall and full southern sun exposure make this the warmest zone on the property. The wall provides wind shelter and physical support for climbing plants. Roof overhang keeps the soil slightly drier.",
      seasonalNotes: [
        { season: "summer", note: "Peak heat accumulation. Best for heat-loving plants. May need supplemental watering due to wall rain shadow." },
        { season: "winter", note: "Retains warmth longer than open areas. South sun still reaches this zone even at low angle." },
        { season: "spring_fall", note: "Warms up earliest in spring. Good for early-season planting." },
      ],
      sourceInputs: ["building_footprint", "compass_orientation", "solar_exposure", "heat_exposure"],
      tags: ["warm", "sheltered", "wall-support", "dry-tendency"],
    },
    {
      id: "zone-b",
      name: "Exposed West Edge",
      geometry: {
        points: [
          { x: 650, y: 550 },
          { x: 950, y: 550 },
          { x: 950, y: 800 },
          { x: 650, y: 700 },
        ],
      },
      lightClass: "full_sun",
      moistureClass: "moderately_dry",
      windClass: "exposed",
      heatClass: "neutral",
      supportClass: "open_bed",
      competitionClass: "low",
      confidence: "modeled",
      rationale:
        "The southeast open yard receives strong afternoon sun with no wind protection from structures. This area is exposed to prevailing winds from the west and southwest. Good open planting area but plants must tolerate wind and some drying stress.",
      seasonalNotes: [
        { season: "summer", note: "Full afternoon sun exposure. Drying winds increase water demand." },
        { season: "winter", note: "Most exposed to winter storms. Wind chill factor is highest here." },
        { season: "spring_fall", note: "Moderate conditions, good growing period. Wind may stress young transplants." },
      ],
      sourceInputs: ["parcel_edges", "wind_exposure", "solar_exposure"],
      tags: ["exposed", "sunny", "wind-stressed", "open"],
    },
    {
      id: "zone-c",
      name: "Cool North Side Shade",
      geometry: {
        points: [
          { x: 250, y: 100 },
          { x: 650, y: 100 },
          { x: 650, y: 250 },
          { x: 250, y: 250 },
        ],
      },
      lightClass: "part_shade",
      moistureClass: "moist",
      windClass: "sheltered",
      heatClass: "cool",
      supportClass: "foundation_strip",
      competitionClass: "moderate",
      confidence: "modeled",
      rationale:
        "The north side of the building is shaded for most of the day year-round. The building blocks direct southern sun, creating a cool, moist environment. This area retains moisture longer and stays cooler than any other zone. The foundation edge provides some structural support opportunity.",
      seasonalNotes: [
        { season: "summer", note: "Stays cool even on hot days. Ideal for shade-loving plants. Soil stays moist longer." },
        { season: "winter", note: "Coldest zone on property. May get frost earlier and lose it later than south-facing areas." },
        { season: "spring_fall", note: "Slow to warm in spring. Last area to dry out." },
      ],
      sourceInputs: ["building_footprint", "shade_layer", "moisture_tendency"],
      tags: ["shady", "cool", "moist", "foundation"],
    },
    {
      id: "zone-d",
      name: "Wet Rear Corner",
      geometry: {
        points: [
          { x: 750, y: 750 },
          { x: 950, y: 750 },
          { x: 950, y: 950 },
          { x: 750, y: 950 },
        ],
      },
      lightClass: "part_sun",
      moistureClass: "wet",
      windClass: "moderate",
      heatClass: "cool",
      supportClass: "open_bed",
      competitionClass: "low",
      confidence: "modeled",
      rationale:
        "The rear corner of the property sits at the likely low point where runoff from the building roof and yard surface tends to collect. Drainage is slow, keeping soil consistently moist to wet. Receives partial sun but not enough to dry quickly.",
      seasonalNotes: [
        { season: "summer", note: "May partially dry in prolonged heat but typically stays moist. Good for moisture-loving plants." },
        { season: "winter", note: "Can become waterlogged. Standing water possible after heavy rain." },
        { season: "spring_fall", note: "Slow to drain after spring rains. Soggy conditions persist." },
      ],
      sourceInputs: ["parcel_geometry", "moisture_tendency", "drainage_tendency"],
      tags: ["wet", "drainage-issue", "low-point", "moist-loving"],
    },
    {
      id: "zone-e",
      name: "Open Sunny Planting Bed",
      geometry: {
        points: [
          { x: 350, y: 700 },
          { x: 650, y: 700 },
          { x: 750, y: 750 },
          { x: 750, y: 950 },
          { x: 250, y: 950 },
          { x: 250, y: 700 },
        ],
      },
      lightClass: "full_sun",
      moistureClass: "balanced",
      windClass: "moderate",
      heatClass: "neutral",
      supportClass: "open_bed",
      competitionClass: "low",
      confidence: "modeled",
      rationale:
        "The largest open area in the south-central yard. Far enough from the building to escape rain shadow and reflected heat, but close enough to benefit from some wind buffering. Full sun exposure with balanced moisture — the most versatile planting zone on the property.",
      seasonalNotes: [
        { season: "summer", note: "Best growing conditions. Full sun and adequate moisture for most garden plants." },
        { season: "winter", note: "Open to sky — good light for winter-interest plants. Normal winter drainage." },
        { season: "spring_fall", note: "Prime planting zone. Warms up quickly in spring, good fall color opportunity." },
      ],
      sourceInputs: ["solar_exposure", "moisture_tendency", "wind_exposure"],
      tags: ["sunny", "balanced", "versatile", "prime-planting"],
    },
    {
      id: "zone-f",
      name: "Tree Root Competition Zone",
      geometry: {
        points: [
          { x: 650, y: 150 },
          { x: 900, y: 150 },
          { x: 950, y: 250 },
          { x: 950, y: 450 },
          { x: 650, y: 450 },
          { x: 650, y: 250 },
        ],
      },
      lightClass: "bright_shade",
      moistureClass: "moderately_dry",
      windClass: "sheltered",
      heatClass: "cool",
      supportClass: "canopy_edge",
      competitionClass: "high",
      confidence: "modeled",
      rationale:
        "Beneath and around the mature tree canopy in the northeast corner. Root competition from the established tree makes it difficult for new plantings to establish. Filtered light through the canopy provides bright shade. The tree canopy shelters this zone from wind but also intercepts rainfall, making soil drier than expected.",
      seasonalNotes: [
        { season: "summer", note: "Dense canopy shade. Tree roots extract significant soil moisture. Very competitive environment." },
        { season: "winter", note: "If deciduous, more light reaches ground. Root competition eases slightly but soil remains dry." },
        { season: "spring_fall", note: "Brief window of good light before leaf-out (spring). Bulbs and early perennials can succeed." },
      ],
      sourceInputs: ["canopy_outline", "shade_layer", "root_competition"],
      tags: ["shady", "competitive", "canopy-edge", "dry-under-canopy"],
    },
  ],

  insights: [
    {
      id: "insight-1",
      type: "opportunity",
      title: "Prime planting zone in south yard",
      body: "The open sunny area south of the building has the best combination of full sun, balanced moisture, and moderate wind protection. This is the most versatile zone for a wide range of garden plants and should be the primary focus for planting design.",
      relatedMicrozoneIds: ["zone-e"],
      importance: "high",
      confidence: "modeled",
    },
    {
      id: "insight-2",
      type: "opportunity",
      title: "South wall creates a warm microclimate",
      body: "The south-facing wall provides reflected heat and wind shelter, creating conditions approximately one USDA hardiness zone warmer than the open yard. This makes it suitable for borderline-hardy plants that would struggle elsewhere on the property.",
      relatedMicrozoneIds: ["zone-a"],
      importance: "high",
      confidence: "modeled",
    },
    {
      id: "insight-3",
      type: "constraint",
      title: "Wet rear corner limits plant selection",
      body: "The southeast rear corner collects runoff and drains slowly. Only moisture-tolerant plants will thrive here. Consider this zone for rain garden plantings or plants adapted to periodic wet feet. Grading improvements could reduce this issue.",
      relatedMicrozoneIds: ["zone-d"],
      importance: "medium",
      confidence: "modeled",
    },
    {
      id: "insight-4",
      type: "constraint",
      title: "Tree root competition in northeast",
      body: "The established tree in the northeast creates significant root competition. New plantings in this zone should be shade-tolerant, drought-adapted species that can coexist with aggressive tree roots. Avoid deep-rooted perennials near the trunk.",
      relatedMicrozoneIds: ["zone-f"],
      importance: "medium",
      confidence: "modeled",
    },
    {
      id: "insight-5",
      type: "observation",
      title: "West boundary is wind-exposed",
      body: "The open west-southwest edge of the property receives prevailing winds with no structural shelter. Plants here should be wind-tolerant. A future hedge or fence along this boundary would create a sheltered planting opportunity along the entire west side.",
      relatedMicrozoneIds: ["zone-b"],
      importance: "medium",
      confidence: "modeled",
    },
  ],

  areaStats: {
    lotAreaSqFt: 7500,
    buildingCoverageSqFt: 1800,
    imperviousSqFt: 900,
    greenSpaceSqFt: 4800,
  },

  analysisMetadata: {
    analyzedAt: new Date().toISOString(),
    pipelineVersion: "0.1.0-mock",
    dataSourceNotes: [
      "All geometry is mock data for demonstration",
      "Environmental layers are modeled from heuristics",
      "Microzones derived from mock layer overlap",
    ],
  },
};
