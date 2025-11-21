import { useNotifications } from "@/hooks/useNotifications";
import { FAQButton } from "@/components/FAQButton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function GlobalNotificationWrapper() {
  const { notifications, markAsRead } = useNotifications();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const firstUnread = notifications.length > 0 ? notifications[0] : null;

  const handleDismiss = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (firstUnread) {
      await markAsRead(firstUnread.id);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }

    if (firstUnread && isAuthenticated) {
      setIsVisible(true);
      setTimeout(() => setShowMessage(true), 200);
      
      autoCloseTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, 15000);

      return () => {
        if (autoCloseTimerRef.current) {
          clearTimeout(autoCloseTimerRef.current);
        }
        setShowMessage(false);
      };
    }
    
    if (!firstUnread) {
      setIsVisible(false);
      setShowMessage(false);
    }
  }, [firstUnread, isAuthenticated]);

  const handleNotificationClick = async () => {
    if (firstUnread) {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
      await markAsRead(firstUnread.id);
      setIsVisible(false);
      if (firstUnread.linkUrl) {
        navigate(firstUnread.linkUrl);
      }
    }
  };

  if (!firstUnread || !isVisible || !isAuthenticated) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
        <div className="flex-shrink-0">
          <FAQButton />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
      <div className="relative flex items-end gap-3">
        <div 
          className="relative mb-16"
          style={{
            animation: 'speech-bubble 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          <div 
            className={`relative bg-card rounded-2xl rounded-tr-none shadow-lg border border-border p-4 max-w-[280px] cursor-pointer hover:shadow-xl transition-all duration-300 ${
              firstUnread.linkUrl ? 'hover:scale-[1.01]' : ''
            }`}
            onClick={handleNotificationClick}
          >
            <div 
              className="absolute right-0 bottom-0 translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderTop: '12px solid hsl(var(--card))',
                borderRight: '12px solid transparent',
                borderBottom: '12px solid transparent',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
              }}
            />
            <div 
              className="absolute right-[-1px] bottom-[-1px] translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderTop: '13px solid hsl(var(--border))',
                borderRight: '13px solid transparent',
                borderBottom: '13px solid transparent',
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <p 
                  className="text-sm text-foreground leading-relaxed flex-1 font-normal pr-1"
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
                  className="h-6 w-6 p-0 flex-shrink-0 opacity-60 hover:opacity-100 hover:bg-muted/50 transition-all rounded-full"
                  onClick={handleDismiss}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <FAQButton />
        </div>
      </div>
    </div>
  );
}

