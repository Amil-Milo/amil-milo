import { Layout } from "@/components/layout/Layout";
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
      <Layout>
        <div className="flex items-center justify-center py-12 px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      </Layout>
    );
  }

  const shouldShow = shouldShowData?.shouldShow ?? false;

  return (
    <Layout>
      <div className="px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
          <div className="mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2 md:gap-3">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Diário de Saúde
          </h1>
            <p className="text-sm md:text-base text-muted-foreground">
            {shouldShow
              ? "Registre como você está se sentindo hoje, um dia antes da sua consulta"
              : "Acompanhe sua evolução e registros anteriores"}
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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

          <div className="space-y-4 md:space-y-6">
            <DiaryList />

            <Card className="p-4 md:p-6 bg-secondary-light">
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-2 md:mb-3">
                💡 Dica do Milo
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {shouldShow
                  ? "Registre como está se sentindo hoje para ajudar seu médico na consulta de amanhã."
                  : "O diário estará disponível um dia antes da sua próxima consulta. Registros regulares ajudam você e seu médico a identificar padrões e ajustar o tratamento."}
              </p>
            </Card>
          </div>
        </div>
    </div>
    </Layout>
  );
}

