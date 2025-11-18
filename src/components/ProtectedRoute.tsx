import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { patientProfileApi } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePatientProfile?: boolean;
  requireAssignedLine?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requirePatientProfile = false,
  requireAssignedLine = false,
  requireAdmin = false
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasAssignedLine, setHasAssignedLine] = useState(false);
  const [hasCompleteData, setHasCompleteData] = useState(false);
  
  // Verifica se há token no localStorage para não redirecionar durante o loading
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('authToken');

  useEffect(() => {
    if (!isAuthenticated || !user || loading) {
      return;
    }

    const isAdmin = user.role === "ADMIN";
    const currentPath = location.pathname;

    if (!isAdmin && user.assignedLineId && currentPath === '/check-in-periodico') {
      navigate('/agenda', { replace: true });
      return;
    }

    if (!isAdmin && !user.assignedLineId && (
      currentPath.startsWith('/agenda') ||
      currentPath.startsWith('/jornada') ||
      currentPath.startsWith('/prontuario') ||
      currentPath.startsWith('/diario') ||
      (currentPath.startsWith('/conteudos') && requireAssignedLine)
    )) {
      navigate('/check-in-periodico', { replace: true });
      return;
    }

    if (isAdmin && requireAssignedLine) {
      return;
    }
  }, [isAuthenticated, user, loading, location.pathname, navigate, requireAssignedLine]);

  useEffect(() => {
    const checkProfile = async () => {
      // Se não estiver autenticado ou não houver usuário, não precisa verificar perfil
      if (!isAuthenticated || !user) {
        setProfileLoading(false);
        return;
      }

      // ADMIN, CLINIC_OWNER e CLINIC_STAFF não precisam de perfil de paciente
      if (user.role === 'ADMIN' || user.role === 'CLINIC_OWNER' || user.role === 'CLINIC_STAFF') {
        setProfileLoading(false);
        return;
      }

      // Só verifica perfil se for necessário (requirePatientProfile ou requireAssignedLine)
      if (!requirePatientProfile && !requireAssignedLine) {
        setProfileLoading(false);
        return;
      }

      try {
        const profile = await patientProfileApi.getProfile();
        if (profile) {
          setHasProfile(true);
          setHasAssignedLine(!!profile.assignedLineId);
          const complete = !!(profile.dateOfBirth && profile.bloodType && profile.height && profile.weight);
          setHasCompleteData(complete);
        } else {
          setHasProfile(false);
          setHasAssignedLine(false);
          setHasCompleteData(false);
        }
      } catch (error: any) {
        // Silencia erros 404 - usuário pode ainda não ter criado perfil
        setHasProfile(false);
        setHasAssignedLine(false);
        setHasCompleteData(false);
      } finally {
        setProfileLoading(false);
      }
    };

    if (isAuthenticated && user) {
      checkProfile();
    } else {
      setProfileLoading(false);
    }
  }, [isAuthenticated, user, requirePatientProfile, requireAssignedLine]);

  // Durante o loading, mostra tela de carregamento
  // Se houver token, aguarda a validação antes de redirecionar
  if (loading) {
    if (hasToken) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Só redireciona para login se não estiver autenticado E não houver token
  // Isso evita redirecionamento durante a inicialização
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Se ainda não está autenticado mas há token, aguarda um pouco mais
  // Isso pode acontecer durante a validação do token
  if (!isAuthenticated && hasToken && !loading) {
    // Aguarda um pouco para dar tempo da validação do token
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin) {
    // Se houver token mas ainda não estiver autenticado, aguarda
    // Isso evita redirecionamento durante a inicialização
    if (hasToken && !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
          </div>
        </div>
      );
    }
    
    // Só redireciona se realmente não for ADMIN e estiver autenticado
    // Se não estiver autenticado e não houver token, já foi tratado acima
    if (isAuthenticated && user && user.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    
    // Se não estiver autenticado e não houver token, redireciona para login
    if (!isAuthenticated && !hasToken) {
      return <Navigate to="/login" replace />;
    }
  }

  if (requirePatientProfile && !hasProfile) {
    const isAdmin = user?.role === "ADMIN";
    if (!isAdmin) {
      return <Navigate to="/check-in-periodico" replace />;
    }
  }

  if (requireAssignedLine) {
    const isAdmin = user?.role === "ADMIN";
    if (isAdmin) {
      return <>{children}</>;
    }
    
    if (!hasProfile || !hasAssignedLine) {
      return <Navigate to="/check-in-periodico" replace />;
    }
    
    if (hasProfile && hasAssignedLine && !hasCompleteData) {
      return <Navigate to="/completar-perfil" replace />;
    }
  }

  return <>{children}</>;
}

