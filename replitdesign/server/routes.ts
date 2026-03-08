import type { Express } from "express";
import type { Server } from "http";
import { demoProperty } from "./mock-data/demo-property";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // --- Property endpoints ---

  // GET /api/properties/demo — returns the hardcoded demo property
  app.get("/api/properties/demo", (_req, res) => {
    res.json(demoProperty);
  });

  return httpServer;
}
