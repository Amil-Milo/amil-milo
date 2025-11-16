import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Target,
  Users,
  TrendingUp,
  Calendar,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Sparkles,
  Brain,
  Shield,
  HelpCircle,
  MapPin,
} from "lucide-react";
import miloFront from "@/assets/milo-front.jpg";

export default function SobrePrograma() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Programa Cuidadosmil
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Transformando o cuidado com a saúde através de tecnologia,
              personalização e acompanhamento humanizado
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                O Desafio da Baixa Adesão
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                A baixa adesão aos tratamentos e programas de cuidado é um dos
                maiores desafios da saúde moderna. Muitos pacientes abandonam
                seus planos de tratamento, não seguem as orientações médicas ou
                perdem o acompanhamento necessário.
              </p>
              <p className="text-lg text-muted-foreground">
                O Programa Cuidadosmil foi criado para enfrentar esse desafio,
                oferecendo uma solução completa que combina tecnologia,
                personalização e acompanhamento contínuo para garantir que cada
                paciente receba o cuidado adequado no momento certo.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Triagem Inteligente
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Utilizamos questionários periódicos e análise de dados para
                  identificar pacientes que precisam de atenção especial,
                  garantindo que o cuidado seja direcionado para quem mais
                  precisa.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Gatilhos Personalizados
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  O sistema identifica automaticamente situações que requerem
                  intervenção, como atrasos em consultas, mudanças nos
                  sintomas, ou necessidade de ajustes no tratamento.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Conheça o Milo
              </h2>
              <p className="text-xl text-muted-foreground">
                Seu assistente virtual de saúde, sempre ao seu lado
              </p>
            </div>

            <Card className="p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={miloFront}
                    alt="Milo"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Quem é o Milo?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    O Milo é uma coruja inteligente, seu assistente virtual de
                    saúde. Ele foi criado com base em princípios de psicologia
                    comportamental e design de experiência do usuário para ser
                    mais do que um chatbot - ele é seu companheiro na jornada de
                    saúde.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-2">
                      <Brain className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Inteligência Emocional
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Compreende suas necessidades e sentimentos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Sempre Disponível
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Disponível 24/7 para te ajudar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2">
                  Apresentação Pessoal
                </h4>
                <p className="text-sm text-muted-foreground">
                  O Milo se apresenta após seu cadastro, criando uma conexão
                  imediata e acolhedora
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2">
                  Respostas às FAQs
                </h4>
                <p className="text-sm text-muted-foreground">
                  Tire suas dúvidas sobre o programa, funcionalidades e
                  cuidados de saúde
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2">
                  Tour Inicial
                </h4>
                <p className="text-sm text-muted-foreground">
                  Guia você em um tour completo pela plataforma, mostrando
                  todas as funcionalidades
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Benefícios do Programa
              </h2>
              <p className="text-xl text-muted-foreground">
                Tudo que você precisa para uma jornada de saúde completa
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Agenda</h3>
                </div>
                <p className="text-muted-foreground">
                  Centralize todas as suas consultas, exames e medicações em um
                  só lugar. Receba lembretes personalizados e acompanhe sua
                  rotina de cuidados.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Jornada</h3>
                </div>
                <p className="text-muted-foreground">
                  Acompanhe seu progresso através de metas personalizadas,
                  marcos alcançados e uma visão clara da sua evolução na jornada
                  de saúde.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <ClipboardList className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Prontuário
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Tenha acesso completo ao seu histórico médico, incluindo
                  consultas, exames, medicações e informações importantes sobre
                  sua saúde.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Conteúdos
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Acesse uma biblioteca completa de conteúdos educacionais
                  personalizados, desenvolvidos por especialistas para apoiar
                  sua jornada de saúde.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Diário</h3>
                </div>
                <p className="text-muted-foreground">
                  Registre seus sentimentos, motivações e conquistas. O diário
                  fica disponível um dia antes das consultas para você
                  compartilhar com sua equipe de cuidado.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Check-in Periódico
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Avalie seu progresso a cada 40 dias através de questionários
                  rápidos que ajudam a identificar necessidades e ajustar seu
                  plano de cuidado.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Como Funciona a Captação
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Triagem
                </h3>
                <p className="text-muted-foreground">
                  Identificamos pacientes que se beneficiariam do programa através
                  de análise de dados e questionários iniciais.
                </p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ativação
                </h3>
                <p className="text-muted-foreground">
                  O paciente recebe acesso à plataforma e é apresentado ao Milo,
                  que guia os primeiros passos.
                </p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Acompanhamento
                </h3>
                <p className="text-muted-foreground">
                  O sistema monitora continuamente o engajamento e identifica
                  gatilhos que requerem intervenção da equipe de cuidado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

