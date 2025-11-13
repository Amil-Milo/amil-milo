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
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const patientNavItems = [
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/programa", label: "Jornada", icon: Heart },
  { to: "/prontuario", label: "Prontuário", icon: FileText },
  { to: "/conteudos", label: "Conteúdos", icon: Library },
  { to: "/diario", label: "Diário", icon: BookOpen },
];

const adminNavItems = [
  { to: "/admin", label: "Painel", icon: LayoutDashboard },
  { to: "/admin/pacientes", label: "Pacientes", icon: Users },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navItems = user?.role === "ADMIN" ? adminNavItems : patientNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border flex flex-col shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <span className="text-2xl font-bold text-primary">amil</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 relative">
        {/* Animated Journey Path */}
        <div className="absolute left-9 top-0 bottom-0 w-1">
          {/* Background path */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full" />
          
          {/* Active progress indicator */}
          <div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-primary to-primary/50 rounded-full transition-all duration-700 ease-out"
            style={{ 
              height: `${((navItems.findIndex(item => location.pathname === item.to) + 1) / navItems.length) * 100}%` 
            }}
          />
        </div>
        
        {/* Nav items */}
        <div className="space-y-2 relative">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            const isPast = navItems.findIndex(i => location.pathname === i.to) > index;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-4 px-3 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 group relative"
              >
                {/* Journey dot indicator */}
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
                    {/* Inner glow for active */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                    )}
                    
                    {/* Checkmark for completed */}
                    {isPast && !isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-background" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Icon */}
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "scale-110 text-primary" : "group-hover:scale-105"
                )} />
                
                {/* Label */}
                <span className={cn(
                  "transition-all duration-300 text-sm",
                  isActive ? "font-semibold text-primary scale-105" : "group-hover:text-foreground"
                )}>
                  {item.label}
                </span>

                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full animate-fade-in" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Journey completion indicator */}
        {user?.role === "PATIENT" && (
          <div className="absolute left-9 -translate-x-1/2 bottom-6 z-10">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-500",
              location.pathname === navItems[navItems.length - 1].to
                ? "bg-primary scale-150 shadow-lg shadow-primary/50 animate-pulse"
                : "bg-border scale-100"
            )} />
          </div>
        )}
      </nav>

      {/* Footer */}
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
