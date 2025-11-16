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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant="secondary" className="text-xs">
              {content.category}
            </Badge>
            {content.specialty && (
              <Badge variant="outline" className="text-xs">
                {content.specialty.name}
              </Badge>
            )}
          </div>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {content.body}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Leitura de {content.durationMinutes} min
          </span>
          <Button size="sm" variant="ghost" onClick={handleClick}>
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

