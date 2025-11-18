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
      return await medicalRecordApi.getMedicalRecord();
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

