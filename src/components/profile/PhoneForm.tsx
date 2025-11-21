import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/lib/phoneUtils";
import { AddPhoneModal } from "./AddPhoneModal";

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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
      setHasChanges(false);
    } catch (error: any) {
      console.error("Erro ao carregar telefones:", error);
      setPhones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhone = async (countryCode: string, areaCode: string, number: string, isPrimary: boolean) => {
    const newPhone = {
      countryCode,
      areaCode,
      number,
      isPrimary,
    };

    if (isPrimary) {
      const updatedPhones = phones.map(phone => ({
        ...phone,
        isPrimary: false,
      }));
      setPhones([...updatedPhones, newPhone]);
    } else {
      setPhones([...phones, newPhone]);
    }
    setHasChanges(true);
  };

  const handleTogglePrimary = (index: number) => {
    const updatedPhones = phones.map((phone, i) => ({
      ...phone,
      isPrimary: i === index,
    }));
    setPhones(updatedPhones);
    setHasChanges(true);
  };

  const handleDeletePhone = async (phoneId: number) => {
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

  const handleSaveAll = async () => {
    try {
      setSaving(true);

      const primaryPhone = phones.find(p => p.isPrimary);
      if (!primaryPhone && phones.length > 0) {
        toast.error("Selecione pelo menos um telefone como principal");
        return;
      }

      const newPhones = phones.filter(p => !p.id);
      const existingPhones = phones.filter(p => p.id);

      for (const phone of newPhones) {
        await api.post('/patient-profile/me/phones', {
          countryCode: phone.countryCode,
          areaCode: phone.areaCode,
          number: phone.number,
          isPrimary: phone.isPrimary,
        });
      }

      for (const phone of existingPhones) {
        await api.patch(`/patient-profile/me/phones/${phone.id}`, {
          areaCode: phone.areaCode,
          number: phone.number,
          isPrimary: phone.isPrimary,
        });
      }

      await fetchPhones();
      toast.success("Telefones atualizados com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar telefones");
    } finally {
      setSaving(false);
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

  const isFirstPhone = phones.length === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Telefones</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowAddModal(true)}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
            title="Adicionar Telefone"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {phones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum telefone cadastrado</p>
          </div>
        ) : (
          phones.map((phone, index) => (
            <div
              key={phone.id || index}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatPhoneNumber(phone.countryCode, phone.areaCode, phone.number)}
                  </span>
                  {phone.isPrimary && (
                    <span className="text-xs text-primary font-medium">(Principal)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`isPrimary-${phone.id || index}`}
                      checked={phone.isPrimary}
                      onChange={() => handleTogglePrimary(index)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`isPrimary-${phone.id || index}`} className="text-sm cursor-pointer">
                      Principal
                    </Label>
                  </div>
                  {phone.id && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePhone(phone.id!)}
                      disabled={deleting === phone.id}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      {deleting === phone.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {phones.length > 0 && (
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleSaveAll}
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
        )}
      </CardContent>

      <AddPhoneModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleAddPhone}
        isPrimary={isFirstPhone}
      />
    </Card>
  );
}
