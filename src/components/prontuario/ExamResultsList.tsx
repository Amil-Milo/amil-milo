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
      <Card className="p-4 md:p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#461BFF] rounded-full flex items-center justify-center flex-shrink-0 p-3">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Exames Recentes
          </h2>
        </div>
        <div className="text-center py-6 md:py-8">
          <p className="text-sm text-muted-foreground">
            Nenhum exame registrado ainda.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Exames Recentes
        </h2>
      </div>
      <div className="space-y-2 md:space-y-3">
        {medicalRecords.map((record) => {
          const recordDate = new Date(record.recordDate);
          const formattedDate = recordDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          return (
            <div
              key={record.id}
              className="p-3 bg-primary-light/20 rounded-lg border border-primary/10"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-1">
                <p className="text-sm sm:text-base font-medium text-foreground break-words">
                  {record.title}
                </p>
                <Badge variant="secondary" className="text-xs w-fit">
                  Registrado
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {formattedDate}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {record.simplifiedSummary}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
