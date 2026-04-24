import type { OrchestratorResponse } from "../shared/types";

const decisions = new Map<string, OrchestratorResponse>();

export function saveDecision(d: OrchestratorResponse): void {
  decisions.set(d.id, d);
}

export function getDecision(id: string): OrchestratorResponse | undefined {
  return decisions.get(id);
}

export function listDecisions(): OrchestratorResponse[] {
  return Array.from(decisions.values()).sort(
    (a, b) => b.created_at - a.created_at,
  );
}
