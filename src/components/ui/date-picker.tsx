import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function DatePicker({ value, onChange, placeholder = "DD/MM/AAAA", disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  const getInitialDate = () => {
    const parsed = parseDate(value);
    if (parsed) {
      const currentYear = new Date().getFullYear();
      const year = parsed.getFullYear();
      if (year > currentYear) {
        return new Date(currentYear, parsed.getMonth(), 1);
      }
      return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const [displayDate, setDisplayDate] = useState(getInitialDate);

  useEffect(() => {
    const parsed = parseDate(value);
    if (parsed) {
      const currentYear = new Date().getFullYear();
      const year = parsed.getFullYear();
      if (year > currentYear) {
        setDisplayDate(new Date(currentYear, parsed.getMonth(), 1));
      } else {
        setDisplayDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    } else {
      const today = new Date();
      setDisplayDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [value]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    const formatted = formatDate(selectedDate);
    onChange(formatted);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setDisplayDate(new Date(displayDate.getFullYear() - 1, displayDate.getMonth(), 1));
  };

  const handleNextYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = displayDate.getFullYear() + 1;
    if (nextYear <= currentYear) {
      setDisplayDate(new Date(nextYear, displayDate.getMonth(), 1));
    }
  };

  const handleYearSelect = (year: number) => {
    const currentYear = new Date().getFullYear();
    const selectedYear = year <= currentYear ? year : currentYear;
    setDisplayDate(new Date(selectedYear, displayDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const endYear = currentYear;
    const years: number[] = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleToday = () => {
    const today = new Date();
    const formatted = formatDate(today);
    onChange(formatted);
    setDisplayDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const days = getDaysInMonth(displayDate);
  const selectedDate = parseDate(value);
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      displayDate.getMonth() === today.getMonth() &&
      displayDate.getFullYear() === today.getFullYear()
    );
  };
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      displayDate.getMonth() === selectedDate.getMonth() &&
      displayDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary transition-colors",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-lg" align="start" side="bottom" sideOffset={8}>
        <div className="p-3 bg-background">
          {!showYearPicker ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevYear}
                  className="h-6 w-6 hover:bg-primary/10"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="h-6 w-6 hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowYearPicker(true)}
                    className="text-xs font-semibold text-foreground text-center min-w-[100px] hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/10"
                  >
                    {months[displayDate.getMonth()].slice(0, 3)} {displayDate.getFullYear()}
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="h-6 w-6 hover:bg-primary/10"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleNextYear}
                  disabled={displayDate.getFullYear() >= new Date().getFullYear()}
                  className="h-6 w-6 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </>
          ) : (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowYearPicker(false)}
                  className="text-xs h-6"
                >
                  ← Voltar
                </Button>
                <div className="text-xs font-semibold text-foreground">
                  Selecione o ano
                </div>
                <div className="w-12" />
              </div>
              <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto">
                {getYearRange().map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={cn(
                      "h-7 text-xs font-medium rounded transition-all",
                      "hover:bg-primary/20 hover:text-primary",
                      displayDate.getFullYear() === year && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showYearPicker && (
            <>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="w-7 h-6 flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                  >
                    {day.slice(0, 1)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={idx} className="w-7 h-7" />;
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={cn(
                        "w-7 h-7 rounded text-xs font-medium transition-all",
                        "hover:bg-primary/20 hover:text-primary",
                        isToday(day) && !isSelected(day) && "bg-primary/10 text-primary font-semibold border border-primary/30",
                        isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-[10px] h-6 px-2 hover:bg-muted"
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleToday}
                  className="text-[10px] h-6 px-2 hover:bg-muted"
                >
                  Hoje
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

