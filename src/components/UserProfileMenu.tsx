import { User, LogOut, LayoutDashboard, UserCircle, Calendar, ClipboardList, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Você saiu com sucesso!");
    navigate("/");
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  const handleProfile = () => {
    navigate("/perfil");
  };

  const handleProgram = () => {
    navigate("/agenda");
  };

  const handleCheckin = () => {
    navigate("/check-in-periodico");
  };

  const handleNotifications = () => {
    navigate("/notificacoes");
  };

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "ADMIN";
  const isPatientWithLine = user.role === "PATIENT" && user.assignedLineId;
  const isPatientWithoutLine = user.role === "PATIENT" && !user.assignedLineId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProgram} className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Programa Cuidadomil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCheckin} className="cursor-pointer">
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>Check-In Periódico</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNotifications} className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleAdminPanel} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Painel Administrativo</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:text-destructive focus:!bg-destructive/10 hover:!bg-destructive/10 hover:!text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </>
        )}

        {isPatientWithLine && (
          <>
            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleProgram} className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Programa Cuidadomil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNotifications} className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:text-destructive focus:!bg-destructive/10 hover:!bg-destructive/10 hover:!text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </>
        )}

        {isPatientWithoutLine && (
          <>
            <DropdownMenuItem onClick={handleCheckin} className="cursor-pointer">
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>Check-In Periódico</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNotifications} className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:text-destructive focus:!bg-destructive/10 hover:!bg-destructive/10 hover:!text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

