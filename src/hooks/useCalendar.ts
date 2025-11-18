import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '@/lib/api';

export interface CalendarEvent {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  type: 'CONSULTATION' | 'MEDICATION' | 'EXAM' | 'REMINDER' | 'OTHER';
  location: string | null;
}

export function useCalendar(startDate?: Date, endDate?: Date) {
  return useQuery<CalendarEvent[]>({
    queryKey: ['calendar', 'events', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(10, 30, 0, 0);

      const medicationDate1 = new Date(tomorrow);
      medicationDate1.setHours(8, 0, 0, 0);
      const medicationDate1End = new Date(medicationDate1);
      medicationDate1End.setHours(8, 30, 0, 0);

      const medicationDate2 = new Date(tomorrow);
      medicationDate2.setHours(20, 0, 0, 0);
      const medicationDate2End = new Date(medicationDate2);
      medicationDate2End.setHours(20, 30, 0, 0);

      const events: CalendarEvent[] = [
        {
          id: 1,
          userId: 1,
          title: "Consulta - Dr. Carlos Silva",
          description: "Consulta de acompanhamento",
          startDate: tomorrow,
          endDate: new Date(tomorrow.getTime() + 60 * 60 * 1000),
          type: 'CONSULTATION',
          location: "Hospital Amil - Unidade Centro",
        },
        {
          id: 2,
          userId: 1,
          title: "Consulta - Dra. Ana Paula Santos",
          description: "Avaliação nutricional",
          startDate: nextWeek,
          endDate: new Date(nextWeek.getTime() + 60 * 60 * 1000),
          type: 'CONSULTATION',
          location: "Clínica Amil - Unidade Jardins",
        },
        {
          id: 3,
          userId: 1,
          title: "Losartana 50mg",
          description: "Tomar com água",
          startDate: medicationDate1,
          endDate: medicationDate1End,
          type: 'MEDICATION',
          location: null,
        },
        {
          id: 4,
          userId: 1,
          title: "AAS 100mg",
          description: "Após o jantar",
          startDate: medicationDate2,
          endDate: medicationDate2End,
          type: 'MEDICATION',
          location: null,
        },
      ];

      return events.filter(event => {
        if (!startDate || !endDate) return true;
        return event.startDate >= startDate && event.startDate <= endDate;
      });
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useGoogleCalendarConnected() {
  return useQuery<{ connected: boolean }>({
    queryKey: ['calendar', 'google-connected'],
    queryFn: async () => {
      // MODO DEMO - SEMPRE DESCONECTADO
      return { connected: false };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useSyncCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return calendarApi.sync();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

