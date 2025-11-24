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
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userResponse = await usersApi.getCurrentUser();

      const user: UserData = {
        id: userResponse.id,
        fullName: userResponse.fullName,
        email: userResponse.email,
        cpf: userResponse.cpf || "",
      };

      const userRole = userResponse.userRole?.[0]?.role?.name;
      const isNewUser = userRole === "USER" || !userRole;

      if (isNewUser) {
        setProfileData({
          user,
          profile: {},
        });
        setLoading(false);
        return;
      }

      const profileResponse = await patientProfileApi.getProfile();
      const profile: PatientProfileData = profileResponse || {};

      setProfileData({
        user,
        profile,
      });
    } catch (error) {
      setProfileData(null);
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

      if (userData) {
        promises.push(usersApi.updateUser(userData));
      }

      if (profileData) {
        promises.push(patientProfileApi.updateProfile(profileData));
      }

      await Promise.all(promises);

      await fetchProfile();

      toast.success("Perfil atualizado com sucesso!");
      setUpdating(false);
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar perfil";
      toast.error(errorMessage);
      setUpdating(false);
      return false;
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
