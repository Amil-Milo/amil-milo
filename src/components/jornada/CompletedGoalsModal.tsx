import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Goal } from '@/hooks/useGoals';
import { GoalItem } from './GoalItem';
import { CheckCircle2 } from 'lucide-react';

interface CompletedGoalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedGoals: Goal[];
  onUpdate: (id: number, data: { title?: string; description?: string; endDate?: string; status?: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggleStatus: (id: number, currentStatus: string) => Promise<void>;
  isUpdating?: boolean;
}

export function CompletedGoalsModal({
  open,
  onOpenChange,
  completedGoals,
  onUpdate,
  onDelete,
  onToggleStatus,
  isUpdating = false,
}: CompletedGoalsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Histórico de Metas Concluídas
          </DialogTitle>
          <DialogDescription>
            Visualize todas as metas que você já completou
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {completedGoals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhuma meta concluída ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

