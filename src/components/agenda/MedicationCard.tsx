import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { AgendaMedication } from "@/hooks/useAgenda";

interface MedicationCardProps {
  medications: AgendaMedication[];
}

export function MedicationCard({ medications }: MedicationCardProps) {
  return (
    <Card className="p-4 md:p-6 flex flex-col border-2 border-primary/20 shadow-lg rounded-xl w-full">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 md:mb-6 flex items-center gap-2">
        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
        Medicações de Hoje
      </h2>
      <div className="space-y-2 md:space-y-3">
        {medications.length === 0 ? (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Nenhuma medicação cadastrada
          </p>
        ) : (
          medications.map((med, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 md:gap-3 pb-2 md:pb-3 border-b border-border last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                  {med.name}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground break-words">
                  {med.time}
                  {med.notes && ` - ${med.notes}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

