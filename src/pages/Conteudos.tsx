import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Heart,
  Activity,
  Utensils,
  Brain,
  Search,
  Play,
  Clock,
} from "lucide-react";

const categories = [
  { name: "Todos", icon: BookOpen },
  { name: "Cardiologia", icon: Heart },
  { name: "Exercícios", icon: Activity },
  { name: "Alimentação", icon: Utensils },
  { name: "Saúde Mental", icon: Brain },
];

const contents = [
  {
    id: 1,
    titulo: "Como funciona sua pressão arterial",
    categoria: "Cardiologia",
    tipo: "artigo",
    duracao: "5 min",
    icon: Heart,
    descricao:
      "Entenda o que significam os números da sua pressão e por que é importante controlá-la",
    visualizado: true,
  },
  {
    id: 2,
    titulo: "Exercícios seguros para hipertensos",
    categoria: "Exercícios",
    tipo: "vídeo",
    duracao: "8 min",
    icon: Activity,
    descricao:
      "Aprenda exercícios que você pode fazer em casa para fortalecer o coração",
    visualizado: false,
  },
  {
    id: 3,
    titulo: "Regra do prato colorido",
    categoria: "Alimentação",
    tipo: "artigo",
    duracao: "4 min",
    icon: Utensils,
    descricao:
      "Monte seu prato de forma equilibrada com essa técnica simples e eficaz",
    visualizado: false,
  },
  {
    id: 4,
    titulo: "Técnicas de respiração para ansiedade",
    categoria: "Saúde Mental",
    tipo: "vídeo",
    duracao: "6 min",
    icon: Brain,
    descricao:
      "Exercícios práticos de respiração para momentos de estresse",
    visualizado: false,
  },
  {
    id: 5,
    titulo: "Sal oculto nos alimentos",
    categoria: "Alimentação",
    tipo: "artigo",
    duracao: "3 min",
    icon: Utensils,
    descricao:
      "Descubra onde se esconde o sal que você não vê e como evitá-lo",
    visualizado: true,
  },
  {
    id: 6,
    titulo: "Sinais de alerta do coração",
    categoria: "Cardiologia",
    tipo: "artigo",
    duracao: "7 min",
    icon: Heart,
    descricao:
      "Saiba reconhecer os sintomas que merecem atenção imediata",
    visualizado: false,
  },
];

export default function Conteudos() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContents = contents.filter((content) => {
    const matchesCategory =
      selectedCategory === "Todos" || content.categoria === selectedCategory;
    const matchesSearch =
      content.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Conteúdos para Você
          </h1>
          <p className="text-muted-foreground">
            Artigos e vídeos personalizados para sua saúde
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar conteúdos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.name}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Featured Content */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
          <Badge className="mb-3">Recomendado para você</Badge>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Como a Losartana protege seu coração
              </h2>
              <p className="text-muted-foreground mb-4">
                Entenda como funciona o medicamento que você usa todos os dias e
                por que é tão importante tomá-lo regularmente.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">Artigo</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />6 min
                </span>
              </div>
              <Button className="bg-gradient-primary">Ler Agora</Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => {
            const IconComponent = content.icon;
            return (
              <Card key={content.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {content.categoria}
                      </Badge>
                      {content.visualizado && (
                        <Badge className="text-xs bg-success">
                          Visualizado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {content.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {content.descricao}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {content.duracao}
                    </span>
                    <Button size="sm" variant="ghost">
                      {content.tipo === "vídeo" ? (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Assistir
                        </>
                      ) : (
                        "Ler"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredContents.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum conteúdo encontrado para sua busca.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
