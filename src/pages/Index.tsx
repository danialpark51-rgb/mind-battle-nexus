import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TopNav } from "@/components/aegis/TopNav";
import { DecisionInput } from "@/components/aegis/DecisionInput";
import { DebateArena } from "@/components/aegis/DebateArena";
import { FutureSimulation } from "@/components/aegis/FutureSimulation";
import { CognitiveTwin } from "@/components/aegis/CognitiveTwin";
import { RippleEffect } from "@/components/aegis/RippleEffect";
import { FinalDecision } from "@/components/aegis/FinalDecision";
import { HistoryDashboard } from "@/components/aegis/HistoryDashboard";
import { analyzeDecision } from "@/lib/decisionApi";
import { useToast } from "@/hooks/use-toast";
import type { OrchestratorResponse } from "@shared/types";

const Index = () => {
  const { toast } = useToast();
  const [result, setResult] = useState<OrchestratorResponse | null>(null);
  const [lastProblem, setLastProblem] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (problem: string) => analyzeDecision({ problem }),
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Decision battle complete",
        description: `Confidence: ${(data.confidence_score * 100).toFixed(0)}%`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Backend error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleRun = (input: string) => {
    const problem = input.trim();
    if (problem.length < 5) {
      toast({
        title: "Problem too short",
        description: "Please describe your decision in at least a few words.",
        variant: "destructive",
      });
      return;
    }
    setLastProblem(problem);
    setResult(null);
    mutation.mutate(problem);
  };

  return (
    <div className="relative min-h-screen">
      <TopNav />
      <main className="relative z-10">
        <DecisionInput onRun={handleRun} running={mutation.isPending} />
        <DebateArena
          active={!!result || mutation.isPending}
          loading={mutation.isPending}
          result={result}
          problem={lastProblem}
        />
        <FutureSimulation />
        <CognitiveTwin />
        <RippleEffect />
        <FinalDecision result={result} loading={mutation.isPending} />
        <HistoryDashboard />
      </main>
      <footer className="relative z-10 border-t border-border/50 py-6 text-center text-xs font-mono text-muted-foreground">
        AegisMind X · Autonomous Decision Battlefield · v1.0
      </footer>
    </div>
  );
};

export default Index;
