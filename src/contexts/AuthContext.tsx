import { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; error?: string }>;
  register: (data: { fullName: string; cpf: string; email: string; passwordHash: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa o usuário do localStorage imediatamente se existir
  const getInitialUser = (): User | null => {
    if (typeof window === 'undefined') return null;
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
        
        // Só tenta buscar perfil se o usuário for PATIENT ou USER
        // E se já tiver patientProfile nos dados retornados (evita 404 desnecessários)
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
                  ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
                  : undefined,
              };
              formattedUser.isInLine = !!profile.assignedLineId;
              formattedUser.careLine = profile.assignedLine?.name;
              formattedUser.assignedLineId = profile.assignedLineId || null;
            }
          } catch (error: any) {
            // Silencia erros 404 - usuário pode ainda não ter criado perfil
          }
        }
        
        // Sempre atualiza o usuário no estado e no localStorage com as informações atualizadas
        // Isso garante que a role seja sempre correta
        setUser(formattedUser);
        localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        return true;
      }
      return false;
    } catch (error: any) {
      // Se o erro for 401 (não autorizado), o token é inválido
      if (error.response?.status === 401) {
        return false;
      }
      // Para outros erros, assumimos que o token pode ser válido mas houve problema na requisição
      // Mantemos o usuário logado com os dados do localStorage
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("currentUser");
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Define o usuário imediatamente para manter a sessão
          // Isso garante que isAuthenticated seja true imediatamente
          setUser(parsedUser);
          
          // Valida o token em background para atualizar as informações do usuário
          // Isso garante que a role seja atualizada se necessário
          validateToken().catch((error) => {
            // Se a validação falhar com 401, limpa tudo
            if (error?.response?.status === 401) {
              setUser(null);
              localStorage.removeItem("authToken");
              localStorage.removeItem("currentUser");
              localStorage.removeItem("isAuthenticated");
            }
            // Para outros erros, mantém o usuário logado
          });
        } catch (error) {
          // Em caso de erro ao parsear, mantém o usuário se o token existir
          // Só limpa se não houver token
          if (!token) {
            setUser(null);
            localStorage.removeItem("authToken");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isAuthenticated");
          }
        }
      }
      // Define loading como false imediatamente após restaurar o usuário
      // Não espera a validação do token
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
      } else if (activeRoles.includes("CLINIC_OWNER")) {
        role = "CLINIC_OWNER";
      } else if (activeRoles.includes("CLINIC_STAFF")) {
        role = "CLINIC_STAFF";
      } else if (activeRoles.includes("PATIENT")) {
        role = "PATIENT";
      } else if (activeRoles.includes("USER")) {
        role = "PATIENT"; // USER é tratado como PATIENT no frontend
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
      profileData: apiUser.patientProfile ? {
        height: apiUser.patientProfile.height,
        weight: apiUser.patientProfile.weight,
        bloodType: apiUser.patientProfile.bloodType,
        age: apiUser.patientProfile.dateOfBirth 
          ? new Date().getFullYear() - new Date(apiUser.patientProfile.dateOfBirth).getFullYear()
          : undefined,
      } : undefined,
    };
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      if (response.token && response.user) {
        // Store token
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
          } catch (error) {
            // Usuário pode não ter perfil ainda
          }
        }
        
        setUser(formattedUser);
        localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        localStorage.setItem("isAuthenticated", "true");
        
        // Return success and redirect path based on role
        if (formattedUser.role === "ADMIN" || formattedUser.role === "CLINIC_OWNER" || formattedUser.role === "CLINIC_STAFF") {
          return { success: true, redirectTo: "/admin" };
        } else {
          // Verificar se tem PatientProfile com linha atribuída
          if (formattedUser.isInLine) {
            // Verificar se tem dados completos
            try {
              const profile = await patientProfileApi.getProfile();
              const hasCompleteData = profile?.dateOfBirth && profile?.bloodType && profile?.height && profile?.weight;
              if (hasCompleteData) {
                return { success: true, redirectTo: "/agenda" };
              } else {
                return { success: true, redirectTo: "/completar-perfil" };
              }
            } catch (error) {
              return { success: true, redirectTo: "/check-in-periodico" };
            }
          } else {
            return { success: true, redirectTo: "/check-in-periodico" };
          }
        }
      } else {
        return { success: false, error: "Resposta inválida do servidor" };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao fazer login";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data: { fullName: string; cpf: string; email: string; passwordHash: string }) => {
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
      } else {
        return { success: false, error: "Resposta inválida do servidor" };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao realizar cadastro";
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
