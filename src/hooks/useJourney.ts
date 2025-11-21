import { useQuery } from '@tanstack/react-query';
import { journeyApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AxiosError } from 'axios';

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
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading && (user?.assignedLineId || user?.role === 'ADMIN'));
  
  return useQuery<JourneyData>({
    queryKey: ['journey'],
    queryFn: async () => {
      const response = await journeyApi.getJourneyData();
      return response.data || response;
    },
    enabled: shouldEnable,
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403 || axiosError.response?.status === 404 || axiosError.code === 'ERR_NETWORK') {
        return false;
      }
      return failureCount < 3;
    },
  });
}

