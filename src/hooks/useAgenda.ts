import { useQuery } from '@tanstack/react-query';
import { agendaApi } from '@/lib/api';

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
  return useQuery<AgendaSummary>({
    queryKey: ['agenda', 'summary'],
    queryFn: async () => {
      const data = await agendaApi.getSummary();
      return {
        upcomingConsultations: data.upcomingConsultations.map((c: any) => ({
          ...c,
          consultationDate: new Date(c.consultationDate),
        })),
        medicationReminders: data.medicationReminders || [],
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

