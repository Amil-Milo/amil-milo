import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckinModal } from "@/components/modals/CheckinModal";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import miloFront from "@/assets/milo-front.png";
import { Clipboard, Stethoscope, Target } from "lucide-react";

export default function CheckinPeriodico() {
  const [checkinOpen, setCheckinOpen] = useState(false);
  const { user } = useAuth();
  const { profileData } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "ADMIN" && profileData?.profile?.assignedLineId) {
      navigate("/agenda", { replace: true });
    }
  }, [user, profileData, navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="text-center space-y-4">
          <img
            src={miloFront}
            alt="Milo"
            className="w-48 h-48 mx-auto object-contain animate-bounce-slow"
          />
          <h1 className="text-4xl font-bold text-[#003B71]">
            Bem-vindo à Amil
          </h1>
          <p className="text-xl text-muted-foreground">
            Estamos felizes em ter você aqui
          </p>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-[#003B71]">
          <div className="space-y-3 text-foreground">
            <p>
              Olá! Eu sou o <strong>Milo</strong>, sua coruja médica
              personalizada.
            </p>
            <p>
              Você acabou de criar sua conta no <strong>Cuidadosmil</strong>,
              nosso programa de engajamento em saúde.
            </p>
            <p>
              Para começarmos sua jornada, preciso conhecer melhor como você
              está se sentindo. Que tal fazer um check-in rápido?
            </p>
          </div>
        </Card>

        {/* Call to action */}
        <Card className="p-8 text-center space-y-6 shadow-strong">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-primary">
              Próximo Passo: Check-in Periódico
            </h2>
            <p className="text-muted-foreground">
              Um questionário rápido que me ajuda a entender suas necessidades
              de saúde. Leva apenas 5 minutos!
            </p>
          </div>

          <Button
            size="lg"
            className="bg-[#461BFF] hover:brightness-90 text-white text-lg px-8 rounded-full"
            onClick={() => setCheckinOpen(true)}
          >
            Fazer Check-in Agora
          </Button>

          <p className="text-sm text-muted-foreground">
            Após o check-in, nossa equipe médica irá avaliar e, se necessário,
            você será convidado para o programa completo
          </p>
        </Card>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#461BFF] flex items-center justify-center">
              <Clipboard className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Check-in Regular</h3>
            <p className="text-sm text-muted-foreground">
              Monitore sua saúde periodicamente
            </p>
          </Card>

          <Card className="p-6 text-center border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#461BFF] flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Avaliação Médica</h3>
            <p className="text-sm text-muted-foreground">
              Equipe especializada analisa suas respostas
            </p>
          </Card>

          <Card className="p-6 text-center border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#461BFF] flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Programa Personalizado</h3>
            <p className="text-sm text-muted-foreground">
              Acesso à jornada completa quando indicado
            </p>
          </Card>
        </div>
      </div>

      <CheckinModal open={checkinOpen} onOpenChange={setCheckinOpen} />
    </div>
  );
}
