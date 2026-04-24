import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, Award } from "lucide-react";
import { SectionHeader } from "./DebateArena";

export const FinalDecision = () => {
  const confidence = 87;
  const reasons = [
    "Aligns with 4 of 5 agent recommendations including the Judge",
    "Matches your 62% risk tolerance with controlled downside",
    "Captures €4.2M projected TAM in first 18 months",
    "Phased rollout protects runway through Q2 next year",
  ];
  const risks = ["Currency volatility", "GDPR compliance cost", "Local hiring delays"];

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <SectionHeader
        eyebrow="Verdict"
        title="Final Decision"
        subtitle="Synthesized from all agents, simulations, and your cognitive profile."
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mt-8 rounded-3xl glass-strong p-8 overflow-hidden"
      >
        {/* Decorative glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/30 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent/20 blur-[100px] rounded-full" />

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
              <Award className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-mono uppercase tracking-wider text-accent">Optimal Path Identified</span>
            </div>

            <h3 className="font-display font-bold text-3xl md:text-4xl mb-3 leading-tight">
              Launch <span className="text-gradient">UK-first</span> in Q3, expand to Germany in M5.
            </h3>
            <p className="text-muted-foreground mb-6">
              A phased EU entry that captures growth, respects your risk profile, and preserves runway.
            </p>

            <div className="space-y-2.5 mb-6">
              {reasons.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2.5 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{r}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {risks.map((r) => (
                <div key={r} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/30 text-xs text-destructive">
                  <AlertTriangle className="w-3 h-3" />
                  {r}
                </div>
              ))}
            </div>

            <button className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-primary text-primary-foreground font-display font-semibold tracking-wide hover:shadow-[0_0_50px_hsl(var(--primary)/0.7)] transition-all">
              Apply this Decision
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* Confidence meter */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Confidence Score</div>
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
                <motion.circle
                  cx="50" cy="50" r="42"
                  stroke="url(#confGrad)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - confidence / 100) }}
                  viewport={{ once: true }}
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
                <div className="font-display font-bold text-5xl text-gradient">{confidence}</div>
                <div className="text-xs font-mono text-muted-foreground">PERCENT</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-4 text-center max-w-[200px]">
              Backed by 12,400 simulations and 5 agent consensus
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
