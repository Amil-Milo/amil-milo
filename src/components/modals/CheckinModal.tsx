import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MiloAssistant } from "@/components/MiloAssistant";
import { toast } from "sonner";

interface CheckinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cardiologyQuestions = [
  {
    id: "cardio-1",
    question: "Nos últimos 15 dias, com que frequência sentiu falta de ar ao realizar atividades simples como vestir-se ou caminhar dentro de casa?",
    options: [
      "Nunca",
      "Raramente (1-2 vezes)",
      "Às vezes (3-5 vezes)",
      "Frequentemente (quase todo dia)"
    ]
  },
  {
    id: "cardio-2",
    question: "Notou inchaço nos tornozelos ou pés que piora ao final do dia?",
    options: [
      "Não",
      "Leve (só nota ao apertar)",
      "Moderado (visível sem apertar)",
      "Acentuado (dificulta usar sapatos)"
    ]
  },
  {
    id: "cardio-3",
    question: "Teve palpitações ou sensação de coração acelerado sem motivo aparente?",
    options: [
      "Não",
      "Sim, mas passageiro",
      "Sim, durou vários minutos",
      "Sim, com tontura ou mal-estar"
    ]
  },
  {
    id: "cardio-4",
    question: "Acordou à noite com falta de ar ou precisou usar mais travesseiros para dormir?",
    options: [
      "Nunca",
      "1-2 vezes",
      "3-5 vezes",
      "Quase toda noite"
    ]
  },
  {
    id: "cardio-5",
    question: "Tem sentido dores de cabeça frequentes, tonturas ou visão turva?",
    options: [
      "Nenhum desses",
      "1 desses sintomas",
      "2 desses sintomas",
      "Todos esses sintomas"
    ]
  }
];

const orthopedicsQuestions = [
  {
    id: "ortho-1",
    question: "Tem sentido dores nas costas, pescoço ou articulações que limitam suas atividades?",
    options: [
      "Nenhuma dor",
      "Dor leve (não limita atividades)",
      "Dor moderada (limita algumas atividades)",
      "Dor intensa (limita muitas atividades)"
    ]
  },
  {
    id: "ortho-2",
    question: "Essa dor irradia para braços, pernas ou outras regiões do corpo?",
    options: [
      "Não",
      "Sim, mas só próximo à área",
      "Sim, irradia para membros",
      "Sim, com formigamento ou dormência"
    ]
  },
  {
    id: "ortho-3",
    question: "Tem dificuldade para se movimentar ao acordar ou após ficar muito tempo parado na mesma posição?",
    options: [
      "Nenhuma dificuldade",
      "Rigidez leve (<30 min)",
      "Rigidez moderada (30-60 min)",
      "Rigidez grave (>60 min)"
    ]
  },
  {
    id: "ortho-4",
    question: "A dor tem atrapalhado seu sono ou acorda você durante a noite?",
    options: [
      "Nunca",
      "Raramente",
      "Algumas vezes por semana",
      "Quase toda noite"
    ]
  },
  {
    id: "ortho-5",
    question: "Tem dificuldade para realizar tarefas simples como calçar sapatos, alcançar objetos no alto ou subir escadas?",
    options: [
      "Nenhuma dificuldade",
      "Dificuldade leve",
      "Dificuldade moderada",
      "Dificuldade grave"
    ]
  }
];

const mentalHealthQuestions = [
  {
    id: "mental-1",
    question: "Nos últimos 15 dias, com que frequência se sentiu desanimado, triste ou sem esperança?",
    options: [
      "Quase nunca",
      "Alguns dias",
      "Mais da metade dos dias",
      "Quase todos os dias"
    ]
  },
  {
    id: "mental-2",
    question: "Teve pouco interesse ou prazer em fazer coisas que normalmente gostaria?",
    options: [
      "Nenhuma redução",
      "Leve redução",
      "Redução moderada",
      "Quase nenhum interesse"
    ]
  },
  {
    id: "mental-3",
    question: "Esses sentimentos têm atrapalhado seu trabalho, atividades domésticas ou relacionamentos?",
    options: [
      "Nada",
      "Um pouco",
      "Moderadamente",
      "Muito"
    ]
  },
  {
    id: "mental-4",
    question: "Tem tido dificuldade para dormir (insônia) ou está dormindo mais que o habitual?",
    options: [
      "Sono normal",
      "Leve alteração",
      "Alteração moderada",
      "Alteração grave"
    ]
  },
  {
    id: "mental-5",
    question: "Sente-se nervoso, ansioso ou muito preocupado sem conseguir relaxar?",
    options: [
      "Nunca",
      "Às vezes",
      "Frequentemente",
      "Quase constantemente"
    ]
  }
];

const allQuestions = [
  ...cardiologyQuestions.map(q => ({ ...q, category: "Cardiologia" })),
  ...orthopedicsQuestions.map(q => ({ ...q, category: "Ortopedia" })),
  ...mentalHealthQuestions.map(q => ({ ...q, category: "Saúde Mental" }))
];

export const CheckinModal = ({ open, onOpenChange }: CheckinModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentCategory, setCurrentCategory] = useState("Cardiologia");

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  // Update category when moving to a new section
  if (currentQuestion && currentQuestion.category !== currentCategory) {
    setCurrentCategory(currentQuestion.category);
  }

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Por favor, selecione uma resposta");
      return;
    }

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit check-in
      console.log("Check-in responses:", answers);
      toast.success("Check-in realizado com sucesso!");
      onOpenChange(false);
      // Reset
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Check-in Periódico</DialogTitle>
        </DialogHeader>

        <MiloAssistant
          message="Olá! Vamos fazer seu check-in de hoje. Responda com calma, suas respostas me ajudam a cuidar melhor de você."
          size="sm"
        />

        <div className="space-y-6">
          {/* Category indicator */}
          <div className="text-center">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {currentCategory}
            </span>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Pergunta {currentQuestionIndex + 1} de {allQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {currentQuestion?.question}
            </h3>

            <RadioGroup
              value={answers[currentQuestion?.id]}
              onValueChange={handleAnswer}
            >
              {currentQuestion?.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
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
            <Button onClick={handleNext} className="bg-gradient-primary">
              {currentQuestionIndex === allQuestions.length - 1 ? "Finalizar" : "Próxima"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
