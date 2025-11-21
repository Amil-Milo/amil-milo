import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  BookOpen,
  FileText,
  Heart,
  Library,
  Users,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Bell,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const generalNavItems = [
  { to: "/perfil", label: "Meu Perfil", icon: UserCircle },
  { to: "/notificacoes", label: "Notificações", icon: Bell },
];

const programNavItems = [
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/jornada", label: "Jornada", icon: Heart },
  { to: "/prontuario", label: "Prontuário", icon: FileText },
  { to: "/conteudos", label: "Conteúdos", icon: Library },
  { to: "/diario", label: "Diário", icon: BookOpen },
];

const adminNavItems = [
  { to: "/admin", label: "Painel", icon: LayoutDashboard },
];

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarSectionProps {
  title: string;
  subtitle?: string;
  items: NavItem[];
  location: { pathname: string };
  markAllAsCompleted?: boolean; // Se true, todos os itens são marcados como completos
  isCollapsed?: boolean;
}

const SidebarSection = ({
  title,
  subtitle,
  items,
  location,
  markAllAsCompleted = false,
  isCollapsed = false,
}: SidebarSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [linePositions, setLinePositions] = useState<
    Array<{ top: number; height: number; left: number }>
  >([]);

  // Encontra o índice da rota atual dentro deste grupo
  const currentIndex = items.findIndex((item) => location.pathname === item.to);

  // Se todos devem ser marcados como completos, currentIndex é tratado como o último índice
  const effectiveIndex = markAllAsCompleted ? items.length - 1 : currentIndex;
  const hasActiveItem = currentIndex !== -1 || markAllAsCompleted;

  // Calcula posições das linhas entre cada par de itens
  const calculateLinePositions = () => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const positions: Array<{ top: number; height: number; left: number }> = [];

    // Para cada par de itens consecutivos (i e i+1)
    for (let i = 0; i < items.length - 1; i++) {
      const currentItem = section.querySelector(
        `[data-nav-item]:nth-child(${i + 1})`
      ) as HTMLElement;
      const nextItem = section.querySelector(
        `[data-nav-item]:nth-child(${i + 2})`
      ) as HTMLElement;

      if (!currentItem || !nextItem) continue;

      const currentCircle = currentItem.querySelector(
        "[data-nav-circle]"
      ) as HTMLElement;
      const nextCircle = nextItem.querySelector(
        "[data-nav-circle]"
      ) as HTMLElement;

      if (!currentCircle || !nextCircle) continue;

      const sectionRect = section.getBoundingClientRect();
      const currentRect = currentCircle.getBoundingClientRect();
      const nextRect = nextCircle.getBoundingClientRect();

      const currentCenterY =
        currentRect.top + currentRect.height / 2 - sectionRect.top;
      const nextCenterY = nextRect.top + nextRect.height / 2 - sectionRect.top;
      const circleCenterX =
        currentRect.left + currentRect.width / 2 - sectionRect.left;

      positions.push({
        top: currentCenterY,
        height: nextCenterY - currentCenterY,
        left: circleCenterX,
      });
    }

    setLinePositions(positions);
  };

  useEffect(() => {
    calculateLinePositions();

    const resizeObserver = new ResizeObserver(() => {
      calculateLinePositions();
    });

    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }

    const timeoutId = setTimeout(calculateLinePositions, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [items.length, location.pathname]);

  // Lógica matemática para determinar estados:
  // Para Bolinha (Item i): isActive = currentIndex >= i (azul se for o atual ou anterior)
  // Para Linha (entre i e i+1): isActive = currentIndex > i (azul se o item atual for i+1 ou maior)

  const isItemActive = (index: number) => {
    if (markAllAsCompleted) return true;
    if (currentIndex === -1) return false;
    return currentIndex >= index;
  };

  const isItemCurrent = (index: number) => {
    if (markAllAsCompleted) return false;
    return currentIndex === index;
  };

  const isLineActive = (index: number) => {
    // Linha entre item i e i+1 fica azul se currentIndex > i
    // Se markAllAsCompleted é true, todas as linhas são azuis
    if (markAllAsCompleted) return true;
    // Se não há item ativo, nenhuma linha é azul
    if (currentIndex === -1) return false;
    // Linha fica azul se o índice ativo é maior que o índice da linha
    return currentIndex > index;
  };

  return (
    <div
      ref={sectionRef}
      className={cn("relative", isCollapsed ? "space-y-1" : "space-y-2")}
    >
      {!isCollapsed && (
        <div className={cn("mb-2", isCollapsed ? "px-1" : "px-3")}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground italic">{subtitle}</p>
          )}
        </div>
      )}

      {/* Linhas verticais entre cada par de itens consecutivos */}
      {!isCollapsed &&
        linePositions.map((linePos, index) => {
          // Lógica: linha entre item i e i+1 fica azul se currentIndex > i
          const lineIsActive = isLineActive(index);

          // Garante que a linha tenha altura mínima para ser visível
          if (linePos.height <= 0) return null;

          return (
            <div
              key={`line-${index}`}
              className="absolute w-0.5 overflow-hidden pointer-events-none z-0"
              style={{
                left: `${linePos.left}px`,
                top: `${linePos.top}px`,
                height: `${linePos.height}px`,
              }}
            >
              {lineIsActive ? (
                <div className="absolute left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/60 via-primary/50 to-primary/40 rounded-full transition-all duration-700 ease-out shadow-sm shadow-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 rounded-full animate-pulse-wave" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-full animate-light-travel" />
                </div>
              ) : (
                <>
                  <div className="absolute left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/15 via-primary/10 to-primary/5 rounded-full transition-all duration-700 ease-out" />
                  <div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      background: `linear-gradient(to bottom, transparent 0%, hsl(var(--primary) / 0.5) 50%, transparent 100%)`,
                      height: "30%",
                      animation: "shimmer-sequential 2s ease-in-out infinite",
                    }}
                  />
                </>
              )}
            </div>
          );
        })}

      {/* Itens de navegação */}
      {items.map((item, index) => {
        const itemIsActive = isItemActive(index);
        const itemIsCurrent = isItemCurrent(index);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            data-nav-item
            className={cn(
              "flex items-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 group relative",
              isCollapsed ? "justify-center px-1.5 py-2" : "gap-4 px-3 py-3"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            {!isCollapsed && (
              <div className="relative z-10 flex items-center justify-center">
                <div
                  data-nav-circle
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all duration-300 relative z-20",
                    itemIsCurrent
                      ? "border-primary bg-primary scale-125 shadow-lg shadow-primary/50"
                      : itemIsActive
                      ? "border-primary bg-primary/80 scale-100"
                      : "border-border bg-background group-hover:border-primary/60 group-hover:scale-110"
                  )}
                >
                  {itemIsCurrent && (
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                  )}
                  {itemIsActive && !itemIsCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-background" />
                    </div>
                  )}
                </div>
              </div>
            )}
            <item.icon
              className={cn(
                "h-5 w-5 transition-all duration-300 flex-shrink-0",
                itemIsCurrent
                  ? "scale-110 text-primary"
                  : itemIsActive
                  ? "text-primary/80"
                  : "group-hover:scale-105"
              )}
            />
            {!isCollapsed && (
              <span
                className={cn(
                  "transition-all duration-300 text-sm",
                  itemIsCurrent
                    ? "font-semibold text-primary scale-105"
                    : itemIsActive
                    ? "text-primary/90"
                    : "group-hover:text-foreground"
                )}
              >
                {item.label}
              </span>
            )}
            {itemIsCurrent && !isCollapsed && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full animate-fade-in" />
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { profileData } = useUserProfile();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isAdmin = user?.role === "ADMIN";
  const hasAssignedLine = !!user?.assignedLineId;
  const assignedLineName =
    profileData?.profile?.assignedLine?.name || user?.careLine || "";

  // Verifica se a rota atual pertence ao Grupo 2 (Programa)
  const isInProgramGroup = programNavItems.some(
    (item) => location.pathname === item.to
  );

  // Se estamos no Grupo 2, o Grupo 1 deve ser marcado como completamente percorrido
  const shouldMarkGeneralAsCompleted =
    !isAdmin && hasAssignedLine && isInProgramGroup;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-shrink-0 h-screen bg-gradient-to-b from-background via-background to-muted/20 border-r border-border flex-col shadow-soft z-50 overflow-hidden will-change-transform transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-border/50",
          isCollapsed ? "p-2 justify-center" : "p-6 justify-between"
        )}
      >
        {!isCollapsed && (
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
          >
            <Heart className="h-8 w-8 text-primary fill-primary flex-shrink-0" />
            <span className="text-2xl font-bold text-primary">Cuidadomil</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("h-8 w-8 flex-shrink-0", isCollapsed && "mx-auto")}
          title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav
        className={cn(
          "flex-1 relative overflow-y-auto",
          isCollapsed ? "p-1.5" : "p-6"
        )}
      >
        <div className="space-y-6 relative">
          {!isAdmin && (
            <SidebarSection
              title="Conta"
              items={generalNavItems}
              location={location}
              markAllAsCompleted={shouldMarkGeneralAsCompleted}
              isCollapsed={isCollapsed}
            />
          )}

          <SidebarSection
            title="Programa Cuidadomil"
            subtitle={assignedLineName || (isAdmin ? "Cardiologia" : "")}
            items={programNavItems}
            location={location}
            isCollapsed={isCollapsed}
          />

          {isAdmin && (
            <SidebarSection
              title="Administração"
              items={adminNavItems}
              location={location}
              isCollapsed={isCollapsed}
            />
          )}
        </div>
      </nav>

      <div
        className={cn("border-t border-border/50", isCollapsed ? "p-1.5" : "p-4")}
      >
        <button
          onClick={logout}
          className={cn(
            "flex items-center w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 group",
            isCollapsed ? "justify-center px-1.5 py-2" : "gap-3 px-4 py-3"
          )}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Sair</span>}
        </button>
      </div>
    </aside>
  );
};
