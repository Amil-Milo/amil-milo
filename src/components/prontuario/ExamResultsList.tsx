import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { MedicalRecord } from "@/hooks/useMedicalRecords";

interface ExamResultsListProps {
  medicalRecords: MedicalRecord[];
}

export function ExamResultsList({ medicalRecords }: ExamResultsListProps) {
  if (medicalRecords.length === 0) {
    return (
      <Card className="p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Exames Recentes</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum exame registrado ainda.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Exames Recentes</h2>
      </div>
      <div className="space-y-3">
        {medicalRecords.map((record) => {
          const recordDate = new Date(record.recordDate);
          const formattedDate = recordDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div key={record.id} className="p-3 bg-primary-light/20 rounded-lg border border-primary/10">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-foreground text-sm">{record.title}</p>
                <Badge variant="secondary">Registrado</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{formattedDate}</p>
              <p className="text-sm text-muted-foreground">{record.simplifiedSummary}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

