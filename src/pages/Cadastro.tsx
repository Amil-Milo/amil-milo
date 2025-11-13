import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";
import miloFront from "@/assets/milo-front.jpg";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Cadastro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Etapa 1: Dados Básicos
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",

    // Etapa 2: Dados de Saúde
    altura: "",
    peso: "",
    diagnosticos: "",
    medicamentos: "",
    
    // Etapa 3: Histórico
    historicoFamiliar: "",
    condicaoEspecial: "",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Em produção, aqui você criaria o usuário no backend
    // e então faria o login
    try {
      // Simula a criação do usuário e login automático
      await login(formData.cpf, ""); // Password será validado no backend
      toast.success("Cadastro realizado com sucesso!");
      navigate("/tour");
    } catch (error) {
      toast.error("Erro ao realizar cadastro. Tente novamente.");
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
            Vamos nos conhecer melhor!
          </h1>
          <p className="text-muted-foreground mb-4">
            Etapa {step} de {totalSteps}
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Dados Básicos
              </h2>
              
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, cpf: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataNascimento: e.target.value,
                      })
                    }
                    required
                  />
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Dados de Saúde
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (cm) *</Label>
                  <Input
                    id="altura"
                    type="number"
                    placeholder="170"
                    value={formData.altura}
                    onChange={(e) =>
                      setFormData({ ...formData, altura: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg) *</Label>
                  <Input
                    id="peso"
                    type="number"
                    placeholder="70"
                    value={formData.peso}
                    onChange={(e) =>
                      setFormData({ ...formData, peso: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosticos">
                  Diagnósticos Médicos (se houver)
                </Label>
                <Input
                  id="diagnosticos"
                  type="text"
                  placeholder="Ex: Hipertensão, Diabetes..."
                  value={formData.diagnosticos}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosticos: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicamentos">
                  Medicamentos em Uso (se houver)
                </Label>
                <Input
                  id="medicamentos"
                  type="text"
                  placeholder="Ex: Losartana 50mg, Metformina..."
                  value={formData.medicamentos}
                  onChange={(e) =>
                    setFormData({ ...formData, medicamentos: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Histórico Familiar e Observações
              </h2>

              <div className="space-y-2">
                <Label htmlFor="historicoFamiliar">
                  Histórico Familiar de Doenças
                </Label>
                <Input
                  id="historicoFamiliar"
                  type="text"
                  placeholder="Ex: Pai com diabetes, mãe com hipertensão..."
                  value={formData.historicoFamiliar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      historicoFamiliar: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condicaoEspecial">
                  Alguma condição especial que devemos saber?
                </Label>
                <Input
                  id="condicaoEspecial"
                  type="text"
                  placeholder="Alergias, cirurgias recentes, etc."
                  value={formData.condicaoEspecial}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      condicaoEspecial: e.target.value,
                    })
                  }
                />
              </div>

              <div className="bg-primary-light p-4 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>🎉 Quase lá!</strong> Ao concluir, você terá acesso ao
                  Programa Cuidadosmil e conhecerá o Milo, seu assistente virtual
                  de saúde.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            <Button type="submit" className="flex-1 bg-gradient-primary">
              {step < totalSteps ? "Próximo" : "Concluir Cadastro"}
            </Button>
          </div>
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
