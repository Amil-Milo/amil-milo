import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/hooks/useCalendar";
import { cn } from "@/lib/utils";

interface CustomCalendarProps {
  onEventClick?: (event: CalendarEvent) => void;
  showConnectButton?: boolean;
}

export function CustomCalendar({ onEventClick, showConnectButton = false }: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = useMemo(() => {
    const date = new Date(currentDate);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [currentDate]);

  const endDate = useMemo(() => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 2);
    date.setDate(0);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [currentDate]);

  const { data: events = [], isLoading } = useCalendar(startDate, endDate);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const dateKey = new Date(event.startDate).toDateString();
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, event]);
    });
    return map;
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getEventsForDate = (date: Date | null): CalendarEvent[] => {
    if (!date) return [];
    const dateKey = date.toDateString();
    return eventsByDate.get(dateKey) || [];
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getEventColor = (type: CalendarEvent["type"]) => {
    const colors = {
      CONSULTATION: "bg-primary/20 text-primary border-primary/30",
      MEDICATION: "bg-accent/20 text-accent border-accent/30",
      EXAM: "bg-secondary/20 text-secondary border-secondary/30",
      REMINDER: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30",
      OTHER: "bg-muted text-muted-foreground border-border",
    };
    return colors[type] || colors.OTHER;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <Card className="p-6 border-2 border-primary/20 shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-primary" />
        Meu Calendário
      </h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <p className="text-sm text-muted-foreground">Seus compromissos de saúde</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
              className="rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="rounded-lg"
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando eventos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const today = isToday(day);
              const selected = isSelected(day);

              return (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={cn(
                    "relative min-h-[60px] p-2 rounded-lg border-2 transition-all duration-200",
                    "hover:bg-primary/5 hover:border-primary/40",
                    today && "bg-primary/10 border-primary/50 ring-2 ring-primary/20",
                    selected && "bg-primary/20 border-primary shadow-md",
                    !day && "border-transparent cursor-default opacity-0",
                    dayEvents.length > 0 && "border-primary/30"
                  )}
                  disabled={!day}
                >
                  {day && (
                    <>
                      <div
                        className={cn(
                          "text-sm font-medium mb-1",
                          today && "text-primary font-bold",
                          selected && "text-primary font-bold",
                          !selected && !today && "text-foreground"
                        )}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-[10px] px-1 py-0.5 rounded truncate border",
                              getEventColor(event.type)
                            )}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-muted-foreground font-medium">
                            +{dayEvents.length - 2}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Eventos em {selectedDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h4>
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <Card
                  key={event.id}
                  className={cn(
                    "p-4 cursor-pointer hover:shadow-md transition-all duration-200 border-2",
                    getEventColor(event.type)
                  )}
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-foreground">{event.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {event.type === "CONSULTATION" && "Consulta"}
                          {event.type === "MEDICATION" && "Medicação"}
                          {event.type === "EXAM" && "Exame"}
                          {event.type === "REMINDER" && "Lembrete"}
                          {event.type === "OTHER" && "Outro"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {new Date(event.startDate).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-xs mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedDate && selectedDateEvents.length === 0 && (
          <div className="mt-6 pt-6 border-t border-border text-center py-8">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Nenhum evento agendado para este dia
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30"></div>
              <span className="text-muted-foreground">Consulta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent/20 border border-accent/30"></div>
              <span className="text-muted-foreground">Medicação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-secondary/20 border border-secondary/30"></div>
              <span className="text-muted-foreground">Exame</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/30"></div>
              <span className="text-muted-foreground">Lembrete</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

