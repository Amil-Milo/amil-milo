import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useJourney } from "@/hooks/useJourney";
import { JourneyProgressBar } from "@/components/jornada/JourneyProgressBar";
import { GoalManager } from "@/components/jornada/GoalManager";
import { MilestoneTimeline } from "@/components/jornada/MilestoneTimeline";
import { MilestoneAchievedModal } from "@/components/jornada/MilestoneAchievedModal";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Activity } from "lucide-react";

export default function Jornada() {
  const { user } = useAuth();
  const { data, isLoading } = useJourney();
  const [newMilestone, setNewMilestone] = useState<{
    id: number;
    title: string;
    description: string | null;
  } | null>(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [previousMilestonesCount, setPreviousMilestonesCount] = useState(0);

  useEffect(() => {
    if (data && data.milestones.length > previousMilestonesCount) {
      const latestMilestone = data.milestones[0];
      const dismissedMilestones = JSON.parse(
        localStorage.getItem('dismissed-milestones') || '[]'
      ) as number[];

      if (!dismissedMilestones.includes(latestMilestone.id)) {
        setNewMilestone({
          id: latestMilestone.id,
          title: latestMilestone.title,
          description: latestMilestone.description,
        });
        setShowMilestoneModal(true);
      }
    }
    if (data) {
      setPreviousMilestonesCount(data.milestones.length);
    }
  }, [data, previousMilestonesCount]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <Sidebar />
        <main className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: 'var(--content-margin-left, 256px)' }}>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <Sidebar />
        <main className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: 'var(--content-margin-left, 256px)' }}>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Erro ao carregar jornada.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <Card className="p-6 mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
            <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              Minha Jornada
            </h1>
            <p className="text-muted-foreground mb-6">
              Acompanhe seu progresso e conquiste novos marcos!
            </p>

            <JourneyProgressBar
              level={data.level}
              levelProgress={data.levelProgress}
              points={data.points}
              streak={data.streak}
              milestonesCount={data.milestones.length}
            />
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <GoalManager />

            <Card className="p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Progresso Semanal
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Interações</span>
                    <span className="font-medium">
                      {data.weeklyProgress.interactions.current}/
                      {data.weeklyProgress.interactions.target}
                    </span>
                  </div>
                  <Progress
                    value={
                      (data.weeklyProgress.interactions.current /
                        data.weeklyProgress.interactions.target) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Conteúdos lidos</span>
                    <span className="font-medium">
                      {data.weeklyProgress.contents.current}/
                      {data.weeklyProgress.contents.target}
                    </span>
                  </div>
                  <Progress
                    value={
                      (data.weeklyProgress.contents.current /
                        data.weeklyProgress.contents.target) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </Card>
          </div>

          <MilestoneTimeline milestones={data.milestones} />

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <Link to="/diario">
              <Card className="p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                <Activity className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  Diário de Saúde
                </h3>
                <p className="text-sm text-muted-foreground">
                  Registre como você está se sentindo
                </p>
              </Card>
            </Link>

            <Link to="/conteudos">
              <Card className="p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                <BookOpen className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  Conteúdos para Você
                </h3>
                <p className="text-sm text-muted-foreground">
                  Artigos e vídeos personalizados
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <MilestoneAchievedModal
        open={showMilestoneModal}
        onOpenChange={setShowMilestoneModal}
        milestone={newMilestone}
      />
    </div>
  );
}

