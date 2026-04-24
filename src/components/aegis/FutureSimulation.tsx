import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "./DebateArena";

const futures = [
  {
    id: "aggressive",
    title: "High Risk Growth",
    tagline: "Aggressive EU expansion",
    profit: 92,
    risk: 78,
    stability: 45,
    accent: "neon-purple",
    data: [10, 15, 22, 35, 50, 70, 95].map((v, i) => ({ m: `M${i + 1}`, v })),
  },
  {
    id: "balanced",
    title: "Balanced Path",
    tagline: "Phased UK-first launch",
    profit: 74,
    risk: 38,
    stability: 82,
    accent: "neon-cyan",
    data: [10, 18, 26, 34, 48, 60, 72].map((v, i) => ({ m: `M${i + 1}`, v })),
  },
  {
    id: "conservative",
    title: "Conservative Hold",
    tagline: "Domestic consolidation",
    profit: 42,
    risk: 12,
    stability: 95,
    accent: "neon-green",
    data: [10, 14, 18, 22, 28, 34, 42].map((v, i) => ({ m: `M${i + 1}`, v })),
  },
  {
    id: "pivot",
    title: "Pivot Scenario",
    tagline: "Vertical specialization",
    profit: 58,
    risk: 55,
    stability: 60,
    accent: "neon-pink",
    data: [10, 16, 14, 20, 32, 40, 58].map((v, i) => ({ m: `M${i + 1}`, v })),
  },
];

const accentHsl: Record<string, string> = {
  "neon-purple": "hsl(var(--neon-purple))",
  "neon-cyan": "hsl(var(--neon-cyan))",
  "neon-green": "hsl(var(--neon-green))",
  "neon-pink": "hsl(var(--neon-pink))",
};

export const FutureSimulation = () => {
  const [selected, setSelected] = useState("balanced");

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <SectionHeader
        eyebrow="Feature 02"
        title="Future Simulation"
        subtitle="Projected timelines for every viable path. Click to expand."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {futures.map((f, i) => {
          const isSel = selected === f.id;
          const color = accentHsl[f.accent];
          return (
            <motion.button
              key={f.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(f.id)}
              className={`text-left glass rounded-2xl p-5 transition-all duration-500 ${
                isSel ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.25)] scale-[1.02]" : "hover:border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-display font-semibold text-base">{f.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{f.tagline}</div>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}20`, color }}
                >
                  {f.profit > 70 ? <TrendingUp className="w-4 h-4" /> : f.profit < 50 ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                </div>
              </div>

              <div className="h-20 -mx-2 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={f.data}>
                    <defs>
                      <linearGradient id={`g-${f.id}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="v" stroke={`url(#g-${f.id})`} strokeWidth={2.5} dot={false} />
                    <XAxis dataKey="m" hide />
                    <YAxis hide />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Stat label="Profit" value={f.profit} color="neon-green" />
                <Stat label="Risk" value={f.risk} color="destructive" />
                <Stat label="Stable" value={f.stability} color="neon-cyan" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

const Stat = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const colorMap: Record<string, string> = {
    "neon-green": "hsl(var(--neon-green))",
    "destructive": "hsl(var(--destructive))",
    "neon-cyan": "hsl(var(--neon-cyan))",
  };
  return (
    <div className="bg-muted/40 rounded-lg p-2">
      <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">{label}</div>
      <div className="text-sm font-display font-semibold">{value}%</div>
      <div className="h-0.5 bg-background/60 rounded-full mt-1 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: colorMap[color] }}
        />
      </div>
    </div>
  );
};
