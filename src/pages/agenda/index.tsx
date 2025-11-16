import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
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
import { useGoogleCalendarConnected, useSyncCalendar, useCalendar } from "@/hooks/useCalendar";
import { calendarApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AgendaConsultation } from "@/hooks/useAgenda";
import type { CalendarEvent } from "@/hooks/useCalendar";

export default function Agenda() {
  const { data: agendaData, isLoading, error } = useAgenda();
  const { data: googleConnected } = useGoogleCalendarConnected();
  const syncCalendarMutation = useSyncCalendar();
  const queryClient = useQueryClient();
  const [selectedConsultation, setSelectedConsultation] = useState<AgendaConsultation | null>(null);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  useEffect(() => {
    const hasDismissedGoogleCalendar = localStorage.getItem('dismissed-google-calendar-prompt');
    
    if (!googleConnected?.connected && !connectModalOpen && !hasDismissedGoogleCalendar) {
      const timer = setTimeout(() => {
        setConnectModalOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [googleConnected?.connected, connectModalOpen]);

  useEffect(() => {
    if (googleConnected?.connected) {
      setConnectModalOpen(false);
      localStorage.removeItem('dismissed-google-calendar-prompt');
    }
  }, [googleConnected?.connected]);

  const handleModalClose = (open: boolean) => {
    setConnectModalOpen(open);
    if (!open) {
      localStorage.setItem('dismissed-google-calendar-prompt', 'true');
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
    if (urlParams.get('google_connected') === 'true') {
      toast.success("Google Calendar conectado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['calendar', 'google-connected'] });
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] });
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (urlParams.get('error') === 'google_auth_failed') {
      toast.error("Erro ao conectar Google Calendar. Tente novamente.");
      window.history.replaceState({}, '', window.location.pathname);
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
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <Card className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar agenda</p>
            <p className="text-sm text-muted-foreground mt-2">
              Não foi possível carregar os dados da agenda. Tente novamente mais tarde.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  const consultations = agendaData?.upcomingConsultations || [];
  const medications = agendaData?.medicationReminders || [];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Sua Agenda de Saúde
          </h1>
          <p className="text-muted-foreground">
            Consultas, exames e lembretes em um só lugar
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <AgendaList
              consultations={consultations}
              onViewChecklist={handleViewChecklist}
            />

            {googleConnected?.connected ? (
              <GoogleCalendarWrapper />
            ) : (
              <CustomCalendar
                onEventClick={handleEventClick}
                onConnectGoogle={handleConnectGoogleCalendar}
                showConnectButton={true}
              />
            )}
          </div>

          <div className="space-y-6">
            <MedicationCard medications={medications} />
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
      </main>
    </div>
  );
}

