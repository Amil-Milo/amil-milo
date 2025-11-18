import { useQuery } from "@tanstack/react-query";
import { medicalRecordApi } from "@/lib/api";

export interface MedicalRecord {
  id: number;
  userId: number;
  title: string;
  simplifiedSummary: string;
  recordDate: string;
}

export interface Consultation {
  id: number;
  patientId: number;
  createdById: number;
  professionalName: string;
  specialty: string;
  consultationDate: string;
  location: string;
  status: string;
  notes?: string;
}

export interface MedicalRecordData {
  profile: {
    id: number;
    userId: number;
    dateOfBirth?: string;
    bloodType?: string;
    height?: number;
    weight?: number;
    diseases?: string;
    medications?: string;
    familyHistory?: string;
    specialConditions?: string;
    assignedLineId?: number;
    assignedLine?: {
      id: number;
      name: string;
    };
  };
  medicalRecords: MedicalRecord[];
  consultations: Consultation[];
  medications: string[];
  allergies: string | null;
  additionalObservations: string | null;
}

export function useMedicalRecords() {
  const query = useQuery<MedicalRecordData>({
    queryKey: ["medical-record", "me"],
    queryFn: async () => {
      // MODO DEMO - DADOS MOCKADOS
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      return {
        profile: {
          id: 1,
          userId: 1,
          dateOfBirth: "1990-05-15",
          bloodType: "O+",
          height: 175,
          weight: 70,
          diseases: "Hipertensão arterial",
          medications: "Losartana 50mg, AAS 100mg",
          familyHistory: "Histórico de diabetes na família",
          specialConditions: "Nenhuma condição especial",
          assignedLineId: 1,
          assignedLine: {
            id: 1,
            name: "Cardiologia",
          },
        },
        medicalRecords: [
          {
            id: 1,
            userId: 1,
            title: "Hemograma Completo",
            simplifiedSummary: "Resultados dentro da normalidade. Hemoglobina: 14.2 g/dL",
            recordDate: lastMonth.toISOString(),
          },
          {
            id: 2,
            userId: 1,
            title: "Eletrocardiograma",
            simplifiedSummary: "Ritmo sinusal regular. Sem alterações significativas",
            recordDate: threeMonthsAgo.toISOString(),
          },
        ],
        consultations: [
          {
            id: 1,
            patientId: 1,
            createdById: 1,
            professionalName: "Dr. Carlos Silva",
            specialty: "Cardiologia",
            consultationDate: lastMonth.toISOString(),
            location: "Hospital Amil - Unidade Centro",
            status: "COMPLETED",
            notes: "Paciente em acompanhamento. Pressão arterial controlada.",
          },
          {
            id: 2,
            patientId: 1,
            createdById: 1,
            professionalName: "Dra. Ana Paula Santos",
            specialty: "Nutrição",
            consultationDate: threeMonthsAgo.toISOString(),
            location: "Clínica Amil - Unidade Jardins",
            status: "COMPLETED",
            notes: "Orientações nutricionais fornecidas. Plano alimentar ajustado.",
          },
        ],
        medications: ["Losartana 50mg", "AAS 100mg"],
        allergies: "Nenhuma alergia conhecida",
        additionalObservations: "Paciente aderente ao tratamento. Seguir acompanhamento regular.",
      };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

