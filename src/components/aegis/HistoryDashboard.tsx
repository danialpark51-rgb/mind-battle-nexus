import { motion } from "framer-motion";
import { ChevronRight, Circle } from "lucide-react";
import { SectionHeader } from "./DebateArena";

const history = [
  { title: "Switch CRM provider to Linear-style tool", outcome: "Adopted", confidence: 91, date: "2d ago", color: "neon-green" },
  { title: "Hire fractional CFO vs full-time", outcome: "Fractional chosen", confidence: 78, date: "5d ago", color: "neon-cyan" },
  { title: "Raise Series A or bootstrap longer", outcome: "Bootstrap +6mo", confidence: 84, date: "1w ago", color: "primary" },
  { title: "Rebrand timing for product launch", outcome: "Delayed to Q4", confidence: 67, date: "2w ago", color: "warning" },
];

const colorMap: Record<string, string> = {
  "neon-green": "hsl(var(--neon-green))",
  "neon-cyan": "hsl(var(--neon-cyan))",
  "primary": "hsl(var(--primary))",
  "warning": "hsl(var(--warning))",
};

export const HistoryDashboard = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12 pb-24">
      <SectionHeader
        eyebrow="Archive"
        title="Decision History"
        subtitle="Every battle, every verdict, every outcome."
      />

      <div className="glass rounded-2xl mt-8 divide-y divide-border/50 overflow-hidden">
        {history.map((h, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="w-full flex items-center gap-4 p-5 hover:bg-muted/30 transition group text-left"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: colorMap[h.color], boxShadow: `0 0 12px ${colorMap[h.color]}` }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-display font-medium text-sm truncate">{h.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>{h.outcome}</span>
                <Circle className="w-1 h-1 fill-current" />
                <span className="font-mono">{h.date}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 w-48">
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${h.confidence}%`, background: colorMap[h.color] }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{h.confidence}%</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition" />
          </motion.button>
        ))}
      </div>
    </section>
  );
};
