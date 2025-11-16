import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddressData {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressFormProps {
  address: AddressData;
  onChange: (address: AddressData) => void;
}

export function AddressForm({ address, onChange }: AddressFormProps) {
  const handleChange = (field: keyof AddressData, value: string) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            value={address.street}
            onChange={(e) => handleChange("street", e.target.value)}
            placeholder="Nome da rua"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              value={address.number}
              onChange={(e) => handleChange("number", e.target.value)}
              placeholder="Número"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={address.complement}
              onChange={(e) => handleChange("complement", e.target.value)}
              placeholder="Apto, Bloco, etc."
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            value={address.neighborhood}
            onChange={(e) => handleChange("neighborhood", e.target.value)}
            placeholder="Nome do bairro"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Cidade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="UF"
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              value={address.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value.replace(/\D/g, ""))}
              placeholder="00000-000"
              maxLength={8}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

