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
      const startDateStr = startDate?.toISOString();
      const endDateStr = endDate?.toISOString();
      return await calendarApi.getEvents(startDateStr, endDateStr);
    },
  });
}

export function useGoogleCalendarConnected() {
  return useQuery<{ connected: boolean }>({
    queryKey: ['calendar', 'google-connected'],
    queryFn: async () => {
      return await calendarApi.isGoogleConnected();
    },
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

