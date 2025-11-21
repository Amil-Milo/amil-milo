import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  BookOpen,
  FileText,
  Heart,
  Library,
  UserCircle,
  Bell,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const generalNavItems = [
  { to: "/perfil", label: "Perfil", icon: UserCircle },
  { to: "/notificacoes", label: "Notificações", icon: Bell },
];

const programNavItems = [
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/jornada", label: "Jornada", icon: Heart },
  { to: "/prontuario", label: "Prontuário", icon: FileText },
  { to: "/conteudos", label: "Conteúdos", icon: Library },
  { to: "/diario", label: "Diário", icon: BookOpen },
];

export const SidebarMobile = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";
  const hasAssignedLine = !!user?.assignedLineId;

  const allNavItems = isAdmin
    ? programNavItems
    : hasAssignedLine
    ? [...generalNavItems, ...programNavItems]
    : generalNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {allNavItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px] font-medium leading-tight text-center">
                {item.label}
              </span>
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-medium leading-tight">Sair</span>
        </button>
      </div>
    </nav>
  );
};


