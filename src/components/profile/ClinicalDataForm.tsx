import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { patientProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formatDateOfBirth = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) {
    return numbers;
  }
  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
      4,
      8
    )}`;
  }
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

const formatDateToISO = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 8) {
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2, 4);
    const year = numbers.slice(4, 8);
    return `${year}-${month}-${day}`;
  }
  return value;
};

const formatHeight = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, "");

  if (cleaned.length <= 2) {
    return cleaned;
  }

  if (cleaned.includes(".")) {
    const parts = cleaned.split(".");
    const integerPart = parts[0];
    const decimalPart = parts.slice(1).join("");

    if (decimalPart.length > 2) {
      return `${integerPart}.${decimalPart.slice(0, 2)}`;
    }

    return `${integerPart}.${decimalPart}`;
  }

  if (cleaned.length === 3) {
    return `${cleaned.slice(0, 1)}.${cleaned.slice(1)}`;
  }

  if (cleaned.length >= 4) {
    return `${cleaned.slice(0, -2)}.${cleaned.slice(-2)}`;
  }

  return cleaned;
};

const formatWeight = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, "");

  if (cleaned.length <= 2) {
    return cleaned;
  }

  if (cleaned.includes(".")) {
    const parts = cleaned.split(".");
    const integerPart = parts[0];
    const decimalPart = parts.slice(1).join("");

    if (decimalPart.length > 1) {
      return `${integerPart}.${decimalPart.slice(0, 1)}`;
    }

    return `${integerPart}.${decimalPart}`;
  }

  if (cleaned.length === 3) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
  }

  if (cleaned.length >= 4) {
    return `${cleaned.slice(0, -1)}.${cleaned.slice(-1)}`;
  }

  return cleaned;
};

const bloodTypes = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
];

interface ClinicalDataFormProps {
  initialDateOfBirth: string;
  initialBloodType: string;
  initialHeight: string;
  initialWeight: string;
  initialDiseases: string;
  initialMedications: string;
  initialFamilyHistory: string;
  initialAllergies: string;
  initialSpecialConditions: string;
}

export function ClinicalDataForm({
  initialDateOfBirth,
  initialBloodType,
  initialHeight,
  initialWeight,
  initialDiseases,
  initialMedications,
  initialFamilyHistory,
  initialAllergies,
  initialSpecialConditions,
}: ClinicalDataFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState(initialDateOfBirth);
  const [bloodType, setBloodType] = useState(initialBloodType);
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [diseases, setDiseases] = useState(initialDiseases);
  const [medications, setMedications] = useState(initialMedications);
  const [familyHistory, setFamilyHistory] = useState(initialFamilyHistory);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [specialConditions, setSpecialConditions] = useState(
    initialSpecialConditions
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDateOfBirth(initialDateOfBirth);
    setBloodType(initialBloodType);
    setHeight(initialHeight);
    setWeight(initialWeight);
    setDiseases(initialDiseases);
    setMedications(initialMedications);
    setFamilyHistory(initialFamilyHistory);
    setAllergies(initialAllergies);
    setSpecialConditions(initialSpecialConditions);
  }, [
    initialDateOfBirth,
    initialBloodType,
    initialHeight,
    initialWeight,
    initialDiseases,
    initialMedications,
    initialFamilyHistory,
    initialAllergies,
    initialSpecialConditions,
  ]);

  const hasChanges =
    dateOfBirth !== initialDateOfBirth ||
    bloodType !== initialBloodType ||
    height !== initialHeight ||
    weight !== initialWeight ||
    diseases !== initialDiseases ||
    medications !== initialMedications ||
    familyHistory !== initialFamilyHistory ||
    allergies !== initialAllergies ||
    specialConditions !== initialSpecialConditions;

  const handleSave = async () => {
    try {
      setSaving(true);

      const healthInfoUpdates: any = {};
      if (dateOfBirth !== initialDateOfBirth) {
        const numbers = dateOfBirth.replace(/\D/g, "");
        if (numbers.length === 8) {
          const day = numbers.slice(0, 2);
          const month = numbers.slice(2, 4);
          const year = numbers.slice(4, 8);
          healthInfoUpdates.dateOfBirth = `${year}-${month}-${day}`;
        }
      }
      if (bloodType !== initialBloodType) {
        healthInfoUpdates.bloodType = bloodType || undefined;
      }
      if (height !== initialHeight) {
        const heightInCm = Math.round(
          parseFloat(height.replace(/[^\d.]/g, "")) * 100
        );
        if (!isNaN(heightInCm) && heightInCm > 0) {
          healthInfoUpdates.height = heightInCm;
        }
      }
      if (weight !== initialWeight) {
        const weightValue = parseFloat(weight.replace(/[^\d.]/g, ""));
        if (!isNaN(weightValue) && weightValue > 0) {
          healthInfoUpdates.weight = weightValue;
        }
      }

      const promises: Promise<any>[] = [];

      if (Object.keys(healthInfoUpdates).length > 0) {
        promises.push(patientProfileApi.updateHealthInfo(healthInfoUpdates));
      }

      if (diseases !== initialDiseases || medications !== initialMedications) {
        promises.push(
          patientProfileApi.updateDiseasesMedications({
            diseases:
              diseases !== initialDiseases ? diseases || undefined : undefined,
            medications:
              medications !== initialMedications
                ? medications || undefined
                : undefined,
          })
        );
      }

      if (familyHistory !== initialFamilyHistory) {
        promises.push(
          patientProfileApi.updateFamilyHistory({
            familyHistory:
              familyHistory !== initialFamilyHistory
                ? familyHistory || undefined
                : undefined,
          })
        );
      }

      if (allergies !== initialAllergies) {
        promises.push(
          patientProfileApi.updateAllergies({
            allergies:
              allergies !== initialAllergies
                ? allergies || undefined
                : undefined,
          })
        );
      }

      if (specialConditions !== initialSpecialConditions) {
        promises.push(
          patientProfileApi.updateSpecialConditions({
            specialConditions:
              specialConditions !== initialSpecialConditions
                ? specialConditions || undefined
                : undefined,
          })
        );
      }

      await Promise.all(promises);
      toast.success("Dados clínicos atualizados com sucesso!");
      window.location.reload();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao atualizar dados clínicos"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Clínicos e Histórico</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Informações de Saúde
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <div className="relative">
                <Input
                  id="dateOfBirth"
                  type="text"
                  inputMode="numeric"
                  placeholder="DD/MM/AAAA"
                  value={dateOfBirth}
                  onChange={(e) => {
                    const formatted = formatDateOfBirth(e.target.value);
                    setDateOfBirth(formatted);
                  }}
                  maxLength={10}
                  className="pr-10"
                />
                <DatePicker
                  value={dateOfBirth}
                  onChange={(value) => {
                    setDateOfBirth(value);
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
              <Select value={bloodType} onValueChange={setBloodType}>
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Selecione o tipo sanguíneo" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Altura (m)</Label>
              <Input
                id="height"
                type="text"
                inputMode="decimal"
                value={height}
                onChange={(e) => {
                  const formatted = formatHeight(e.target.value);
                  setHeight(formatted);
                }}
                placeholder="Ex: 1.75"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="text"
                inputMode="decimal"
                value={weight}
                onChange={(e) => {
                  const formatted = formatWeight(e.target.value);
                  setWeight(formatted);
                }}
                placeholder="Ex: 70.5"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Doenças/Medicamentos
          </h3>
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Histórico Familiar
          </h3>
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Alergias</h3>
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Observações Adicionais
          </h3>
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
        </div>

        <div className="flex justify-end pt-4">
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
