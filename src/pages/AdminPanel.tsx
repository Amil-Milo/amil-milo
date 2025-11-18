import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, TrendingUp, Activity, AlertCircle, Filter } from "lucide-react";
import { toast } from "sonner";
import { adminApi, specialtyApi, patientProfileAdminApi } from "@/lib/api";
import { UserProfileMenu } from "@/components/UserProfileMenu";

interface Patient {
  id: number;
  fullName: string;
  email: string;
  cpf: string;
  patientProfile: {
    id: number;
    assignedLineId: number | null;
    assignedLine: {
      id: number;
      name: string;
    } | null;
  } | null;
}

interface Specialty {
  id: number;
  name: string;
  description: string | null;
}

interface CheckinDetails {
  id: number;
  patient: {
    id: number;
    fullName: string;
    email: string;
    cpf: string;
  };
  questionnaire: {
    id: number;
    name: string;
    specialty: {
      id: number;
      name: string;
    };
  };
  totalScore: number | null;
  completedAt: string;
  answers: Array<{
    id: number;
    question: {
      id: number;
      text: string;
      order: number;
    };
    chosenAnswer: {
      id: number;
      text: string;
      value: number;
    };
  }>;
}

type FilterType = "all" | "withLine" | "withoutLine" | number;

export default function AdminPanel() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [allCheckins, setAllCheckins] = useState<CheckinDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCheckins, setLoadingCheckins] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(null);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "checkins") {
      loadAllCheckins();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patientsData, specialtiesData] = await Promise.all([
        adminApi.getPatientTriageList(),
        specialtyApi.listSpecialties(),
      ]);
      setPatients(patientsData);
      setSpecialties(specialtiesData);
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const loadAllCheckins = async () => {
    setLoadingCheckins(true);
    try {
      const checkins = await adminApi.getAllCheckinsBySpecialty();
      setAllCheckins(checkins);
      if (checkins.length > 0 && !selectedSpecialtyId) {
        const firstSpecialtyId = checkins[0]?.questionnaire.specialty.id;
        if (firstSpecialtyId) {
          setSelectedSpecialtyId(firstSpecialtyId);
        }
      }
    } catch (error: any) {
      console.error("Error loading checkins:", error);
      toast.error("Erro ao carregar check-ins. Tente novamente.");
    } finally {
      setLoadingCheckins(false);
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm);

      if (!matchesSearch) {
        return false;
      }

      if (filter === "all") {
        return true;
      }

      if (filter === "withLine") {
        return !!p.patientProfile?.assignedLineId;
      }

      if (filter === "withoutLine") {
        return !p.patientProfile?.assignedLineId;
      }

      if (typeof filter === "number") {
        return p.patientProfile?.assignedLineId === filter;
      }

      return true;
    });
  }, [patients, searchTerm, filter]);

  const checkinsBySpecialty = useMemo(() => {
    const grouped: Record<number, CheckinDetails[]> = {};
    
    allCheckins.forEach((checkin) => {
      const specialtyId = checkin.questionnaire.specialty.id;
      if (!grouped[specialtyId]) {
        grouped[specialtyId] = [];
      }
      grouped[specialtyId].push(checkin);
    });

    return grouped;
  }, [allCheckins]);

  const availableSpecialties = useMemo(() => {
    const specialtyIds = new Set(allCheckins.map(c => c.questionnaire.specialty.id));
    return specialties.filter(s => specialtyIds.has(s.id));
  }, [specialties, allCheckins]);

  const currentCheckins = useMemo(() => {
    if (!selectedSpecialtyId) {
      return [];
    }
    return checkinsBySpecialty[selectedSpecialtyId] || [];
  }, [selectedSpecialtyId, checkinsBySpecialty]);

  const handleAssignCareLine = async (patientId: number, specialtyId: string) => {
    if (!specialtyId || specialtyId === "none" || specialtyId === "remove") return;
    
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex === -1) return;

    const previousPatient = patients[patientIndex];
    const specialty = specialties.find(s => s.id === parseInt(specialtyId));
    
    setPatients(prev => prev.map(p => 
      p.id === patientId 
        ? {
            ...p,
            patientProfile: {
              ...p.patientProfile!,
              assignedLineId: parseInt(specialtyId),
              assignedLine: specialty ? { id: specialty.id, name: specialty.name } : null,
            }
          }
        : p
    ));
    
    try {
      await patientProfileAdminApi.assignLine(patientId, parseInt(specialtyId));
      toast.success("Linha de cuidado atribuída com sucesso!");
      loadData();
    } catch (error: any) {
      setPatients(prev => prev.map(p => 
        p.id === patientId ? previousPatient : p
      ));
      console.error("Error assigning care line:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.description || "Erro ao atribuir linha de cuidado. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  const handleRemoveCareLine = async (patientId: number) => {
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex === -1) return;

    const previousPatient = patients[patientIndex];
    
    setPatients(prev => prev.map(p => 
      p.id === patientId 
        ? {
            ...p,
            patientProfile: {
              ...p.patientProfile!,
              assignedLineId: null,
              assignedLine: null,
            }
          }
        : p
    ));
    
    try {
      await patientProfileAdminApi.removeLine(patientId);
      toast.success("Linha de cuidado removida com sucesso!");
      loadData();
    } catch (error: any) {
      setPatients(prev => prev.map(p => 
        p.id === patientId ? previousPatient : p
      ));
      console.error("Error removing care line:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.description || "Erro ao remover linha de cuidado. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  const stats = {
    total: patients.length,
    inLine: patients.filter(p => p.patientProfile?.assignedLineId).length,
    pending: patients.filter(p => !p.patientProfile?.assignedLineId).length,
    recentCheckins: allCheckins.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">
              Gerencie pacientes e atribua linhas de cuidado
            </p>
          </div>
          <UserProfileMenu />
        </div>

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

        <Tabs defaultValue="manage" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="manage">Gerenciar Pacientes</TabsTrigger>
            <TabsTrigger value="checkins">Visualizar Check-ins</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Pacientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 w-full">
                  <Input
                    placeholder="Buscar por nome ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">Filtrar por:</span>
                        <Filter className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-56 p-2" 
                      align="end" 
                      side="bottom" 
                      sideOffset={8}
                      collisionPadding={20}
                    >
                      <div className="space-y-1">
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            filter === "all"
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent text-foreground hover:bg-muted hover:text-foreground"
                          }`}
                          onClick={() => {
                            setFilter("all");
                            setFilterPopoverOpen(false);
                          }}
                        >
                          Todos os pacientes
                        </button>
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            filter === "withLine"
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent text-foreground hover:bg-muted hover:text-foreground"
                          }`}
                          onClick={() => {
                            setFilter("withLine");
                            setFilterPopoverOpen(false);
                          }}
                        >
                          Com linha atribuída
                        </button>
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            filter === "withoutLine"
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent text-foreground hover:bg-muted hover:text-foreground"
                          }`}
                          onClick={() => {
                            setFilter("withoutLine");
                            setFilterPopoverOpen(false);
                          }}
                        >
                          Sem linha atribuída
                        </button>
                        {specialties.length > 0 && (
                          <>
                            <div className="h-px bg-border my-1" />
                            {specialties.map((specialty) => (
                              <button
                                key={specialty.id}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                  filter === specialty.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-transparent text-foreground hover:bg-muted hover:text-foreground"
                                }`}
                                onClick={() => {
                                  setFilter(specialty.id);
                                  setFilterPopoverOpen(false);
                                }}
                              >
                                {specialty.name}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Linha Atual</TableHead>
                      <TableHead>Atribuir Linha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          {patients.length === 0 
                            ? "Nenhum paciente encontrado" 
                            : "Nenhum paciente corresponde à busca"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.fullName}</TableCell>
                          <TableCell>{patient.cpf}</TableCell>
                          <TableCell>
                            {patient.patientProfile?.assignedLineId ? (
                              <Badge variant="secondary">Com Linha</Badge>
                            ) : (
                              <Badge variant="outline">Sem Linha</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {patient.patientProfile?.assignedLine ? (
                              <Badge>{patient.patientProfile.assignedLine.name}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                onValueChange={(value) => {
                                  if (value === "remove") {
                                    handleRemoveCareLine(patient.id);
                                  } else {
                                    handleAssignCareLine(patient.id, value);
                                  }
                                }}
                                value={patient.patientProfile?.assignedLineId?.toString() || "none"}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Nenhuma</SelectItem>
                                  {patient.patientProfile?.assignedLineId && (
                                    <SelectItem value="remove">Remover Linha</SelectItem>
                                  )}
                                  {specialties.map((specialty) => (
                                    <SelectItem key={specialty.id} value={specialty.id.toString()}>
                                      {specialty.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visualizar Check-ins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingCheckins ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Carregando check-ins...</p>
                  </div>
                ) : availableSpecialties.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum check-in encontrado</p>
                  </div>
                ) : (
                  <>
                    <Tabs value={selectedSpecialtyId?.toString() || ""} onValueChange={(value) => setSelectedSpecialtyId(parseInt(value))}>
                      <TabsList className="flex flex-wrap gap-2">
                        {availableSpecialties.map((specialty) => (
                          <TabsTrigger 
                            key={specialty.id} 
                            value={specialty.id.toString()}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            {specialty.name}
                            <Badge variant="secondary" className="ml-2">
                              {checkinsBySpecialty[specialty.id]?.length || 0}
                            </Badge>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {availableSpecialties.map((specialty) => (
                        <TabsContent key={specialty.id} value={specialty.id.toString()} className="space-y-4 mt-4">
                          {checkinsBySpecialty[specialty.id]?.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>Nenhum check-in encontrado para esta linha</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {checkinsBySpecialty[specialty.id]?.map((checkin) => (
                                <Card key={checkin.id} className="border-l-4 border-l-primary">
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <CardTitle className="text-lg">{checkin.patient.fullName}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {checkin.patient.email} • {checkin.patient.cpf}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(checkin.completedAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </p>
                                        {checkin.totalScore !== null && (
                                          <Badge variant="secondary" className="mt-2">
                                            Pontuação: {checkin.totalScore}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                                        Questionário: {checkin.questionnaire.name}
                                      </h4>
                                      <div className="space-y-3">
                                        {checkin.answers.map((answer) => (
                                          <div key={answer.id} className="p-4 bg-muted rounded-lg border">
                                            <p className="font-medium mb-2 text-foreground">
                                              {answer.question.text}
                                            </p>
                                            <div className="flex items-center justify-between">
                                              <p className="text-sm text-muted-foreground">
                                                Resposta: <span className="font-medium text-foreground">{answer.chosenAnswer.text}</span>
                                              </p>
                                              <Badge variant="outline" className="ml-2">
                                                Valor: {answer.chosenAnswer.value}
                                              </Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
