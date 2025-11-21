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
          <Card key={consultation.id} className="p-4 md:p-5 border border-border">

            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
              <div className="flex items-start gap-3 md:gap-4 w-full sm:flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">
                      {consultation.specialty}
                    </h3>
                    <Badge
                      variant={
                        consultation.status === "SCHEDULED" || consultation.status === "AGENDADA" ? "default" : "secondary"
                      }
                      className="text-xs w-fit"
                    >
                      {consultation.status === "SCHEDULED" || consultation.status === "AGENDADA" ? "AGENDADA" : consultation.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {consultation.professionalName}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">
                      {consultationDate.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        })} às {consultationDate.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                          hour12: false,
                      })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">{consultation.location}</span>
                    </div>
                    {daysUntil >= 0 && daysUntil <= 7 && (
                      <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <Bell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>Em {daysUntil} {daysUntil === 1 ? "dia" : "dias"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {hasChecklist && (
              <div className="mt-3 md:mt-4 p-3 md:p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-700 dark:text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-green-900 dark:text-green-100">
                    Preparação necessária:
                  </span>
                </div>
                <ul className="text-xs sm:text-sm text-green-800 dark:text-green-200 space-y-1 md:space-y-1.5">
                  {checklistItems.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0">•</span>
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                  {checklistItems.length > 3 && (
                    <li className="mt-2">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs sm:text-sm text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
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
              <div className="mt-3 md:mt-4 p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">
                  Observações:
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {consultation.notes}
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

