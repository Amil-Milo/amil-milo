import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar } from "lucide-react";

interface Milestone {
  id: number;
  type: string;
  title: string;
  description: string | null;
  achievedAt: string;
}

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <Card className="p-6 border-warning/30 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
            <Award className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Conquistas
            </h3>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma conquista desbloqueada ainda.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Continue sua jornada para desbloquear conquistas!
          </p>
        </div>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className="p-6 border-warning/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
          <Award className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            Conquistas Desbloqueadas
          </h3>
        </div>
      </div>
      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="p-4 bg-gradient-to-r from-warning/10 to-background rounded-lg border border-warning/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-foreground">
                    {milestone.title}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {milestone.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
                {milestone.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {milestone.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(milestone.achievedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

