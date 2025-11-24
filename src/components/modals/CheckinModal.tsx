import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MiloAssistant } from "@/components/MiloAssistant";
import { toast } from "sonner";
import { checkinApi } from "@/lib/api";

interface CheckinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AnswerOption {
  id: number;
  text: string;
  value: number;
}

interface Question {
  id: number;
  text: string;
  order: number;
  answerOptions: AnswerOption[];
}

interface Questionnaire {
  id: number;
  name: string;
  specialtyId: number;
  questions: Question[];
  eligible: true;
}

interface CheckinNotAvailable {
  eligible: false;
  nextCheckinAvailableOn?: string;
  message: string;
}

type CheckinResponse = Questionnaire | CheckinNotAvailable;

export const CheckinModal = ({ open, onOpenChange }: CheckinModalProps) => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null
  );
  const [checkinStatus, setCheckinStatus] =
    useState<CheckinNotAvailable | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> chosenAnswerId
  const [loading, setLoading] = useState(false);
  const [loadingQuestionnaire, setLoadingQuestionnaire] = useState(false);

  useEffect(() => {
    if (open) {
      loadQuestionnaire();
    } else {
      setQuestionnaire(null);
      setCheckinStatus(null);
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  }, [open]);

  const loadQuestionnaire = async () => {
    setLoadingQuestionnaire(true);
    try {
      const data = await checkinApi.getNextCheckin();

      if (data.eligible === false) {
        setCheckinStatus(data as CheckinNotAvailable);
        setQuestionnaire(null);
      } else {
        setQuestionnaire(data as Questionnaire);
        setCheckinStatus(null);
        setCurrentQuestionIndex(0);
        setAnswers({});
      }
    } catch (error: any) {
      console.error("Error loading questionnaire:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.description ||
        "Não foi possível carregar o questionário. Tente novamente.";
      toast.error(errorMessage);
      onOpenChange(false);
    } finally {
      setLoadingQuestionnaire(false);
    }
  };

  const currentQuestion = questionnaire?.questions[currentQuestionIndex];
  const progress = questionnaire
    ? ((currentQuestionIndex + 1) / questionnaire.questions.length) * 100
    : 0;

  const handleAnswer = (answerOptionId: string) => {
    if (!currentQuestion) return;
    const chosenAnswerId = parseInt(answerOptionId, 10);
    setAnswers({ ...answers, [currentQuestion.id]: chosenAnswerId });
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    if (!answers[currentQuestion.id]) {
      toast.error("Selecione uma resposta para continuar");
      return;
    }

    if (currentQuestionIndex < (questionnaire?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit check-in
      await submitCheckin();
    }
  };

  const submitCheckin = async () => {
    if (!questionnaire) return;

    setLoading(true);
    try {
      // Mapear respostas para o formato esperado pelo backend
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, chosenAnswerId]) => ({
          questionId: parseInt(questionId, 10),
          chosenAnswerId: chosenAnswerId,
        })
      );

      await checkinApi.submitCheckin({
        questionnaireId: questionnaire.id,
        answers: formattedAnswers,
      });

      toast.success("Check-in concluído! Suas respostas foram registradas.");
      onOpenChange(false);

      // Reset
      setCurrentQuestionIndex(0);
      setAnswers({});
      setQuestionnaire(null);
    } catch (error: any) {
      console.error("Error submitting check-in:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.description ||
        "Erro ao salvar check-in. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Mostrar loading enquanto carrega o questionário
  if (loadingQuestionnaire) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Check-in Periódico</DialogTitle>
            <DialogDescription>Carregando questionário...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando questionário...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (checkinStatus) {
    const formatDate = (dateString?: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Check-in Periódico</DialogTitle>
            <DialogDescription>
              {checkinStatus.nextCheckinAvailableOn
                ? `Próximo check-in disponível em ${formatDate(
                    checkinStatus.nextCheckinAvailableOn
                  )}`
                : "Você completou todos os check-ins disponíveis"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-8">
            <MiloAssistant message={checkinStatus.message} size="sm" />
            {checkinStatus.nextCheckinAvailableOn && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Seu próximo check-in estará disponível em{" "}
                  <span className="font-semibold text-foreground">
                    {formatDate(checkinStatus.nextCheckinAvailableOn)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!questionnaire || !currentQuestion) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Check-in Periódico</DialogTitle>
            <DialogDescription>
              Nenhum questionário disponível no momento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">
              Nenhum questionário disponível no momento.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Check-in Periódico</DialogTitle>
          <DialogDescription>
            Responda as perguntas para completar seu check-in periódico
          </DialogDescription>
        </DialogHeader>

        <MiloAssistant
          message="Olá! Vamos fazer seu check-in de hoje. Responda com calma, suas respostas me ajudam a cuidar melhor de você."
          size="sm"
        />

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Pergunta {currentQuestionIndex + 1} de{" "}
                {questionnaire.questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#00AEEF] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {currentQuestion.text}
            </h3>

            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ""}
              onValueChange={handleAnswer}
            >
              {currentQuestion.answerOptions.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-primary/10"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`option-${option.id}`}
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#461BFF] hover:brightness-90 text-white rounded-full"
              loading={loading}
            >
              {loading
                ? "Salvando..."
                : currentQuestionIndex === questionnaire.questions.length - 1
                ? "Finalizar"
                : "Próxima"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
