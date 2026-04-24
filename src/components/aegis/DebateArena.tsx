import { motion } from "framer-motion";
import { Shield, TrendingUp, Sun, Gavel, UserCircle2, Trophy, Brain, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AgentRole, OrchestratorResponse } from "@shared/types";

const AGENT_META: Record<
  AgentRole,
  { name: string; role: string; icon: typeof Shield; color: string }
> = {
  analyst: { name: "Analyst", role: "Evidence & data", icon: Brain, color: "neon-cyan" },
  strategist: { name: "Strategist", role: "Long-term vision", icon: TrendingUp, color: "neon-blue" },
  risk_manager: { name: "Risk Manager", role: "Threat analysis", icon: Shield, color: "destructive" },
  optimist: { name: "Optimist", role: "Upside seeker", icon: Sun, color: "neon-green" },
  cognitive_twin: { name: "Your Twin", role: "Personal alignment", icon: UserCircle2, color: "neon-cyan" },
  judge: { name: "Judge", role: "Final arbiter", icon: Gavel, color: "neon-purple" },
};

const FALLBACK_LINES: Record<AgentRole, string> = {
  strategist: "Standing by — submit a decision to begin the debate.",
  risk_manager: "No risks to surface yet — awaiting your problem.",
  optimist: "Ready to find the upside as soon as you ask.",
  analyst: "Awaiting data to analyze.",
  cognitive_twin: "Calibrating to your profile…",
  judge: "Will deliver the final verdict once the agents have spoken.",
};

const DEFAULT_ORDER: AgentRole[] = [
  "analyst",
  "strategist",
  "risk_manager",
  "optimist",
  "judge",
];

const colorMap: Record<string, string> = {
  "neon-blue": "from-neon-blue/30 to-neon-blue/5 border-neon-blue/40 text-neon-blue",
  destructive: "from-destructive/30 to-destructive/5 border-destructive/40 text-destructive",
  "neon-green": "from-neon-green/30 to-neon-green/5 border-neon-green/40 text-neon-green",
  "neon-cyan": "from-neon-cyan/30 to-neon-cyan/5 border-neon-cyan/40 text-neon-cyan",
  "neon-purple": "from-neon-purple/30 to-neon-purple/5 border-neon-purple/40 text-neon-purple",
};

interface AgentCard {
  id: AgentRole;
  line: string;
  winner?: boolean;
}

function buildAgentCards(result: OrchestratorResponse | null): AgentCard[] {
  if (!result) {
    return DEFAULT_ORDER.map((id) => ({ id, line: FALLBACK_LINES[id] }));
  }

  const order: AgentRole[] = [];
  const linesByAgent = new Map<AgentRole, string[]>();

  for (const msg of result.debate_summary.transcript) {
    if (!order.includes(msg.agent)) order.push(msg.agent);
    const existing = linesByAgent.get(msg.agent) ?? [];
    existing.push(msg.content);
    linesByAgent.set(msg.agent, existing);
  }

  if (!order.includes("judge")) order.push("judge");

  return order.map((id) => {
    const allLines = linesByAgent.get(id) ?? [];
    const text = allLines.join("\n\n").trim() || FALLBACK_LINES[id];
    return { id, line: text, winner: id === "judge" };
  });
}

interface Props {
  active: boolean;
  loading?: boolean;
  result?: OrchestratorResponse | null;
  problem?: string;
}

export const DebateArena = ({ active, loading = false, result = null, problem = "" }: Props) => {
  const cards = useMemo(() => buildAgentCards(result), [result]);
  const [currentAgent, setCurrentAgent] = useState(-1);
  const [typedText, setTypedText] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!active || loading) {
      setCurrentAgent(-1);
      setTypedText({});
      return;
    }

    setCurrentAgent(-1);
    setTypedText({});
    let cancelled = false;
    let agentIdx = 0;
    let typer: ReturnType<typeof setInterval> | undefined;

    const advance = () => {
      if (cancelled || agentIdx >= cards.length) return;
      const card = cards[agentIdx];
      setCurrentAgent(agentIdx);
      let char = 0;
      const fullText = card.line;
      typer = setInterval(() => {
        if (cancelled) {
          if (typer) clearInterval(typer);
          return;
        }
        char += Math.max(2, Math.floor(fullText.length / 200));
        const next = fullText.slice(0, Math.min(char, fullText.length));
        setTypedText((p) => ({ ...p, [card.id]: next }));
        if (char >= fullText.length) {
          if (typer) clearInterval(typer);
          agentIdx++;
          setTimeout(advance, 350);
        }
      }, 16);
    };

    const t = setTimeout(advance, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
      if (typer) clearInterval(typer);
    };
  }, [active, loading, cards]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <SectionHeader
        eyebrow="Feature 01"
        title="AI Debate Arena"
        subtitle={
          loading
            ? "Five specialized agents are debating your decision in real time…"
            : "Five specialized agents argue, counter, and defend until consensus."
        }
      />

      {problem && (
        <div className="mt-4 p-4 rounded-xl glass border border-border/50">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Problem under analysis
          </div>
          <p className="text-sm text-foreground/90" data-testid="text-current-problem">
            {problem}
          </p>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground" data-testid="status-debating">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Multi-agent debate running… this can take 20–60 seconds.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {cards.map((card, i) => {
          const meta = AGENT_META[card.id];
          const Icon = meta.icon;
          const isActive = currentAgent === i && !loading;
          const isDone = currentAgent > i && !loading;
          const text = typedText[card.id] || "";
          const colors = colorMap[meta.color];

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              data-testid={`card-agent-${card.id}`}
              className={`relative glass rounded-2xl p-5 transition-all duration-500 ${
                isActive ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.3)] scale-[1.02]" : ""
              } ${card.winner && isDone ? "border-accent/60 shadow-[0_0_50px_hsl(var(--accent)/0.4)]" : ""}`}
            >
              {card.winner && isDone && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center glow-green">
                  <Trophy className="w-3.5 h-3.5 text-background" />
                </div>
              )}

              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors} border flex items-center justify-center mb-3 ${
                  isActive ? "pulse-ring" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="font-display font-semibold text-sm">{meta.name}</div>
              <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-3">
                {meta.role}
              </div>

              <div className="min-h-[140px] max-h-[260px] overflow-y-auto text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap pr-1">
                {loading ? (
                  <span className="text-muted-foreground/50 italic">thinking…</span>
                ) : (
                  <>
                    {text}
                    {isActive && (
                      <span className="inline-block w-1.5 h-3 bg-primary ml-0.5 animate-blink align-middle" />
                    )}
                    {!isActive && !isDone && !text && (
                      <span className="text-muted-foreground/40 italic">awaiting turn…</span>
                    )}
                  </>
                )}
              </div>

              {isActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-primary"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-end justify-between gap-6 flex-wrap">
    <div>
      <div className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-2">{eyebrow}</div>
      <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-1.5 max-w-xl">{subtitle}</p>
    </div>
    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> LIVE
    </div>
  </div>
);
