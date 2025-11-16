import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PhoneData {
  id?: number;
  countryCode: string;
  areaCode: string;
  number: string;
  isPrimary: boolean;
}

interface PhoneFormProps {
  phones: PhoneData[];
  onChange: (phones: PhoneData[]) => void;
}

export function PhoneForm({ phones, onChange }: PhoneFormProps) {
  const addPhone = () => {
    onChange([
      ...phones,
      {
        countryCode: "+55",
        areaCode: "",
        number: "",
        isPrimary: phones.length === 0,
      },
    ]);
  };


  const updatePhone = (index: number, field: keyof PhoneData, value: string | boolean) => {
    const newPhones = [...phones];
    newPhones[index] = {
      ...newPhones[index],
      [field]: value,
    };

    if (field === "isPrimary" && value === true) {
      newPhones.forEach((phone, i) => {
        if (i !== index) {
          phone.isPrimary = false;
        }
      });
    }

    onChange(newPhones);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Telefones</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addPhone}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Telefone
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {phones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum telefone cadastrado</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={addPhone}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Telefone
            </Button>
          </div>
        ) : (
          phones.map((phone, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="mb-2">
                <Label className="text-sm font-medium">
                  Telefone {index + 1}
                  {phone.isPrimary && (
                    <span className="ml-2 text-xs text-primary">(Principal)</span>
                  )}
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`countryCode-${index}`}>Código do País</Label>
                  <Input
                    id={`countryCode-${index}`}
                    value={phone.countryCode}
                    onChange={(e) => updatePhone(index, "countryCode", e.target.value)}
                    placeholder="+55"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`areaCode-${index}`}>DDD</Label>
                  <Input
                    id={`areaCode-${index}`}
                    value={phone.areaCode}
                    onChange={(e) => updatePhone(index, "areaCode", e.target.value.replace(/\D/g, ""))}
                    placeholder="11"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`number-${index}`}>Número</Label>
                  <Input
                    id={`number-${index}`}
                    value={phone.number}
                    onChange={(e) => updatePhone(index, "number", e.target.value.replace(/\D/g, ""))}
                    placeholder="987654321"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2 h-10">
                    <input
                      type="checkbox"
                      id={`isPrimary-${index}`}
                      checked={phone.isPrimary}
                      onChange={(e) => updatePhone(index, "isPrimary", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`isPrimary-${index}`} className="text-sm">
                      Principal
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

