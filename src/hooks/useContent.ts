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
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      return [
        {
          id: 1,
          title: "Alimentação Saudável para o Coração",
          body: "Descubra como uma alimentação balanceada pode melhorar a saúde cardiovascular...",
          durationMinutes: 15,
          mediaType: "VIDEO" as const,
          category: "Nutrição",
          difficulty: "BEGINNER" as const,
          specialtyId: 1,
          specialty: {
            id: 1,
            name: "Cardiologia",
          },
        },
        {
          id: 2,
          title: "Exercícios para Hipertensos",
          body: "Guia completo de exercícios físicos seguros para pessoas com hipertensão...",
          durationMinutes: 20,
          mediaType: "TEXT" as const,
          category: "Exercício",
          difficulty: "BEGINNER" as const,
          specialtyId: 1,
          specialty: {
            id: 1,
            name: "Cardiologia",
          },
        },
      ];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const allContentsQuery = useQuery<Content[]>({
    queryKey: ["contents", "all"],
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      return [
        {
          id: 1,
          title: "Alimentação Saudável para o Coração",
          body: "Descubra como uma alimentação balanceada pode melhorar a saúde cardiovascular...",
          durationMinutes: 15,
          mediaType: "VIDEO" as const,
          category: "Nutrição",
          difficulty: "BEGINNER" as const,
          specialtyId: 1,
          specialty: {
            id: 1,
            name: "Cardiologia",
          },
        },
        {
          id: 2,
          title: "Exercícios para Hipertensos",
          body: "Guia completo de exercícios físicos seguros para pessoas com hipertensão...",
          durationMinutes: 20,
          mediaType: "TEXT" as const,
          category: "Exercício",
          difficulty: "BEGINNER" as const,
          specialtyId: 1,
          specialty: {
            id: 1,
            name: "Cardiologia",
          },
        },
        {
          id: 3,
          title: "Meditação e Redução de Estresse",
          body: "Técnicas de meditação para reduzir o estresse e melhorar o bem-estar...",
          durationMinutes: 25,
          mediaType: "AUDIO" as const,
          category: "Bem-estar",
          difficulty: "ADVANCED" as const,
          specialtyId: 2,
          specialty: {
            id: 2,
            name: "Saúde Mental",
          },
        },
        {
          id: 4,
          title: "Importância do Sono na Saúde",
          body: "Entenda como uma boa noite de sono impacta positivamente sua saúde...",
          durationMinutes: 12,
          mediaType: "TEXT" as const,
          category: "Bem-estar",
          difficulty: "BEGINNER" as const,
          specialtyId: 3,
          specialty: {
            id: 3,
            name: "Clínica Geral",
          },
        },
      ];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    recommendations: recommendationsQuery.data || [],
    allContents: allContentsQuery.data || [],
    isLoadingRecommendations: false,
    isLoadingAll: false,
    isErrorRecommendations: false,
    isErrorAll: false,
    refetchRecommendations: recommendationsQuery.refetch,
    refetchAll: allContentsQuery.refetch,
  };
}

export function useContentBySpecialty(specialtyId: number) {
  return useQuery<Content[]>({
    queryKey: ["contents", "specialty", specialtyId],
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      return [
        {
          id: 1,
          title: "Alimentação Saudável para o Coração",
          body: "Descubra como uma alimentação balanceada pode melhorar a saúde cardiovascular...",
          durationMinutes: 15,
          mediaType: "VIDEO" as const,
          category: "Nutrição",
          difficulty: "BEGINNER" as const,
          specialtyId: specialtyId,
          specialty: {
            id: specialtyId,
            name: "Cardiologia",
          },
        },
      ];
    },
    enabled: !!specialtyId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useContentByCategory(category: string) {
  return useQuery<Content[]>({
    queryKey: ["contents", "category", category],
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      return [
        {
          id: 1,
          title: "Conteúdo de Exemplo",
          body: "Este é um conteúdo de exemplo para a categoria selecionada...",
          durationMinutes: 10,
          mediaType: "TEXT" as const,
          category: category,
          difficulty: "BEGINNER" as const,
          specialtyId: 1,
          specialty: {
            id: 1,
            name: "Cardiologia",
          },
        },
      ];
    },
    enabled: !!category,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

