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
      // MODO DEMO - DADOS MOCKADOS
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(18, 0, 0, 0);

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(19, 30, 0, 0);

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      lastWeek.setHours(20, 0, 0, 0);

      const entries: DiaryEntry[] = [
        {
          id: 1,
          userId: 1,
          entryDate: yesterday,
          moodRating: 5,
          motivationRating: 4,
          goalsMet: true,
          feedbackText: "Dia produtivo! Consegui fazer caminhada e me alimentar bem.",
        },
        {
          id: 2,
          userId: 1,
          entryDate: twoDaysAgo,
          moodRating: 3,
          motivationRating: 3,
          goalsMet: false,
          feedbackText: "Dia mais difícil, mas não desisti.",
        },
        {
          id: 3,
          userId: 1,
          entryDate: lastWeek,
          moodRating: 4,
          motivationRating: 5,
          goalsMet: true,
          feedbackText: "Excelente semana! Me sinto mais disposto.",
        },
      ];

      return {
        entries: entries.slice((page - 1) * limit, page * limit),
        total: entries.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(entries.length / limit),
      };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useTodayEntry() {
  return useQuery<{ entry: DiaryEntry | null }>({
    queryKey: ['diary', 'today'],
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      const today = new Date();
      today.setHours(18, 0, 0, 0);

      return {
        entry: {
          id: 4,
          userId: 1,
          entryDate: today,
          moodRating: 4,
          motivationRating: 4,
          goalsMet: true,
          feedbackText: "Dia positivo! Seguindo o plano de saúde.",
        },
      };
    },
    staleTime: Infinity,
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
      // MODO DEMO - DADOS MOCKADOS
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);

      return {
        shouldShow: true,
        nextConsultation: {
          id: 1,
          professionalName: "Dr. Carlos Silva",
          specialty: "Cardiologia",
          consultationDate: tomorrow,
          location: "Hospital Amil - Unidade Centro",
        },
        message: "Lembre-se de preencher seu diário antes da consulta!",
      };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

