import { useNotifications } from "@/hooks/useNotifications";
import { FAQButton } from "@/components/FAQButton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function GlobalNotificationWrapper() {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const firstUnread = notifications.length > 0 ? notifications[0] : null;

  useEffect(() => {
    if (firstUnread) {
      setTimeout(() => setShowMessage(true), 200);
      return () => {
        setShowMessage(false);
      };
    }
  }, [firstUnread]);

  const handleNotificationClick = async () => {
    if (firstUnread) {
      await markAsRead(firstUnread.id);
      if (firstUnread.linkUrl) {
        navigate(firstUnread.linkUrl);
      }
    }
  };

  const handleDismiss = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (firstUnread) {
      await markAsRead(firstUnread.id);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative flex items-end gap-3">
        {firstUnread && (
          <div 
            className="relative mb-16"
            style={{
              animation: 'speech-bubble 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            <div 
              className={`relative bg-card rounded-2xl shadow-lg border border-border p-3 max-w-[240px] cursor-pointer hover:shadow-xl transition-all duration-300 ${
                firstUnread.linkUrl ? 'hover:scale-[1.01]' : ''
              }`}
              onClick={handleNotificationClick}
            >
              <div 
                className="absolute -right-2 bottom-8 z-0"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderLeft: '12px solid hsl(var(--card))',
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.08))',
                }}
              />
              <div 
                className="absolute -right-3 bottom-[30px] z-[-1]"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '9px solid transparent',
                  borderBottom: '9px solid transparent',
                  borderLeft: '13px solid hsl(var(--border))',
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <p 
                    className="text-sm text-foreground leading-relaxed flex-1 font-normal"
                    style={{
                      animation: showMessage 
                        ? 'message-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards' 
                        : 'none',
                      opacity: 0,
                    }}
                  >
                    {firstUnread.message}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 flex-shrink-0 opacity-50 hover:opacity-100 hover:bg-muted transition-all"
                    onClick={handleDismiss}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-shrink-0">
          <FAQButton />
        </div>
      </div>
    </div>
  );
}

