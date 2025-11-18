import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
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
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | undefined>(undefined);

  const {
    recommendations,
    allContents,
    isLoadingRecommendations,
    isLoadingAll,
  } = useContent();

  const filteredLibraryContents = useMemo(() => {
    let filtered = [...allContents];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((content) => content.category === selectedCategory);
    }

    if (selectedSpecialty) {
      filtered = filtered.filter((content) => content.specialtyId === selectedSpecialty);
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
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 transition-all duration-300 min-w-0 overflow-x-auto" style={{ marginLeft: 'var(--content-margin-left, 72px)' }}>
        <Card className="p-6 mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
          <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Conteúdos para Você
          </h1>
          <p className="text-muted-foreground mb-6">
            Artigos e vídeos personalizados para sua saúde
          </p>

          {isLoadingRecommendations && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoadingRecommendations && recommendations.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Recomendado para Você</CardTitle>
                <Badge variant="secondary">Personalizado</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <Card className="mb-8">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma recomendação disponível no momento. Complete seu perfil para receber conteúdos personalizados.
              </p>
            </CardContent>
          </Card>
        )}

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Explorar Biblioteca</CardTitle>
            </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar conteúdos..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-shrink-0">
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </Card>
      </main>
    </div>
  );
}

