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
      <Card className="p-6 border-secondary/30 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-secondary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Última Consulta</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma consulta registrada ainda.</p>
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
    <Card className="p-6 border-secondary/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center">
          <Stethoscope className="h-6 w-6 text-secondary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Última Consulta</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Data:</span>
          <span className="font-medium text-foreground">{formattedDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Médico:</span>
          <span className="font-medium text-foreground">{lastConsultation.professionalName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Especialidade:</span>
          <Badge className={statusColors[lastConsultation.status] || "bg-secondary"}>
            {lastConsultation.specialty}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Badge className={statusColors[lastConsultation.status] || "bg-secondary"}>
            {statusLabels[lastConsultation.status] || lastConsultation.status}
          </Badge>
        </div>
        {lastConsultation.notes && (
          <div className="mt-4 p-4 bg-secondary-light/30 rounded-lg border border-secondary/20">
            <p className="text-sm text-foreground">{lastConsultation.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

