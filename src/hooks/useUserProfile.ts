import { useState, useEffect } from "react";
import { patientProfileApi, usersApi } from "@/lib/api";
import { toast } from "sonner";

interface UserData {
  id: number;
  fullName: string;
  email: string;
  cpf: string;
}

interface AddressData {
  id?: number;
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PatientProfileData {
  dateOfBirth?: string;
  bloodType?: string;
  height?: number;
  weight?: number;
  diseases?: string;
  medications?: string;
  familyHistory?: string;
  specialConditions?: string;
  address?: AddressData | null;
  assignedLineId?: number | null;
  assignedLine?: {
    id: number;
    name: string;
    description?: string | null;
  } | null;
}

interface ProfileData {
  user: UserData;
  profile: PatientProfileData;
}

export function useUserProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // MODO DEMO - DADOS MOCKADOS
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockUserData = {
        id: 1,
        fullName: "Admin Mockado",
        email: "admin@mock.com",
        cpf: "123.456.789-00",
      };

      const mockProfile: PatientProfileData = {
        dateOfBirth: "1990-05-15",
        bloodType: "O+",
        height: 175,
        weight: 70,
        diseases: "Hipertensão arterial",
        medications: "Losartana 50mg, AAS 100mg",
        familyHistory: "Histórico de diabetes na família",
        specialConditions: "Nenhuma condição especial",
        address: {
          id: 1,
          street: "Rua das Flores",
          number: "123",
          complement: "Apto 45",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
        },
        assignedLineId: 1,
        assignedLine: {
          id: 1,
          name: "Cardiologia",
          description: "Linha de cuidados cardiológicos",
        },
      };

      setProfileData({
        user: mockUserData,
        profile: mockProfile,
      });
    } catch (error: any) {
      toast.error("Erro ao carregar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (
    profileData: Partial<PatientProfileData>,
    userData?: { fullName?: string; email?: string }
  ) => {
    setUpdating(true);
    try {
      // MODO DEMO - SIMULA ATUALIZAÇÃO
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (profileData && setProfileData) {
        setProfileData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              ...(userData?.fullName && { fullName: userData.fullName }),
              ...(userData?.email && { email: userData.email }),
            },
            profile: {
              ...prev.profile,
              ...profileData,
            },
          };
        });
      }

      toast.success("Perfil atualizado com sucesso!");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao atualizar perfil. Tente novamente.";
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    profileData,
    loading,
    updating,
    updateProfile,
    refetch: fetchProfile,
  };
}

