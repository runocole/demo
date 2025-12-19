import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
  const [isPaused, setIsPaused] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (isPaused) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
  }, [slides.length, interval, clearTimer, isPaused]);

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

  const pauseSlider = useCallback(() => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resumeSlider = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  return { 
    currentSlide, 
    goToSlide, 
    goToNextSlide, 
    goToPreviousSlide,
    pauseSlider,
    resumeSlider,
    isPaused
  };
};

interface HeroSlideProps {
  slide: Slide;
  isActive: boolean;
}

const HeroSlide = ({ slide, isActive }: HeroSlideProps) => (
  <div
    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
      isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
    }`}
    style={{ backgroundImage: `url(${slide.image})` }}
    aria-hidden={!isActive}
  >
    {/* Gradient Overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent"></div>
    {/* Mobile-specific overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent md:hidden"></div>
  </div>
);

export const HeroSection = ({ slides }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { 
    currentSlide, 
    goToSlide, 
    goToNextSlide, 
    goToPreviousSlide,
    pauseSlider,
    resumeSlider
  } = useAutoSlide(slides);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section 
      className="relative h-[70vh] md:h-screen overflow-hidden"
      onMouseEnter={pauseSlider}
      onMouseLeave={resumeSlider}
      onTouchStart={pauseSlider}
      onTouchEnd={resumeSlider}
    >
      {slides.map((slide, index) => (
        <HeroSlide
          key={index}
          slide={slide}
          isActive={index === currentSlide}
        />
      ))}
      
      {/* Navigation Arrows - Mobile Optimized */}
      <button 
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        onClick={goToPreviousSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      <button 
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dynamic Hero Content */}
      <div className="relative z-20 flex items-center h-full px-4 md:px-6 lg:px-8">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ease-in-out max-w-6xl ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8 pointer-events-none'
            } ${isMobile ? 'w-full px-4' : 'w-full md:w-2/3 lg:w-1/2'}`}
            style={{
              left: isMobile ? '4%' : '8%',
              bottom: isMobile ? '15%' : 'auto',
              top: isMobile ? 'auto' : '50%',
              transform: isMobile 
                ? (index === currentSlide ? 'translateY(0)' : 'translateY(20px)') 
                : (index === currentSlide ? 'translateY(-50%)' : 'translateY(-50%) translateX(20px)')
            }}
          >
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 text-white tracking-tight leading-tight"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.5px' : '1px',
                lineHeight: 1.1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {slide.title}
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 max-w-full md:max-w-2xl lg:max-w-3xl leading-relaxed"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300,
                letterSpacing: isMobile ? '0.5px' : '1px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {slide.subtitle}
            </p>
            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row gap-4'} justify-start`}>
              <Button 
                size={isMobile ? "default" : "lg"}
                className={`bg-[#081748] text-white hover:bg-blue-800 font-bold ${
                  isMobile 
                    ? 'w-full px-6 py-4 text-base' 
                    : 'px-8 py-6 text-lg'
                } transition-all group`}
                onClick={() => navigate('/services')}
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}
              >
                <span>Explore Services</span>
                <ArrowRight className={`ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 ${
                  isMobile ? 'inline' : 'inline'
                }`} />
              </Button>
              <Button 
                size={isMobile ? "default" : "lg"}
                variant="outline" 
                className={`text-white border-white hover:bg-white/10 ${
                  isMobile 
                    ? 'w-full px-6 py-4 text-base' 
                    : 'px-8 py-6 text-lg'
                }`}
                onClick={() => navigate('/contact')}
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.5px'
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators - Mobile Optimized */}
      <div className="absolute bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            } ${
              isMobile ? 'w-2 h-2 rounded-full' : 'w-3 h-3 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>

      {/* Scroll Indicator - Desktop Only */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

      {/* Mobile Touch Indicators */}
      {isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <span>Swipe</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-30">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${(currentSlide + 1) / slides.length * 100}%`,
            transition: 'width 5s linear'
          }}
        />
      </div>
    </section>
  );
};