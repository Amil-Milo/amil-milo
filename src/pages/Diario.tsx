import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { BookOpen, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function Diario() {
  const [formData, setFormData] = useState({
    bemEstar: [5],
    motivacao: [5],
    dor: [0],
    sono: [5],
    sintomas: "",
    observacoes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registro salvo com sucesso! Continue assim!");
    // Reset form
    setFormData({
      bemEstar: [5],
      motivacao: [5],
      dor: [0],
      sono: [5],
      sintomas: "",
      observacoes: "",
    });
  };

  const recentEntries = [
    {
      data: "2024-11-20",
      bemEstar: 7,
      motivacao: 8,
      resumo: "Me senti bem, fiz caminhada",
    },
    {
      data: "2024-11-18",
      bemEstar: 6,
      motivacao: 6,
      resumo: "Dia normal, dormi bem",
    },
    {
      data: "2024-11-15",
      bemEstar: 8,
      motivacao: 9,
      resumo: "Ótimo dia! Muita energia",
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Diário de Saúde
          </h1>
          <p className="text-muted-foreground">
            Registre como você está se sentindo hoje
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <Card className="md:col-span-2 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Novo Registro
                </h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">
                    Como está seu bem-estar geral hoje?
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Baixo</span>
                    <Slider
                      value={formData.bemEstar}
                      onValueChange={(value) =>
                        setFormData({ ...formData, bemEstar: value })
                      }
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Alto</span>
                    <span className="text-sm font-medium min-w-[2rem] text-center">
                      {formData.bemEstar[0]}/10
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Como está sua motivação hoje?
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Baixa</span>
                    <Slider
                      value={formData.motivacao}
                      onValueChange={(value) =>
                        setFormData({ ...formData, motivacao: value })
                      }
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Alta</span>
                    <span className="text-sm font-medium min-w-[2rem] text-center">
                      {formData.motivacao[0]}/10
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Nível de dor (se houver)
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Nenhuma</span>
                    <Slider
                      value={formData.dor}
                      onValueChange={(value) =>
                        setFormData({ ...formData, dor: value })
                      }
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Intensa</span>
                    <span className="text-sm font-medium min-w-[2rem] text-center">
                      {formData.dor[0]}/10
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Qualidade do sono na última noite
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Ruim</span>
                    <Slider
                      value={formData.sono}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sono: value })
                      }
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Ótima</span>
                    <span className="text-sm font-medium min-w-[2rem] text-center">
                      {formData.sono[0]}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sintomas">
                  Sintomas ou sensações específicas
                </Label>
                <Input
                  id="sintomas"
                  placeholder="Ex: dor de cabeça leve, cansaço..."
                  value={formData.sintomas}
                  onChange={(e) =>
                    setFormData({ ...formData, sintomas: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">
                  Observações adicionais (opcional)
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Conte mais sobre como foi seu dia, alimentação, atividades..."
                  rows={4}
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                Salvar Registro
              </Button>
            </form>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Entries */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Registros Recentes
                </h3>
              </div>
              <div className="space-y-3">
                {recentEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="pb-3 border-b border-border last:border-0"
                  >
                    <p className="text-sm font-medium text-foreground mb-1">
                      {new Date(entry.data).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex gap-3 text-xs text-muted-foreground mb-1">
                      <span>Bem-estar: {entry.bemEstar}/10</span>
                      <span>Motivação: {entry.motivacao}/10</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {entry.resumo}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                Ver Histórico Completo
              </Button>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-secondary-light">
              <h3 className="font-semibold text-foreground mb-3">
                💡 Dica do Milo
              </h3>
              <p className="text-sm text-muted-foreground">
                Registros regulares ajudam você e seu médico a identificar
                padrões e ajustar o tratamento. Tente fazer pelo menos 3
                registros por semana!
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
