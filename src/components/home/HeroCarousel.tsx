import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "@/assets/banner1.webp";
import banner2 from "@/assets/banner2.webp";
import banner3 from "@/assets/banner3.webp";
import banner4 from "@/assets/banner4.webp";

const BANNERS = [banner1, banner2, banner3, banner4];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[400px] md:h-[500px]">
        {BANNERS.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative group"
              aria-label={`Ir para slide ${index + 1}`}
            >
              {index === currentIndex ? (
                <div className="w-8 h-0.5 bg-[#461BFF] rounded-full transition-all duration-300"></div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-white/50 transition-all duration-300 group-hover:bg-white/75"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <button
            onClick={goToPrevious}
            className="w-10 h-10 border border-[#461BFF] bg-transparent text-[#461BFF] hover:bg-[#461BFF] hover:text-white transition-colors duration-200 rounded-md flex items-center justify-center"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-sm font-medium text-[#461BFF] px-3">
            {currentIndex + 1} / {BANNERS.length}
          </div>

          <button
            onClick={goToNext}
            className="w-10 h-10 border border-[#461BFF] bg-transparent text-[#461BFF] hover:bg-[#461BFF] hover:text-white transition-colors duration-200 rounded-md flex items-center justify-center"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
