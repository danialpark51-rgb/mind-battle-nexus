import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Brain, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeDecision } from "@/lib/decisionApi";
import type {
  CognitiveTwin,
  OrchestratorResponse,
  AgentRole,
} from "@shared/types";

const ROLE_COLORS: Record<AgentRole, string> = {
  analyst: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  risk_manager: "bg-red-500/10 text-red-700 dark:text-red-300",
  optimist: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  strategist: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  judge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  cognitive_twin: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
};

export default function Decisions() {
  const { toast } = useToast();
  const [problem, setProblem] = useState("");
  const [context, setContext] = useState("");
  const [useTwin, setUseTwin] = useState(false);
  const [twin, setTwin] = useState<CognitiveTwin>({
    user_id: "demo",
    traits: {
      risk_level: "medium",
      decision_bias: "balanced",
      goal_type: "balanced",
    },
    history: [],
  });
  const [result, setResult] = useState<OrchestratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      analyzeDecision({
        problem,
        context: context || undefined,
        twin: useTwin ? twin : undefined,
      }),
    onSuccess: (data) => {
      setResult(data);
      toast({ title: "Analysis complete", description: `Confidence: ${(data.confidence_score * 100).toFixed(0)}%` });
    },
    onError: (err: Error) => {
      toast({
        title: "Analysis failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground" data-testid="link-home">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold" data-testid="heading-app">
              AegisMind X
            </h1>
            <Badge variant="outline" data-testid="badge-module">Debate Engine</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Multi-agent decision analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problem">Decision to analyze</Label>
              <Textarea
                id="problem"
                data-testid="input-problem"
                placeholder="e.g., Should I leave my stable job to join an early-stage AI startup as a co-founder?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional context (optional)</Label>
              <Textarea
                id="context"
                data-testid="input-context"
                placeholder="Constraints, background, what you've tried, etc."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="useTwin"
                type="checkbox"
                checked={useTwin}
                onChange={(e) => setUseTwin(e.target.checked)}
                data-testid="checkbox-twin"
                className="h-4 w-4"
              />
              <Label htmlFor="useTwin" className="cursor-pointer">
                Include my Cognitive Twin in the debate
              </Label>
            </div>

            {useTwin && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/30">
                <div className="space-y-2">
                  <Label>Risk level</Label>
                  <Select
                    value={twin.traits.risk_level}
                    onValueChange={(v) =>
                      setTwin({ ...twin, traits: { ...twin.traits, risk_level: v as any } })
                    }
                  >
                    <SelectTrigger data-testid="select-risk"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Decision bias</Label>
                  <Select
                    value={twin.traits.decision_bias}
                    onValueChange={(v) =>
                      setTwin({ ...twin, traits: { ...twin.traits, decision_bias: v as any } })
                    }
                  >
                    <SelectTrigger data-testid="select-bias"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analytical">Analytical</SelectItem>
                      <SelectItem value="intuitive">Intuitive</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Goal type</Label>
                  <Select
                    value={twin.traits.goal_type}
                    onValueChange={(v) =>
                      setTwin({ ...twin, traits: { ...twin.traits, goal_type: v as any } })
                    }
                  >
                    <SelectTrigger data-testid="select-goal"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short_term">Short-term</SelectItem>
                      <SelectItem value="long_term">Long-term</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="twin-user-id">User ID</Label>
                  <Input
                    id="twin-user-id"
                    value={twin.user_id}
                    onChange={(e) => setTwin({ ...twin, user_id: e.target.value })}
                    data-testid="input-user-id"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || problem.trim().length < 5}
              data-testid="button-analyze"
              className="w-full"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running multi-agent debate…
                </>
              ) : (
                "Analyze decision"
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Final decision
                  <Badge variant="secondary" data-testid="badge-confidence">
                    Confidence {(result.confidence_score * 100).toFixed(0)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap" data-testid="text-final-decision">
                  {result.final_decision}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decision options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.debate_summary.decision_options.map((opt) => (
                  <div
                    key={opt.id}
                    className="border rounded-md p-3"
                    data-testid={`card-option-${opt.id}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={ROLE_COLORS[opt.proposedBy]} variant="outline">
                        {opt.proposedBy}
                      </Badge>
                      <span className="font-medium">{opt.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{opt.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Debate transcript</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.debate_summary.transcript.map((m, i) => (
                  <div
                    key={i}
                    className="border-l-2 pl-3"
                    data-testid={`message-${i}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={ROLE_COLORS[m.agent]} variant="outline">
                        {m.agent}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{m.phase}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {result.debate_summary.conflicts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detected conflicts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.debate_summary.conflicts.map((c, i) => (
                    <div
                      key={i}
                      className="text-sm p-2 border rounded"
                      data-testid={`conflict-${i}`}
                    >
                      {c.description}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
