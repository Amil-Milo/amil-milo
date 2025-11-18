import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SpecialConditionsFormProps {
  initialSpecialConditions: string;
}

export function SpecialConditionsForm({
  initialSpecialConditions,
}: SpecialConditionsFormProps) {
  const [specialConditions, setSpecialConditions] = useState(initialSpecialConditions);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSpecialConditions(initialSpecialConditions);
  }, [initialSpecialConditions]);

  const hasChanges = specialConditions !== initialSpecialConditions;

  const handleSave = async () => {
    try {
      setSaving(true);
      await patientProfileApi.updateSpecialConditions({
        specialConditions: specialConditions !== initialSpecialConditions ? specialConditions || undefined : undefined,
      });
      toast.success("Observações adicionais atualizadas com sucesso!");
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar observações adicionais");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações Adicionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="specialConditions">Observações Adicionais</Label>
          <Textarea
            id="specialConditions"
            value={specialConditions}
            onChange={(e) => setSpecialConditions(e.target.value)}
            placeholder="Cirurgias recentes, condições especiais, etc."
            rows={3}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

