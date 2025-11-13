import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  age: number;
  cpf: string;
  isInLine: boolean;
  careLine?: string;
  lastCheckin?: string;
  checkinResponses?: Record<string, string>;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    age: 65,
    cpf: "123.456.789-00",
    isInLine: false,
    lastCheckin: "2024-11-10",
    checkinResponses: {
      "cardio-1": "Às vezes (3-5 vezes)",
      "cardio-2": "Moderado (visível sem apertar)",
    }
  },
  {
    id: "2",
    name: "João Santos",
    age: 68,
    cpf: "987.654.321-00",
    isInLine: true,
    careLine: "cardiologia",
    lastCheckin: "2024-11-12",
  },
  {
    id: "3",
    name: "Ana Costa",
    age: 62,
    cpf: "456.789.123-00",
    isInLine: false,
    lastCheckin: "2024-11-08",
  },
];

const careLines = [
  { value: "cardiologia", label: "Cardiologia" },
  { value: "diabetes", label: "Diabetes" },
  { value: "ortopedia", label: "Ortopedia" },
  { value: "saude-mental", label: "Saúde Mental" },
  { value: "respiratorio", label: "Respiratório" },
  { value: "renal", label: "Renal" },
  { value: "oncologia", label: "Oncologia" },
  { value: "neurologico", label: "Neurológico" },
  { value: "gastro", label: "Gastroenterologia" },
  { value: "preventivo", label: "Preventivo" },
];

export default function AdminPanel() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  const handleAssignCareLine = (patientId: string, careLine: string) => {
    setPatients(patients.map(p =>
      p.id === patientId
        ? { ...p, isInLine: true, careLine }
        : p
    ));
    toast.success("Linha de cuidado atribuída com sucesso!");
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailsOpen(true);
  };

  const stats = {
    total: patients.length,
    inLine: patients.filter(p => p.isInLine).length,
    pending: patients.filter(p => !p.isInLine).length,
    recentCheckins: patients.filter(p => p.lastCheckin).length,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gerencie pacientes e atribua linhas de cuidado
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Pacientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Com Linha Atribuída
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inLine}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Aguardando Atribuição
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Check-ins Recentes
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentCheckins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Linha Atual</TableHead>
                  <TableHead>Último Check-in</TableHead>
                  <TableHead>Atribuir Linha</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.cpf}</TableCell>
                    <TableCell>{patient.age} anos</TableCell>
                    <TableCell>
                      {patient.isInLine ? (
                        <Badge variant="secondary">Com Linha</Badge>
                      ) : (
                        <Badge variant="outline">Sem Linha</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {patient.careLine ? (
                        <Badge>{patient.careLine}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {patient.lastCheckin || (
                        <span className="text-muted-foreground text-sm">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => handleAssignCareLine(patient.id, value)}
                        defaultValue={patient.careLine}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {careLines.map((line) => (
                            <SelectItem key={line.value} value={line.value}>
                              {line.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(patient)}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{selectedPatient.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade</p>
                  <p className="font-medium">{selectedPatient.age} anos</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Último Check-in</p>
                  <p className="font-medium">{selectedPatient.lastCheckin || "Nunca"}</p>
                </div>
              </div>

              {selectedPatient.checkinResponses && (
                <div>
                  <h3 className="font-semibold mb-3">Respostas do Check-in</h3>
                  <div className="space-y-2 p-4 bg-muted rounded-lg">
                    {Object.entries(selectedPatient.checkinResponses).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-muted-foreground">{key}:</span>{" "}
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
