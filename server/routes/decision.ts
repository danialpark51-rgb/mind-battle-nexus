import type { Request, Response, Router } from "express";
import { Router as makeRouter } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { analyzeDecision } from "../services/orchestrator";
import { getDecision, listDecisions } from "../store";

const traitsSchema = z.object({
  risk_level: z.enum(["low", "medium", "high"]),
  decision_bias: z.enum(["analytical", "intuitive", "balanced"]),
  goal_type: z.enum(["short_term", "long_term", "balanced"]),
});

const twinSchema = z.object({
  user_id: z.string(),
  traits: traitsSchema,
  history: z.array(z.string()).default([]),
});

const analyzeSchema = z.object({
  problem: z.string().min(5).max(2000),
  context: z.string().max(4000).optional(),
  user_id: z.string().optional(),
  twin: twinSchema.optional(),
});

export function decisionRouter(): Router {
  const router = makeRouter();

  router.post("/analyze", async (req: Request, res: Response) => {
    const parsed = analyzeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: fromZodError(parsed.error).message,
      });
    }

    try {
      const result = await analyzeDecision(parsed.data);
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[decision/analyze] failed:", msg);
      res.status(500).json({ error: "Analysis failed", message: msg });
    }
  });

  router.get("/", (_req, res) => {
    res.json(listDecisions());
  });

  router.get("/:id", (req, res) => {
    const decision = getDecision(req.params.id);
    if (!decision) return res.status(404).json({ error: "Not found" });
    res.json(decision);
  });

  return router;
}
