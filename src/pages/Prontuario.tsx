import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  Calendar,
  Pill,
  AlertTriangle,
  Syringe,
  Stethoscope,
  Heart,
} from "lucide-react";

export default function Prontuario() {
  const { user } = useAuth();

  const patientData = {
    exames: [
      { tipo: "Hemograma", data: "10 Nov 2024", resultado: "Normal" },
      { tipo: "Glicemia", data: "10 Nov 2024", resultado: "Alterado" },
      { tipo: "Colesterol", data: "05 Nov 2024", resultado: "Normal" },
    ],
    medicamentos: [
      { nome: "Losartana 50mg", dosagem: "1 comprimido", frequencia: "1x ao dia pela manhã" },
      { nome: "Sinvastatina 20mg", dosagem: "1 comprimido", frequencia: "1x ao dia à noite" },
    ],
    alergias: ["Dipirona", "Penicilina"],
    historicoMedico: [
      { ano: "2020", evento: "Hipertensão diagnosticada", descricao: "Início do tratamento medicamentoso" },
      { ano: "2018", evento: "Cirurgia de hérnia", descricao: "Procedimento realizado com sucesso" },
    ],
    vacinacao: [
      { nome: "COVID-19", status: "Em dia", ultimaDose: "Jan 2024" },
      { nome: "Influenza", status: "Em dia", ultimaDose: "Abr 2024" },
      { nome: "Pneumocócica", status: "Pendente", ultimaDose: "Não aplicada" },
    ],
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-subtle">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Prontuário Médico</h1>
            <p className="text-muted-foreground">Seu histórico completo de saúde</p>
          </div>

          <Card className="p-6 mb-6 bg-gradient-to-br from-primary-light/30 to-background border-primary/20">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-dark text-white text-3xl">
                  {user?.name?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">{user?.name || "Paciente"}</h2>
                <p className="text-muted-foreground mb-3">65 anos • Carteirinha: 12345678</p>
                <Badge className="bg-destructive text-white text-lg px-4 py-1">
                  O+ <span className="ml-2 text-xs">Tipo Sanguíneo</span>
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 border-secondary/30 hover:shadow-medium transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Última Consulta</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Data:</span>
                  <span className="font-medium text-foreground">15 Nov 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Médico:</span>
                  <span className="font-medium text-foreground">Dr. Carlos Silva</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Especialidade:</span>
                  <Badge className="bg-secondary text-white">Cardiologia</Badge>
                </div>
                <div className="mt-4 p-4 bg-secondary-light/30 rounded-lg border border-secondary/20">
                  <p className="text-sm text-foreground">Paciente apresenta melhora nos indicadores cardiovasculares...</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/30 hover:shadow-medium transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Exames Recentes</h2>
              </div>
              <div className="space-y-3">
                {patientData.exames.map((exame, index) => (
                  <div key={index} className="p-3 bg-primary-light/20 rounded-lg border border-primary/10">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-foreground text-sm">{exame.tipo}</p>
                      <Badge className={exame.resultado === "Normal" ? "bg-success" : "bg-warning"}>{exame.resultado}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{exame.data}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 border-primary/20 hover:shadow-medium transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Medicamentos em Uso</h2>
              </div>
              <div className="space-y-3">
                {patientData.medicamentos.map((med, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-primary-light/20 to-background rounded-lg border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{med.nome}</p>
                        <p className="text-sm text-primary">{med.dosagem}</p>
                        <p className="text-xs text-muted-foreground mt-1">{med.frequencia}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/40 hover:shadow-medium transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Alergias</h2>
              </div>
              <div className="space-y-3">
                {patientData.alergias.map((alergia, index) => (
                  <div key={index} className="p-4 bg-destructive/20 rounded-lg border-2 border-destructive/40">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                      <p className="font-semibold text-destructive">{alergia}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-destructive/20">
                <p className="text-xs text-destructive/70 text-center font-medium">⚠️ Informação crítica</p>
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-6 border-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Histórico Médico</h2>
            </div>
            <div className="space-y-4">
              {patientData.historicoMedico.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-secondary-light/20 to-background rounded-lg border border-secondary/10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-secondary font-bold text-sm">{item.ano}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">{item.evento}</p>
                    <p className="text-sm text-muted-foreground">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-success/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Syringe className="h-6 w-6 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Carteira de Vacinação</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {patientData.vacinacao.map((vacina, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-success/5 to-background rounded-lg border border-success/20">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Syringe className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-1">{vacina.nome}</p>
                      <Badge className={vacina.status === "Em dia" ? "bg-success" : "bg-warning"}>{vacina.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-11">{vacina.ultimaDose}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
