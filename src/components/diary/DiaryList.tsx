import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useDiaryEntries, type DiaryEntry } from "@/hooks/useDiaryEntries";
import { Loader2 } from "lucide-react";

export function DiaryList() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useDiaryEntries(page, limit);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive text-center">Erro ao carregar registros</p>
      </Card>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Histórico de Registros</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum registro encontrado
        </p>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getMoodLabel = (rating: number | null) => {
    if (rating === null) return "Não informado";
    if (rating <= 3) return "Ruim";
    if (rating <= 6) return "Regular";
    if (rating <= 8) return "Bom";
    return "Ótimo";
  };

  const getMoodColor = (rating: number | null) => {
    if (rating === null) return "secondary";
    if (rating <= 3) return "destructive";
    if (rating <= 6) return "default";
    if (rating <= 8) return "default";
    return "default";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Histórico de Registros</h3>
      </div>
      
      <div className="space-y-3 mb-4">
        {data.entries.map((entry) => (
          <div
            key={entry.id}
            className="pb-3 border-b border-border last:border-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  {formatDate(entry.entryDate)}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 text-xs text-muted-foreground mb-2">
              {entry.moodRating !== null && (
                <Badge variant={getMoodColor(entry.moodRating)} className="text-xs">
                  Humor: {entry.moodRating}/10 ({getMoodLabel(entry.moodRating)})
                </Badge>
              )}
              {entry.motivationRating !== null && (
                <Badge variant="secondary" className="text-xs">
                  Motivação: {entry.motivationRating}/10
                </Badge>
              )}
              {entry.goalsMet !== null && (
                <Badge variant={entry.goalsMet ? "default" : "secondary"} className="text-xs">
                  Metas: {entry.goalsMet ? "Sim" : "Não"}
                </Badge>
              )}
            </div>
            
            {entry.feedbackText && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                <strong>Feedback:</strong> {entry.feedbackText}
              </p>
            )}
          </div>
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Página {data.page} de {data.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(data.totalPages, prev + 1))}
            disabled={page === data.totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  );
}

