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
      const response = await journeyApi.getJourneyData();
      return response.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });
}

