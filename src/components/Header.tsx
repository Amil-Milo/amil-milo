import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { NotificationsPopup } from "@/components/NotificationsPopup";

export const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage =
    location.pathname === "/" || location.pathname === "/programas/cuidadosmil";

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span
            className="text-4xl md:text-5xl bg-gradient-to-r from-[#003B71] to-[#461BFF] bg-clip-text text-transparent font-amil"
            style={{
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            amil
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link
            to="#"
            className="text-sm font-medium text-gray-700 hover:text-[#461BFF] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Nossos planos
          </Link>
          <Link
            to="/cadastro"
            className="text-sm font-medium text-gray-700 hover:text-[#461BFF] transition-colors"
          >
            Torne-se Cliente
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-gray-700 hover:text-[#461BFF] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Rede credenciada
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {isLandingPage && <NotificationsPopup />}
              <UserProfileMenu />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button className="bg-[#461BFF] hover:opacity-90 text-white font-bold px-6 py-2 rounded-md transition-all flex items-center gap-2">
                  Entrar
                  <ChevronDown className="h-4 w-4" />
                </Button>
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

      {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-200 bg-white">
          <nav className="flex flex-col gap-3 px-4">
            <Link
              to="#"
              className="text-sm font-medium text-gray-700 hover:text-[#461BFF] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
              }}
            >
              Nossos planos
            </Link>
            <Link
              to="/cadastro"
              className="text-sm font-medium text-gray-700 hover:text-[#461BFF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Torne-se Cliente
            </Link>
            <Link
              to="#"
              className="text-sm font-medium text-gray-700 hover:text-[#461BFF] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
              }}
            >
              Rede credenciada
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-sm font-medium text-[#461BFF] hover:text-[#461BFF]/80 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
