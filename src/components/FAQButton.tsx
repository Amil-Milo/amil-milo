import { useState, useEffect } from "react";
import miloFaqHead from "@/assets/milo-faq-head.png";
import { MiloModal } from "./MiloModal";
import { useNotifications } from "@/hooks/useNotifications";

export const FAQButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useNotifications();
  const hasNewNotification = notifications.length > 0;
  const [animationState, setAnimationState] = useState<'idle' | 'proactive'>('idle');

  useEffect(() => {
    if (hasNewNotification) {
      setAnimationState('proactive');
      const timer = setTimeout(() => {
        setAnimationState('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
    setAnimationState('idle');
  }, [hasNewNotification]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 flex items-center justify-center hover:scale-110 transition-smooth bg-transparent group cursor-pointer"
        aria-label="Milo - Assistente Virtual"
      >
        <img 
          src={miloFaqHead} 
          alt="Milo" 
          className={`w-[3.75rem] h-[3.75rem] object-contain transition-transform group-hover:scale-105 drop-shadow-lg ${
            animationState === 'idle' 
              ? 'animate-[milo-idle_3s_ease-in-out_infinite]' 
              : 'animate-[milo-pulse_1.5s_ease-in-out_infinite,milo-tilt_2s_ease-in-out_infinite]'
          }`}
        />
      </button>

      <MiloModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};