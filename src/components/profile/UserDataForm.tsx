import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Função para formatar CPF
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

interface UserDataFormProps {
  fullName: string;
  email: string;
  cpf: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function UserDataForm({
  fullName,
  email,
  cpf,
  onNameChange,
  onEmailChange,
}: UserDataFormProps) {
  const formattedCPF = cpf ? formatCPF(cpf) : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Digite seu nome completo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Digite seu e-mail"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            value={formattedCPF}
            disabled
            className="bg-muted cursor-not-allowed"
            placeholder="000.000.000-00"
          />
        </div>
      </CardContent>
    </Card>
  );
}

