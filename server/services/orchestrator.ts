import { runDebate } from "./debateEngine";
import type {
  OrchestratorRequest,
  OrchestratorResponse,
} from "../../shared/types";
import { saveDecision } from "../store";
import { randomUUID } from "node:crypto";

export async function analyzeDecision(
  req: OrchestratorRequest,
): Promise<OrchestratorResponse> {
  if (!req.problem || req.problem.trim().length < 5) {
    throw new Error("`problem` must be a non-trivial description (>= 5 chars).");
  }

  const debate = await runDebate({
    problem: req.problem,
    context: req.context,
    twin: req.twin,
  });

  const response: OrchestratorResponse = {
    id: randomUUID(),
    final_decision: debate.winning_decision,
    reasoning: debate.winning_decision,
    debate_summary: debate,
    simulations: [], // Future Simulation Engine — module 2 (not yet built)
    impact_chain: [], // Impact Chain Analyzer — module 4 (not yet built)
    confidence_score: debate.confidence_score,
    created_at: Date.now(),
  };

  saveDecision(response);
  return response;
}
