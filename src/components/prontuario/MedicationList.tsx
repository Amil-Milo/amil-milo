import { Card } from "@/components/ui/card";
import { Pill } from "lucide-react";

interface MedicationListProps {
  medications: string[];
}

export function MedicationList({ medications }: MedicationListProps) {
  if (medications.length === 0) {
    return (
      <Card className="p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Medicamentos em Uso</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum medicamento cadastrado.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
          <Pill className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Medicamentos em Uso</h2>
      </div>
      <div className="space-y-3">
        {medications.map((medication, index) => (
          <div key={index} className="p-4 bg-gradient-to-r from-primary-light/20 to-background rounded-lg border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Pill className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{medication}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

