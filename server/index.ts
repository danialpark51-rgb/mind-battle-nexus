import express, { type Express } from "express";
import type { Plugin } from "vite";
import { decisionRouter } from "./routes/decision";

export function buildBackendApp(): Express {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: Date.now() });
  });

  app.use("/api/decision", decisionRouter());

  return app;
}

/**
 * Vite plugin that mounts the Express backend as middleware.
 * This lets the frontend and backend share port 5000 with no proxy.
 */
export function backendPlugin(): Plugin {
  return {
    name: "aegismind-backend",
    configureServer(server) {
      const app = buildBackendApp();
      server.middlewares.use(app);
    },
  };
}
