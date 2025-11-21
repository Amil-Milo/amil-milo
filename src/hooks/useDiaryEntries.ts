import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AxiosError } from 'axios';

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

const getLocalStorageEntries = (): DiaryEntry[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('diary_entries');
  if (!stored) return [];
  try {
    const entries = JSON.parse(stored);
    return entries.map((entry: any) => ({
      ...entry,
      entryDate: new Date(entry.entryDate),
    }));
  } catch {
    return [];
  }
};

const saveLocalStorageEntry = (entry: DiaryEntry) => {
  if (typeof window === 'undefined') return;
  const entries = getLocalStorageEntries();
  const existingIndex = entries.findIndex(e => {
    const entryDate = new Date(e.entryDate).toDateString();
    const newEntryDate = new Date(entry.entryDate).toDateString();
    return entryDate === newEntryDate;
  });
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  
  entries.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  localStorage.setItem('diary_entries', JSON.stringify(entries));
};

export function useDiaryEntries(page: number = 1, limit: number = 20) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading);
  
  return useQuery<DiaryEntriesResponse>({
    queryKey: ['diary', 'entries', page, limit],
    queryFn: async () => {
      try {
        const response = await diaryApi.getEntries(page, limit);
        const apiEntries = response.entries?.map((entry: any) => ({
          ...entry,
          entryDate: new Date(entry.entryDate),
        })) || [];
        
        const localStorageEntries = getLocalStorageEntries();
        const allEntries = [...apiEntries, ...localStorageEntries];
        
        const uniqueEntries = allEntries.reduce((acc, entry) => {
          const entryDateStr = new Date(entry.entryDate).toDateString();
          const existing = acc.find(e => new Date(e.entryDate).toDateString() === entryDateStr);
          if (!existing) {
            acc.push(entry);
          } else {
            const index = acc.indexOf(existing);
            if (entry.id > existing.id || (entry.id > 1000 && existing.id < 1000)) {
              acc[index] = entry;
            }
          }
          return acc;
        }, [] as DiaryEntry[]);
        
        uniqueEntries.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
        
        return {
          entries: uniqueEntries.slice((page - 1) * limit, page * limit),
          total: uniqueEntries.length,
          page,
          limit,
          totalPages: Math.ceil(uniqueEntries.length / limit),
        };
      } catch (error) {
        const localStorageEntries = getLocalStorageEntries();
        return {
          entries: localStorageEntries.slice((page - 1) * limit, page * limit),
          total: localStorageEntries.length,
          page,
          limit,
          totalPages: Math.ceil(localStorageEntries.length / limit),
        };
      }
    },
    enabled: shouldEnable,
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403 || axiosError.response?.status === 404 || axiosError.code === 'ERR_NETWORK' || axiosError.response?.status === 502) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useTodayEntry() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading);
  
  return useQuery<{ entry: DiaryEntry | null }>({
    queryKey: ['diary', 'today'],
    queryFn: async () => {
      try {
        const response = await diaryApi.getTodayEntry();
        if (response.entry) {
          return {
            entry: {
              ...response.entry,
              entryDate: new Date(response.entry.entryDate),
            },
          };
        }
      } catch (error) {
        // Fallback to localStorage
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const localStorageEntries = getLocalStorageEntries();
      const todayEntry = localStorageEntries.find(entry => {
        const entryDate = new Date(entry.entryDate);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });
      
      return {
        entry: todayEntry || null,
      };
    },
    enabled: shouldEnable,
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
    mutationFn: async (data: CreateDiaryEntryDTO) => {
      try {
        const response = await diaryApi.createEntry(data);
        return {
          ...response,
          entryDate: new Date(response.entryDate),
        };
      } catch (error) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const newEntry: DiaryEntry = {
          id: Date.now(),
          userId: 1,
          entryDate: today,
          moodRating: data.moodRating ?? null,
          motivationRating: data.motivationRating ?? null,
          goalsMet: data.goalsMet ?? null,
          feedbackText: data.feedbackText ?? null,
        };
        
        saveLocalStorageEntry(newEntry);
        return newEntry;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary'] });
    },
  });
}

export function useUpdateDiaryEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateDiaryEntryDTO }) => {
      try {
        const response = await diaryApi.updateEntry(id, data);
        return {
          ...response,
          entryDate: new Date(response.entryDate),
        };
      } catch (error) {
        const localStorageEntries = getLocalStorageEntries();
        const existingEntry = localStorageEntries.find(e => e.id === id);
        
        if (existingEntry) {
          const updatedEntry: DiaryEntry = {
            ...existingEntry,
            moodRating: data.moodRating ?? existingEntry.moodRating,
            motivationRating: data.motivationRating ?? existingEntry.motivationRating,
            goalsMet: data.goalsMet ?? existingEntry.goalsMet,
            feedbackText: data.feedbackText ?? existingEntry.feedbackText,
          };
          
          saveLocalStorageEntry(updatedEntry);
          return updatedEntry;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const newEntry: DiaryEntry = {
          id,
          userId: 1,
          entryDate: today,
          moodRating: data.moodRating ?? null,
          motivationRating: data.motivationRating ?? null,
          goalsMet: data.goalsMet ?? null,
          feedbackText: data.feedbackText ?? null,
        };
        
        saveLocalStorageEntry(newEntry);
        return newEntry;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary'] });
    },
  });
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (typeof window !== 'undefined') {
        const entries = getLocalStorageEntries();
        const filtered = entries.filter(e => e.id !== id);
        localStorage.setItem('diary_entries', JSON.stringify(filtered));
      }
      
      return { id };
    },
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
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading);
  
  return useQuery<ShouldShowDiaryResponse>({
    queryKey: ['diary', 'should-show'],
    queryFn: async () => {
      const response = await diaryApi.shouldShowDiary();
      const data = response.data || response;
      return {
        ...data,
        nextConsultation: data.nextConsultation ? {
          ...data.nextConsultation,
          consultationDate: new Date(data.nextConsultation.consultationDate),
        } : null,
      };
    },
    enabled: shouldEnable,
  });
}

