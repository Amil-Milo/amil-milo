import { Sidebar } from "@/components/Sidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Perfil() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e de saúde
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

