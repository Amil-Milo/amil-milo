import { Layout } from "@/components/layout/Layout";
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
        localStorage.getItem("dismissed-milestones") || "[]"
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
      <Layout>
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8 text-center py-12">
          <p className="text-muted-foreground">Erro ao carregar jornada.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backgroundClass="bg-gradient-subtle">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
        <Card className="p-4 md:p-6 mb-4 md:mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Minha Jornada
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <GoalManager />

          <Card className="p-4 md:p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          <Link to="/diario">
            <Card className="p-4 md:p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
              <Activity className="h-6 w-6 md:h-8 md:w-8 text-primary mb-2 md:mb-3" />
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 md:mb-2">
                Diário de Saúde
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Registre como você está se sentindo
              </p>
            </Card>
          </Link>

          <Link to="/conteudos">
            <Card className="p-4 md:p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary mb-2 md:mb-3" />
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 md:mb-2">
                Conteúdos para Você
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Artigos e vídeos personalizados
              </p>
            </Card>
          </Link>
        </div>
      </div>

      <MilestoneAchievedModal
        open={showMilestoneModal}
        onOpenChange={setShowMilestoneModal}
        milestone={newMilestone}
      />
    </Layout>
  );
}
