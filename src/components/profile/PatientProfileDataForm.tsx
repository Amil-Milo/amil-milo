import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";

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

// Função para formatar altura em metros (ex: 1.75) - formata enquanto digita
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

// Função para formatar peso com decimais (ex: 70.5) - formata enquanto digita, máximo 1 decimal
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

interface PatientProfileDataFormProps {
  dateOfBirth: string;
  dateOfBirthISO?: string;
  bloodType: string;
  height: string;
  weight: string;
  diseases: string;
  medications: string;
  familyHistory: string;
  allergies: string;
  specialConditions: string;
  onDateOfBirthChange: (value: string) => void;
  onDateOfBirthISOChange?: (value: string) => void;
  onBloodTypeChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onDiseasesChange: (value: string) => void;
  onMedicationsChange: (value: string) => void;
  onFamilyHistoryChange: (value: string) => void;
  onAllergiesChange: (value: string) => void;
  onSpecialConditionsChange: (value: string) => void;
}

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

export function PatientProfileDataForm({
  dateOfBirth,
  dateOfBirthISO = "",
  bloodType,
  height,
  weight,
  diseases,
  medications,
  familyHistory,
  allergies,
  specialConditions,
  onDateOfBirthChange,
  onDateOfBirthISOChange,
  onBloodTypeChange,
  onHeightChange,
  onWeightChange,
  onDiseasesChange,
  onMedicationsChange,
  onFamilyHistoryChange,
  onAllergiesChange,
  onSpecialConditionsChange,
}: PatientProfileDataFormProps) {
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
                  onDateOfBirthChange(formatted);
                  if (onDateOfBirthISOChange) {
                    onDateOfBirthISOChange(dateISO || "");
                  }
                }}
                maxLength={10}
                className="pr-10"
              />
              <DatePicker
                value={dateOfBirth}
                onChange={(value) => {
                  const dateISO = formatDateToISO(value);
                  onDateOfBirthChange(value);
                  if (onDateOfBirthISOChange) {
                    onDateOfBirthISOChange(dateISO || "");
                  }
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
            <Select value={bloodType} onValueChange={onBloodTypeChange}>
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
                onHeightChange(formatted);
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
                onWeightChange(formatted);
              }}
              placeholder="Ex: 70.5"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="diseases">Doenças/Diagnósticos</Label>
          <Textarea
            id="diseases"
            value={diseases}
            onChange={(e) => onDiseasesChange(e.target.value)}
            placeholder="Informe doenças ou diagnósticos conhecidos"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medications">Medicamentos</Label>
          <Textarea
            id="medications"
            value={medications}
            onChange={(e) => onMedicationsChange(e.target.value)}
            placeholder="Informe medicamentos em uso"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="familyHistory">Histórico Familiar</Label>
          <Textarea
            id="familyHistory"
            value={familyHistory}
            onChange={(e) => onFamilyHistoryChange(e.target.value)}
            placeholder="Informe histórico familiar relevante"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Alergias</Label>
          <Textarea
            id="allergies"
            value={allergies}
            onChange={(e) => onAllergiesChange(e.target.value)}
            placeholder="Ex: Penicilina, amendoim, látex..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialConditions">Observações Adicionais</Label>
          <Textarea
            id="specialConditions"
            value={specialConditions}
            onChange={(e) => onSpecialConditionsChange(e.target.value)}
            placeholder="Cirurgias recentes, condições especiais, etc."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

