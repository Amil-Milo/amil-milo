import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2 } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description: string | null;
  status: string;
  progress: number;
}

interface CurrentGoalsProps {
  goals: Goal[];
}

export function CurrentGoals({ goals }: CurrentGoalsProps) {
  if (goals.length === 0) {
    return (
      <Card className="p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#461BFF] rounded-full flex items-center justify-center p-3">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Metas Atuais</h3>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma meta ativa no momento.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[#461BFF] rounded-full flex items-center justify-center p-3">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Metas Atuais</h3>
        </div>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-4 bg-primary-light/20 rounded-lg border border-primary/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{goal.title}</h4>
                  {goal.status === "COMPLETED" && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                </div>
                {goal.description && (
                  <p className="text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                )}
              </div>
              <Badge
                variant={goal.status === "COMPLETED" ? "default" : "secondary"}
                className="ml-2"
              >
                {goal.status === "COMPLETED" ? "Concluída" : "Ativa"}
              </Badge>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
