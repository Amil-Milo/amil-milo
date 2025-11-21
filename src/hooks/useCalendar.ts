import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AxiosError } from 'axios';

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
      const startDateStr = startDate ? startDate.toISOString() : undefined;
      const endDateStr = endDate ? endDate.toISOString() : undefined;
      
      const response = await calendarApi.getEvents(startDateStr, endDateStr);
      return (response.data || response).map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
    },
  });
}

export function useGoogleCalendarConnected() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading && (user?.assignedLineId || user?.role === 'ADMIN'));
  
  return useQuery<{ connected: boolean }>({
    queryKey: ['calendar', 'google-connected'],
    queryFn: async () => {
      const response = await calendarApi.isGoogleConnected();
      return response.data || response;
    },
    enabled: shouldEnable,
  });
}

export function useSyncCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await calendarApi.sync();
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

