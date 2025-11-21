import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, BookOpen, Headphones } from "lucide-react";
import { Content } from "@/hooks/useContent";

interface ContentCardProps {
  content: Content;
  onOpen?: (content: Content) => void;
}

const mediaTypeIcons = {
  TEXT: BookOpen,
  VIDEO: Play,
  AUDIO: Headphones,
};

const mediaTypeLabels = {
  TEXT: "Artigo",
  VIDEO: "Vídeo",
  AUDIO: "Áudio",
};

export function ContentCard({ content, onOpen }: ContentCardProps) {
  const IconComponent = mediaTypeIcons[content.mediaType];
  const mediaLabel = mediaTypeLabels[content.mediaType];

  const handleClick = () => {
    if (onOpen) {
      onOpen(content);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow w-full">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              {content.category}
            </Badge>
            {content.specialty && (
              <Badge variant="outline" className="text-[10px] sm:text-xs">
                {content.specialty.name}
              </Badge>
            )}
          </div>
        </div>
        
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 line-clamp-2 break-words">
          {content.title}
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-3 break-words">
          {content.body}
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            Leitura de {content.durationMinutes} min
          </span>
          <Button size="sm" variant="ghost" onClick={handleClick} className="text-xs sm:text-sm h-7 sm:h-8">
            {content.mediaType === "VIDEO" && (
              <>
                <Play className="h-3 w-3 mr-1" />
                Assistir
              </>
            )}
            {content.mediaType === "AUDIO" && (
              <>
                <Headphones className="h-3 w-3 mr-1" />
                Ouvir
              </>
            )}
            {content.mediaType === "TEXT" && "Ler"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

