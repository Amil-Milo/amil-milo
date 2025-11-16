import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart, Eye, EyeOff } from "lucide-react";
import miloFront from "@/assets/milo-front.jpg";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.email && formData.password) {
      setLoading(true);
      try {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success("Login realizado com sucesso!");
          navigate(result.redirectTo || "/agenda");
        } else {
          toast.error(result.error || "E-mail ou senha incorretos. Verifique e tente novamente.");
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao fazer login. Tente novamente.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Preencha todos os campos para continuar");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-primary">amil</span>
          </Link>
          <img
            src={miloFront}
            alt="Milo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-muted-foreground">
            O Milo está esperando por você
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary text-white" loading={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="text-primary font-medium hover:underline">
              Cadastre-se agora
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Voltar ao site
          </Link>
        </div>
      </Card>
    </div>
  );
}
