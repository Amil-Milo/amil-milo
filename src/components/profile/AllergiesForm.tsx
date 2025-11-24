import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AllergiesFormProps {
  initialAllergies: string;
}

export function AllergiesForm({ initialAllergies }: AllergiesFormProps) {
  const [allergies, setAllergies] = useState(initialAllergies);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAllergies(initialAllergies);
  }, [initialAllergies]);

  const hasChanges = allergies !== initialAllergies;

  const handleSave = async () => {
    try {
      setSaving(true);
      await patientProfileApi.updateAllergies({
        allergies:
          allergies !== initialAllergies ? allergies || undefined : undefined,
      });
      toast.success("Alergias atualizadas com sucesso!");
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao atualizar alergias"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alergias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="allergies">Alergias</Label>
          <Textarea
            id="allergies"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Ex: Penicilina, amendoim, látex..."
            rows={3}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            size="lg"
            className="bg-[#461BFF] hover:brightness-90 text-white rounded-full"
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
