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
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading);
  
  const recommendationsQuery = useQuery<Content[]>({
    queryKey: ["contents", "recommendations"],
    queryFn: async () => {
      const response = await contentApi.getRecommendations();
      return response.data || response;
    },
    enabled: shouldEnable,
  });

  const allContentsQuery = useQuery<Content[]>({
    queryKey: ["contents", "all"],
    queryFn: async () => {
      const response = await contentApi.getAll();
      return response.data || response;
    },
    enabled: shouldEnable,
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
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading && !!specialtyId);
  
  return useQuery<Content[]>({
    queryKey: ["contents", "specialty", specialtyId],
    queryFn: async () => {
      const response = await contentApi.getBySpecialty(specialtyId);
      return response.data || response;
    },
    enabled: shouldEnable,
  });
}

export function useContentByCategory(category: string) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const shouldEnable = Boolean(isAuthenticated && !authLoading && !!category);
  
  return useQuery<Content[]>({
    queryKey: ["contents", "category", category],
    queryFn: async () => {
      const response = await contentApi.getByCategory(category);
      return response.data || response;
    },
    enabled: shouldEnable,
  });
}

