import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";
import { UserDataForm } from "./UserDataForm";
import { HealthInfoForm } from "./HealthInfoForm";
import { DiseasesMedicationsForm } from "./DiseasesMedicationsForm";
import { FamilyHistoryForm } from "./FamilyHistoryForm";
import { AllergiesForm } from "./AllergiesForm";
import { SpecialConditionsForm } from "./SpecialConditionsForm";
import { AddressForm } from "./AddressForm";
import { PhoneForm } from "./PhoneForm";

export function ProfileForm() {
  const { profileData, loading } = useUserProfile();

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

  const birthDate = profileData.profile.dateOfBirth ? new Date(profileData.profile.dateOfBirth) : null;
  const formattedDate = birthDate 
    ? `${String(birthDate.getDate()).padStart(2, '0')}/${String(birthDate.getMonth() + 1).padStart(2, '0')}/${birthDate.getFullYear()}`
    : "";
  
  const heightInMeters = profileData.profile.height ? (profileData.profile.height / 100).toFixed(2) : "";
  const weightFormatted = profileData.profile.weight ? profileData.profile.weight.toString() : "";

  return (
    <div className="space-y-6">
      <UserDataForm
        initialFullName={profileData.user.fullName || ""}
        initialEmail={profileData.user.email || ""}
        cpf={profileData.user.cpf || ""}
      />

      <HealthInfoForm
        initialDateOfBirth={formattedDate}
        initialBloodType={profileData.profile.bloodType || ""}
        initialHeight={heightInMeters}
        initialWeight={weightFormatted}
      />

      <DiseasesMedicationsForm
        initialDiseases={profileData.profile.diseases || ""}
        initialMedications={profileData.profile.medications || ""}
      />

      <FamilyHistoryForm
        initialFamilyHistory={profileData.profile.familyHistory || ""}
      />

      <AllergiesForm
        initialAllergies={profileData.profile.allergies || ""}
      />

      <SpecialConditionsForm
        initialSpecialConditions={profileData.profile.specialConditions || ""}
      />

      <AddressForm
        initialAddress={profileData.profile.address ? {
          street: profileData.profile.address.street || "",
          number: profileData.profile.address.number || "",
          complement: profileData.profile.address.complement || "",
          neighborhood: profileData.profile.address.neighborhood || "",
          city: profileData.profile.address.city || "",
          state: profileData.profile.address.state || "",
          zipCode: profileData.profile.address.zipCode || "",
        } : null}
        addressId={profileData.profile.address?.id || null}
      />

      <PhoneForm />
    </div>
  );
}

