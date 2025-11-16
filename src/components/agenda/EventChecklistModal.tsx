import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, CheckCircle2 } from "lucide-react";
import { AgendaConsultation } from "@/hooks/useAgenda";

interface EventChecklistModalProps {
  consultation: AgendaConsultation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventChecklistModal({
  consultation,
  open,
  onOpenChange,
}: EventChecklistModalProps) {
  if (!consultation) {
    return null;
  }

  const getChecklistItems = (specialty: string): string[] => {
    const checklists: Record<string, string[]> = {
      'Cardiologia': [
        'Trazer exames anteriores',
        'Jejum de 12 horas (se necessário)',
        'Lista de medicamentos em uso',
        'Trazer documentos de exames cardíacos anteriores',
        'Anotar sintomas e dúvidas',
        'Trazer histórico familiar de doenças cardíacas',
      ],
      'Exame de Sangue': [
        'Jejum de 12 horas obrigatório',
        'Beber bastante água',
        'Trazer documento de identidade',
        'Evitar exercícios físicos no dia anterior',
        'Informar sobre medicamentos em uso',
        'Não fumar no dia do exame',
      ],
      'Radiografia': [
        'Remover objetos metálicos (joias, relógios)',
        'Trazer pedido médico',
        'Informar sobre gravidez (se aplicável)',
        'Usar roupas sem zíper ou botões metálicos',
        'Remover próteses dentárias (se aplicável)',
      ],
      'Ultrassonografia': [
        'Jejum de 6-8 horas para ultrassom de abdome',
        'Bexiga cheia para ultrassom pélvico',
        'Trazer exames anteriores',
        'Usar roupas confortáveis',
        'Informar sobre medicações em uso',
      ],
      'Endoscopia': [
        'Jejum absoluto de 8 horas',
        'Suspender medicamentos que aumentam sangramento (com orientação médica)',
        'Trazer acompanhante',
        'Trazer exames anteriores',
        'Lista de medicamentos e alergias',
      ],
    };

    return checklists[specialty] || [
      'Trazer documento de identidade',
      'Trazer pedido médico (se houver)',
      'Lista de medicamentos em uso',
      'Exames anteriores relacionados',
      'Anotar dúvidas e sintomas',
    ];
  };

  const checklistItems = getChecklistItems(consultation.specialty);
  const consultationDate = new Date(consultation.consultationDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Checklist de Preparação
          </DialogTitle>
          <DialogDescription>
            {consultation.specialty} com {consultation.professionalName}
            <br />
            <span className="font-medium">
              {consultationDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold text-foreground mb-3">
              Itens importantes antes da consulta/exame:
            </h4>
            <ul className="space-y-2">
              {checklistItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {consultation.notes && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">
                Observações:
              </h4>
              <p className="text-sm text-muted-foreground">
                {consultation.notes}
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Dica:</strong> Prepare uma lista com suas dúvidas e sintomas
              antes da consulta. Isso ajudará você a aproveitar melhor o tempo com o
              profissional de saúde.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

