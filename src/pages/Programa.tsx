import { Layout } from "@/components/layout/Layout";
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
    <Layout backgroundClass="bg-gradient-subtle">
      <div className="px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
        {/* Welcome Section */}
          <div className="mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Olá, {userData.nome}!
          </h1>
            <p className="text-sm md:text-base text-muted-foreground">
            Que bom te ver por aqui! Vamos continuar cuidando da sua saúde?
          </p>
        </div>

        {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-8">
          <Card className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Nível
              </span>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              Nível {userData.nivel}
            </div>
            <Progress value={65} className="mt-2 h-1.5 sm:h-2" />
          </Card>

          <Card className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Pontos
              </span>
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-warning flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {userData.pontos}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              +50 pontos até próximo nível
            </p>
          </Card>

          <Card className="p-3 md:p-4 bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Sequência
              </span>
              <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-accent">
              {userData.streak} dias
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              Registro consecutivo
            </p>
          </Card>

          <Card className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Conquistas
              </span>
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-secondary flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {userData.conquistas.length}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              selos desbloqueados
            </p>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-8">
          {/* Next Appointment */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-light rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  Próxima Consulta
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Cardiologia</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-foreground mb-3 md:mb-4">
              {userData.proximaConsulta || "Nenhuma consulta agendada"}
            </p>
            <Link to="/agenda">
              <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-10">
                Ver Agenda Completa
              </Button>
            </Link>
          </Card>

          {/* Weekly Goals */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Metas da Semana</h3>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
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
                  className="h-1.5 sm:h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
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
                  className="h-1.5 sm:h-2"
                />
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  Conquistas Recentes
                </h3>
              </div>
            </div>
            <div className="space-y-2 flex flex-wrap gap-2">
              {userData.conquistas.map((conquista, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {conquista}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!user?.assignedLineId && (
            <Link to="/check-in-periodico">
              <Card className="p-4 md:p-6 hover:shadow-medium transition-shadow cursor-pointer">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2 md:mb-3" />
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 md:mb-2">
                  Check-In Periódico
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Faça seu check-in e monitore sua saúde
                </p>
              </Card>
            </Link>
          )}

          <Link to="/diario">
            <Card className="p-4 md:p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2 md:mb-3" />
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 md:mb-2">
                Diário de Saúde
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Registre como você está se sentindo
              </p>
            </Card>
          </Link>

          <Link to="/conteudos">
            <Card className="p-4 md:p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2 md:mb-3" />
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 md:mb-2">
                Conteúdos para Você
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Artigos e vídeos personalizados
              </p>
            </Card>
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
