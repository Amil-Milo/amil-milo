import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  BookOpen,
  Heart,
  TrendingUp,
  Award,
  Flame,
  Target,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Programa() {
  const { user } = useAuth();

  // Dados vazios - serão preenchidos quando houver integração com backend
  const userData = {
    nome: user?.name || "Paciente",
    nivel: 0,
    pontos: 0,
    streak: 0,
    proximaConsulta: null as string | null,
    metasSemana: {
      interacoes: { atual: 0, meta: 0 },
      conteudos: { atual: 0, meta: 0 },
    },
    conquistas: [] as string[],
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <Sidebar />
      
      <main className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Olá, {userData.nome}!
          </h1>
          <p className="text-muted-foreground">
            Que bom te ver por aqui! Vamos continuar cuidando da sua saúde?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Nível
              </span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              Nível {userData.nivel}
            </div>
            <Progress value={65} className="mt-2 h-2" />
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Pontos
              </span>
              <Award className="h-4 w-4 text-warning" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {userData.pontos}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +50 pontos até próximo nível
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Sequência
              </span>
              <Flame className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold text-accent">
              {userData.streak} dias
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registro consecutivo
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Conquistas
              </span>
              <Award className="h-4 w-4 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {userData.conquistas.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              selos desbloqueados
            </p>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Next Appointment */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Próxima Consulta
                </h3>
                <p className="text-sm text-muted-foreground">Cardiologia</p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-4">
              {userData.proximaConsulta || "Nenhuma consulta agendada"}
            </p>
            <Link to="/agenda">
              <Button variant="outline" className="w-full">
                Ver Agenda Completa
              </Button>
            </Link>
          </Card>

          {/* Weekly Goals */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Metas da Semana</h3>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Interações</span>
                  <span className="font-medium">
                    {userData.metasSemana.interacoes.atual}/
                    {userData.metasSemana.interacoes.meta}
                  </span>
                </div>
                <Progress
                  value={
                    (userData.metasSemana.interacoes.atual /
                      userData.metasSemana.interacoes.meta) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Conteúdos lidos</span>
                  <span className="font-medium">
                    {userData.metasSemana.conteudos.atual}/
                    {userData.metasSemana.conteudos.meta}
                  </span>
                </div>
                <Progress
                  value={
                    (userData.metasSemana.conteudos.atual /
                      userData.metasSemana.conteudos.meta) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Conquistas Recentes
                </h3>
              </div>
            </div>
            <div className="space-y-2">
              {userData.conquistas.map((conquista, index) => (
                <Badge key={index} variant="secondary" className="mr-2">
                  {conquista}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {user?.assignedLineId ? (
            <Link to="/agenda">
              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
                <Calendar className="h-8 w-8 text-secondary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  Minha Agenda
                </h3>
                <p className="text-sm text-muted-foreground">
                  Veja suas consultas e compromissos
                </p>
              </Card>
            </Link>
          ) : (
            <Link to="/check-in-periodico">
              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
                <Activity className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  Check-In Periódico
                </h3>
                <p className="text-sm text-muted-foreground">
                  Faça seu check-in e monitore sua saúde
                </p>
              </Card>
            </Link>
          )}

          <Link to="/diario">
            <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <Activity className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                Diário de Saúde
              </h3>
              <p className="text-sm text-muted-foreground">
                Registre como você está se sentindo
              </p>
            </Card>
          </Link>

          <Link to="/conteudos">
            <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <BookOpen className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                Conteúdos para Você
              </h3>
              <p className="text-sm text-muted-foreground">
                Artigos e vídeos personalizados
              </p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
