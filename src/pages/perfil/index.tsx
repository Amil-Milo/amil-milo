import { Layout } from "@/components/layout/Layout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Perfil() {
  return (
    <Layout>
      <div className="px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
        <Card className="p-4 md:p-6 mb-4 md:mb-6 border-2 border-primary/20 shadow-lg rounded-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
            <User className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Meu Perfil
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
            Gerencie suas informações pessoais e de saúde
          </p>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6 pt-4 md:pt-6">
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

