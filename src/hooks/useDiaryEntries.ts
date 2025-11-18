import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface DiaryEntry {
  id: number;
  userId: number;
  entryDate: Date;
  moodRating: number | null;
  motivationRating: number | null;
  goalsMet: boolean | null;
  feedbackText: string | null;
}

export interface DiaryEntriesResponse {
  entries: DiaryEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useDiaryEntries(page: number = 1, limit: number = 20) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  return useQuery<DiaryEntriesResponse>({
    queryKey: ['diary', 'entries', page, limit],
    queryFn: async () => {
      return await diaryApi.getEntries(page, limit);
    },
    enabled: isAuthenticated && !authLoading,
  });
}

export function useTodayEntry() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  return useQuery<{ entry: DiaryEntry | null }>({
    queryKey: ['diary', 'today'],
    queryFn: async () => {
      return await diaryApi.getTodayEntry();
    },
    enabled: isAuthenticated && !authLoading,
  });
}

export interface CreateDiaryEntryDTO {
  moodRating?: number;
  motivationRating?: number;
  goalsMet?: boolean;
  feedbackText?: string;
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDiaryEntryDTO) => diaryApi.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary'] });
    },
  });
}

export function useUpdateDiaryEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDiaryEntryDTO }) =>
      diaryApi.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary'] });
    },
  });
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => diaryApi.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary'] });
    },
  });
}

export interface ShouldShowDiaryResponse {
  shouldShow: boolean;
  nextConsultation?: {
    id: number;
    professionalName: string;
    specialty: string;
    consultationDate: Date;
    location: string;
  } | null;
  message?: string;
}

export function useShouldShowDiary() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  return useQuery<ShouldShowDiaryResponse>({
    queryKey: ['diary', 'should-show'],
    queryFn: async () => {
      return await diaryApi.shouldShowDiary();
    },
    enabled: isAuthenticated && !authLoading,
  });
}

