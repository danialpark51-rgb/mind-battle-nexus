import { useState } from "react";
import { TopNav } from "@/components/aegis/TopNav";
import { DecisionInput } from "@/components/aegis/DecisionInput";
import { DebateArena } from "@/components/aegis/DebateArena";
import { FutureSimulation } from "@/components/aegis/FutureSimulation";
import { CognitiveTwin } from "@/components/aegis/CognitiveTwin";
import { RippleEffect } from "@/components/aegis/RippleEffect";
import { FinalDecision } from "@/components/aegis/FinalDecision";
import { HistoryDashboard } from "@/components/aegis/HistoryDashboard";

const Index = () => {
  const [running, setRunning] = useState(true);

  const handleRun = () => {
    setRunning(false);
    setTimeout(() => setRunning(true), 50);
  };

  return (
    <div className="relative min-h-screen">
      <TopNav />
      <main className="relative z-10">
        <DecisionInput onRun={handleRun} running={false} />
        <DebateArena active={running} />
        <FutureSimulation />
        <CognitiveTwin />
        <RippleEffect />
        <FinalDecision />
        <HistoryDashboard />
      </main>
      <footer className="relative z-10 border-t border-border/50 py-6 text-center text-xs font-mono text-muted-foreground">
        AegisMind X · Autonomous Decision Battlefield · v1.0
      </footer>
    </div>
  );
};

export default Index;
