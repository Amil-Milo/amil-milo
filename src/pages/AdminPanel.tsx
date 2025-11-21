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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, TrendingUp, Activity, AlertCircle, Filter, Edit, Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { adminApi, specialtyApi, patientProfileAdminApi, questionnaireApi } from "@/lib/api";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { Textarea } from "@/components/ui/textarea";

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

interface Questionnaire {
  id: number;
  name: string;
  specialtyId: number;
  specialty: {
    id: number;
    name: string;
  };
  questionsCount: number;
}

interface Question {
  id: number;
  text: string;
  order: number;
  type: 'SELECTION' | 'TEXT' | 'BOOLEAN';
  answerOptions: Array<{
    id: number;
    text: string;
    value: number;
  }>;
}

export default function AdminPanel() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [allCheckins, setAllCheckins] = useState<CheckinDetails[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [questions, setQuestions] = useState<Record<number, Question[]>>({});
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState<string>("");
  const [editingQuestionType, setEditingQuestionType] = useState<'SELECTION' | 'TEXT' | 'BOOLEAN'>('SELECTION');
  const [editingOptionData, setEditingOptionData] = useState<{ text: string; value: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCheckins, setLoadingCheckins] = useState(false);
  const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(null);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<number | null>(null);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "checkins") {
      loadAllCheckins();
    }
    if (activeTab === "questionnaires") {
      loadQuestionnaires();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedQuestionnaireId) {
      loadQuestions(selectedQuestionnaireId);
    }
  }, [selectedQuestionnaireId]);

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

  const loadQuestionnaires = async () => {
    setLoadingQuestionnaires(true);
    try {
      const data = await questionnaireApi.listAll();
      setQuestionnaires(data);
      if (data.length > 0 && !selectedQuestionnaireId) {
        setSelectedQuestionnaireId(data[0].id);
      }
    } catch (error: any) {
      console.error("Error loading questionnaires:", error);
      toast.error("Erro ao carregar questionários.");
    } finally {
      setLoadingQuestionnaires(false);
    }
  };

  const loadQuestions = async (questionnaireId: number) => {
    try {
      const data = await questionnaireApi.getQuestions(questionnaireId);
      setQuestions((prev) => ({
        ...prev,
        [questionnaireId]: data,
      }));
    } catch (error: any) {
      console.error("Error loading questions:", error);
      toast.error("Erro ao carregar perguntas.");
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
    <div className="min-h-screen bg-gradient-subtle p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gerencie pacientes e atribua linhas de cuidado
            </p>
          </div>
          <UserProfileMenu />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
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
          <div className="overflow-x-auto">
            <TabsList className="flex flex-nowrap gap-2 min-w-max">
              <TabsTrigger value="manage" className="whitespace-nowrap shrink-0">Gerenciar Pacientes</TabsTrigger>
              <TabsTrigger value="checkins" className="whitespace-nowrap shrink-0">Visualizar Check-ins</TabsTrigger>
              <TabsTrigger value="questionnaires" className="whitespace-nowrap shrink-0">Gerenciar Questionários</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Pacientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full">
                  <Input
                    placeholder="Buscar por nome ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 w-full"
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
                <div className="hidden md:block overflow-x-auto">
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
                </div>
                <div className="md:hidden space-y-3">
                  {filteredPatients.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      {patients.length === 0 
                        ? "Nenhum paciente encontrado" 
                        : "Nenhum paciente corresponde à busca"}
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <Card key={patient.id} className="w-full">
                        <CardContent className="p-4 space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-foreground text-sm">{patient.fullName}</p>
                              {patient.patientProfile?.assignedLineId ? (
                                <Badge variant="secondary" className="text-xs">Com Linha</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Sem Linha</Badge>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 text-sm">
                              <span className="text-muted-foreground">
                                <span className="font-medium">CPF:</span> {patient.cpf}
                              </span>
                              {patient.patientProfile?.assignedLine ? (
                                <span className="text-muted-foreground">
                                  <span className="font-medium">Linha:</span>{" "}
                                  <Badge variant="default" className="ml-1">{patient.patientProfile.assignedLine.name}</Badge>
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">Sem linha atribuída</span>
                              )}
                            </div>
                          </div>
                          <div className="pt-2 border-t">
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
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Atribuir linha..." />
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
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
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
                      <div className="overflow-x-auto">
                      <TabsList className="flex flex-nowrap gap-2 min-w-max">
                        {availableSpecialties.map((specialty) => (
                          <TabsTrigger 
                            key={specialty.id} 
                            value={specialty.id.toString()}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap shrink-0"
                          >
                            {specialty.name}
                            <Badge variant="secondary" className="ml-2">
                              {checkinsBySpecialty[specialty.id]?.length || 0}
                            </Badge>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                      {availableSpecialties.map((specialty) => (
                        <TabsContent key={specialty.id} value={specialty.id.toString()} className="space-y-4 mt-4">
                          {checkinsBySpecialty[specialty.id]?.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>Nenhum check-in encontrado para esta linha</p>
                            </div>
                          ) : (
                            <Accordion type="single" collapsible className="space-y-4">
                              {checkinsBySpecialty[specialty.id]?.map((checkin) => (
                                <AccordionItem key={checkin.id} value={`checkin-${checkin.id}`} className="border border-border/50 rounded-lg px-4">
                                  <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full pr-4 gap-3">
                                      <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                                        <CardTitle className="text-base md:text-lg font-semibold text-foreground break-words">
                                          {checkin.patient.fullName}
                                        </CardTitle>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-xs md:text-sm text-muted-foreground">
                                          <span className="break-all">{checkin.patient.email}</span>
                                          <span className="hidden md:inline">•</span>
                                          <span>{checkin.patient.cpf}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 break-words">
                                          {checkin.questionnaire.name}
                                        </p>
                                      </div>
                                      <div className="flex flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                                        <p className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                                          {new Date(checkin.completedAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </p>
                                        {checkin.totalScore !== null && (
                                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                            {checkin.totalScore} pontos
                                          </Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                                          {checkin.answers.length} {checkin.answers.length === 1 ? 'resposta' : 'respostas'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-4 pt-2 pb-4 w-full max-w-full">
                                      {checkin.answers.map((answer) => (
                                        <div key={answer.id} className="space-y-2 p-3 bg-muted/50 rounded-lg w-full max-w-full">
                                          <p className="font-medium text-foreground text-sm break-words">
                                            {answer.question.text}
                                          </p>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <Badge className="bg-primary text-primary-foreground font-normal break-words">
                                              {answer.chosenAnswer.text}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                              {answer.chosenAnswer.value} pontos
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Questionários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingQuestionnaires ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Carregando questionários...</p>
                  </div>
                ) : questionnaires.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum questionário encontrado</p>
                  </div>
                ) : (
                  <>
                    <Tabs value={selectedQuestionnaireId?.toString() || ""} onValueChange={(value) => setSelectedQuestionnaireId(parseInt(value))}>
                      <div className="overflow-x-auto">
                        <TabsList className="flex flex-nowrap gap-2 min-w-max">
                          {questionnaires.map((questionnaire) => (
                            <TabsTrigger 
                              key={questionnaire.id} 
                              value={questionnaire.id.toString()}
                              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap shrink-0"
                            >
                              {questionnaire.specialty.name} - {questionnaire.name}
                              <Badge variant="secondary" className="ml-2">
                                {questionnaire.questionsCount}
                              </Badge>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>

                      {questionnaires.map((questionnaire) => (
                        <TabsContent key={questionnaire.id} value={questionnaire.id.toString()} className="space-y-4 mt-4">
                          {!questions[questionnaire.id] ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                              <p className="mt-2 text-sm text-muted-foreground">Carregando perguntas...</p>
                            </div>
                          ) : questions[questionnaire.id].length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>Nenhuma pergunta encontrada neste questionário</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {questions[questionnaire.id].map((question) => (
                                <Card key={question.id} className="border border-border/50">
                                  <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                      {editingQuestion === question.id ? (
                                        <div className="flex-1 space-y-3">
                                          <Textarea
                                            value={editingQuestionText}
                                            onChange={(e) => setEditingQuestionText(e.target.value)}
                                            className="min-h-[80px]"
                                            placeholder="Texto da pergunta"
                                          />
                                          <Select
                                            value={editingQuestionType}
                                            onValueChange={(value: 'SELECTION' | 'TEXT' | 'BOOLEAN') => setEditingQuestionType(value)}
                                          >
                                            <SelectTrigger className="w-full max-w-full">
                                              <SelectValue placeholder="Tipo de resposta" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="SELECTION">Seleção</SelectItem>
                                              <SelectItem value="TEXT">Texto Livre</SelectItem>
                                              <SelectItem value="BOOLEAN">Sim/Não</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              onClick={async () => {
                                                try {
                                                  await questionnaireApi.updateQuestion(question.id, {
                                                    text: editingQuestionText,
                                                    order: question.order,
                                                    type: editingQuestionType,
                                                  });
                                                  toast.success("Pergunta atualizada com sucesso!");
                                                  setEditingQuestion(null);
                                                  setEditingQuestionText("");
                                                  setEditingQuestionType('SELECTION');
                                                  loadQuestions(questionnaire.id);
                                                } catch (error: any) {
                                                  toast.error("Erro ao atualizar pergunta.");
                                                }
                                              }}
                                            >
                                              <Save className="h-4 w-4 mr-2" />
                                              Salvar
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                setEditingQuestion(null);
                                                setEditingQuestionText("");
                                                setEditingQuestionType('SELECTION');
                                              }}
                                            >
                                              <X className="h-4 w-4 mr-2" />
                                              Cancelar
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="flex-1">
                                            <p className="font-semibold text-foreground">{question.text}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <p className="text-sm text-muted-foreground">Ordem: {question.order}</p>
                                              <span className="text-muted-foreground">•</span>
                                              <Badge variant="outline" className="text-xs">
                                                {question.type === 'SELECTION' ? 'Seleção' : question.type === 'TEXT' ? 'Texto Livre' : 'Sim/Não'}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                setEditingQuestion(question.id);
                                                setEditingQuestionText(question.text);
                                                setEditingQuestionType(question.type);
                                              }}
                                              className="w-full sm:w-auto"
                                            >
                                              <Edit className="h-4 w-4 mr-2" />
                                              Editar
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={async () => {
                                                if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
                                                  try {
                                                    await questionnaireApi.deleteQuestion(question.id);
                                                    toast.success("Pergunta excluída com sucesso!");
                                                    loadQuestions(questionnaire.id);
                                                  } catch (error: any) {
                                                    toast.error("Erro ao excluir pergunta.");
                                                  }
                                                }
                                              }}
                                              className="w-full sm:w-auto"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Excluir
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-muted-foreground">Opções de Resposta</h4>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={async () => {
                                            const text = prompt("Texto da opção:");
                                            if (text) {
                                              const valueStr = prompt("Valor (pontuação):");
                                              if (valueStr) {
                                                try {
                                                  await questionnaireApi.createAnswerOption(question.id, {
                                                    text,
                                                    value: parseInt(valueStr),
                                                  });
                                                  toast.success("Opção adicionada com sucesso!");
                                                  loadQuestions(questionnaire.id);
                                                } catch (error: any) {
                                                  toast.error("Erro ao adicionar opção.");
                                                }
                                              }
                                            }
                                          }}
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Adicionar Opção
                                        </Button>
                                      </div>
                                      {question.answerOptions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Nenhuma opção de resposta</p>
                                      ) : (
                                        <div className="space-y-2">
                                          {question.answerOptions.map((option) => (
                                            <div key={option.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                              {editingOption === option.id ? (
                                                <div className="flex-1 flex items-center gap-2">
                                                  <Input
                                                    value={editingOptionData?.text || ""}
                                                    onChange={(e) => {
                                                      if (editingOptionData) {
                                                        setEditingOptionData({ ...editingOptionData, text: e.target.value });
                                                      }
                                                    }}
                                                    className="flex-1"
                                                  />
                                                  <Input
                                                    type="number"
                                                    value={editingOptionData?.value || 0}
                                                    onChange={(e) => {
                                                      if (editingOptionData) {
                                                        setEditingOptionData({ ...editingOptionData, value: parseInt(e.target.value) || 0 });
                                                      }
                                                    }}
                                                    className="w-20"
                                                  />
                                                  <Button
                                                    size="sm"
                                                    onClick={async () => {
                                                      if (editingOptionData) {
                                                        try {
                                                          await questionnaireApi.updateAnswerOption(option.id, {
                                                            text: editingOptionData.text,
                                                            value: editingOptionData.value,
                                                          });
                                                          toast.success("Opção atualizada com sucesso!");
                                                          setEditingOption(null);
                                                          setEditingOptionData(null);
                                                          loadQuestions(questionnaire.id);
                                                        } catch (error: any) {
                                                          toast.error("Erro ao atualizar opção.");
                                                        }
                                                      }
                                                    }}
                                                  >
                                                    <Save className="h-4 w-4" />
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                      setEditingOption(null);
                                                      setEditingOptionData(null);
                                                    }}
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              ) : (
                                                <>
                                                  <div className="flex-1">
                                                    <p className="font-medium text-foreground">{option.text}</p>
                                                    <p className="text-sm text-muted-foreground">Valor: {option.value}</p>
                                                  </div>
                                                  <div className="flex gap-2">
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => {
                                                        setEditingOption(option.id);
                                                        setEditingOptionData({ text: option.text, value: option.value });
                                                      }}
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                      size="sm"
                                                      variant="destructive"
                                                      onClick={async () => {
                                                        if (confirm("Tem certeza que deseja excluir esta opção?")) {
                                                          try {
                                                            await questionnaireApi.deleteAnswerOption(option.id);
                                                            toast.success("Opção excluída com sucesso!");
                                                            loadQuestions(questionnaire.id);
                                                          } catch (error: any) {
                                                            toast.error("Erro ao excluir opção.");
                                                          }
                                                        }
                                                      }}
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
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
