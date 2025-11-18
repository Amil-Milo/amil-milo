import { useQuery } from '@tanstack/react-query';
import { journeyApi } from '@/lib/api';

export interface JourneyData {
  level: string;
  levelProgress: number;
  points: number;
  streak: number;
  currentGoals: Array<{
    id: number;
    title: string;
    description: string | null;
    status: string;
    progress: number;
  }>;
  milestones: Array<{
    id: number;
    type: string;
    title: string;
    description: string | null;
    achievedAt: string;
  }>;
  weeklyProgress: {
    interactions: { current: number; target: number };
    contents: { current: number; target: number };
  };
}

export function useJourney() {
  return useQuery<JourneyData>({
    queryKey: ['journey'],
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      return {
        level: "Intermediário",
        levelProgress: 65,
        points: 1250,
        streak: 12,
        currentGoals: [
          {
            id: 1,
            title: "Beber 2L de água por dia",
            description: "Meta de hidratação diária",
            status: "COMPLETED",
            progress: 100,
          },
          {
            id: 2,
            title: "Caminhada de 30 minutos",
            description: "Exercício físico regular",
            status: "ACTIVE",
            progress: 70,
          },
          {
            id: 3,
            title: "Evitar sal em excesso",
            description: "Redução de sódio na alimentação",
            status: "ACTIVE",
            progress: 45,
          },
        ],
        milestones: [
          {
            id: 1,
            type: "FIRST_ACCESS",
            title: "Primeiro Acesso",
            description: "Bem-vindo ao programa!",
            achievedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            type: "STREAK_7",
            title: "7 Dias Seguidos",
            description: "Você completou 7 dias consecutivos!",
            achievedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            type: "GOAL_COMPLETED",
            title: "Primeira Meta Concluída",
            description: "Parabéns pela dedicação!",
            achievedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        weeklyProgress: {
          interactions: { current: 8, target: 10 },
          contents: { current: 5, target: 7 },
        },
      };
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

