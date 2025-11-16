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
      const data = await calendarApi.getEvents(
        startDate?.toISOString(),
        endDate?.toISOString(),
      );
      return data.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useGoogleCalendarConnected() {
  return useQuery<{ connected: boolean }>({
    queryKey: ['calendar', 'google-connected'],
    queryFn: async () => {
      return calendarApi.isGoogleConnected();
    },
    staleTime: 1000 * 60 * 10,
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

