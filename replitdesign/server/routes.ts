import type { Express } from "express";
import type { Server } from "http";
import { analyzeProperty } from "./analysis/pipeline";
import type { AnalysisInput } from "./analysis/types";
import { geocodeAddress } from "./services/geocoding";

/**
 * Demo property seed: just the geometry and metadata needed as pipeline input.
 * The pipeline produces the full Property output with layers, zones, insights.
 */
const demoInput: AnalysisInput = {
  address: "1428 Elm Street",
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
  buildingGeometry: {
    points: [
      { x: 250, y: 250 },
      { x: 650, y: 250 },
      { x: 650, y: 550 },
      { x: 250, y: 550 },
    ],
  },
  additionalFeatures: {
    neighboringBuildings: [
      {
        points: [
          { x: 960, y: 200 },
          { x: 1100, y: 200 },
          { x: 1100, y: 600 },
          { x: 960, y: 600 },
        ],
      },
    ],
    canopies: [
      {
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
        species: "deciduous",
      },
    ],
    fences: [
      {
        geometry: {
          points: [
            { x: 50, y: 50 },
            { x: 60, y: 50 },
            { x: 60, y: 950 },
            { x: 50, y: 950 },
          ],
        },
        heightFt: 6,
      },
    ],
    imperviousSurfaces: [
      {
        points: [
          { x: 100, y: 550 },
          { x: 250, y: 550 },
          { x: 250, y: 950 },
          { x: 100, y: 950 },
        ],
      },
    ],
  },
  lotAreaSqFt: 7500,
  buildingAreaSqFt: 1800,
  frontFacingDegrees: 180, // south-facing
};

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // GET /api/properties/demo — run analysis pipeline on demo seed data
  app.get("/api/properties/demo", (_req, res) => {
    const result = analyzeProperty(demoInput);
    res.json(result);
  });

  // POST /api/properties/analyze — analyze a custom property
  app.post("/api/properties/analyze", async (req, res) => {
    const { address } = req.body as { address?: string };
    if (!address || typeof address !== "string" || address.trim().length === 0) {
      res.status(400).json({ error: "Address is required" });
      return;
    }

    try {
      const geo = await geocodeAddress(address.trim());

      const input: AnalysisInput = {
        ...demoInput,
        address: address.trim(),
        resolvedAddress: geo.resolvedAddress,
        centroid: { lat: geo.lat, lon: geo.lon },
      };

      const result = analyzeProperty(input);
      res.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Geocoding failed";
      res.status(422).json({ error: message });
    }
  });

  return httpServer;
}
