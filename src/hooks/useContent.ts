import { useQuery } from "@tanstack/react-query";
import { contentApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface Content {
  id: number;
  title: string;
  body: string;
  durationMinutes: number;
  mediaType: "TEXT" | "VIDEO" | "AUDIO";
  category: string;
  difficulty: "BEGINNER" | "ADVANCED";
  specialtyId: number;
  specialty?: {
    id: number;
    name: string;
  };
}

export function useContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const recommendationsQuery = useQuery<Content[]>({
    queryKey: ["contents", "recommendations"],
    queryFn: async () => {
      return await contentApi.getRecommendations();
    },
    enabled: isAuthenticated && !authLoading,
  });

  const allContentsQuery = useQuery<Content[]>({
    queryKey: ["contents", "all"],
    queryFn: async () => {
      return await contentApi.getAll();
    },
    enabled: isAuthenticated && !authLoading,
  });

  return {
    recommendations: recommendationsQuery.data || [],
    allContents: allContentsQuery.data || [],
    isLoadingRecommendations: recommendationsQuery.isLoading,
    isLoadingAll: allContentsQuery.isLoading,
    isErrorRecommendations: recommendationsQuery.isError,
    isErrorAll: allContentsQuery.isError,
    refetchRecommendations: recommendationsQuery.refetch,
    refetchAll: allContentsQuery.refetch,
  };
}

export function useContentBySpecialty(specialtyId: number) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  return useQuery<Content[]>({
    queryKey: ["contents", "specialty", specialtyId],
    queryFn: async () => {
      return await contentApi.getBySpecialty(specialtyId);
    },
    enabled: isAuthenticated && !authLoading && !!specialtyId,
  });
}

export function useContentByCategory(category: string) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  return useQuery<Content[]>({
    queryKey: ["contents", "category", category],
    queryFn: async () => {
      return await contentApi.getByCategory(category);
    },
    enabled: isAuthenticated && !authLoading && !!category,
  });
}

