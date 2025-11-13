import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import miloClipboard from "@/assets/milo-clipboard.jpg";

interface MiloAssistantProps {
  message: string | ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "floating";
  className?: string;
}

export const MiloAssistant = ({
  message,
  size = "md",
  variant = "default",
  className = "",
}: MiloAssistantProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <img
            src={miloClipboard}
            alt="Milo"
            className={`${sizeClasses[size]} object-contain animate-bounce`}
          />
          {message && (
            <Card className="absolute bottom-full right-0 mb-4 p-3 max-w-xs shadow-strong bg-card">
              <div className="text-sm text-card-foreground">{message}</div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  const enhancedSizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-40 h-40",
  };

  return (
    <Card className={`p-6 shadow-soft border-primary/20 ${className}`}>
      <div className="flex items-center gap-6">
        <img
          src={miloClipboard}
          alt="Milo"
          className={`${enhancedSizeClasses[size]} object-contain flex-shrink-0`}
        />
        <div className="flex-1">
          <div className="text-foreground leading-relaxed">{message}</div>
        </div>
      </div>
    </Card>
  );
};
