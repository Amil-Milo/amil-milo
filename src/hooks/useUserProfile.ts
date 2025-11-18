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
      const [userData, profileData] = await Promise.all([
        usersApi.getCurrentUser(),
        patientProfileApi.getProfile().catch(() => null),
      ]);

      if (userData) {
        const user: UserData = {
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          cpf: userData.cpf,
        };

        const profile: PatientProfileData = profileData
          ? {
              dateOfBirth: profileData.dateOfBirth,
              bloodType: profileData.bloodType,
              height: profileData.height,
              weight: profileData.weight,
              diseases: profileData.diseases,
              medications: profileData.medications,
              familyHistory: profileData.familyHistory,
              specialConditions: profileData.specialConditions,
              address: profileData.address,
              assignedLineId: profileData.assignedLineId,
              assignedLine: profileData.assignedLine,
            }
          : {};

        setProfileData({
          user,
          profile,
        });
      }
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
      const promises = [];

      if (userData && (userData.fullName || userData.email)) {
        promises.push(usersApi.updateUser(userData));
      }

      if (profileData && Object.keys(profileData).length > 0) {
        promises.push(patientProfileApi.updateProfile(profileData));
      }

      await Promise.all(promises);

      await fetchProfile();

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

