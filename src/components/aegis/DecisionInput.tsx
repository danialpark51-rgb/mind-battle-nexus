import { motion } from "framer-motion";
import { Sparkles, Briefcase, User, Heart, Zap } from "lucide-react";
import { useState } from "react";

const domains = [
  { id: "business", label: "Business", icon: Briefcase },
  { id: "career", label: "Career", icon: User },
  { id: "personal", label: "Personal", icon: Heart },
];

interface Props {
  onRun: (input: string) => void;
  running: boolean;
}

export const DecisionInput = ({ onRun, running }: Props) => {
  const [value, setValue] = useState("");
  const [domain, setDomain] = useState("business");
  const [risk, setRisk] = useState(50);

  return (
    <section className="relative pt-12 pb-8">
      {/* Ambient glow */}
      <div className="absolute inset-0 -top-20 flex justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full animate-glow-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative max-w-4xl mx-auto text-center px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            Neural Engine · Online
          </span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight tracking-tight mb-4">
          Decide with <span className="text-gradient">superintelligence</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
          Pit AI agents against each other, simulate every future, and find the optimal path forward.
        </p>

        <motion.div
          whileHover={{ scale: 1.005 }}
          className="glass-strong rounded-3xl p-2 neon-border"
        >
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your decision problem… e.g. ‘Should I expand my SaaS to Europe in Q3?’"
              rows={3}
              className="w-full bg-transparent rounded-2xl p-5 pr-16 text-base placeholder:text-muted-foreground/60 resize-none focus:outline-none font-body"
            />
            <div className="absolute top-5 right-5">
              <Sparkles className="w-5 h-5 text-primary/60" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-4 pb-3 pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 bg-muted/50 rounded-full p-1">
              {domains.map((d) => {
                const Icon = d.icon;
                const active = domain === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDomain(d.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {d.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
              <span className="text-xs text-muted-foreground font-mono">RISK</span>
              <input
                type="range"
                min="0"
                max="100"
                value={risk}
                onChange={(e) => setRisk(+e.target.value)}
                className="w-24 accent-primary"
              />
              <span className="text-xs font-mono text-foreground w-8">{risk}%</span>
            </div>

            <div className="flex-1" />

            <button
              onClick={() => onRun(value || "Should I expand my SaaS to Europe in Q3?")}
              disabled={running}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-display font-semibold text-sm tracking-wide overflow-hidden transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] disabled:opacity-60"
            >
              <Zap className="w-4 h-4" fill="currentColor" />
              {running ? "Battle in progress…" : "Run Decision Battle"}
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
