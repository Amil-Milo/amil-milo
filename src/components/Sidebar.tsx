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
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";

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
  { to: "/admin/pacientes", label: "Pacientes", icon: Users },
];

const navPadding = 1.5;
const itemPadding = 0.75;
const itemSpacing = 0.5;
const circleSize = 1.25;
const lineLeft = '2.875rem';
const titleHeight = 2;
const sectionSpacing = 1.5;

const getSectionTopOffset = (sectionIndex: number) => {
  let offset = navPadding;
  
  if (sectionIndex === 0) {
    return offset + titleHeight + itemPadding;
  }
  
  offset += titleHeight + itemPadding;
  offset += generalNavItems.length * (itemPadding + itemSpacing + itemPadding + circleSize);
  offset += sectionSpacing + titleHeight;
  
  return offset + itemPadding;
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { profileData } = useUserProfile();
  
  const isAdmin = user?.role === "ADMIN";
  const hasAssignedLine = !!user?.assignedLineId;
  const assignedLineName = profileData?.profile?.assignedLine?.name || user?.careLine || "";

  const generalActiveIndex = generalNavItems.findIndex(item => location.pathname === item.to);
  const programActiveIndex = programNavItems.findIndex(item => location.pathname === item.to);
  
  const generalTopOffset = getSectionTopOffset(0);
  const programTopOffset = getSectionTopOffset(1);
  
  const itemHeight = itemPadding + itemSpacing + itemPadding + circleSize;
  
  const generalFirstCenter = generalTopOffset + (circleSize / 2);
  const generalLastCenter = generalFirstCenter + ((generalNavItems.length - 1) * itemHeight);
  const generalLineHeight = generalLastCenter - generalFirstCenter;
  
  const programFirstCenter = programTopOffset + (circleSize / 2);
  const programLastCenter = programFirstCenter + ((programNavItems.length - 1) * itemHeight);
  const programLineHeight = programLastCenter - programFirstCenter;

  const generalLineIsActive = generalActiveIndex !== -1 || programActiveIndex !== -1;
  const generalActiveLineHeight = generalActiveIndex !== -1 
    ? (generalActiveIndex * itemHeight) + circleSize
    : programActiveIndex !== -1
    ? generalLineHeight
    : 0;
  
  const programLineIsActive = programActiveIndex !== -1;
  const programActiveLineHeight = programActiveIndex !== -1
    ? (programActiveIndex * itemHeight) + circleSize
    : 0;

  const isGeneralItemPast = (index: number) => {
    if (generalActiveIndex !== -1 && generalActiveIndex > index) return true;
    if (programActiveIndex !== -1) return true;
    return false;
  };

  const isProgramItemPast = (index: number) => {
    if (programActiveIndex !== -1 && programActiveIndex > index) return true;
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border flex flex-col shadow-soft">
      <Link to="/" className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <span className="text-2xl font-bold text-primary">Cuidadomil</span>
        </div>
      </Link>

      <nav className="flex-1 p-6 relative overflow-y-auto">
        {!isAdmin && (
          <>
            {generalNavItems.length > 0 && (
              <div 
                className="absolute w-0.5 overflow-hidden"
                style={{ 
                  left: lineLeft,
                  top: `${generalFirstCenter}rem`,
                  height: `${generalLineHeight}rem`,
                }}
              >
                {generalLineIsActive ? (
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/60 via-primary/50 to-primary/40 rounded-full transition-all duration-700 ease-out shadow-sm shadow-primary/20"
                    style={{ 
                      top: '0',
                      height: `${generalActiveLineHeight}rem`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 rounded-full animate-pulse-wave" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-full animate-light-travel" />
                  </div>
                ) : (
                  <>
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/15 via-primary/10 to-primary/5 rounded-full transition-all duration-700 ease-out"
                    />
                    <div 
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{
                        background: `linear-gradient(to bottom, transparent 0%, hsl(var(--primary) / 0.5) 50%, transparent 100%)`,
                        height: '30%',
                        animation: 'shimmer-sequential 2s ease-in-out infinite',
                        animationDelay: '0s',
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {hasAssignedLine && programNavItems.length > 0 && (
              <div 
                className="absolute w-0.5 overflow-hidden"
                style={{ 
                  left: lineLeft,
                  top: `${programFirstCenter}rem`,
                  height: `${programLineHeight}rem`,
                }}
              >
                {programLineIsActive ? (
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-full bg-gradient-to-b from-primary/60 via-primary/50 to-primary/40 rounded-full transition-all duration-700 ease-out shadow-sm shadow-primary/20"
                    style={{ 
                      top: '0',
                      height: `${programActiveLineHeight}rem`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 rounded-full animate-pulse-wave" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-full animate-light-travel" />
                  </div>
                ) : (
                  <>
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/15 via-primary/10 to-primary/5 rounded-full transition-all duration-700 ease-out"
                    />
                    <div 
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{
                        background: `linear-gradient(to bottom, transparent 0%, hsl(var(--primary) / 0.5) 50%, transparent 100%)`,
                        height: '30%',
                        animation: 'shimmer-sequential 2s ease-in-out infinite',
                        animationDelay: '1s',
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </>
        )}
        
        <div className="space-y-6 relative">
          {!isAdmin && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Conta
              </h3>
              {generalNavItems.map((item, index) => {
                const isActive = location.pathname === item.to;
                const isPast = isGeneralItemPast(index);
                
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-4 px-3 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 group relative"
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      <div 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 transition-all duration-300 relative",
                          isActive 
                            ? "border-primary bg-primary scale-125 shadow-lg shadow-primary/50" 
                            : isPast
                            ? "border-primary bg-primary/80 scale-100"
                            : "border-border bg-background group-hover:border-primary/60 group-hover:scale-110"
                        )}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                        )}
                        {isPast && !isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-background" />
                          </div>
                        )}
                      </div>
                    </div>
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "scale-110 text-primary" : "group-hover:scale-105"
                    )} />
                    <span className={cn(
                      "transition-all duration-300 text-sm",
                      isActive ? "font-semibold text-primary scale-105" : "group-hover:text-foreground"
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full animate-fade-in" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          {hasAssignedLine && !isAdmin && (
            <div className="space-y-2">
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Programa Cuidadomil
                </h3>
                {assignedLineName && (
                  <p className="text-xs text-muted-foreground italic">
                    {assignedLineName}
                  </p>
                )}
              </div>
              {programNavItems.map((item, index) => {
                const isActive = location.pathname === item.to;
                const isPast = isProgramItemPast(index);
                
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-4 px-3 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 group relative"
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      <div 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 transition-all duration-300 relative",
                          isActive 
                            ? "border-primary bg-primary scale-125 shadow-lg shadow-primary/50" 
                            : isPast
                            ? "border-primary bg-primary/80 scale-100"
                            : "border-border bg-background group-hover:border-primary/60 group-hover:scale-110"
                        )}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                        )}
                        {isPast && !isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-background" />
                          </div>
                        )}
                      </div>
                    </div>
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "scale-110 text-primary" : "group-hover:scale-105"
                    )} />
                    <span className={cn(
                      "transition-all duration-300 text-sm",
                      isActive ? "font-semibold text-primary scale-105" : "group-hover:text-foreground"
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full animate-fade-in" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          {isAdmin && (
            <div className="space-y-2">
              {adminNavItems.map((item, index) => {
                const isActive = location.pathname === item.to;
                const isPast = adminNavItems.findIndex(i => location.pathname === i.to) > index;
                
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-4 px-3 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 group relative"
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      <div 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 transition-all duration-300 relative",
                          isActive 
                            ? "border-primary bg-primary scale-125 shadow-lg shadow-primary/50" 
                            : isPast
                            ? "border-primary bg-primary/80 scale-100"
                            : "border-border bg-background group-hover:border-primary/60 group-hover:scale-110"
                        )}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                        )}
                        {isPast && !isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-background" />
                          </div>
                        )}
                      </div>
                    </div>
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "scale-110 text-primary" : "group-hover:scale-105"
                    )} />
                    <span className={cn(
                      "transition-all duration-300 text-sm",
                      isActive ? "font-semibold text-primary scale-105" : "group-hover:text-foreground"
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full animate-fade-in" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 group"
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
};
