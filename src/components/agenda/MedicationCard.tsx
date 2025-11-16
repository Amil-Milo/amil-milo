import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { AgendaMedication } from "@/hooks/useAgenda";

interface MedicationCardProps {
  medications: AgendaMedication[];
}

export function MedicationCard({ medications }: MedicationCardProps) {
  return (
    <Card className="p-6 flex flex-col border-2 border-primary/20 shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        Medicações de Hoje
      </h2>
      <div className="space-y-3">
        {medications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma medicação cadastrada
          </p>
        ) : (
          medications.map((med, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {med.name}
                </p>
                <p className="text-xs text-muted-foreground">
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

