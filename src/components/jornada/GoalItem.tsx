import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Edit2, X, Trash2, Save, Loader2 } from 'lucide-react';
import { Goal } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';

interface GoalItemProps {
  goal: Goal;
  onUpdate: (id: number, data: { title?: string; description?: string; endDate?: string; status?: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggleStatus: (id: number, currentStatus: string) => Promise<void>;
  isUpdating?: boolean;
}

export function GoalItem({ goal, onUpdate, onDelete, onToggleStatus, isUpdating = false }: GoalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description || '',
    endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(goal.id, {
        title: formData.title,
        description: formData.description || undefined,
        endDate: formData.endDate || undefined,
      });
      setIsEditing(false);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: goal.title,
      description: goal.description || '',
      endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : '',
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(goal.id);
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    await onToggleStatus(goal.id, goal.status);
  };

  const progress = goal.progress || 0;
  const isCompleted = goal.status === 'COMPLETED';

  return (
    <Card className={cn(
      "p-4 bg-primary-light/20 rounded-lg border border-primary/10 transition-all duration-300",
      isEditing && "border-primary/40 shadow-md"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground">{goal.title}</h4>
                {isCompleted && (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                )}
              </div>
              {goal.description && (
                <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
              )}
              {goal.endDate && (
                <p className="text-xs text-muted-foreground">
                  Prazo: {new Date(goal.endDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título da meta"
                className="w-full"
              />
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição (opcional)"
                className="w-full min-h-[80px]"
              />
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {!isEditing ? (
            <>
              <Badge
                variant={isCompleted ? 'default' : 'secondary'}
                className="ml-2"
              >
                {isCompleted ? 'Concluída' : 'Ativa'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving || isDeleting}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || isDeleting || !formData.title.trim()}
                className="h-8 w-8 p-0"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className={cn(
          "mt-4 pt-4 border-t border-primary/20 space-y-3 animate-in slide-in-from-top-2 duration-300"
        )}>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Meta
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving || isDeleting}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <Button
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className="ml-2"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isCompleted ? (
              'Reativar'
            ) : (
              'Concluir'
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}

