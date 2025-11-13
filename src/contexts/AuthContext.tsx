import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "PATIENT" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  isInLine: boolean;
  careLine?: string;
  profileData?: {
    height?: number;
    weight?: number;
    bloodType?: string;
    age?: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (cpf: string, password: string) => Promise<{ success: boolean; redirectTo?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated users database
const MOCK_USERS: User[] = [
  {
    id: "patient-1",
    name: "Maria Silva",
    email: "maria@email.com",
    cpf: "123.456.789-00",
    role: "PATIENT",
    isInLine: false,
  },
  {
    id: "patient-2",
    name: "João Santos",
    email: "joao@email.com",
    cpf: "987.654.321-00",
    role: "PATIENT",
    isInLine: true,
    careLine: "cardiologia",
    profileData: {
      height: 1.75,
      weight: 80,
      bloodType: "O+",
      age: 65,
    },
  },
  {
    id: "admin-1",
    name: "Dr. Admin",
    email: "admin@amil.com",
    cpf: "111.222.333-44",
    role: "ADMIN",
    isInLine: false,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (cpf: string, _password: string) => {
    // Simulate API call
    const foundUser = MOCK_USERS.find((u) => u.cpf === cpf);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      localStorage.setItem("isAuthenticated", "true");
      
      // Return success and redirect path based on role
      if (foundUser.role === "ADMIN") {
        return { success: true, redirectTo: "/admin" };
      } else {
        return { success: true, redirectTo: "/agenda" };
      }
    } else {
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
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
        logout,
        updateUser,
        isAuthenticated: !!user,
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
