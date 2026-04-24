import { motion, AnimatePresence } from "framer-motion";
import { Shield, TrendingUp, Sun, Gavel, UserCircle2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const agents = [
  { id: "strategist", name: "Strategist", role: "Long-term vision", icon: TrendingUp, color: "neon-blue", line: "Expanding to Europe captures TAM growth of 3.2x. Q3 timing aligns with EU procurement cycles." },
  { id: "risk", name: "Risk Manager", role: "Threat analysis", icon: Shield, color: "destructive", line: "Currency exposure and GDPR compliance increase opex by ~22%. Recommend phased rollout." },
  { id: "optimist", name: "Optimist", role: "Upside seeker", icon: Sun, color: "neon-green", line: "Early-mover advantage. Three competitors are stalled — window closes in 9 months." },
  { id: "twin", name: "Your Twin", role: "Personal alignment", icon: UserCircle2, color: "neon-cyan", line: "Matches your risk profile (62%). Aligns with your stated 18-month wealth goal." },
  { id: "judge", name: "Judge", role: "Final arbiter", icon: Gavel, color: "neon-purple", line: "Weighing all arguments… verdict: PROCEED with phased EU launch starting Q3, UK first.", winner: true },
];

const colorMap: Record<string, string> = {
  "neon-blue": "from-neon-blue/30 to-neon-blue/5 border-neon-blue/40 text-neon-blue",
  "destructive": "from-destructive/30 to-destructive/5 border-destructive/40 text-destructive",
  "neon-green": "from-neon-green/30 to-neon-green/5 border-neon-green/40 text-neon-green",
  "neon-cyan": "from-neon-cyan/30 to-neon-cyan/5 border-neon-cyan/40 text-neon-cyan",
  "neon-purple": "from-neon-purple/30 to-neon-purple/5 border-neon-purple/40 text-neon-purple",
};

export const DebateArena = ({ active }: { active: boolean }) => {
  const [currentAgent, setCurrentAgent] = useState(-1);
  const [typedText, setTypedText] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!active) return;
    setCurrentAgent(-1);
    setTypedText({});
    let agentIdx = 0;
    const advance = () => {
      if (agentIdx >= agents.length) return;
      const agent = agents[agentIdx];
      setCurrentAgent(agentIdx);
      let char = 0;
      const typer = setInterval(() => {
        char++;
        setTypedText((p) => ({ ...p, [agent.id]: agent.line.slice(0, char) }));
        if (char >= agent.line.length) {
          clearInterval(typer);
          agentIdx++;
          setTimeout(advance, 600);
        }
      }, 18);
    };
    const t = setTimeout(advance, 400);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <SectionHeader
        eyebrow="Feature 01"
        title="AI Debate Arena"
        subtitle="Five specialized agents argue, counter, and defend until consensus."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {agents.map((agent, i) => {
          const Icon = agent.icon;
          const isActive = currentAgent === i;
          const isDone = currentAgent > i;
          const text = typedText[agent.id] || "";
          const colors = colorMap[agent.color];

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative glass rounded-2xl p-5 transition-all duration-500 ${
                isActive ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.3)] scale-[1.02]" : ""
              } ${agent.winner && isDone ? "border-accent/60 shadow-[0_0_50px_hsl(var(--accent)/0.4)]" : ""}`}
            >
              {agent.winner && isDone && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center glow-green">
                  <Trophy className="w-3.5 h-3.5 text-background" />
                </div>
              )}

              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors} border flex items-center justify-center mb-3 ${isActive ? "pulse-ring" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="font-display font-semibold text-sm">{agent.name}</div>
              <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-3">
                {agent.role}
              </div>

              <div className="min-h-[110px] text-xs leading-relaxed text-foreground/90">
                {text}
                {isActive && <span className="inline-block w-1.5 h-3 bg-primary ml-0.5 animate-blink align-middle" />}
                {!isActive && !isDone && (
                  <span className="text-muted-foreground/40 italic">awaiting turn…</span>
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

export const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) => (
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
