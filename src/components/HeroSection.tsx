import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export interface Slide {
  image: string;
  title: string;
  subtitle: string;
  position: 'left' | 'center' | 'right';
}

interface HeroSectionProps {
  slides: Slide[];
}

const useAutoSlide = (slides: any[], interval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
  }, [slides.length, interval, clearTimer]);

  const goToNextSlide = useCallback(() => {
    clearTimer();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startTimer();
  }, [slides.length, clearTimer, startTimer]);

  const goToPreviousSlide = useCallback(() => {
    clearTimer();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startTimer();
  }, [slides.length, clearTimer, startTimer]);

  const goToSlide = useCallback((index: number) => {
    clearTimer();
    setCurrentSlide(index);
    startTimer();
  }, [clearTimer, startTimer]);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  return { currentSlide, goToSlide, goToNextSlide, goToPreviousSlide };
};

interface HeroSlideProps {
  slide: Slide;
  isActive: boolean;
}

const HeroSlide = ({ slide, isActive }: HeroSlideProps) => (
  <div
    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
      isActive ? "opacity-100" : "opacity-0"
    }`}
    style={{ backgroundImage: `url(${slide.image})` }}
    aria-hidden={!isActive}
  >
    <div className="absolute inset-0 bg-transparent"></div>
  </div>
);

export const HeroSection = ({ slides }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { currentSlide, goToSlide, goToNextSlide, goToPreviousSlide } = useAutoSlide(slides);

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <HeroSlide
          key={index}
          slide={slide}
          isActive={index === currentSlide}
        />
      ))}
      
      {/* Navigation Arrows */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        onClick={goToPreviousSlide}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        onClick={goToNextSlide}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dynamic Hero Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-700 max-w-2xl px-6 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } ${
              slide.position === 'left' ? 'text-left left-8' :
              slide.position === 'right' ? 'text-right right-8' :
              'text-center left-1/2 transform -translate-x-1/2'
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 text-white">
              {slide.subtitle}
            </p>
            <div className={`flex gap-4 ${
              slide.position === 'left' ? 'justify-start' :
              slide.position === 'right' ? 'justify-end' :
              'justify-center'
            }`}>
              <Button 
                size="lg" 
                className="bg-[#081748] text-white hover:bg-blue-800 font-bold px-8 py-6 text-lg transition-all"
                onClick={() => navigate('/services')}
              >
                Explore Services 
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/10"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};