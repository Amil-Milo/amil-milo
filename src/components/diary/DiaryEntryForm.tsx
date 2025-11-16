import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateDiaryEntry, useUpdateDiaryEntry, useTodayEntry, type DiaryEntry } from "@/hooks/useDiaryEntries";

interface DiaryEntryFormProps {
  onSuccess?: () => void;
}

export function DiaryEntryForm({ onSuccess }: DiaryEntryFormProps) {
  const { data: todayData } = useTodayEntry();
  const createMutation = useCreateDiaryEntry();
  const updateMutation = useUpdateDiaryEntry();
  
  const existingEntry = todayData?.entry;
  const isEditing = !!existingEntry;

  const [formData, setFormData] = useState({
    moodRating: [5] as number[],
    motivationRating: [5] as number[],
    goalsMet: undefined as boolean | undefined,
    feedbackText: "",
  });

  useEffect(() => {
    if (existingEntry) {
      setFormData({
        moodRating: [existingEntry.moodRating ?? 5],
        motivationRating: [existingEntry.motivationRating ?? 5],
        goalsMet: existingEntry.goalsMet ?? undefined,
        feedbackText: existingEntry.feedbackText ?? "",
      });
    }
  }, [existingEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      moodRating: formData.moodRating[0],
      motivationRating: formData.motivationRating[0],
      goalsMet: formData.goalsMet,
      feedbackText: formData.feedbackText || undefined,
    };

    if (isEditing && existingEntry) {
      updateMutation.mutate(
        { id: existingEntry.id, data: submitData },
        {
          onSuccess: () => {
            toast.success("Registro atualizado! Obrigado por compartilhar como você está se sentindo.");
            if (onSuccess) {
              onSuccess();
            }
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.response?.data?.description || "Erro ao atualizar registro. Tente novamente.";
            toast.error(errorMessage);
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Registro salvo! Obrigado por compartilhar como você está se sentindo.");
          setFormData({
            moodRating: [5],
            motivationRating: [5],
            goalsMet: undefined,
            feedbackText: "",
          });
          if (onSuccess) {
            onSuccess();
          }
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || error.response?.data?.description || "Erro ao salvar registro. Tente novamente.";
          toast.error(errorMessage);
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="p-6 border-2 border-primary/20 shadow-lg rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {isEditing ? "Editar Registro de Hoje" : "Novo Registro"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-3 block">
              Como me sinto hoje?
            </Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Ruim</span>
              <Slider
                value={formData.moodRating}
                onValueChange={(value) =>
                  setFormData({ ...formData, moodRating: value })
                }
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">Ótimo</span>
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {formData.moodRating[0]}/10
              </span>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">
              Quão motivado eu me sinto para continuar no programa?
            </Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Baixa</span>
              <Slider
                value={formData.motivationRating}
                onValueChange={(value) =>
                  setFormData({ ...formData, motivationRating: value })
                }
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">Alta</span>
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {formData.motivationRating[0]}/10
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Bati minhas metas da semana?
          </Label>
          <RadioGroup
            value={formData.goalsMet === undefined ? "" : formData.goalsMet ? "true" : "false"}
            onValueChange={(value) => {
              if (value === "true") {
                setFormData({ ...formData, goalsMet: true });
              }
              if (value === "false") {
                setFormData({ ...formData, goalsMet: false });
              }
            }}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="goalsMet-yes" />
              <Label htmlFor="goalsMet-yes" className="cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="goalsMet-no" />
              <Label htmlFor="goalsMet-no" className="cursor-pointer">
                Não
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedbackText">
            O que melhoraria minha experiência?
          </Label>
          <Textarea
            id="feedbackText"
            placeholder="Sua opinião é muito importante para melhorarmos o programa..."
            rows={4}
            value={formData.feedbackText}
            onChange={(e) =>
              setFormData({ ...formData, feedbackText: e.target.value })
            }
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            isEditing ? "Atualizar Registro" : "Salvar Registro"
          )}
        </Button>
      </form>
    </Card>
  );
}

