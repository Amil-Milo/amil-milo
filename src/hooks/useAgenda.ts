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
  
  // ADMIN pode acessar mesmo sem linha de cuidado
  const isAdmin = user?.role === 'ADMIN';
  const shouldEnable = Boolean(isAuthenticated && !authLoading && (user?.assignedLineId || isAdmin));
  
  return useQuery<AgendaSummary>({
    queryKey: ['agenda', 'summary'],
    queryFn: async () => {
      try {
      const response = await agendaApi.getSummary();
      return {
        upcomingConsultations: response.upcomingConsultations?.map((c: any) => ({
          ...c,
          consultationDate: new Date(c.consultationDate),
        })) || [],
        medicationReminders: response.medicationReminders || [],
      };
      } catch (error: any) {
        // Se for ADMIN e der 404, retorna dados vazios ao invés de lançar erro
        if (isAdmin && error?.response?.status === 404) {
          // Marca o erro para não ser logado no console
          (error as any).__suppressConsole = true;
          return {
            upcomingConsultations: [],
            medicationReminders: [],
          };
        }
        throw error;
      }
    },
    enabled: shouldEnable,
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      // Se for ADMIN e der 404, não tenta novamente
      if (isAdmin && axiosError.response?.status === 404) {
        return false;
      }
      if (axiosError.response?.status === 403 || axiosError.response?.status === 404 || axiosError.code === 'ERR_NETWORK' || axiosError.response?.status === 502) {
        return false;
      }
      return failureCount < 3;
    },
    // Suprime logs de erro para ADMINs quando for 404
    onError: (error: any) => {
      if (isAdmin && error?.response?.status === 404) {
        // Não faz nada, o erro já foi tratado no queryFn
        return;
      }
    },
  });
}

