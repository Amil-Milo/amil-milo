import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertTriangle,
  Heart,
  Loader2,
  User,
  FileText,
  Activity,
} from "lucide-react";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { ExamResultsList } from "@/components/prontuario/ExamResultsList";
import { ConsultationHistory } from "@/components/prontuario/ConsultationHistory";
import { MedicationList } from "@/components/prontuario/MedicationList";

const bloodTypeLabels: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

export default function Prontuario() {
  const { user } = useAuth();
  const { data, isLoading, error } = useMedicalRecords();
  const isAdmin = user?.role === "ADMIN";

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Se for ADMIN e der erro 404, mostra prontuário vazio ao invés de erro
  if (!data && !isAdmin) {
    return (
      <Layout>
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8 text-center py-12">
          <p className="text-muted-foreground">Erro ao carregar prontuário.</p>
        </div>
      </Layout>
    );
  }

  // Se for ADMIN e não tiver dados, cria dados vazios
  const medicalData =
    data ||
    (isAdmin
      ? {
          profile: {
            id: 0,
            userId: user?.id || 0,
          },
          medicalRecords: [],
          consultations: [],
          medications: [],
          allergies: null,
          additionalObservations: null,
        }
      : null);

  if (!medicalData) {
    return (
      <Layout>
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8 text-center py-12">
          <p className="text-muted-foreground">Erro ao carregar prontuário.</p>
        </div>
      </Layout>
    );
  }

  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(medicalData.profile.dateOfBirth);
  const bloodType = medicalData.profile.bloodType
    ? bloodTypeLabels[medicalData.profile.bloodType]
    : null;

  const calculateBMI = (height?: number, weight?: number): number | null => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  };

  const bmi = calculateBMI(
    medicalData.profile.height,
    medicalData.profile.weight
  );

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
        <Card className="p-4 md:p-6 mb-4 md:mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
            <FileText className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Prontuário Médico
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
            Seu histórico completo de saúde
          </p>

          <Card className="p-4 md:p-6 mb-4 md:mb-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1 w-full">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-primary/30 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-white text-xl sm:text-2xl font-bold">
                    {user?.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 sm:space-y-3 w-full">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {user?.name || "Paciente"}
                    </h3>
                    {age && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {age} anos
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                    {medicalData.profile.height && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Altura:
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {(medicalData.profile.height / 100).toFixed(2)}m
                        </span>
                      </div>
                    )}
                    {medicalData.profile.weight && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Peso:
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {medicalData.profile.weight.toFixed(1)}kg
                        </span>
                      </div>
                    )}
                    {bmi && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          IMC:
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {bmi}
                        </span>
                      </div>
                    )}
                    {medicalData.profile.assignedLine && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Linha de Cuidado:
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {medicalData.profile.assignedLine.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {bloodType && (
                <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                  <Badge className="bg-destructive text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 font-bold hover:!bg-destructive">
                    {bloodType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Tipo Sanguíneo
                  </span>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <ConsultationHistory consultations={medicalData.consultations} />
            <ExamResultsList medicalRecords={medicalData.medicalRecords} />
            <MedicationList medications={medicalData.medications} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <Card className="p-4 md:p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/40 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-destructive rounded-full flex items-center justify-center flex-shrink-0 p-3">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Alergias
                </h2>
              </div>
              <div className="space-y-3">
                {medicalData.allergies ? (
                  <>
                    <div className="p-4 bg-destructive/20 rounded-lg border-2 border-destructive/40">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                        <p className="font-semibold text-destructive">
                          {medicalData.allergies}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-destructive/20">
                      <p className="text-xs text-destructive/70 text-center font-medium">
                        ⚠️ Informação crítica
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhuma alergia cadastrada.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 md:p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#461BFF] rounded-full flex items-center justify-center flex-shrink-0 p-3">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Doenças/Diagnósticos
                </h2>
              </div>
              <div className="p-4 bg-gradient-to-r from-primary/10 to-background rounded-lg border border-primary/10 min-h-[100px]">
                {medicalData.profile.diseases ? (
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {medicalData.profile.diseases}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma doença ou diagnóstico cadastrado.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <Card className="p-4 md:p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#461BFF] rounded-full flex items-center justify-center flex-shrink-0 p-3">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Observações Adicionais
                </h2>
              </div>
              <div className="p-4 bg-gradient-to-r from-primary/10 to-background rounded-lg border border-primary/10 min-h-[100px]">
                {medicalData.additionalObservations ? (
                  <p className="text-sm text-foreground">
                    {medicalData.additionalObservations}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma observação adicional cadastrada.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-4 md:p-6 border-secondary/20 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00AEEF] rounded-full flex items-center justify-center flex-shrink-0 p-3">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Histórico Familiar
                </h2>
              </div>
              <div className="p-4 bg-gradient-to-r from-secondary-light/20 to-background rounded-lg border border-secondary/10 min-h-[100px]">
                {medicalData.profile.familyHistory ? (
                  <p className="text-sm text-foreground">
                    {medicalData.profile.familyHistory}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum histórico familiar cadastrado.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
