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
import api from "@/lib/api";

// Função para validar CPF
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

// Função para formatar CPF - formata enquanto digita
const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length <= 3) {
    return numbers;
  }
  
  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  }
  
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  }
  
  if (numbers.length <= 11) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
  
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

// Função para formatar telefone - formata enquanto digita
const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export default function Cadastro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    password: "",
    telefone: "",
  });

  const [cpfError, setCpfError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar CPF
    const cleanCPF = formData.cpf.replace(/\D/g, "");
    if (!validateCPF(cleanCPF)) {
      setCpfError("CPF inválido. Verifique os números digitados.");
      toast.error("CPF inválido. Verifique os números digitados.");
      return;
    }
    setCpfError("");

    // Validate password strength (min 8 chars, at least one uppercase, lowercase, number and symbol)
    // Aceita qualquer símbolo, não apenas @$!%*?&
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("A senha precisa ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo");
      return;
    }

    setLoading(true);
    try {
      // Register user
      const registerResult = await register({
        fullName: formData.nome,
        cpf: cleanCPF,
        email: formData.email,
        passwordHash: formData.password,
      });

      if (!registerResult.success) {
        toast.error(registerResult.error || "Não foi possível criar sua conta. Tente novamente.");
        return;
      }

      // Criar telefone
      if (formData.telefone) {
        try {
          const phoneNumbers = formData.telefone.replace(/\D/g, "");
          const areaCode = phoneNumbers.substring(0, 2);
          const number = phoneNumbers.substring(2);
          
          await api.post("/patient-profile/me/phones", {
            countryCode: "55",
            areaCode: areaCode,
            number: number,
            isPrimary: true,
          });
        } catch (error: any) {
          console.error("Error creating phone:", error);
          // Continue even if phone creation fails
        }
      }

      toast.success("Conta criada com sucesso! Bem-vindo ao Cuidadosmil!");
      navigate("/tour");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Não foi possível criar sua conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-primary">amil</span>
          </Link>
          <img
            src={miloFront}
            alt="Milo"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Criar sua conta
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para começar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setFormData({ ...formData, cpf: formatted });
                    if (cpfError) setCpfError("");
                  }}
                  maxLength={14}
                  required
                />
                {cpfError && (
                  <p className="text-sm text-red-500">{cpfError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setFormData({ ...formData, telefone: formatted });
                  }}
                  maxLength={15}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
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
              <p className="text-xs text-muted-foreground">
                A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary text-white" loading={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
