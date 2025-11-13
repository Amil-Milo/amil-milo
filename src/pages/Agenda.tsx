import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, FileText, Bell } from "lucide-react";

const appointments = [
  {
    id: 1,
    tipo: "Consulta",
    especialidade: "Cardiologia",
    data: "2024-11-23",
    hora: "14:00",
    medico: "Dr. Carlos Silva",
    local: "Hospital Amil - Unidade Centro",
    status: "confirmada",
    preparacao: ["Levar exames anteriores", "Fazer jejum de 12h", "Lista de medicamentos"],
  },
  {
    id: 2,
    tipo: "Exame",
    especialidade: "Ecocardiograma",
    data: "2024-11-28",
    hora: "09:30",
    medico: "Laboratório CardioCheck",
    local: "Clínica Diagnóstica São Paulo",
    status: "agendada",
    preparacao: ["Não precisa jejum", "Chegar 15min antes"],
  },
  {
    id: 3,
    tipo: "Consulta",
    especialidade: "Endocrinologia",
    data: "2024-12-05",
    hora: "16:00",
    medico: "Dra. Ana Paula Costa",
    local: "Consultório Médico - Av. Paulista",
    status: "agendada",
    preparacao: ["Levar últimos exames de glicemia", "Diário alimentar da semana"],
  },
];

const medications = [
  { nome: "Losartana 50mg", horario: "08:00", obs: "Em jejum" },
  { nome: "Metformina 850mg", horario: "12:00", obs: "Após almoço" },
  { nome: "Sinvastatina 20mg", horario: "22:00", obs: "Antes de dormir" },
];

export default function Agenda() {
  const handleViewCalendar = () => {
    // Placeholder para integração com Google Calendar API
    // TODO: Implementar autenticação OAuth2 do Google
    // TODO: Carregar eventos do Google Calendar
    console.log("Abrindo Google Calendar...");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sua Agenda de Saúde
          </h1>
          <p className="text-muted-foreground">
            Consultas, exames e lembretes em um só lugar
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Appointments List */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Próximos Compromissos
              </h2>
              <Button variant="outline" size="sm" onClick={handleViewCalendar}>
                <Calendar className="h-4 w-4 mr-2" />
                Ver Calendário
              </Button>
            </div>

            {appointments.map((apt) => (
              <Card key={apt.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {apt.tipo} - {apt.especialidade}
                        </h3>
                        <Badge
                          variant={
                            apt.status === "confirmada" ? "default" : "secondary"
                          }
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {apt.medico}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(apt.data).toLocaleDateString("pt-BR")} às{" "}
                          {apt.hora}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {apt.local}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {apt.preparacao && apt.preparacao.length > 0 && (
                  <div className="mt-4 p-4 bg-secondary-light rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">
                        Preparação necessária:
                      </span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {apt.preparacao.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Lembrar 1h antes
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Medications */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Medicações de Hoje
              </h3>
              <div className="space-y-3">
                {medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {med.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {med.horario} - {med.obs}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      ✓
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  + Nova Consulta
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  + Novo Exame
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  + Novo Lembrete
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
