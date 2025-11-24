import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Calendar, BookOpen, Award, TrendingUp } from "lucide-react";
import miloFront from "@/assets/milo-front.png";

const tourSteps = [
  {
    icon: Heart,
    title: "Bem-vindo ao Programa Cuidadosmil!",
    description:
      "Eu sou o Milo, seu assistente virtual de saúde! Vou te acompanhar em toda sua jornada, enviando lembretes, dicas e comemorando cada conquista com você. Estou aqui para tornar o cuidado com sua saúde mais simples e motivador!",
  },
  {
    icon: Calendar,
    title: "Sua Agenda Inteligente",
    description:
      "Na sua agenda, você encontra consultas, exames e lembretes de medicação. Eu vou te avisar antes de cada compromisso e ajudar você a se preparar melhor para suas consultas.",
  },
  {
    icon: BookOpen,
    title: "Conteúdos Personalizados",
    description:
      "Preparei artigos, vídeos e dicas sobre saúde pensando em você! Todo o conteúdo é adaptado para sua condição e seus interesses. Vamos aprender juntos!",
  },
  {
    icon: Award,
    title: "Conquistas",
    description:
      "Cada passo importa! Você vai ganhar selos, manter sequências de dias ativos e subir de nível. É uma forma divertida de acompanhar seu progresso.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhe sua Evolução",
    description:
      "No dashboard, você vê gráficos simples sobre sua adesão, metas cumpridas e evolução ao longo do tempo. Vamos celebrar cada avanço juntos!",
  },
];

export default function Tour() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const CurrentIcon = tourSteps[currentStep].icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.removeItem("isNewUser");
      navigate("/agenda");
    }
  };

  const handleSkip = () => {
    localStorage.removeItem("isNewUser");
    navigate("/agenda");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003B71] to-[#00AEEF] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 md:p-8 bg-white shadow-sm border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md transition-all">
        <div className="text-center mb-8">
          <img
            src={miloFront}
            alt="Milo"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 object-contain"
          />
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#461BFF] rounded-full flex items-center justify-center mx-auto mb-4">
            <CurrentIcon className="h-10 w-10 md:h-12 md:w-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#003B71] mb-4">
            {tourSteps[currentStep].title}
          </h1>
          <p className="text-base text-[#333333] leading-relaxed">
            {tourSteps[currentStep].description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? "w-8 bg-[#461BFF]" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 text-[#003B71] hover:bg-gray-50"
          >
            Pular Tour
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-[#461BFF] hover:brightness-90 text-white rounded-full"
          >
            {currentStep < tourSteps.length - 1 ? "Próximo" : "Começar!"}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Passo {currentStep + 1} de {tourSteps.length}
          </p>
        </div>
      </Card>
    </div>
  );
}
