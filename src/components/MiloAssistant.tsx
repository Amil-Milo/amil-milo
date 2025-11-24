import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import miloClipboard from "@/assets/milo-clipboard.png";

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
  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative flex items-end gap-3">
          {message && (
            <div className="relative mb-16">
              <div className="relative bg-white rounded-2xl rounded-tr-none shadow-lg border border-gray-200 p-4 max-w-xs">
                <div
                  className="absolute right-0 bottom-0 translate-y-full"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "12px solid white",
                    borderRight: "12px solid transparent",
                    borderBottom: "12px solid transparent",
                  }}
                />
                <p className="text-sm text-gray-800 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          )}
          <img
            src={miloClipboard}
            alt="Milo"
            className={`w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0`}
          />
        </div>
      </div>
    );
  }

  const enhancedSizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
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
          <div className="text-gray-800 leading-relaxed">{message}</div>
        </div>
      </div>
    </Card>
  );
};
