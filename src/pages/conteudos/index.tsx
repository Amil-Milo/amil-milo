import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, BookOpen } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { ContentCard } from "@/components/conteudos/ContentCard";
import { CategoryFilter } from "@/components/conteudos/CategoryFilter";

export default function Conteudos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<
    number | undefined
  >(undefined);

  const {
    recommendations,
    allContents,
    isLoadingRecommendations,
    isLoadingAll,
  } = useContent();

  const filteredLibraryContents = useMemo(() => {
    let filtered = [...allContents];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (content) => content.category === selectedCategory
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(
        (content) => content.specialtyId === selectedSpecialty
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchLower) ||
          content.body.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [allContents, selectedCategory, selectedSpecialty, searchTerm]);

  const handleContentOpen = (content: any) => {
    console.log("Abrir conteúdo:", content);
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
        <Card className="p-4 md:p-6 mb-4 md:mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
            <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Conteúdos para Você
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
            Artigos e vídeos personalizados para sua saúde
          </p>

          {isLoadingRecommendations && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoadingRecommendations && recommendations.length > 0 && (
            <Card className="mb-4 md:mb-8 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="text-xl md:text-2xl">
                    Recomendado para Você
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Personalizado
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {recommendations.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onOpen={handleContentOpen}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoadingRecommendations && recommendations.length === 0 && (
            <Card className="mb-4 md:mb-8">
              <CardContent className="py-8 text-center">
                <p className="text-sm md:text-base text-muted-foreground">
                  Nenhuma recomendação disponível no momento. Complete seu
                  perfil para receber conteúdos personalizados.
                </p>
              </CardContent>
            </Card>
          )}
        </Card>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">
              Explorar Biblioteca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar conteúdos..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  selectedSpecialty={selectedSpecialty}
                  onCategoryChange={setSelectedCategory}
                  onSpecialtyChange={setSelectedSpecialty}
                />
              </div>
            </div>

            {isLoadingAll ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLibraryContents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredLibraryContents.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    onOpen={handleContentOpen}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum conteúdo encontrado para sua busca.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
