import { Sidebar } from "@/components/Sidebar";
import { BookOpen, Calendar, Loader2, Info } from "lucide-react";
import { DiaryEntryForm } from "@/components/diary/DiaryEntryForm";
import { DiaryList } from "@/components/diary/DiaryList";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useShouldShowDiary } from "@/hooks/useDiaryEntries";

export default function Diario() {
  const { data: shouldShowData, isLoading } = useShouldShowDiary();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-8 transition-all duration-300 min-w-0 overflow-x-auto" style={{ marginLeft: 'var(--content-margin-left, 72px)' }}>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  const shouldShow = shouldShowData?.shouldShow ?? false;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Diário de Saúde
          </h1>
          <p className="text-muted-foreground">
            {shouldShow
              ? "Registre como você está se sentindo hoje, um dia antes da sua consulta"
              : "Acompanhe sua evolução e registros anteriores"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {shouldShow ? (
              <DiaryEntryForm />
            ) : (
              <Card className="p-6 border-2 border-primary/20 shadow-lg rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Diário não disponível no momento
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {shouldShowData?.message ||
                        "O diário estará disponível um dia antes da sua próxima consulta."}
                    </p>
                    {shouldShowData?.nextConsultation && (
                      <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-secondary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            Próxima Consulta
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Badge variant="default" className="mb-2">
                              {shouldShowData.nextConsultation.specialty}
                            </Badge>
                            <p className="text-sm text-foreground">
                              {shouldShowData.nextConsultation.professionalName}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              shouldShowData.nextConsultation.consultationDate
                            ).toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            📍 {shouldShowData.nextConsultation.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <DiaryList />

            <Card className="p-6 bg-secondary-light">
              <h3 className="font-semibold text-foreground mb-3">
                💡 Dica do Milo
              </h3>
              <p className="text-sm text-muted-foreground">
                {shouldShow
                  ? "Registre como está se sentindo hoje para ajudar seu médico na consulta de amanhã."
                  : "O diário estará disponível um dia antes da sua próxima consulta. Registros regulares ajudam você e seu médico a identificar padrões e ajustar o tratamento."}
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

