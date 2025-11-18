import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DiseasesMedicationsFormProps {
  initialDiseases: string;
  initialMedications: string;
}

export function DiseasesMedicationsForm({
  initialDiseases,
  initialMedications,
}: DiseasesMedicationsFormProps) {
  const [diseases, setDiseases] = useState(initialDiseases);
  const [medications, setMedications] = useState(initialMedications);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDiseases(initialDiseases);
    setMedications(initialMedications);
  }, [initialDiseases, initialMedications]);

  const hasChanges =
    diseases !== initialDiseases || medications !== initialMedications;

  const handleSave = async () => {
    try {
      setSaving(true);
      await patientProfileApi.updateDiseasesMedications({
        diseases: diseases !== initialDiseases ? diseases || undefined : undefined,
        medications: medications !== initialMedications ? medications || undefined : undefined,
      });
      toast.success("Doenças e medicamentos atualizados com sucesso!");
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar doenças e medicamentos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doenças/Medicamentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="diseases">Doenças/Diagnósticos</Label>
          <Textarea
            id="diseases"
            value={diseases}
            onChange={(e) => setDiseases(e.target.value)}
            placeholder="Informe doenças ou diagnósticos conhecidos"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medications">Medicamentos</Label>
          <Textarea
            id="medications"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="Informe medicamentos em uso"
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

