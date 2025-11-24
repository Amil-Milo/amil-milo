import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import {
  Heart,
  Activity,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import miloFront from "@/assets/milo-front.png";

export default function Landing() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroCarousel />

      <ServicesSection />

      <section id="milo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#003B71] mb-4">
                Conheça o Milo
              </h2>
              <p className="text-xl text-gray-600">
                Seu assistente virtual de saúde, sempre ao seu lado
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-shrink-0">
                <img
                  src={miloFront}
                  alt="Milo"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-[#003B71] mb-4">
                  Quem é o Milo?
                </h3>
                <p className="text-base md:text-lg text-gray-600 mb-6">
                  Milo é seu assistente virtual de saúde! Ele vai acompanhar sua
                  jornada, enviar lembretes carinhosos, compartilhar dicas
                  personalizadas e comemorar cada conquista ao seu lado.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#461BFF]">
                    <CheckCircle2 className="h-5 w-5 text-[#461BFF]" />
                    Acompanhamento personalizado
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#461BFF]">
                    <CheckCircle2 className="h-5 w-5 text-[#461BFF]" />
                    Disponível 24/7
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#461BFF]">
                    <CheckCircle2 className="h-5 w-5 text-[#461BFF]" />
                    Linguagem acessível
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="program" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#003B71] mb-4">
              Como o programa funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Um acompanhamento completo para você cuidar melhor da sua saúde
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md">
              <div className="w-16 h-16 bg-[#461BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003B71] mb-3">
                Acompanhamento Contínuo
              </h3>
              <p className="text-gray-600">
                Check-ins periódicos para monitorar sua saúde e ajustar o plano
                quando necessário
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md">
              <div className="w-16 h-16 bg-[#461BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003B71] mb-3">
                Agenda Inteligente
              </h3>
              <p className="text-gray-600">
                Lembretes de consultas, medicações e exames, tudo organizado em
                um só lugar
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md">
              <div className="w-16 h-16 bg-[#461BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003B71] mb-3">
                Conteúdos Personalizados
              </h3>
              <p className="text-gray-600">
                Artigos, vídeos e dicas adaptados à sua condição de saúde e
                interesses
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md">
              <div className="w-16 h-16 bg-[#461BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003B71] mb-3">
                Diário de Saúde
              </h3>
              <p className="text-gray-600">
                Registre sintomas, humor e rotina para ajudar seu médico a te
                conhecer melhor
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md">
              <div className="w-16 h-16 bg-[#461BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003B71] mb-3">
                Conquistas
              </h3>
              <p className="text-gray-600">
                Conquiste selos, mantenha sequências e celebre cada progresso na
                sua jornada
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow border border-gray-200 rounded-xl hover:border-[#461BFF] hover:shadow-md">
              <div className="w-16 h-16 bg-[#461BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003B71] mb-3">
                Evolução Visível
              </h3>
              <p className="text-gray-600">
                Acompanhe seu progresso com gráficos e relatórios simples de
                entender
              </p>
            </Card>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#F0F0F0] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#003B71] mb-2">
                Amil
              </h3>
              <div className="h-px bg-[#003B71] w-16 mb-6"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button
                      onClick={() => scrollToSection("about")}
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Sobre
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/contato"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Contato
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/contato"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Contato
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("milo")}
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Conheça o Milo
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/privacidade"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/termos"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Termos de Uso
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-300 text-center">
              <p className="text-xs text-gray-600">
                © 2024 Amil. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
