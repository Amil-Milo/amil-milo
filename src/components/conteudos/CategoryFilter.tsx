import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookOpen, Heart, Activity, Utensils, Brain, GraduationCap, Sparkles, Filter } from "lucide-react";
import { specialtyApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface CategoryFilterProps {
  selectedCategory: string;
  selectedSpecialty?: number;
  onCategoryChange: (category: string) => void;
  onSpecialtyChange?: (specialtyId: number | undefined) => void;
}

const defaultCategories = [
  { name: "Todos", icon: BookOpen, value: "all" },
  { name: "Alimentação", icon: Utensils, value: "Alimentação" },
  { name: "Exercício", icon: Activity, value: "Exercício" },
  { name: "Bem-estar", icon: Sparkles, value: "Bem-estar" },
  { name: "Educação", icon: GraduationCap, value: "Educação" },
];

export function CategoryFilter({
  selectedCategory,
  selectedSpecialty,
  onCategoryChange,
  onSpecialtyChange,
}: CategoryFilterProps) {
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const { data: specialties } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => specialtyApi.listSpecialties(),
  });

  const getCategoryLabel = () => {
    if (selectedSpecialty) {
      const specialty = specialties?.find(s => s.id === selectedSpecialty);
      return specialty?.name || "Especialidade";
    }
    const category = defaultCategories.find(c => c.value === selectedCategory);
    return category?.name || "Todos";
  };

  return (
    <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm text-muted-foreground">Filtrar por:</span>
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{getCategoryLabel()}</span>
        </Button>
      </PopoverTrigger>
        <PopoverContent 
          className="w-56 p-2" 
          align="start" 
          side="bottom" 
          sideOffset={8}
          collisionPadding={20}
        >
          <div className="space-y-1">
            {defaultCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === cat.value && !selectedSpecialty
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => {
                    onCategoryChange(cat.value);
                    if (onSpecialtyChange) {
                      onSpecialtyChange(undefined);
                    }
                    setFilterPopoverOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              );
            })}
            
            {specialties && specialties.length > 0 && (
              <>
                <div className="h-px bg-border my-1" />
                {specialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedSpecialty === specialty.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent text-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    onClick={() => {
                      if (onSpecialtyChange) {
                        onSpecialtyChange(
                          selectedSpecialty === specialty.id ? undefined : specialty.id
                        );
                      }
                      onCategoryChange("all");
                      setFilterPopoverOpen(false);
                    }}
                  >
                    <Heart className="h-4 w-4" />
                    {specialty.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
  );
}

