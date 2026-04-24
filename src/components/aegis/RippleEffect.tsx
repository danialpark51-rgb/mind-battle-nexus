import { motion } from "framer-motion";
import { useState } from "react";
import { SectionHeader } from "./DebateArena";

const nodes = {
  center: { x: 50, y: 50, label: "Decision", desc: "Launch in EU (UK-first)", level: 0 },
  immediate: [
    { x: 22, y: 22, label: "Hire EU lead", desc: "1 senior PM in London by week 3", level: 1 },
    { x: 78, y: 22, label: "Legal setup", desc: "GDPR + UK entity formation", level: 1 },
    { x: 22, y: 78, label: "Marketing prep", desc: "Localized landing page + ads", level: 1 },
    { x: 78, y: 78, label: "Banking", desc: "Multi-currency accounts opened", level: 1 },
  ],
  mid: [
    { x: 8, y: 50, label: "Revenue +24%", desc: "Q4 lift from UK pipeline", level: 2 },
    { x: 92, y: 50, label: "Team +6", desc: "Sales & support hires", level: 2 },
    { x: 50, y: 8, label: "Brand uplift", desc: "EU press recognition", level: 2 },
    { x: 50, y: 92, label: "Burn +18%", desc: "Manageable runway impact", level: 2 },
  ],
};

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--neon-cyan))",
  "hsl(var(--neon-green))",
];

export const RippleEffect = () => {
  const [hover, setHover] = useState<string | null>(null);
  const allNodes = [{ ...nodes.center, id: "c" }, ...nodes.immediate.map((n, i) => ({ ...n, id: `i${i}` })), ...nodes.mid.map((n, i) => ({ ...n, id: `m${i}` }))];
  const hoverNode = allNodes.find((n) => n.id === hover);

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <SectionHeader
        eyebrow="Feature 04"
        title="Ripple Effect Analyzer"
        subtitle="Cascading consequences mapped across time horizons."
      />

      <div className="glass rounded-3xl p-6 mt-8 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {["Decision", "Immediate", "Mid-term"].map((l, i) => (
            <div key={l} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i], boxShadow: `0 0 12px ${colors[i]}` }} />
              <span className="text-muted-foreground font-mono">{l}</span>
            </div>
          ))}
        </div>

        <div className="relative aspect-[16/9] max-h-[500px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Connections center -> immediate */}
            {nodes.immediate.map((n, i) => (
              <line
                key={`l1-${i}`}
                x1="50" y1="50"
                x2={n.x} y2={n.y}
                stroke="hsl(var(--primary))"
                strokeOpacity="0.4"
                strokeWidth="0.2"
                strokeDasharray="0.8 0.8"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="3s" repeatCount="indefinite" />
              </line>
            ))}
            {/* Immediate -> mid */}
            {nodes.immediate.map((im, i) => {
              const mid = nodes.mid[i];
              return (
                <line
                  key={`l2-${i}`}
                  x1={im.x} y1={im.y}
                  x2={mid.x} y2={mid.y}
                  stroke="hsl(var(--neon-cyan))"
                  strokeOpacity="0.3"
                  strokeWidth="0.15"
                  strokeDasharray="0.6 0.6"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="4s" repeatCount="indefinite" />
                </line>
              );
            })}
          </svg>

          {allNodes.map((n) => {
            const isCenter = n.level === 0;
            const color = colors[n.level];
            const size = isCenter ? 88 : 64;
            return (
              <motion.div
                key={n.id}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: n.level * 0.15 + (isCenter ? 0 : 0.1), type: "spring" }}
                style={{
                  position: "absolute",
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: size,
                  height: size,
                }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <div
                  className={`w-full h-full rounded-full glass-strong flex items-center justify-center text-center p-2 transition-all ${isCenter ? "pulse-ring" : ""}`}
                  style={{
                    border: `1.5px solid ${color}`,
                    boxShadow: `0 0 ${isCenter ? 40 : 20}px ${color}55`,
                  }}
                >
                  <span className={`font-display font-semibold leading-tight ${isCenter ? "text-sm" : "text-[10px]"}`}>
                    {n.label}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {hoverNode && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-strong rounded-xl px-4 py-2 text-xs max-w-md text-center pointer-events-none"
            >
              <span className="font-display font-semibold">{hoverNode.label}</span>
              <span className="text-muted-foreground"> — {hoverNode.desc}</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
