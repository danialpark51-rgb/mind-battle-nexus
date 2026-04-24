export type AgentRole =
  | "analyst"
  | "risk_manager"
  | "optimist"
  | "strategist"
  | "judge"
  | "cognitive_twin";

export interface AgentMessage {
  agent: AgentRole;
  phase: DebatePhase;
  content: string;
  timestamp: number;
}

export type DebatePhase =
  | "initial_proposal"
  | "critique"
  | "defense"
  | "final_argument"
  | "judgment";

export interface DecisionOption {
  id: string;
  title: string;
  summary: string;
  proposedBy: AgentRole;
}

export interface AgentArgument {
  agent: AgentRole;
  optionId: string;
  stance: "support" | "oppose" | "neutral";
  reasoning: string;
}

export interface Conflict {
  betweenAgents: AgentRole[];
  description: string;
  resolved: boolean;
}

export interface DebateResult {
  decision_options: DecisionOption[];
  arguments: AgentArgument[];
  conflicts: Conflict[];
  winning_decision: string;
  confidence_score: number;
  transcript: AgentMessage[];
}

export interface CognitiveTwinTraits {
  risk_level: "low" | "medium" | "high";
  decision_bias: "analytical" | "intuitive" | "balanced";
  goal_type: "short_term" | "long_term" | "balanced";
}

export interface CognitiveTwin {
  user_id: string;
  traits: CognitiveTwinTraits;
  history: string[];
}

export interface OrchestratorRequest {
  user_id?: string;
  problem: string;
  context?: string;
  twin?: CognitiveTwin;
}

export interface OrchestratorResponse {
  id: string;
  final_decision: string;
  reasoning: string;
  debate_summary: DebateResult;
  simulations: unknown[];
  impact_chain: unknown[];
  confidence_score: number;
  created_at: number;
}
