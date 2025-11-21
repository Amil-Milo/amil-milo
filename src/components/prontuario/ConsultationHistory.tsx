import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope } from "lucide-react";
import { Consultation } from "@/hooks/useMedicalRecords";

interface ConsultationHistoryProps {
  consultations: Consultation[];
}

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  NO_SHOW: "Não compareceu",
};

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-primary",
  COMPLETED: "bg-success",
  CANCELLED: "bg-destructive",
  NO_SHOW: "bg-warning",
};

export function ConsultationHistory({ consultations }: ConsultationHistoryProps) {
  if (consultations.length === 0) {
    return (
      <Card className="p-4 md:p-6 border-secondary/30 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-light rounded-full flex items-center justify-center flex-shrink-0">
            <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Última Consulta</h2>
        </div>
        <div className="text-center py-6 md:py-8">
          <p className="text-sm text-muted-foreground">Nenhuma consulta registrada ainda.</p>
        </div>
      </Card>
    );
  }

  const lastConsultation = consultations[0];
  const consultationDate = new Date(lastConsultation.consultationDate);
  const formattedDate = consultationDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="p-4 md:p-6 border-secondary/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-light rounded-full flex items-center justify-center flex-shrink-0">
          <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Última Consulta</h2>
      </div>
      <div className="space-y-2 md:space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Data:</span>
          <span className="text-sm sm:text-base font-medium text-foreground break-words">{formattedDate}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Médico:</span>
          <span className="text-sm sm:text-base font-medium text-foreground break-words">{lastConsultation.professionalName}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Especialidade:</span>
          <Badge className={`${statusColors[lastConsultation.status] || "bg-secondary"} text-xs`}>
            {lastConsultation.specialty}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
          <Badge className={`${statusColors[lastConsultation.status] || "bg-secondary"} text-xs`}>
            {statusLabels[lastConsultation.status] || lastConsultation.status}
          </Badge>
        </div>
        {lastConsultation.notes && (
          <div className="mt-3 md:mt-4 p-3 md:p-4 bg-secondary-light/30 rounded-lg border border-secondary/20">
            <p className="text-xs sm:text-sm text-foreground break-words">{lastConsultation.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

