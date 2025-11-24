import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, Calendar } from "lucide-react";
import { useAgenda } from "@/hooks/useAgenda";
import { AgendaList } from "@/components/agenda/AgendaList";
import { MedicationCard } from "@/components/agenda/MedicationCard";
import { GoogleCalendarWrapper } from "@/components/agenda/GoogleCalendarWrapper";
import { CustomCalendar } from "@/components/agenda/CustomCalendar";
import { GoogleCalendarConnectModal } from "@/components/agenda/GoogleCalendarConnectModal";
import { EventChecklistModal } from "@/components/agenda/EventChecklistModal";
import {
  useGoogleCalendarConnected,
  useSyncCalendar,
  useCalendar,
} from "@/hooks/useCalendar";
import { calendarApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AgendaConsultation } from "@/hooks/useAgenda";
import type { CalendarEvent } from "@/hooks/useCalendar";
import { useAuth } from "@/contexts/AuthContext";

export default function Agenda() {
  const { user } = useAuth();
  const { data: agendaData, isLoading, error } = useAgenda();
  const { data: googleConnected } = useGoogleCalendarConnected();
  const syncCalendarMutation = useSyncCalendar();
  const queryClient = useQueryClient();
  const [selectedConsultation, setSelectedConsultation] =
    useState<AgendaConsultation | null>(null);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  useEffect(() => {
    const hasDismissedGoogleCalendar = localStorage.getItem(
      "dismissed-google-calendar-prompt"
    );

    if (
      !googleConnected?.connected &&
      !connectModalOpen &&
      !hasDismissedGoogleCalendar
    ) {
      const timer = setTimeout(() => {
        setConnectModalOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [googleConnected?.connected, connectModalOpen]);

  useEffect(() => {
    if (googleConnected?.connected) {
      setConnectModalOpen(false);
      localStorage.removeItem("dismissed-google-calendar-prompt");
    }
  }, [googleConnected?.connected]);

  const handleModalClose = (open: boolean) => {
    setConnectModalOpen(open);
    if (!open) {
      localStorage.setItem("dismissed-google-calendar-prompt", "true");
    }
  };

  useEffect(() => {
    if (agendaData && !googleConnected?.connected) {
      syncCalendarMutation.mutate();
    }
  }, [agendaData, googleConnected?.connected]);

  const handleConnectGoogleCalendar = () => {
    calendarApi.connectGoogle();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("google_connected") === "true") {
      toast.success("Google Calendar conectado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["calendar", "google-connected"],
      });
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (urlParams.get("error") === "google_auth_failed") {
      toast.error("Erro ao conectar Google Calendar. Tente novamente.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [queryClient]);

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Evento clicado:", event);
  };

  const handleViewChecklist = (consultation: AgendaConsultation) => {
    setSelectedConsultation(consultation);
    setChecklistModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12 px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    const axiosError = error as any;
    const isForbidden = axiosError?.response?.status === 403;
    const isNotFound = axiosError?.response?.status === 404;
    const isAdmin = user?.role === "ADMIN";

    // ADMIN pode acessar tudo, mesmo sem linha de cuidado
    if (isAdmin) {
      // Se for ADMIN, mostra a agenda vazia ao invés de erro
      return (
        <Layout>
          <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2 md:gap-3">
                <Calendar className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                Sua Agenda de Saúde
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Consultas, exames e lembretes em um só lugar
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">
              <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0">
                <AgendaList consultations={[]} onViewChecklist={() => {}} />
                <CustomCalendar
                  onEventClick={handleEventClick}
                  showConnectButton={false}
                />
              </div>

              <div className="space-y-4 md:space-y-6 min-w-0">
                <MedicationCard medications={[]} />
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    if (isForbidden || isNotFound) {
      return (
        <Layout>
          <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
            <Card className="p-6 text-center">
              <p className="text-foreground font-semibold mb-2">
                Linha de cuidado não atribuída
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Você precisa ter uma linha de cuidado atribuída para acessar a
                agenda.
              </p>
            </Card>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
          <Card className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar agenda</p>
            <p className="text-sm text-muted-foreground mt-2">
              Não foi possível carregar os dados da agenda. Tente novamente mais
              tarde.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  const consultations = agendaData?.upcomingConsultations || [];
  const medications = agendaData?.medicationReminders || [];

  return (
    <Layout>
      <div className="px-4 md:px-8 pt-4 md:pt-8 pb-20 md:pb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2 md:gap-3">
            <Calendar className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Sua Agenda de Saúde
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Consultas, exames e lembretes em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0">
            <AgendaList
              consultations={consultations}
              onViewChecklist={handleViewChecklist}
            />

            <CustomCalendar
              onEventClick={handleEventClick}
              showConnectButton={false}
            />
          </div>

          <div className="space-y-4 md:space-y-6 min-w-0">
            <MedicationCard medications={medications} />
          </div>
        </div>
      </div>

      <EventChecklistModal
        consultation={selectedConsultation}
        open={checklistModalOpen}
        onOpenChange={setChecklistModalOpen}
      />

      <GoogleCalendarConnectModal
        open={connectModalOpen}
        onOpenChange={handleModalClose}
        onConnect={handleConnectGoogleCalendar}
      />
    </Layout>
  );
}
