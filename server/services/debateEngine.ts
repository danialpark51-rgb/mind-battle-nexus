import { jsonChat } from "../llm";
import { getAgentSystemPrompt } from "../agents/prompts";
import type {
  AgentArgument,
  AgentMessage,
  AgentRole,
  CognitiveTwin,
  Conflict,
  DebateResult,
  DecisionOption,
} from "../../shared/types";

interface DebateInput {
  problem: string;
  context?: string;
  twin?: CognitiveTwin;
}

const PROPOSING_AGENTS: AgentRole[] = [
  "analyst",
  "risk_manager",
  "optimist",
  "strategist",
];

function nowMessage(
  agent: AgentRole,
  phase: AgentMessage["phase"],
  content: string,
): AgentMessage {
  return { agent, phase, content, timestamp: Date.now() };
}

async function runProposalPhase(
  input: DebateInput,
): Promise<{ options: DecisionOption[]; messages: AgentMessage[] }> {
  const messages: AgentMessage[] = [];
  const options: DecisionOption[] = [];

  const userPrompt = `Problem: ${input.problem}
${input.context ? `\nContext: ${input.context}` : ""}

Propose ONE decision option from your role's perspective. Output JSON:
{
  "option": { "title": "string (max 8 words)", "summary": "string (2-3 sentences)" },
  "reasoning": "string (why this fits your role's lens)"
}`;

  const proposals = await Promise.all(
    PROPOSING_AGENTS.map(async (agent) => {
      const result = await jsonChat<{
        option: { title: string; summary: string };
        reasoning: string;
      }>({
        system: getAgentSystemPrompt(agent, input.twin),
        user: userPrompt,
      });
      return { agent, result };
    }),
  );

  proposals.forEach(({ agent, result }, idx) => {
    options.push({
      id: `opt_${idx + 1}`,
      title: result.option.title,
      summary: result.option.summary,
      proposedBy: agent,
    });
    messages.push(
      nowMessage(
        agent,
        "initial_proposal",
        `${result.option.title} — ${result.option.summary}\nReasoning: ${result.reasoning}`,
      ),
    );
  });

  return { options, messages };
}

async function runCritiquePhase(
  input: DebateInput,
  options: DecisionOption[],
): Promise<{ args: AgentArgument[]; messages: AgentMessage[] }> {
  const args: AgentArgument[] = [];
  const messages: AgentMessage[] = [];

  const optionsBlock = options
    .map((o) => `- [${o.id}] ${o.title}: ${o.summary} (proposed by ${o.proposedBy})`)
    .join("\n");

  const userPrompt = `Problem: ${input.problem}
${input.context ? `\nContext: ${input.context}` : ""}

Decision options on the table:
${optionsBlock}

Critique each option from your role's perspective. Output JSON:
{
  "critiques": [
    { "optionId": "opt_1", "stance": "support" | "oppose" | "neutral", "reasoning": "string" }
  ]
}`;

  const critiqueAgents: AgentRole[] = input.twin
    ? [...PROPOSING_AGENTS, "cognitive_twin"]
    : PROPOSING_AGENTS;

  const results = await Promise.all(
    critiqueAgents.map(async (agent) => {
      const result = await jsonChat<{
        critiques: Array<{
          optionId: string;
          stance: "support" | "oppose" | "neutral";
          reasoning: string;
        }>;
      }>({
        system: getAgentSystemPrompt(agent, input.twin),
        user: userPrompt,
      });
      return { agent, result };
    }),
  );

  results.forEach(({ agent, result }) => {
    for (const c of result.critiques ?? []) {
      args.push({
        agent,
        optionId: c.optionId,
        stance: c.stance,
        reasoning: c.reasoning,
      });
      messages.push(
        nowMessage(
          agent,
          "critique",
          `[${c.optionId}] ${c.stance.toUpperCase()}: ${c.reasoning}`,
        ),
      );
    }
  });

  return { args, messages };
}

function detectConflicts(args: AgentArgument[]): Conflict[] {
  const byOption = new Map<string, AgentArgument[]>();
  for (const a of args) {
    const list = byOption.get(a.optionId) ?? [];
    list.push(a);
    byOption.set(a.optionId, list);
  }

  const conflicts: Conflict[] = [];
  for (const [optionId, list] of byOption) {
    const supporters = list.filter((a) => a.stance === "support");
    const opposers = list.filter((a) => a.stance === "oppose");
    if (supporters.length > 0 && opposers.length > 0) {
      conflicts.push({
        betweenAgents: [
          ...supporters.map((s) => s.agent),
          ...opposers.map((o) => o.agent),
        ],
        description: `Disagreement on ${optionId}: ${supporters
          .map((s) => s.agent)
          .join(", ")} support; ${opposers.map((o) => o.agent).join(", ")} oppose.`,
        resolved: false,
      });
    }
  }
  return conflicts;
}

async function runJudgmentPhase(
  input: DebateInput,
  options: DecisionOption[],
  args: AgentArgument[],
  conflicts: Conflict[],
): Promise<{
  winningOptionId: string;
  confidence: number;
  reasoning: string;
  message: AgentMessage;
}> {
  const optionsBlock = options
    .map((o) => `- [${o.id}] ${o.title}: ${o.summary}`)
    .join("\n");

  const argsBlock = args
    .map((a) => `- ${a.agent} → ${a.optionId} (${a.stance}): ${a.reasoning}`)
    .join("\n");

  const conflictsBlock =
    conflicts.length > 0
      ? conflicts.map((c) => `- ${c.description}`).join("\n")
      : "(none)";

  const userPrompt = `Problem: ${input.problem}
${input.context ? `\nContext: ${input.context}` : ""}

Options:
${optionsBlock}

All agent arguments:
${argsBlock}

Conflicts:
${conflictsBlock}

Judge the debate. Output JSON:
{
  "winning_option_id": "opt_X",
  "confidence_score": 0.0,
  "reasoning": "string (3-5 sentences explaining the verdict)"
}`;

  const verdict = await jsonChat<{
    winning_option_id: string;
    confidence_score: number;
    reasoning: string;
  }>({
    system: getAgentSystemPrompt("judge"),
    user: userPrompt,
  });

  return {
    winningOptionId: verdict.winning_option_id,
    confidence: Math.max(0, Math.min(1, verdict.confidence_score ?? 0.5)),
    reasoning: verdict.reasoning,
    message: nowMessage(
      "judge",
      "judgment",
      `Winning: ${verdict.winning_option_id} @ confidence ${verdict.confidence_score}\n${verdict.reasoning}`,
    ),
  };
}

export async function runDebate(input: DebateInput): Promise<DebateResult> {
  const transcript: AgentMessage[] = [];

  const { options, messages: proposalMsgs } = await runProposalPhase(input);
  transcript.push(...proposalMsgs);

  const { args, messages: critiqueMsgs } = await runCritiquePhase(input, options);
  transcript.push(...critiqueMsgs);

  const conflicts = detectConflicts(args);

  const { winningOptionId, confidence, reasoning, message } =
    await runJudgmentPhase(input, options, args, conflicts);
  transcript.push(message);

  // Mark conflicts as resolved if the winning option is involved
  for (const c of conflicts) {
    c.resolved = true;
  }

  const winningOption = options.find((o) => o.id === winningOptionId);

  return {
    decision_options: options,
    arguments: args,
    conflicts,
    winning_decision: winningOption
      ? `${winningOption.title} — ${winningOption.summary}\n\nVerdict reasoning: ${reasoning}`
      : reasoning,
    confidence_score: confidence,
    transcript,
  };
}
