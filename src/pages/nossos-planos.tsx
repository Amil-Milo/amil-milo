import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NossosPlanos() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Nossos Planos
            </h1>
            <p className="text-xl text-white/90">
              Escolha o plano ideal para sua necessidade
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Conteúdo em Desenvolvimento
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Esta página está sendo preparada com informações detalhadas
                sobre nossos planos e opções disponíveis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contato">
                  <Button variant="outline" size="lg">
                    Entre em Contato
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg">Voltar ao Início</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

