import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Header = ({ isAuthenticated = false, onLogout }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <div>
              <span className="text-2xl font-bold text-primary">amil</span>
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                Cuidadosmil
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/planos"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Nossos Planos
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sobre o Programa
            </Link>
            <Link
              to="/contato"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/agenda">
                  <Button variant="outline">Minha Agenda</Button>
                </Link>
                <Button variant="destructive" onClick={onLogout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link to="/cadastro">
                  <Button className="bg-gradient-primary">Começar Agora</Button>
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              <Link
                to="/planos"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Nossos Planos
              </Link>
              <Link
                to="/sobre"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Sobre o Programa
              </Link>
              <Link
                to="/contato"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Contato
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
