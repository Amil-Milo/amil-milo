import { useQuery } from "@tanstack/react-query";
import { contentApi } from "@/lib/api";

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
  const recommendationsQuery = useQuery<Content[]>({
    queryKey: ["contents", "recommendations"],
    queryFn: () => contentApi.getRecommendations(),
  });

  const allContentsQuery = useQuery<Content[]>({
    queryKey: ["contents", "all"],
    queryFn: () => contentApi.getAll(),
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
  return useQuery<Content[]>({
    queryKey: ["contents", "specialty", specialtyId],
    queryFn: () => contentApi.getBySpecialty(specialtyId),
    enabled: !!specialtyId,
  });
}

export function useContentByCategory(category: string) {
  return useQuery<Content[]>({
    queryKey: ["contents", "category", category],
    queryFn: () => contentApi.getByCategory(category),
    enabled: !!category,
  });
}

