import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FamilyHistoryFormProps {
  initialFamilyHistory: string;
}

export function FamilyHistoryForm({
  initialFamilyHistory,
}: FamilyHistoryFormProps) {
  const [familyHistory, setFamilyHistory] = useState(initialFamilyHistory);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFamilyHistory(initialFamilyHistory);
  }, [initialFamilyHistory]);

  const hasChanges = familyHistory !== initialFamilyHistory;

  const handleSave = async () => {
    try {
      setSaving(true);
      await patientProfileApi.updateFamilyHistory({
        familyHistory: familyHistory !== initialFamilyHistory ? familyHistory || undefined : undefined,
      });
      toast.success("Histórico familiar atualizado com sucesso!");
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar histórico familiar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico Familiar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="familyHistory">Histórico Familiar</Label>
          <Textarea
            id="familyHistory"
            value={familyHistory}
            onChange={(e) => setFamilyHistory(e.target.value)}
            placeholder="Informe histórico familiar relevante"
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

