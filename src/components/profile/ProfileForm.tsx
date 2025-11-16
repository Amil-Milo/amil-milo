import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserDataForm } from "./UserDataForm";
import { PatientProfileDataForm } from "./PatientProfileDataForm";
import { AddressForm } from "./AddressForm";
import { PhoneForm } from "./PhoneForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";

export function ProfileForm() {
  const { profileData, loading, updating, updateProfile } = useUserProfile();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthISO, setDateOfBirthISO] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [diseases, setDiseases] = useState("");
  const [medications, setMedications] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");
  const [address, setAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (profileData) {
      setFullName(profileData.user.fullName || "");
      setEmail(profileData.user.email || "");
      setCpf(profileData.user.cpf || "");
      
      const birthDate = profileData.profile.dateOfBirth ? new Date(profileData.profile.dateOfBirth) : null;
      const formattedDate = birthDate 
        ? `${String(birthDate.getDate()).padStart(2, '0')}/${String(birthDate.getMonth() + 1).padStart(2, '0')}/${birthDate.getFullYear()}`
        : "";
      const dateISO = birthDate ? birthDate.toISOString().split('T')[0] : "";
      
      const heightInMeters = profileData.profile.height ? (profileData.profile.height / 100).toFixed(2) : "";
      const weightFormatted = profileData.profile.weight ? profileData.profile.weight.toString() : "";

      setDateOfBirth(formattedDate);
      setDateOfBirthISO(dateISO);
      setBloodType(profileData.profile.bloodType || "");
      setHeight(heightInMeters);
      setWeight(weightFormatted);
      setDiseases(profileData.profile.diseases || "");
      setMedications(profileData.profile.medications || "");
      setFamilyHistory(profileData.profile.familyHistory || "");
      setAllergies(profileData.profile.allergies || "");
      setSpecialConditions(profileData.profile.specialConditions || "");

      if (profileData.profile.address) {
        setAddress({
          street: profileData.profile.address.street || "",
          number: profileData.profile.address.number || "",
          complement: profileData.profile.address.complement || "",
          neighborhood: profileData.profile.address.neighborhood || "",
          city: profileData.profile.address.city || "",
          state: profileData.profile.address.state || "",
          zipCode: profileData.profile.address.zipCode || "",
        });
      }

    }
  }, [profileData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateProfileData: any = {};

    if (dateOfBirth) {
      const numbers = dateOfBirth.replace(/\D/g, "");
      if (numbers.length === 8) {
        const day = numbers.slice(0, 2);
        const month = numbers.slice(2, 4);
        const year = numbers.slice(4, 8);
        updateProfileData.dateOfBirth = `${year}-${month}-${day}`;
      }
    }
    if (bloodType) {
      updateProfileData.bloodType = bloodType;
    }
    if (height) {
      const heightInCm = Math.round(parseFloat(height.replace(/[^\d.]/g, "")) * 100);
      if (!isNaN(heightInCm)) {
        updateProfileData.height = heightInCm;
      }
    }
    if (weight) {
      const weightValue = parseFloat(weight.replace(/[^\d.]/g, ""));
      if (!isNaN(weightValue)) {
        updateProfileData.weight = weightValue;
      }
    }
    if (diseases !== undefined) {
      updateProfileData.diseases = diseases || null;
    }
    if (medications !== undefined) {
      updateProfileData.medications = medications || null;
    }
    if (familyHistory !== undefined) {
      updateProfileData.familyHistory = familyHistory || null;
    }
    if (allergies !== undefined) {
      updateProfileData.allergies = allergies || null;
    }
    if (specialConditions !== undefined) {
      updateProfileData.specialConditions = specialConditions || null;
    }

    const hasAddressData =
      address.street ||
      address.number ||
      address.complement ||
      address.neighborhood ||
      address.city ||
      address.state ||
      address.zipCode;

    if (hasAddressData) {
      updateProfileData.address = {
        street: address.street || "",
        number: address.number || null,
        complement: address.complement || null,
        neighborhood: address.neighborhood || null,
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
      };
    }

    if (profileData?.profile.address && !hasAddressData) {
      updateProfileData.address = null;
    }

    const userDataUpdate: { fullName?: string; email?: string } = {};

    if (fullName !== profileData?.user.fullName) {
      userDataUpdate.fullName = fullName;
    }

    if (email !== profileData?.user.email) {
      userDataUpdate.email = email;
    }

    await updateProfile(updateProfileData, Object.keys(userDataUpdate).length > 0 ? userDataUpdate : undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UserDataForm
        fullName={fullName}
        email={email}
        cpf={cpf}
        onNameChange={setFullName}
        onEmailChange={setEmail}
      />

      <PatientProfileDataForm
        dateOfBirth={dateOfBirth}
        dateOfBirthISO={dateOfBirthISO}
        bloodType={bloodType}
        height={height}
        weight={weight}
        diseases={diseases}
        medications={medications}
        familyHistory={familyHistory}
        allergies={allergies}
        specialConditions={specialConditions}
        onDateOfBirthChange={setDateOfBirth}
        onDateOfBirthISOChange={setDateOfBirthISO}
        onBloodTypeChange={setBloodType}
        onHeightChange={setHeight}
        onWeightChange={setWeight}
        onDiseasesChange={setDiseases}
        onMedicationsChange={setMedications}
        onFamilyHistoryChange={setFamilyHistory}
        onAllergiesChange={setAllergies}
        onSpecialConditionsChange={setSpecialConditions}
      />

      <AddressForm address={address} onChange={setAddress} />

      <div className="flex justify-end">
        <Button type="submit" disabled={updating} size="lg">
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </div>
    </form>
  );
}

