import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { authApi, usersApi, patientProfileApi } from "@/lib/api";

export type UserRole = "PATIENT" | "ADMIN" | "CLINIC_STAFF" | "CLINIC_OWNER";

export interface User {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  role: UserRole;
  isInLine?: boolean;
  careLine?: string;
  assignedLineId?: number | null;
  profileData?: {
    height?: number;
    weight?: number;
    bloodType?: string;
    age?: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; redirectTo?: string; error?: string }>;
  register: (data: {
    fullName: string;
    cpf: string;
    email: string;
    passwordHash: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa o usuário do localStorage imediatamente se existir
  const getInitialUser = (): User | null => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState<User | null>(getInitialUser());
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
  };

  const validateToken = async () => {
    try {
      const userData = await usersApi.getCurrentUser();
      if (userData) {
        const formattedUser = formatUserFromApi(userData);

        const shouldFetchProfile =
          (formattedUser.role === "PATIENT" || formattedUser.role === "USER") &&
          userData.patientProfile &&
          userData.patientProfile.id;

        if (shouldFetchProfile) {
          try {
            const profile = await patientProfileApi.getProfile();
            if (profile) {
              formattedUser.profileData = {
                height: profile.height,
                weight: profile.weight,
                bloodType: profile.bloodType,
                age: profile.dateOfBirth
                  ? new Date().getFullYear() -
                    new Date(profile.dateOfBirth).getFullYear()
                  : undefined,
              };
              formattedUser.isInLine = !!profile.assignedLineId;
              formattedUser.careLine = profile.assignedLine?.name;
              formattedUser.assignedLineId = profile.assignedLineId || null;
            }
          } catch (error: any) {
            if (error.response?.status !== 404) {
              console.error("Error fetching profile:", error);
            }
          }
        }

        setUser(formattedUser);
        localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return false;
      }
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const isValid = await validateToken();
        if (!isValid) {
          setUser(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("currentUser");
          localStorage.removeItem("isAuthenticated");
        }
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const formatUserFromApi = (apiUser: any): User => {
    // Determine role from user roles
    // Prioridade: ADMIN > CLINIC_OWNER > CLINIC_STAFF > PATIENT
    let role: UserRole = "PATIENT";

    if (apiUser.userRole && apiUser.userRole.length > 0) {
      // Filtra apenas roles não deletadas e mapeia os nomes
      const activeRoles = apiUser.userRole
        .filter((ur: any) => !ur.deletedAt && ur.role && !ur.role.deletedAt)
        .map((ur: any) => ur.role?.name?.toUpperCase());

      if (activeRoles.includes("ADMIN")) {
        role = "ADMIN";
      }
      if (activeRoles.includes("CLINIC_OWNER") && role !== "ADMIN") {
        role = "CLINIC_OWNER";
      }
      if (activeRoles.includes("CLINIC_STAFF") && role !== "ADMIN" && role !== "CLINIC_OWNER") {
        role = "CLINIC_STAFF";
      }
      if (activeRoles.includes("PATIENT") && role === "PATIENT") {
        role = "PATIENT";
      }
      if (activeRoles.includes("USER") && role === "PATIENT") {
        role = "PATIENT";
      }
    }

    return {
      id: apiUser.id,
      name: apiUser.fullName,
      email: apiUser.email,
      role,
      isInLine: apiUser.patientProfile?.assignedLineId ? true : false,
      careLine: apiUser.patientProfile?.assignedLine?.name,
      assignedLineId: apiUser.patientProfile?.assignedLineId || null,
      profileData: apiUser.patientProfile
        ? {
            height: apiUser.patientProfile.height,
            weight: apiUser.patientProfile.weight,
            bloodType: apiUser.patientProfile.bloodType,
            age: apiUser.patientProfile.dateOfBirth
              ? new Date().getFullYear() -
                new Date(apiUser.patientProfile.dateOfBirth).getFullYear()
              : undefined,
          }
        : undefined,
    };
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      if (response.token && response.user) {
        localStorage.setItem("authToken", response.token);
        
        const formattedUser = formatUserFromApi(response.user);
        
        if (formattedUser.role !== "ADMIN") {
          try {
            const profile = await patientProfileApi.getProfile();
            if (profile) {
              formattedUser.profileData = {
                height: profile.height,
                weight: profile.weight,
                bloodType: profile.bloodType,
                age: profile.dateOfBirth 
                  ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
                  : undefined,
              };
              formattedUser.isInLine = !!profile.assignedLineId;
              formattedUser.careLine = profile.assignedLine?.name;
              formattedUser.assignedLineId = profile.assignedLineId || null;
            }
          } catch (error: any) {
            if (error.response?.status !== 404) {
              console.error("Error fetching profile during login:", error);
            }
          }
        }
        
        setUser(formattedUser);
        localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        localStorage.setItem("isAuthenticated", "true");
        
        if (formattedUser.role === "ADMIN" || formattedUser.role === "CLINIC_OWNER" || formattedUser.role === "CLINIC_STAFF") {
          return { success: true, redirectTo: "/admin" };
        }
        
        if (formattedUser.isInLine) {
          try {
            const profile = await patientProfileApi.getProfile();
            const hasCompleteData = profile?.dateOfBirth && profile?.bloodType && profile?.height && profile?.weight;
            if (hasCompleteData) {
              return { success: true, redirectTo: "/agenda" };
            }
            return { success: true, redirectTo: "/completar-perfil" };
          } catch (error: any) {
            if (error.response?.status !== 404) {
              console.error("Error fetching profile for redirect:", error);
            }
            return { success: true, redirectTo: "/check-in-periodico" };
          }
        }
        
        return { success: true, redirectTo: "/check-in-periodico" };
      }
      
      return { success: false, error: "Resposta inválida do servidor" };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao fazer login";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data: {
    fullName: string;
    cpf: string;
    email: string;
    passwordHash: string;
  }) => {
    try {
      const response = await authApi.register(data);

      if (response.token && response.registerData) {
        // Store token
        localStorage.setItem("authToken", response.token);

        // Format and store user
        const formattedUser = formatUserFromApi(response.registerData);
        setUser(formattedUser);
        localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        localStorage.setItem("isAuthenticated", "true");

        return { success: true };
      }
      
      return { success: false, error: "Resposta inválida do servidor" };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao realizar cadastro";
      return { success: false, error: errorMessage };
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
