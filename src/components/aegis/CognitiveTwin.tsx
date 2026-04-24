import { motion } from "framer-motion";
import { UserCircle2, Brain, Sparkles } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "./DebateArena";

const traits = [
  { name: "Risk Tolerance", value: 62 },
  { name: "Analytical Depth", value: 84 },
  { name: "Speed of Action", value: 71 },
  { name: "Long-term Focus", value: 78 },
];

export const CognitiveTwin = () => {
  const [mode, setMode] = useState<"match" | "optimize">("match");

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <SectionHeader
        eyebrow="Feature 03"
        title="Cognitive Twin"
        subtitle="Your AI mirror — trained on your patterns and preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        {/* Twin profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-neon-cyan/20 blur-3xl rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/40 to-neon-purple/40 border border-neon-cyan/40 flex items-center justify-center">
                  <UserCircle2 className="w-7 h-7 text-neon-cyan" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent ring-2 ring-card" />
              </div>
              <div>
                <div className="font-display font-bold">Your Twin</div>
                <div className="text-xs text-muted-foreground font-mono">v3.2 · 12,400 datapoints</div>
              </div>
            </div>

            <div className="space-y-3">
              {traits.map((t, i) => (
                <div key={t.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{t.name}</span>
                    <span className="font-mono text-foreground">{t.value}%</span>
                  </div>
                  <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="font-display font-semibold">Twin vs AegisMind</div>
            <div className="bg-muted/50 rounded-full p-1 flex gap-1">
              <button
                onClick={() => setMode("match")}
                className={`text-xs px-3 py-1.5 rounded-full transition ${mode === "match" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Match my style
              </button>
              <button
                onClick={() => setMode("optimize")}
                className={`text-xs px-3 py-1.5 rounded-full transition ${mode === "optimize" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Optimize beyond me
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Choice
              icon={UserCircle2}
              title="What you would choose"
              text="Phased UK-first launch with conservative Q3 budget. Wait for proof points before EU expansion."
              color="neon-cyan"
              tag="Your Twin"
            />
            <Choice
              icon={Brain}
              title={mode === "match" ? "AI aligned recommendation" : "AI optimal recommendation"}
              text={
                mode === "match"
                  ? "UK-first launch matching your risk profile — adds Ireland in M4 for 18% upside."
                  : "Simultaneous UK + Germany launch. +34% projected ROI but exceeds your typical risk band."
              }
              color="neon-purple"
              tag="AegisMind"
              highlight
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Choice = ({ icon: Icon, title, text, color, tag, highlight }: any) => (
  <div className={`relative rounded-xl p-4 border ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"}`}>
    {highlight && <Sparkles className="absolute top-3 right-3 w-4 h-4 text-primary" />}
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 text-${color}`} style={{ color: `hsl(var(--${color}))` }} />
      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{tag}</span>
    </div>
    <div className="font-display font-medium text-sm mb-1.5">{title}</div>
    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
  </div>
);
