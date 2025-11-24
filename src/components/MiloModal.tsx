import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MapPin, ClipboardList } from "lucide-react";
import miloFaqHead from "@/assets/milo-faq-head.png";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MiloModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MiloView = "welcome" | "faq" | "tour" | "checkin";

export const MiloModal = ({ isOpen, onClose }: MiloModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const { profileData } = useUserProfile();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<MiloView>("welcome");
  const [isNewUser, setIsNewUser] = useState(false);
  const hasAssignedLine = !!profileData?.profile?.assignedLineId;

  useEffect(() => {
    if (isAuthenticated && user) {
      const registrationDate = user.createdAt ? new Date(user.createdAt) : null;
      const daysSinceRegistration = registrationDate
        ? Math.floor(
            (Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 999;
      setIsNewUser(daysSinceRegistration <= 7);
    }
  }, [isAuthenticated, user]);

  const handleStartTour = () => {
    onClose();
    navigate("/tour");
  };

  const handleGoToCheckin = () => {
    onClose();
    navigate("/check-in-periodico");
  };

  const faqs = [
    {
      question: "O que é o Programa Cuidadosmil?",
      answer:
        "O Programa Cuidadosmil é uma plataforma de acompanhamento de saúde personalizado que te ajuda a manter o foco na sua jornada de bem-estar através de metas, diário pessoal, conteúdos educacionais e muito mais.",
    },
    {
      question: "Como funciona o check-in periódico?",
      answer:
        "O check-in periódico é uma avaliação que você faz a cada 40 dias para acompanhar seu progresso. Ele ajuda a identificar áreas que precisam de atenção e ajustar seu plano de cuidado.",
    },
    {
      question: "O que são as metas de saúde?",
      answer:
        "As metas são objetivos personalizados definidos junto com sua equipe de cuidado. Elas podem incluir melhorias na alimentação, exercícios, medicação e outros aspectos da sua saúde.",
    },
    {
      question: "Como posso ver minhas consultas?",
      answer:
        "Todas as suas consultas aparecem na página Agenda, onde você também pode ver seus medicamentos, exames e lembretes importantes.",
    },
    {
      question: "O que é o Diário do Paciente?",
      answer:
        "O Diário é uma ferramenta para você registrar como se sente, sua motivação e suas conquistas. Ele fica disponível um dia antes das suas consultas para você compartilhar com sua equipe de cuidado.",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>
            Olá! Eu sou o Milo. Seu assistente virtual de saúde.
          </DialogTitle>
          <DialogDescription>
            Modal de assistente virtual com opções para acessar perguntas
            frequentes, tour inicial e check-in periódico.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                <img
                  src={miloFaqHead}
                  alt="Milo"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#003B71]">
                  Olá! Eu sou o Milo.
                </h2>
                <p className="text-sm text-gray-600">
                  Seu assistente virtual de saúde.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white">
            {currentView === "welcome" && (
              <div className="space-y-6">
                {isNewUser && isAuthenticated && (
                  <Card className="p-4 bg-[#F8F9FA] border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong className="text-[#003B71]">
                        Bem-vindo ao Programa Cuidadosmil!
                      </strong>{" "}
                      Estou aqui para te ajudar a navegar pela plataforma e
                      aproveitar ao máximo todos os recursos disponíveis.
                    </p>
                  </Card>
                )}

                {!isAuthenticated && (
                  <Card className="p-4 bg-[#F8F9FA] border border-gray-200">
                    <p className="text-sm text-gray-700">
                      Olá! Eu sou o{" "}
                      <strong className="text-[#003B71]">Milo</strong>, seu
                      assistente virtual. Estou aqui para te ajudar a entender o
                      Programa Cuidadosmil e acompanhar você em sua jornada de
                      saúde.
                    </p>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-3 bg-white border border-gray-200 hover:border-[#461BFF] hover:shadow-md transition-all"
                    onClick={() => navigate("/faq")}
                  >
                    <div className="w-12 h-12 bg-[#461BFF] rounded-full flex items-center justify-center">
                      <HelpCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-[#003B71] text-base">
                        Perguntas Frequentes
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Tire suas dúvidas sobre o programa
                      </div>
                    </div>
                  </Button>

                  {isAuthenticated && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-3 bg-white border border-gray-200 hover:border-[#461BFF] hover:shadow-md transition-all"
                      onClick={handleStartTour}
                    >
                      <div className="w-12 h-12 bg-[#461BFF] rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-[#003B71] text-base">
                          Tour Inicial
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Conheça todas as funcionalidades
                        </div>
                      </div>
                    </Button>
                  )}

                  {isAuthenticated && !hasAssignedLine && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-3 bg-white border border-gray-200 hover:border-[#461BFF] hover:shadow-md transition-all"
                      onClick={handleGoToCheckin}
                    >
                      <div className="w-12 h-12 bg-[#461BFF] rounded-full flex items-center justify-center">
                        <ClipboardList className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-[#003B71] text-base">
                          Check-in Periódico
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Avalie seu progresso
                        </div>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {currentView === "faq" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView("welcome")}
                    className="text-[#003B71] hover:text-[#461BFF] hover:bg-[#F8F9FA]"
                  >
                    ← Voltar
                  </Button>
                </div>
                <h3 className="text-xl font-bold text-[#003B71] mb-4">
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card
                      key={index}
                      className="p-4 bg-white border border-gray-200"
                    >
                      <h4 className="font-semibold text-[#003B71] mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
