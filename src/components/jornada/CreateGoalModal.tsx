import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';

interface CreateGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newGoalData: {
    title: string;
    description: string;
    endDate: string;
  };
  onGoalDataChange: (data: { title: string; description: string; endDate: string }) => void;
  onCreate: () => Promise<void>;
  isSaving: boolean;
}

export function CreateGoalModal({
  open,
  onOpenChange,
  newGoalData,
  onGoalDataChange,
  onCreate,
  isSaving,
}: CreateGoalModalProps) {
  const handleCreate = async () => {
    if (!newGoalData.title.trim()) {
      return;
    }
    await onCreate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova meta
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              value={newGoalData.title}
              onChange={(e) => onGoalDataChange({ ...newGoalData, title: e.target.value })}
              placeholder="Título da meta *"
              className="h-9"
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              value={newGoalData.description}
              onChange={(e) => onGoalDataChange({ ...newGoalData, description: e.target.value })}
              placeholder="Descrição (opcional)"
              className="min-h-[80px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="date"
              value={newGoalData.endDate}
              onChange={(e) => onGoalDataChange({ ...newGoalData, endDate: e.target.value })}
              className="h-9"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
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
                  Criar
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

