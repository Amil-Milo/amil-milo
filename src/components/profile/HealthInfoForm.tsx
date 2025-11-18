import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Função para formatar data de nascimento (DD/MM/YYYY)
const formatDateOfBirth = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) {
    return numbers;
  }
  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

// Função para converter data formatada para formato ISO (YYYY-MM-DD)
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

// Função para formatar altura em metros
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

// Função para formatar peso
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

interface HealthInfoFormProps {
  initialDateOfBirth: string;
  initialBloodType: string;
  initialHeight: string;
  initialWeight: string;
}

export function HealthInfoForm({
  initialDateOfBirth,
  initialBloodType,
  initialHeight,
  initialWeight,
}: HealthInfoFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState(initialDateOfBirth);
  const [dateOfBirthISO, setDateOfBirthISO] = useState("");
  const [bloodType, setBloodType] = useState(initialBloodType);
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDateOfBirth(initialDateOfBirth);
    setBloodType(initialBloodType);
    setHeight(initialHeight);
    setWeight(initialWeight);
  }, [initialDateOfBirth, initialBloodType, initialHeight, initialWeight]);

  const hasChanges =
    dateOfBirth !== initialDateOfBirth ||
    bloodType !== initialBloodType ||
    height !== initialHeight ||
    weight !== initialWeight;

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData: any = {};

      if (dateOfBirth !== initialDateOfBirth) {
        const numbers = dateOfBirth.replace(/\D/g, "");
        if (numbers.length === 8) {
          const day = numbers.slice(0, 2);
          const month = numbers.slice(2, 4);
          const year = numbers.slice(4, 8);
          updateData.dateOfBirth = `${year}-${month}-${day}`;
        }
      }

      if (bloodType !== initialBloodType) {
        updateData.bloodType = bloodType || undefined;
      }

      if (height !== initialHeight) {
        const heightInCm = Math.round(parseFloat(height.replace(/[^\d.]/g, "")) * 100);
        if (!isNaN(heightInCm) && heightInCm > 0) {
          updateData.height = heightInCm;
        }
      }

      if (weight !== initialWeight) {
        const weightValue = parseFloat(weight.replace(/[^\d.]/g, ""));
        if (!isNaN(weightValue) && weightValue > 0) {
          updateData.weight = weightValue;
        }
      }

      await patientProfileApi.updateHealthInfo(updateData);
      toast.success("Informações de saúde atualizadas com sucesso!");
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar informações de saúde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Saúde</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  const dateISO = formatDateToISO(formatted);
                  setDateOfBirth(formatted);
                  setDateOfBirthISO(dateISO || "");
                }}
                maxLength={10}
                className="pr-10"
              />
              <DatePicker
                value={dateOfBirth}
                onChange={(value) => {
                  const dateISO = formatDateToISO(value);
                  setDateOfBirth(value);
                  setDateOfBirthISO(dateISO || "");
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

