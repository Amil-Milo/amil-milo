import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Heart,
  Activity,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import heroImage from "@/assets/hero-health.jpg";
import miloFront from "@/assets/milo-front.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="container relative mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Sua jornada de saúde, guiada por quem cuida de você
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Conheça o Programa Cuidadosmil: acompanhamento personalizado,
                orientações práticas e o Milo ao seu lado todos os dias.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cadastro">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 text-lg px-8"
                  >
                    Começar Agora
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 text-lg px-8"
                  >
                    Já sou participante
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Pessoas saudáveis"
                className="rounded-2xl shadow-strong"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conheça o Milo */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-card rounded-2xl p-8 shadow-medium">
              <img
                src={miloFront}
                alt="Milo"
                className="w-48 h-48 object-contain"
              />
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Conheça o Milo
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Milo é seu assistente virtual de saúde! Ele vai acompanhar sua
                  jornada, enviar lembretes carinhosos, compartilhar dicas
                  personalizadas e comemorar cada conquista ao seu lado.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                    <CheckCircle2 className="h-5 w-5" />
                    Acompanhamento personalizado
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                    <CheckCircle2 className="h-5 w-5" />
                    Disponível 24/7
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                    <CheckCircle2 className="h-5 w-5" />
                    Linguagem acessível
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Como o programa funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Um acompanhamento completo para você cuidar melhor da sua saúde
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Acompanhamento Contínuo</h3>
              <p className="text-muted-foreground">
                Check-ins periódicos para monitorar sua saúde e ajustar o plano
                quando necessário
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-secondary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Agenda Inteligente</h3>
              <p className="text-muted-foreground">
                Lembretes de consultas, medicações e exames, tudo organizado em um
                só lugar
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Conteúdos Personalizados</h3>
              <p className="text-muted-foreground">
                Artigos, vídeos e dicas adaptados à sua condição de saúde e
                interesses
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-secondary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Diário de Saúde</h3>
              <p className="text-muted-foreground">
                Registre sintomas, humor e rotina para ajudar seu médico a te
                conhecer melhor
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gamificação</h3>
              <p className="text-muted-foreground">
                Conquiste selos, mantenha sequências e celebre cada progresso na
                sua jornada
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-secondary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Evolução Visível</h3>
              <p className="text-muted-foreground">
                Acompanhe seu progresso com gráficos e relatórios simples de
                entender
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-health">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Entre para o Programa Cuidadosmil e tenha o Milo ao seu lado todos
              os dias
            </p>
            <Link to="/cadastro">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-12"
              >
                Começar Agora - É Gratuito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary fill-primary" />
                <span className="text-xl font-bold text-primary">amil</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cuidando da sua saúde com tecnologia e carinho
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Programa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/sobre" className="hover:text-primary">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link to="/planos" className="hover:text-primary">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-primary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/contato" className="hover:text-primary">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link to="/ajuda" className="hover:text-primary">
                    Central de Ajuda
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacidade" className="hover:text-primary">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/termos" className="hover:text-primary">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 Amil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
