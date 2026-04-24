import type {
  OrchestratorRequest,
  OrchestratorResponse,
} from "@shared/types";

export async function analyzeDecision(
  body: OrchestratorRequest,
): Promise<OrchestratorResponse> {
  const res = await fetch("/api/decision/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Analyze failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function listDecisions(): Promise<OrchestratorResponse[]> {
  const res = await fetch("/api/decision");
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  return res.json();
}

export async function getDecision(id: string): Promise<OrchestratorResponse> {
  const res = await fetch(`/api/decision/${id}`);
  if (!res.ok) throw new Error(`Get failed: ${res.status}`);
  return res.json();
}
