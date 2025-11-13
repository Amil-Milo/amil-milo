import { useState } from "react";
import { Card } from "@/components/ui/card";
import miloFaqHead from "@/assets/milo-faq-head.png";

export const FAQButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-strong flex items-center justify-center hover:scale-110 transition-smooth backdrop-blur-sm"
        style={{ backgroundColor: 'hsl(210, 100%, 85%)' }}
        aria-label="FAQ e Ajuda"
      >
        <img src={miloFaqHead} alt="Milo" className="w-12 h-12 object-contain" />
      </button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 p-4 max-w-xs shadow-strong bg-card animate-fade-in">
          <h3 className="font-semibold text-foreground mb-2">Precisa de ajuda?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Estou aqui para te ajudar! Confira as perguntas frequentes ou entre em contato com nossa equipe.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-primary hover:underline"
          >
            Fechar
          </button>
        </Card>
      )}
    </>
  );
};