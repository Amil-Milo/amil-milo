import { useQuery } from "@tanstack/react-query";
import { medicalRecordApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // ADMIN pode acessar mesmo sem linha de cuidado
  const isAdmin = user?.role === 'ADMIN';
  const shouldEnable = Boolean(isAuthenticated && !authLoading);
  
  const query = useQuery<MedicalRecordData>({
    queryKey: ["medical-record", "me"],
    queryFn: async () => {
      try {
      const response = await medicalRecordApi.getMedicalRecord();
      return response.data || response;
      } catch (error: any) {
        // Se for ADMIN e der 404, retorna dados vazios ao invés de lançar erro
        if (isAdmin && error?.response?.status === 404) {
          // Marca o erro para não ser logado no console
          (error as any).__suppressConsole = true;
          return {
            profile: {
              id: 0,
              userId: user?.id || 0,
            },
            medicalRecords: [],
            consultations: [],
            medications: [],
            allergies: null,
            additionalObservations: null,
          } as MedicalRecordData;
        }
        throw error;
      }
    },
    enabled: shouldEnable,
    retry: (failureCount, error: any) => {
      // Se for ADMIN e der 404, não tenta novamente
      if (isAdmin && error?.response?.status === 404) {
        return false;
      }
      if (error?.response?.status === 403 || error?.response?.status === 404 || error?.code === 'ERR_NETWORK' || error?.response?.status === 502) {
        return false;
      }
      return failureCount < 3;
    },
    // Suprime logs de erro para ADMINs quando for 404
    onError: (error: any) => {
      if (isAdmin && error?.response?.status === 404) {
        // Não faz nada, o erro já foi tratado no queryFn
        return;
      }
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

