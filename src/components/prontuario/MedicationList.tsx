import { Card } from "@/components/ui/card";
import { Pill } from "lucide-react";

interface MedicationListProps {
  medications: string[];
}

export function MedicationList({ medications }: MedicationListProps) {
  if (medications.length === 0) {
    return (
      <Card className="p-4 md:p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#461BFF] rounded-full flex items-center justify-center flex-shrink-0 p-3">
            <Pill className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Medicamentos em Uso
          </h2>
        </div>
        <div className="text-center py-6 md:py-8">
          <p className="text-sm text-muted-foreground">
            Nenhum medicamento cadastrado.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#461BFF] rounded-full flex items-center justify-center flex-shrink-0 p-3">
          <Pill className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Medicamentos em Uso
        </h2>
      </div>
      <div className="space-y-2 md:space-y-3">
        {medications.map((medication, index) => (
          <div
            key={index}
            className="p-3 md:p-4 bg-gradient-to-r from-primary-light/20 to-background rounded-lg border border-primary/10"
          >
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Pill className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground break-words">
                  {medication}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
