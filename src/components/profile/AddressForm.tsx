import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  initialAddress: AddressData | null;
  addressId?: number | null;
}

export function AddressForm({ initialAddress, addressId }: AddressFormProps) {
  const [address, setAddress] = useState<AddressData>({
    street: initialAddress?.street || "",
    number: initialAddress?.number || "",
    complement: initialAddress?.complement || "",
    neighborhood: initialAddress?.neighborhood || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
    zipCode: initialAddress?.zipCode || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      setAddress({
        street: initialAddress.street || "",
        number: initialAddress.number || "",
        complement: initialAddress.complement || "",
        neighborhood: initialAddress.neighborhood || "",
        city: initialAddress.city || "",
        state: initialAddress.state || "",
        zipCode: initialAddress.zipCode || "",
      });
    }
  }, [initialAddress]);

  const hasChanges = initialAddress
    ? address.street !== (initialAddress.street || "") ||
      address.number !== (initialAddress.number || "") ||
      address.complement !== (initialAddress.complement || "") ||
      address.neighborhood !== (initialAddress.neighborhood || "") ||
      address.city !== (initialAddress.city || "") ||
      address.state !== (initialAddress.state || "") ||
      address.zipCode !== (initialAddress.zipCode || "")
    : !!(address.street || address.number || address.complement || address.neighborhood || address.city || address.state || address.zipCode);

  const handleChange = (field: keyof AddressData, value: string) => {
    setAddress({
      ...address,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const addressData = {
        street: address.street || "",
        number: address.number || null,
        complement: address.complement || null,
        neighborhood: address.neighborhood || null,
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
      };

      if (addressId) {
        // Atualizar endereço existente
        await patientProfileApi.updateAddress(addressId, addressData);
      } else {
        // Criar novo endereço
        await patientProfileApi.createAddress(addressData);
      }
      toast.success("Endereço salvo com sucesso!");
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar endereço");
    } finally {
      setSaving(false);
    }
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
              onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
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
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

