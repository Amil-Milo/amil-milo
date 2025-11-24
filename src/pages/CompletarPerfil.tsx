import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";
import miloFront from "@/assets/milo-front.png";
import { toast } from "sonner";
import { patientProfileApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { DatePicker } from "@/components/ui/date-picker";

// Função para permitir apenas números
const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};

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
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
      4,
      8
    )}`;
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

// Função para converter metros para centímetros
const metersToCentimeters = (value: string): number => {
  const numValue = parseFloat(value.replace(/[^\d.]/g, ""));
  if (isNaN(numValue)) return 0;
  return Math.round(numValue * 100);
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

// Opções de tipo sanguíneo
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

export default function CompletarPerfil() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dataNascimento: "",
    dataNascimentoISO: "",
    altura: "",
    peso: "",
    tipoSanguineo: "",
    diagnosticos: "",
    medicamentos: "",
    historicoFamiliar: "",
    alergias: "",
    condicaoEspecial: "",
  });

  useEffect(() => {
    // Carregar dados existentes do perfil se houver
    const loadProfile = async () => {
      try {
        const profile = await patientProfileApi.getProfile();
        if (profile) {
          const birthDate = profile.dateOfBirth
            ? new Date(profile.dateOfBirth)
            : null;
          const formattedDate = birthDate
            ? `${String(birthDate.getDate()).padStart(2, "0")}/${String(
                birthDate.getMonth() + 1
              ).padStart(2, "0")}/${birthDate.getFullYear()}`
            : "";
          const dateISO = birthDate
            ? birthDate.toISOString().split("T")[0]
            : "";

          const heightInMeters = profile.height
            ? (profile.height / 100).toFixed(2)
            : "";
          const weightFormatted = profile.weight
            ? profile.weight.toString()
            : "";

          setFormData({
            dataNascimento: formattedDate,
            dataNascimentoISO: dateISO,
            altura: heightInMeters,
            peso: weightFormatted,
            tipoSanguineo: profile.bloodType || "",
            diagnosticos: profile.diseases || "",
            medicamentos: profile.medications || "",
            historicoFamiliar: profile.familyHistory || "",
            alergias: profile.allergies || "",
            condicaoEspecial: profile.specialConditions || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.dataNascimento ||
        !formData.altura ||
        !formData.peso ||
        !formData.tipoSanguineo
      ) {
        toast.error("Preencha todos os campos obrigatórios para continuar");
        setLoading(false);
        return;
      }

      const dateNumbers = formData.dataNascimento.replace(/\D/g, "");
      if (dateNumbers.length !== 8) {
        toast.error("Data de nascimento inválida. Use o formato DD/MM/AAAA");
        setLoading(false);
        return;
      }

      const dateISO = formatDateToISO(formData.dataNascimento);
      const heightInCm = metersToCentimeters(formData.altura);
      const weightValue = parseFloat(formData.peso.replace(/[^\d.]/g, "")) || 0;

      if (heightInCm === 0 || isNaN(heightInCm)) {
        toast.error("Altura inválida. Use o formato em metros (ex: 1.75)");
        setLoading(false);
        return;
      }

      if (weightValue === 0 || isNaN(weightValue)) {
        toast.error("Peso inválido. Use o formato em kg (ex: 70.5)");
        setLoading(false);
        return;
      }

      await patientProfileApi.updateProfile({
        dateOfBirth: dateISO,
        bloodType: formData.tipoSanguineo,
        height: heightInCm,
        weight: weightValue,
        diseases: formData.diagnosticos || undefined,
        medications: formData.medicamentos || undefined,
        familyHistory: formData.historicoFamiliar || undefined,
        allergies: formData.alergias || undefined,
        specialConditions: formData.condicaoEspecial || undefined,
      });

      // Atualizar contexto do usuário
      updateUser({
        profileData: {
          height: heightInCm,
          weight: weightValue,
          bloodType: formData.tipoSanguineo,
        },
      });

      toast.success(
        "Perfil atualizado! Agora você tem acesso completo ao programa."
      );
      navigate("/agenda");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Não foi possível salvar seus dados. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-primary">amil</span>
          </Link>
          <img src={miloFront} alt="Milo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Complete seu perfil
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para ter acesso completo ao programa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Dados de Saúde
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <div className="relative">
                  <Input
                    id="dataNascimento"
                    type="text"
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    value={formData.dataNascimento}
                    onChange={(e) => {
                      const formatted = formatDateOfBirth(e.target.value);
                      const dateISO = formatDateToISO(formatted);
                      setFormData({
                        ...formData,
                        dataNascimento: formatted,
                        dataNascimentoISO: dateISO || "",
                      });
                    }}
                    maxLength={10}
                    required
                    className="pr-10"
                  />
                  <DatePicker
                    value={formData.dataNascimento}
                    onChange={(value) => {
                      const dateISO = formatDateToISO(value);
                      setFormData({
                        ...formData,
                        dataNascimento: value,
                        dataNascimentoISO: dateISO || "",
                      });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="altura">Altura (m) *</Label>
                <Input
                  id="altura"
                  type="text"
                  inputMode="decimal"
                  placeholder="1.75"
                  value={formData.altura}
                  onChange={(e) => {
                    const formatted = formatHeight(e.target.value);
                    setFormData({ ...formData, altura: formatted });
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg) *</Label>
                <Input
                  id="peso"
                  type="text"
                  inputMode="decimal"
                  placeholder="70.5"
                  value={formData.peso}
                  onChange={(e) => {
                    const formatted = formatWeight(e.target.value);
                    setFormData({ ...formData, peso: formatted });
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoSanguineo">Tipo Sanguíneo *</Label>
              <Select
                value={formData.tipoSanguineo}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipoSanguineo: value })
                }
                required
              >
                <SelectTrigger id="tipoSanguineo">
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

            <div className="space-y-2">
              <Label htmlFor="diagnosticos">
                Possui alguma doença? (se houver)
              </Label>
              <Input
                id="diagnosticos"
                type="text"
                placeholder="Ex: Hipertensão, Diabetes..."
                value={formData.diagnosticos}
                onChange={(e) =>
                  setFormData({ ...formData, diagnosticos: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicamentos">
                Toma algum medicamento? (se houver)
              </Label>
              <Input
                id="medicamentos"
                type="text"
                placeholder="Ex: Losartana 50mg, Metformina..."
                value={formData.medicamentos}
                onChange={(e) =>
                  setFormData({ ...formData, medicamentos: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="historicoFamiliar">
                Histórico Familiar de Doenças
              </Label>
              <Input
                id="historicoFamiliar"
                type="text"
                placeholder="Ex: Pai com diabetes, mãe com hipertensão..."
                value={formData.historicoFamiliar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    historicoFamiliar: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alergias">Alergias</Label>
              <Input
                id="alergias"
                type="text"
                placeholder="Ex: Penicilina, amendoim, látex..."
                value={formData.alergias}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alergias: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condicaoEspecial">Observações Adicionais</Label>
              <Input
                id="condicaoEspecial"
                type="text"
                placeholder="Cirurgias recentes, condições especiais, etc."
                value={formData.condicaoEspecial}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condicaoEspecial: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#461BFF] hover:brightness-90 text-white rounded-full"
            loading={loading}
          >
            {loading ? "Salvando..." : "Completar Perfil"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
