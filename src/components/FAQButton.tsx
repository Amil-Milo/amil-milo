import { useState, useEffect } from "react";
import miloFaqHead from "@/assets/milo-faq-head.png";
import { MiloModal } from "./MiloModal";
import { useNotifications } from "@/hooks/useNotifications";

export const FAQButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useNotifications();
  const hasNewNotification = notifications.length > 0;
  const [animationState, setAnimationState] = useState<"idle" | "proactive">(
    "idle"
  );

  useEffect(() => {
    if (hasNewNotification) {
      setAnimationState("proactive");
      const timer = setTimeout(() => {
        setAnimationState("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
    setAnimationState("idle");
  }, [hasNewNotification]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center hover:scale-110 transition-smooth bg-transparent group cursor-pointer z-50"
        aria-label="Milo - Assistente Virtual"
      >
        <img
          src={miloFaqHead}
          alt="Milo"
          className={`w-14 h-14 md:w-16 md:h-16 object-contain transition-transform group-hover:scale-105 drop-shadow-2xl ${
            animationState === "idle"
              ? ""
              : "animate-[milo-idle_3s_ease-in-out_infinite]"
          }`}
        />
      </button>

      <MiloModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
