import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, Heart, Loader2, User, FileText, Activity } from "lucide-react";
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
  const { data, isLoading } = useMedicalRecords();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <Sidebar />
        <main className="flex-1 p-8 transition-all duration-300 min-w-0 overflow-x-auto" style={{ marginLeft: 'var(--content-margin-left, 72px)' }}>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <Sidebar />
        <main className="flex-1 p-8 transition-all duration-300 min-w-0 overflow-x-auto" style={{ marginLeft: 'var(--content-margin-left, 72px)' }}>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Erro ao carregar prontuário.</p>
          </div>
        </main>
      </div>
    );
  }

  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(data.profile.dateOfBirth);
  const bloodType = data.profile.bloodType ? bloodTypeLabels[data.profile.bloodType] : null;

  const calculateBMI = (height?: number, weight?: number): number | null => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  };

  const bmi = calculateBMI(data.profile.height, data.profile.weight);

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <Card className="p-6 mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
            <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Prontuário Médico
            </h1>
            <p className="text-muted-foreground mb-6">Seu histórico completo de saúde</p>

            <Card className="p-6 mb-6 border-primary/30 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6 flex-1">
                <Avatar className="w-20 h-20 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{user?.name || "Paciente"}</h3>
                    {age && (
                      <p className="text-sm text-muted-foreground">{age} anos</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {data.profile.height && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Altura:</span>
                        <span className="text-sm font-medium text-foreground">{(data.profile.height / 100).toFixed(2)}m</span>
                      </div>
                    )}
                    {data.profile.weight && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Peso:</span>
                        <span className="text-sm font-medium text-foreground">{data.profile.weight.toFixed(1)}kg</span>
                      </div>
                    )}
                    {bmi && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">IMC:</span>
                        <span className="text-sm font-medium text-foreground">{bmi}</span>
                      </div>
                    )}
                    {data.profile.assignedLine && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Linha de Cuidado:</span>
                        <Badge variant="secondary" className="text-xs">
                          {data.profile.assignedLine.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {bloodType && (
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge className="bg-destructive text-white text-base px-4 py-2 font-bold hover:!bg-destructive">
                    {bloodType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Tipo Sanguíneo</span>
                </div>
              )}
            </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ConsultationHistory consultations={data.consultations} />
              <ExamResultsList medicalRecords={data.medicalRecords} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <MedicationList medications={data.medications} />

              <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/40 hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Alergias</h2>
                </div>
                <div className="space-y-3">
                  {data.allergies ? (
                    <>
                      <div className="p-4 bg-destructive/20 rounded-lg border-2 border-destructive/40">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                          <p className="font-semibold text-destructive">{data.allergies}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-destructive/20">
                        <p className="text-xs text-destructive/70 text-center font-medium">⚠️ Informação crítica</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma alergia cadastrada.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Doenças/Diagnósticos</h2>
                </div>
                <div className="p-4 bg-gradient-to-r from-primary/10 to-background rounded-lg border border-primary/10 min-h-[100px]">
                  {data.profile.diseases ? (
                    <p className="text-sm text-foreground whitespace-pre-line">{data.profile.diseases}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma doença ou diagnóstico cadastrado.</p>
                  )}
                </div>
              </Card>

              <Card className="p-6 border-primary/20 hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Observações Adicionais</h2>
                </div>
                <div className="p-4 bg-gradient-to-r from-primary/10 to-background rounded-lg border border-primary/10 min-h-[100px]">
                  {data.additionalObservations ? (
                    <p className="text-sm text-foreground">{data.additionalObservations}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma observação adicional cadastrada.</p>
                  )}
                </div>
              </Card>
            </div>

            <Card className="p-6 mb-6 border-secondary/20 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Histórico Familiar</h2>
              </div>
              <div className="p-4 bg-gradient-to-r from-secondary-light/20 to-background rounded-lg border border-secondary/10 min-h-[100px]">
                {data.profile.familyHistory ? (
                  <p className="text-sm text-foreground">{data.profile.familyHistory}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum histórico familiar cadastrado.</p>
                )}
              </div>
            </Card>
          </Card>
        </div>
      </main>
    </div>
  );
}

