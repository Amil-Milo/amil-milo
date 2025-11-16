import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryApi } from '@/lib/api';

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
  return useQuery<DiaryEntriesResponse>({
    queryKey: ['diary', 'entries', page, limit],
    queryFn: async () => {
      const data = await diaryApi.getEntries(page, limit);
      return {
        ...data,
        entries: data.entries.map((entry: any) => ({
          ...entry,
          entryDate: new Date(entry.entryDate),
        })),
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useTodayEntry() {
  return useQuery<{ entry: DiaryEntry | null }>({
    queryKey: ['diary', 'today'],
    queryFn: async () => {
      const data = await diaryApi.getTodayEntry();
      if (data.entry) {
        return {
          entry: {
            ...data.entry,
            entryDate: new Date(data.entry.entryDate),
          },
        };
      }
      return { entry: null };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
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
  return useQuery<ShouldShowDiaryResponse>({
    queryKey: ['diary', 'should-show'],
    queryFn: async () => {
      const data = await diaryApi.shouldShowDiary();
      if (data.nextConsultation) {
        return {
          ...data,
          nextConsultation: {
            ...data.nextConsultation,
            consultationDate: new Date(data.nextConsultation.consultationDate),
          },
        };
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

