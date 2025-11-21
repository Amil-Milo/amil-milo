import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus, Loader2, History } from 'lucide-react';
import { useGoals, Goal } from '@/hooks/useGoals';
import { GoalItem } from './GoalItem';
import { CompletedGoalsModal } from './CompletedGoalsModal';
import { CreateGoalModal } from './CreateGoalModal';

export function GoalManager() {
  const { goals, loading, fetchGoals, createGoal, updateGoal, deleteGoal, toggleGoalStatus } = useGoals();
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    description: '',
    endDate: '',
  });

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await createGoal({
        title: newGoalData.title,
        description: newGoalData.description || undefined,
        endDate: newGoalData.endDate || undefined,
      });
      setNewGoalData({ title: '', description: '', endDate: '' });
      setIsCreating(false);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = (open: boolean) => {
    setIsCreating(open);
    if (!open) {
      setNewGoalData({ title: '', description: '', endDate: '' });
    }
  };

  const handleUpdate = async (id: number, data: { title?: string; description?: string; endDate?: string; status?: string }) => {
    setIsUpdating(true);
    try {
      await updateGoal(id, data);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsUpdating(true);
    try {
      await deleteGoal(id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    setIsUpdating(true);
    try {
      await toggleGoalStatus(id, currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const activeGoals = goals.filter(g => g.status === 'ACTIVE');
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');

  if (loading && goals.length === 0) {
    return (
      <Card className="p-6 border-primary/30">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200 relative">
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Metas Atuais</h3>
            {completedGoals.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {completedGoals.length} {completedGoals.length === 1 ? 'meta concluída' : 'metas concluídas'}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 relative">
          {completedGoals.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCompletedModal(true)}
              className="h-9 w-9"
              title="Histórico de metas concluídas"
            >
              <History className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCreating(true)}
            className="h-9 w-9"
            title="Nova Meta"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CreateGoalModal
        open={isCreating}
        onOpenChange={handleCloseModal}
        newGoalData={newGoalData}
        onGoalDataChange={setNewGoalData}
        onCreate={handleCreate}
        isSaving={isSaving}
      />

      {activeGoals.length === 0 && !isCreating && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma meta ativa no momento.</p>
        </div>
      )}

      {activeGoals.length > 0 && (
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}

      <CompletedGoalsModal
        open={showCompletedModal}
        onOpenChange={setShowCompletedModal}
        completedGoals={completedGoals}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        isUpdating={isUpdating}
      />
    </Card>
  );
}

