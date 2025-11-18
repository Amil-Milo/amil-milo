import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, FileText, Bell } from "lucide-react";
import { AgendaConsultation } from "@/hooks/useAgenda";

interface AgendaListProps {
  consultations: AgendaConsultation[];
  onViewChecklist?: (consultation: AgendaConsultation) => void;
}

export function AgendaList({ consultations, onViewChecklist }: AgendaListProps) {
  if (consultations.length === 0) {
    return (
      <Card className="p-6 border-2 border-primary/20 shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Próximos Compromissos
        </h2>
        <div className="text-center flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Nenhum compromisso agendado</p>
        </div>
      </Card>
    );
  }

  const getChecklistItems = (specialty: string): string[] => {
    const checklists: Record<string, string[]> = {
      'Cardiologia': [
        'Trazer exames anteriores',
        'Jejum de 12 horas (se necessário)',
        'Lista de medicamentos em uso',
        'Trazer documentos de exames cardíacos anteriores',
      ],
      'Exame de Sangue': [
        'Jejum de 12 horas',
        'Beber bastante água',
        'Trazer documento de identidade',
        'Evitar exercícios físicos no dia anterior',
      ],
      'Radiografia': [
        'Remover objetos metálicos',
        'Trazer pedido médico',
        'Informar sobre gravidez (se aplicável)',
        'Usar roupas sem zíper ou botões metálicos',
      ],
      'Ultrassonografia': [
        'Jejum de 6-8 horas (abdome)',
        'Bexiga cheia (ultrassom pélvico)',
        'Trazer exames anteriores',
        'Usar roupas confortáveis',
      ],
    };

    return checklists[specialty] || [
      'Trazer documento de identidade',
      'Trazer pedido médico (se houver)',
      'Lista de medicamentos em uso',
      'Exames anteriores relacionados',
    ];
  };


  return (
    <Card className="p-6 border-2 border-primary/20 shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Próximos Compromissos
      </h2>
      <div className="space-y-4">
        {consultations.map((consultation) => {
        const consultationDate = new Date(consultation.consultationDate);
        const checklistItems = getChecklistItems(consultation.specialty);
        const hasChecklist = checklistItems.length > 0;
        const daysUntil = Math.ceil(
          (consultationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        );

        return (
          <Card key={consultation.id} className="p-5 border border-border">

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {consultation.specialty}
                    </h3>
                    <Badge
                      variant={
                        consultation.status === "SCHEDULED" ? "default" : "secondary"
                      }
                    >
                      {consultation.status === "SCHEDULED" ? "Agendada" : consultation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {consultation.professionalName}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {consultationDate.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })} às{" "}
                      {consultationDate.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {consultation.location}
                    </div>
                    {daysUntil >= 0 && daysUntil <= 7 && (
                      <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <Bell className="h-4 w-4" />
                        Em {daysUntil} {daysUntil === 1 ? "dia" : "dias"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {hasChecklist && (
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Preparação necessária:
                  </span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {checklistItems.slice(0, 3).map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                  {checklistItems.length > 3 && (
                    <li className="mt-2">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-sm"
                        onClick={() => onViewChecklist?.(consultation)}
                      >
                        Ver lista completa ({checklistItems.length} itens)
                      </Button>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {consultation.notes && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Observações:</strong> {consultation.notes}
                </p>
              </div>
            )}
          </Card>
        );
      })}
      </div>
    </Card>
  );
}

