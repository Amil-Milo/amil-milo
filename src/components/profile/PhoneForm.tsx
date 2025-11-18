import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface PhoneData {
  id?: number;
  countryCode: string;
  areaCode: string;
  number: string;
  isPrimary: boolean;
}

export function PhoneForm() {
  const [phones, setPhones] = useState<PhoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/me');
      const userPhones = response.data.phones || [];
      setPhones(userPhones.map((phone: any) => ({
        id: phone.id,
        countryCode: phone.countryCode || "+55",
        areaCode: phone.areaCode || "",
        number: phone.number || "",
        isPrimary: phone.isPrimary || false,
      })));
    } catch (error: any) {
      console.error("Erro ao carregar telefones:", error);
      setPhones([]);
    } finally {
      setLoading(false);
    }
  };
  const addPhone = async () => {
    try {
      setSaving(-1);
      const newPhone = {
        countryCode: "+55",
        areaCode: "",
        number: "",
        isPrimary: phones.length === 0,
      };
      
      const response = await api.post('/patient-profile/me/phones', newPhone);
      await fetchPhones();
      toast.success("Telefone adicionado com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao adicionar telefone");
    } finally {
      setSaving(null);
    }
  };

  const updatePhone = async (phoneId: number, index: number, field: keyof PhoneData, value: string | boolean) => {
    try {
      setSaving(index);
      const updatedPhone = {
        ...phones[index],
        [field]: value,
      };

      if (field === "isPrimary" && value === true) {
        // Desmarcar outros telefones como principal
        for (let i = 0; i < phones.length; i++) {
          if (i !== index && phones[i].id) {
            await api.patch(`/patient-profile/me/phones/${phones[i].id}`, {
              isPrimary: false,
            });
          }
        }
      }

      await api.patch(`/patient-profile/me/phones/${phoneId}`, {
        [field]: value,
      });
      
      await fetchPhones();
      toast.success("Telefone atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar telefone");
    } finally {
      setSaving(null);
    }
  };

  const removePhone = async (phoneId: number) => {
    try {
      setDeleting(phoneId);
      await api.delete(`/patient-profile/me/phones/${phoneId}`);
      await fetchPhones();
      toast.success("Telefone removido com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao remover telefone");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telefones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Telefones</CardTitle>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addPhone}
            disabled={saving === -1}
          >
            {saving === -1 ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Telefone
              </>
            )}
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
              disabled={saving === -1}
            >
              {saving === -1 ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Telefone
                </>
              )}
            </Button>
          </div>
        ) : (
          phones.map((phone, index) => (
            <div key={phone.id || index} className="border rounded-lg p-4 space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Telefone {index + 1}
                  {phone.isPrimary && (
                    <span className="ml-2 text-xs text-primary">(Principal)</span>
                  )}
                </Label>
                {phone.id && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePhone(phone.id!)}
                    disabled={deleting === phone.id}
                  >
                    {deleting === phone.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`countryCode-${phone.id || index}`}>Código do País</Label>
                  <Input
                    id={`countryCode-${phone.id || index}`}
                    value={phone.countryCode}
                    onChange={(e) => {
                      if (phone.id) {
                        updatePhone(phone.id, index, "countryCode", e.target.value);
                      }
                    }}
                    onBlur={(e) => {
                      if (phone.id && e.target.value !== phone.countryCode) {
                        updatePhone(phone.id, index, "countryCode", e.target.value);
                      }
                    }}
                    placeholder="+55"
                    disabled={saving === index}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`areaCode-${phone.id || index}`}>DDD</Label>
                  <Input
                    id={`areaCode-${phone.id || index}`}
                    value={phone.areaCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPhones(prev => {
                        const newPhones = [...prev];
                        newPhones[index] = { ...newPhones[index], areaCode: value };
                        return newPhones;
                      });
                    }}
                    onBlur={(e) => {
                      if (phone.id && e.target.value !== phone.areaCode) {
                        updatePhone(phone.id, index, "areaCode", e.target.value.replace(/\D/g, ""));
                      }
                    }}
                    placeholder="11"
                    maxLength={2}
                    disabled={saving === index}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`number-${phone.id || index}`}>Número</Label>
                  <Input
                    id={`number-${phone.id || index}`}
                    value={phone.number}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPhones(prev => {
                        const newPhones = [...prev];
                        newPhones[index] = { ...newPhones[index], number: value };
                        return newPhones;
                      });
                    }}
                    onBlur={(e) => {
                      if (phone.id && e.target.value !== phone.number) {
                        updatePhone(phone.id, index, "number", e.target.value.replace(/\D/g, ""));
                      }
                    }}
                    placeholder="987654321"
                    disabled={saving === index}
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2 h-10">
                    <input
                      type="checkbox"
                      id={`isPrimary-${phone.id || index}`}
                      checked={phone.isPrimary}
                      onChange={(e) => {
                        if (phone.id) {
                          updatePhone(phone.id, index, "isPrimary", e.target.checked);
                        }
                      }}
                      className="h-4 w-4"
                      disabled={saving === index}
                    />
                    <Label htmlFor={`isPrimary-${phone.id || index}`} className="text-sm">
                      Principal
                    </Label>
                  </div>
                </div>
              </div>
              {saving === index && (
                <div className="flex items-center justify-end text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

