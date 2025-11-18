import { useQuery } from '@tanstack/react-query';
import { agendaApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AxiosError } from 'axios';

export interface AgendaConsultation {
  id: number;
  professionalName: string;
  specialty: string;
  consultationDate: Date;
  location: string;
  status: string;
  notes: string | null;
  googleEventId: string | null;
}

export interface AgendaMedication {
  name: string;
  time: string;
  notes: string | null;
}

export interface AgendaSummary {
  upcomingConsultations: AgendaConsultation[];
  medicationReminders: AgendaMedication[];
}

export function useAgenda() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  return useQuery<AgendaSummary>({
    queryKey: ['agenda', 'summary'],
    queryFn: async () => {
      return await agendaApi.getSummary();
    },
    enabled: isAuthenticated && !authLoading && (user?.assignedLineId || user?.role === 'ADMIN'),
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403 || axiosError.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

