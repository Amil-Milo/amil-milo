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
      // MODO DEMO - DADOS MOCKADOS
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(10, 30, 0, 0);

      return {
        upcomingConsultations: [
          {
            id: 1,
            professionalName: "Dr. Carlos Silva",
            specialty: "Cardiologia",
            consultationDate: tomorrow,
            location: "Hospital Amil - Unidade Centro",
            status: "SCHEDULED",
            notes: "Consulta de acompanhamento",
            googleEventId: null,
          },
          {
            id: 2,
            professionalName: "Dra. Ana Paula Santos",
            specialty: "Nutrição",
            consultationDate: nextWeek,
            location: "Clínica Amil - Unidade Jardins",
            status: "SCHEDULED",
            notes: "Avaliação nutricional",
            googleEventId: null,
          },
        ],
        medicationReminders: [
          {
            name: "Losartana 50mg",
            time: "08:00",
            notes: "Tomar com água",
          },
          {
            name: "AAS 100mg",
            time: "20:00",
            notes: "Após o jantar",
          },
        ],
      };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

