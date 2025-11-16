import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useGoogleCalendarConnected } from "@/hooks/useCalendar";

interface GoogleCalendarWrapperProps {
  calendarId?: string | null;
}

export function GoogleCalendarWrapper({ calendarId: propCalendarId }: GoogleCalendarWrapperProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const { data: googleConnected } = useGoogleCalendarConnected();

  useEffect(() => {
    const loadCalendarId = async () => {
      try {
        if (propCalendarId) {
          setCalendarId(propCalendarId);
          setLoading(false);
          return;
        }

        if (googleConnected?.connected) {
          setCalendarId('primary');
          setLoading(false);
          return;
        }

        const calendarIdFromEnv = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
        
        if (calendarIdFromEnv) {
          setCalendarId(calendarIdFromEnv);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (err: any) {
        setError("Erro ao carregar configuração do calendário");
        setLoading(false);
      }
    };

    loadCalendarId();
  }, [propCalendarId, googleConnected]);

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando Google Calendar...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o Google Calendar.
        </p>
      </Card>
    );
  }

  if (!calendarId && !googleConnected?.connected) {
    return null;
  }

  const finalCalendarId = calendarId || (googleConnected?.connected ? 'primary' : null);

  if (!finalCalendarId) {
    return null;
  }

  const encodedCalendarId = encodeURIComponent(finalCalendarId);
  const calendarUrl = `https://calendar.google.com/calendar/embed?src=${encodedCalendarId}&ctz=America%2FSao_Paulo&wkst=1&bgcolor=%23ffffff&showPrint=0&showCalendars=0&showTz=0&mode=month`;

  return (
    <Card className="p-6 border-2 border-primary/20 shadow-lg rounded-xl overflow-hidden">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-primary" />
        Google Calendar
      </h2>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          Seus compromissos de saúde sincronizados automaticamente.
        </p>
      </div>
      <div className="w-full rounded-lg overflow-hidden" style={{ height: '600px' }}>
        <iframe
          src={calendarUrl}
          style={{
            border: '0',
            width: '100%',
            height: '100%',
            frameborder: '0',
            scrolling: 'no',
          }}
          title="Google Calendar"
          className="rounded-lg"
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          As consultas agendadas pela equipe de saúde são automaticamente adicionadas ao seu Google Calendar.
        </p>
      </div>
    </Card>
  );
}

