import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { formatPhoneInput, formatAreaCode } from "@/lib/phoneUtils";

interface AddPhoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (countryCode: string, areaCode: string, number: string, isPrimary: boolean) => Promise<void>;
  isPrimary: boolean;
}

export function AddPhoneModal({
  open,
  onOpenChange,
  onSave,
  isPrimary,
}: AddPhoneModalProps) {
  const [countryCode, setCountryCode] = useState("+55");
  const [areaCode, setAreaCode] = useState("");
  const [number, setNumber] = useState("");
  const [isPrimaryChecked, setIsPrimaryChecked] = useState(isPrimary);
  const [saving, setSaving] = useState(false);

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAreaCode(e.target.value);
    setAreaCode(formatted);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setNumber(formatted);
  };

  const handleSave = async () => {
    const cleanCountryCode = countryCode.replace(/\D/g, "");
    const cleanAreaCode = areaCode.replace(/\D/g, "");
    const cleanNumber = number.replace(/\D/g, "");

    if (!cleanCountryCode) {
      return;
    }

    if (!cleanAreaCode || cleanAreaCode.length !== 2) {
      return;
    }

    if (!cleanNumber || cleanNumber.length < 8 || cleanNumber.length > 9) {
      return;
    }

    setSaving(true);
    try {
      await onSave(`+${cleanCountryCode}`, cleanAreaCode, cleanNumber, isPrimaryChecked);
      setCountryCode("+55");
      setAreaCode("");
      setNumber("");
      setIsPrimaryChecked(isPrimary);
      onOpenChange(false);
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setCountryCode("+55");
      setAreaCode("");
      setNumber("");
      setIsPrimaryChecked(isPrimary);
      onOpenChange(false);
    }
  };

  const cleanCountryCode = countryCode.replace(/\D/g, "");
  const cleanAreaCode = areaCode.replace(/\D/g, "");
  const cleanNumber = number.replace(/\D/g, "");
  const isValid = cleanCountryCode.length > 0 && cleanAreaCode.length === 2 && cleanNumber.length >= 8 && cleanNumber.length <= 9;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Telefone</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo telefone
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="countryCode">Código do País</Label>
            <Input
              id="countryCode"
              value={countryCode}
              onChange={(e) => {
                const value = e.target.value;
                if (value.startsWith("+")) {
                  const numbers = value.slice(1).replace(/\D/g, "");
                  setCountryCode(`+${numbers}`);
                } else {
                  const numbers = value.replace(/\D/g, "");
                  setCountryCode(numbers ? `+${numbers}` : "+");
                }
              }}
              placeholder="+55"
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="areaCode">DDD *</Label>
            <Input
              id="areaCode"
              value={areaCode}
              onChange={handleAreaCodeChange}
              placeholder="11"
              maxLength={2}
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Número *</Label>
            <Input
              id="number"
              value={number}
              onChange={handleNumberChange}
              placeholder="9 9999-9999"
              maxLength={11}
              disabled={saving}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={isPrimaryChecked}
              onChange={(e) => setIsPrimaryChecked(e.target.checked)}
              disabled={saving}
              className="h-4 w-4"
            />
            <Label htmlFor="isPrimary" className="text-sm font-normal cursor-pointer">
              Principal
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

