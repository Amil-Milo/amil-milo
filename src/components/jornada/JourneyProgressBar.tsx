import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { TrendingUp, Award, Flame } from "lucide-react";

interface JourneyProgressBarProps {
  level: string;
  levelProgress: number;
  points: number;
  streak: number;
  milestonesCount: number;
}

export function JourneyProgressBar({
  level,
  levelProgress,
  points,
  streak,
  milestonesCount,
}: JourneyProgressBarProps) {
  const getLevelColor = (level: string) => {
    if (level === "Iniciante") return "text-primary";
    if (level === "Intermediário") return "text-blue-600";
    if (level === "Avançado") return "text-[#00AEEF]";
    if (level === "Expert") return "text-orange-600";
    return "text-yellow-600";
  };

  const getLevelBgColor = (level: string) => {
    if (level === "Iniciante") return "bg-primary/10";
    if (level === "Intermediário") return "bg-blue-600/10";
    if (level === "Avançado") return "bg-[#00AEEF]/10";
    if (level === "Expert") return "bg-orange-600/10";
    return "bg-yellow-600/10";
  };

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Nível
          </span>
          <div className="w-6 h-6 rounded-full border-2 border-[#003B71] flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-[#003B71]" />
          </div>
        </div>
        <div className={`text-2xl font-bold ${getLevelColor(level)}`}>
          {level}
        </div>
        <Progress value={levelProgress} className="mt-2 h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {levelProgress}% completo
        </p>
      </Card>

      <Card className="p-4 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Pontos
          </span>
          <div className="w-6 h-6 rounded-full border-2 border-[#003B71] flex items-center justify-center">
            <Award className="h-3 w-3 text-[#003B71]" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{points}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Continue progredindo!
        </p>
      </Card>

      <Card className="p-4 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Sequência
          </span>
          <div className="w-6 h-6 rounded-full border-2 border-[#00AEEF] flex items-center justify-center">
            <Flame className="h-3 w-3 text-[#00AEEF]" />
          </div>
        </div>
        <div className="text-2xl font-bold text-primary">{streak} dias</div>
        <p className="text-xs text-muted-foreground mt-1">
          Registro consecutivo
        </p>
      </Card>

      <Card className="p-4 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Conquistas
          </span>
          <div className="w-6 h-6 rounded-full border-2 border-[#00AEEF] flex items-center justify-center">
            <Award className="h-3 w-3 text-[#00AEEF]" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">
          {milestonesCount}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          selos desbloqueados
        </p>
      </Card>
    </div>
  );
}
