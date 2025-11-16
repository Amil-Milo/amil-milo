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
      const [userData, profileDataResponse] = await Promise.all([
        usersApi.getCurrentUser(),
        patientProfileApi.getProfile().catch(() => null),
      ]);

      const profile: PatientProfileData = profileDataResponse
        ? {
            dateOfBirth: profileDataResponse.dateOfBirth
              ? new Date(profileDataResponse.dateOfBirth).toISOString().split("T")[0]
              : undefined,
            bloodType: profileDataResponse.bloodType || undefined,
            height: profileDataResponse.height || undefined,
            weight: profileDataResponse.weight || undefined,
            diseases: profileDataResponse.diseases || undefined,
            medications: profileDataResponse.medications || undefined,
            familyHistory: profileDataResponse.familyHistory || undefined,
            specialConditions: profileDataResponse.specialConditions || undefined,
            address: profileDataResponse.address || null,
            assignedLineId: profileDataResponse.assignedLineId || null,
            assignedLine: profileDataResponse.assignedLine || null,
          }
        : {
            address: null,
            assignedLineId: null,
            assignedLine: null,
          };

      setProfileData({
        user: {
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          cpf: userData.cpf || "",
        },
        profile,
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
      const updateProfilePayload: any = {};

      if (profileData.dateOfBirth !== undefined) {
        updateProfilePayload.dateOfBirth = profileData.dateOfBirth;
      }
      if (profileData.bloodType !== undefined) {
        updateProfilePayload.bloodType = profileData.bloodType;
      }
      if (profileData.height !== undefined) {
        updateProfilePayload.height = profileData.height;
      }
      if (profileData.weight !== undefined) {
        updateProfilePayload.weight = profileData.weight;
      }
      if (profileData.diseases !== undefined) {
        updateProfilePayload.diseases = profileData.diseases;
      }
      if (profileData.medications !== undefined) {
        updateProfilePayload.medications = profileData.medications;
      }
      if (profileData.familyHistory !== undefined) {
        updateProfilePayload.familyHistory = profileData.familyHistory;
      }
      if (profileData.specialConditions !== undefined) {
        updateProfilePayload.specialConditions = profileData.specialConditions;
      }
      if (profileData.address !== undefined) {
        updateProfilePayload.address = profileData.address;
      }

      const promises = [];

      if (Object.keys(updateProfilePayload).length > 0) {
        promises.push(patientProfileApi.updateProfile(updateProfilePayload));
      }

      if (userData && (userData.fullName || userData.email)) {
        const updateUserPayload: any = {};
        if (userData.fullName) {
          updateUserPayload.fullName = userData.fullName;
        }
        if (userData.email) {
          updateUserPayload.email = userData.email;
        }
        promises.push(usersApi.updateUser(updateUserPayload));
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

