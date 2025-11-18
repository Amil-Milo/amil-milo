import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target, Plus, Loader2, X } from 'lucide-react';
import { useGoals, Goal } from '@/hooks/useGoals';
import { GoalItem } from './GoalItem';
import { cn } from '@/lib/utils';

export function GoalManager() {
  const { goals, loading, fetchGoals, createGoal, updateGoal, deleteGoal, toggleGoalStatus } = useGoals();
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    description: '',
    endDate: '',
  });

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreate = async () => {
    if (!newGoalData.title.trim()) {
      return;
    }
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
    <Card className="p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Metas Atuais</h3>
          </div>
        </div>
        {!isCreating && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Meta
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className={cn(
          "p-4 mb-4 border-2 border-primary/40 bg-primary-light/10 animate-in slide-in-from-top-2 duration-300"
        )}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Nova Meta</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNewGoalData({ title: '', description: '', endDate: '' });
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={newGoalData.title}
              onChange={(e) => setNewGoalData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Título da meta"
              className="w-full"
            />
            <Textarea
              value={newGoalData.description}
              onChange={(e) => setNewGoalData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição (opcional)"
              className="w-full min-h-[80px]"
            />
            <Input
              type="date"
              value={newGoalData.endDate}
              onChange={(e) => setNewGoalData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={isSaving || !newGoalData.title.trim()}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Meta
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewGoalData({ title: '', description: '', endDate: '' });
                }}
                disabled={isSaving}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeGoals.length === 0 && completedGoals.length === 0 && !isCreating && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma meta ativa no momento.</p>
        </div>
      )}

      {activeGoals.length > 0 && (
        <div className="space-y-4 mb-4">
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

      {completedGoals.length > 0 && (
        <div className="mt-6 pt-6 border-t border-primary/20">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Metas Concluídas</h4>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
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
        </div>
      )}
    </Card>
  );
}

