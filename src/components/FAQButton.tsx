import { useState } from "react";
import miloFaqHead from "@/assets/milo-faq-head.png";
import { MiloModal } from "./MiloModal";

export const FAQButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-strong flex items-center justify-center hover:scale-110 transition-smooth bg-primary hover:bg-primary/90 group"
        aria-label="Milo - Assistente Virtual"
      >
        <img 
          src={miloFaqHead} 
          alt="Milo" 
          className="w-[3.75rem] h-[3.75rem] object-contain transition-transform group-hover:scale-105" 
        />
      </button>

      {isOpen && (
        <MiloModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};