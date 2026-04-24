import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, Award, Loader2, Inbox } from "lucide-react";
import { useMemo } from "react";
import { SectionHeader } from "./DebateArena";
import type { OrchestratorResponse } from "@shared/types";

interface Props {
  result?: OrchestratorResponse | null;
  loading?: boolean;
}

function splitDecision(text: string): { headline: string; body: string } {
  if (!text) return { headline: "", body: "" };
  const trimmed = text.trim();
  // Try to split on the first em-dash, sentence end, or newline.
  const dashIdx = trimmed.indexOf(" — ");
  if (dashIdx > 0 && dashIdx < 120) {
    return {
      headline: trimmed.slice(0, dashIdx).trim(),
      body: trimmed.slice(dashIdx + 3).trim(),
    };
  }
  const dotIdx = trimmed.indexOf(". ");
  if (dotIdx > 0 && dotIdx < 160) {
    return {
      headline: trimmed.slice(0, dotIdx + 1).trim(),
      body: trimmed.slice(dotIdx + 1).trim(),
    };
  }
  const newlineIdx = trimmed.indexOf("\n");
  if (newlineIdx > 0 && newlineIdx < 200) {
    return {
      headline: trimmed.slice(0, newlineIdx).trim(),
      body: trimmed.slice(newlineIdx + 1).trim(),
    };
  }
  return { headline: trimmed.slice(0, 140), body: trimmed.slice(140) };
}

export const FinalDecision = ({ result = null, loading = false }: Props) => {
  const confidence = result ? Math.round(result.confidence_score * 100) : 0;

  const { headline, body, supporters, opposers } = useMemo(() => {
    if (!result) return { headline: "", body: "", supporters: [] as string[], opposers: [] as string[] };
    const { headline, body } = splitDecision(result.final_decision || result.reasoning);
    const winningOption =
      result.debate_summary.decision_options.find((opt) =>
        result.debate_summary.transcript.some(
          (m) => m.phase === "judgment" && m.content.includes(opt.id),
        ),
      ) || result.debate_summary.decision_options[0];
    const winningId = winningOption?.id;
    const supporters = winningId
      ? result.debate_summary.arguments
          .filter((a) => a.optionId === winningId && a.stance === "support")
          .map((a) => `${a.agent}: ${a.reasoning}`)
      : [];
    const opposers = winningId
      ? result.debate_summary.arguments
          .filter((a) => a.optionId === winningId && a.stance === "oppose")
          .map((a) => `${a.agent}: ${a.reasoning}`)
      : [];
    return { headline, body, supporters, opposers };
  }, [result]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <SectionHeader
        eyebrow="Verdict"
        title="Final Decision"
        subtitle="Synthesized from all agents, simulations, and your cognitive profile."
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-8 rounded-3xl glass-strong p-8 overflow-hidden"
        data-testid="card-final-decision"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/30 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent/20 blur-[100px] rounded-full" />

        {loading ? (
          <div className="relative flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <h3 className="font-display font-semibold text-2xl mb-2">
              Synthesizing the verdict…
            </h3>
            <p className="text-muted-foreground max-w-md">
              The judge agent is weighing every argument and conflict to produce your final
              decision. Hang tight.
            </p>
          </div>
        ) : !result ? (
          <div className="relative flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="font-display font-semibold text-2xl mb-2">
              No decision yet
            </h3>
            <p className="text-muted-foreground max-w-md">
              Enter a question above and click <span className="font-semibold">Run Decision Battle</span>{" "}
              to see your AI-powered verdict appear here.
            </p>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
                <Award className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-mono uppercase tracking-wider text-accent">
                  Optimal Path Identified
                </span>
              </div>

              <h3
                className="font-display font-bold text-2xl md:text-3xl mb-3 leading-tight"
                data-testid="text-final-headline"
              >
                <span className="text-gradient">{headline || "Decision ready"}</span>
              </h3>
              {body && (
                <p
                  className="text-muted-foreground mb-6 whitespace-pre-wrap"
                  data-testid="text-final-body"
                >
                  {body}
                </p>
              )}

              {supporters.length > 0 && (
                <div className="space-y-2.5 mb-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Why this won
                  </div>
                  {supporters.slice(0, 5).map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5 text-sm"
                      data-testid={`text-supporter-${i}`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{r}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {opposers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="w-full text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Counter-arguments to watch
                  </div>
                  {opposers.slice(0, 4).map((r, i) => (
                    <div
                      key={i}
                      className="inline-flex items-start gap-1.5 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive max-w-full"
                      data-testid={`text-opposer-${i}`}
                    >
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="whitespace-pre-wrap">{r}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="mt-6 group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-primary text-primary-foreground font-display font-semibold tracking-wide hover:shadow-[0_0_50px_hsl(var(--primary)/0.7)] transition-all"
                data-testid="button-apply-decision"
              >
                Apply this Decision
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Confidence Score
              </div>
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="url(#confGrad)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - confidence / 100) }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary)))" }}
                  />
                  <defs>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display font-bold text-5xl text-gradient" data-testid="text-confidence">
                    {confidence}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">PERCENT</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-4 text-center max-w-[220px]">
                Backed by {result.debate_summary.decision_options.length} options &nbsp;·&nbsp;{" "}
                {result.debate_summary.arguments.length} arguments &nbsp;·&nbsp;{" "}
                {result.debate_summary.conflicts.length} conflicts
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};
