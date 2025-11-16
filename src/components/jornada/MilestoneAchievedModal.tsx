import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MilestoneAchievedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: {
    id: number;
    title: string;
    description: string | null;
  } | null;
}

export function MilestoneAchievedModal({
  open,
  onOpenChange,
  milestone,
}: MilestoneAchievedModalProps) {
  if (!milestone) {
    return null;
  }

  const handleClose = (open: boolean) => {
    if (!open && milestone) {
      const dismissedMilestones = JSON.parse(
        localStorage.getItem('dismissed-milestones') || '[]'
      ) as number[];
      
      if (!dismissedMilestones.includes(milestone.id)) {
        dismissedMilestones.push(milestone.id);
        localStorage.setItem('dismissed-milestones', JSON.stringify(dismissedMilestones));
      }
    }
    onOpenChange(open);
  };

  const handleContinue = () => {
    if (milestone) {
      const dismissedMilestones = JSON.parse(
        localStorage.getItem('dismissed-milestones') || '[]'
      ) as number[];
      
      if (!dismissedMilestones.includes(milestone.id)) {
        dismissedMilestones.push(milestone.id);
        localStorage.setItem('dismissed-milestones', JSON.stringify(dismissedMilestones));
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            🎉 Parabéns! 🎉
          </DialogTitle>
          <DialogDescription className="text-center">
            Você alcançou um novo marco!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-warning via-warning/90 to-warning/80 rounded-full flex items-center justify-center shadow-lg">
              <Award className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-warning animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              {milestone.title}
            </h3>
            {milestone.description && (
              <p className="text-sm text-muted-foreground">
                {milestone.description}
              </p>
            )}
          </div>
          <Button
            onClick={handleContinue}
            className="w-full"
          >
            Continuar Jornada
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

