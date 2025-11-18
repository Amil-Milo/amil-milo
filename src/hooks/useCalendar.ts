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
      const startDateStr = startDate?.toISOString();
      const endDateStr = endDate?.toISOString();
      return await calendarApi.getEvents(startDateStr, endDateStr);
    },
  });
}

export function useGoogleCalendarConnected() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  return useQuery<{ connected: boolean }>({
    queryKey: ['calendar', 'google-connected'],
    queryFn: async () => {
      return await calendarApi.isGoogleConnected();
    },
    enabled: isAuthenticated && !authLoading && (user?.assignedLineId || user?.role === 'ADMIN'),
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403 || axiosError.response?.status === 404 || axiosError.code === 'ERR_NETWORK' || axiosError.response?.status === 502) {
        return false;
      }
      return failureCount < 3;
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

