import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// UPDATED Slide interface with mobileImage field
export interface Slide {
  image: string; // Desktop image
  mobileImage: string; // Mobile-specific image
  title: string;
  subtitle: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  position: 'left' | 'center' | 'right';
}

interface HeroSectionProps {
  slides: Slide[];
}

// Fixed useAutoSlide hook
const useAutoSlide = (slides: Slide[], interval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const slideCount = slides.length;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    progressRef.current = 0;
    startTimeRef.current = Date.now();
  }, []);

  const goToNextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slideCount);
  }, [currentSlide, slideCount, goToSlide]);

  const goToPreviousSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  }, [currentSlide, slideCount, goToSlide]);

  const startTimer = useCallback(() => {
    if (isPaused || slideCount <= 1) return;
    
    clearTimer();
    
    startTimeRef.current = Date.now();
    progressRef.current = 0;
    
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      progressRef.current = (elapsed / interval) * 100;
      
      if (elapsed >= interval) {
        goToNextSlide();
      }
    }, 50);
  }, [clearTimer, isPaused, slideCount, interval, goToNextSlide]);

  const pauseSlider = useCallback(() => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resumeSlider = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      startTimer();
    }
  }, [isPaused, startTimer]);

  // Initialize and clean up timer
  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  // Reset timer when slide changes
  useEffect(() => {
    if (!isPaused) {
      startTimer();
    }
  }, [currentSlide, isPaused, startTimer]);

  return { 
    currentSlide, 
    goToSlide, 
    goToNextSlide, 
    goToPreviousSlide,
    pauseSlider,
    resumeSlider,
    isPaused,
    progress: progressRef.current
  };
};

interface HeroSlideProps {
  slide: Slide;
  isActive: boolean;
  isTransitioning: boolean;
  isMobile: boolean;
}

const HeroSlide = ({ slide, isActive, isTransitioning, isMobile }: HeroSlideProps) => (
  <div
    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
      isActive ? "opacity-100" : "opacity-0"
    } ${isTransitioning ? "scale-105" : "scale-100"}`}
    style={{ 
      backgroundImage: `url(${isMobile ? slide.mobileImage : slide.image})`,
      transitionProperty: 'opacity, transform',
      willChange: 'opacity, transform'
    }}
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
    resumeSlider,
    progress
  } = useAutoSlide(slides);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle slide transitions
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get the appropriate title and subtitle based on device
  const getSlideTitle = (slide: Slide) => {
    return isMobile ? slide.mobileTitle || slide.title : slide.title;
  };

  const getSlideSubtitle = (slide: Slide) => {
    return isMobile ? slide.mobileSubtitle || slide.subtitle : slide.subtitle;
  };

  // Handle swipe gestures for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    pauseSlider();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      resumeSlider();
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNextSlide();
    } else if (isRightSwipe) {
      goToPreviousSlide();
    }
    
    setTimeout(resumeSlider, 1000);
  };

  return (
    <section 
      className="relative h-[70vh] md:h-screen overflow-hidden"
      onMouseEnter={pauseSlider}
      onMouseLeave={resumeSlider}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, index) => (
        <HeroSlide
          key={index}
          slide={slide}
          isActive={index === currentSlide}
          isTransitioning={isTransitioning && index === currentSlide}
          isMobile={isMobile}
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
                : (index === currentSlide ? 'translateY(-50%)' : 'translateY(-50%) translateX(20px)'),
              transitionProperty: 'opacity, transform',
              willChange: 'opacity, transform'
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
              {getSlideTitle(slide)}
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 max-w-full md:max-w-2xl lg:max-w-3xl font-normal"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300,
                letterSpacing: isMobile ? '0.5px' : '1px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {getSlideSubtitle(slide)}
            </p>
            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row gap-4'} justify-start`}>
              <Button 
                size={isMobile ? "default" : "lg"}
                className={`bg-blue-900 text-white hover:bg-blue-800 font-bold ${
                  isMobile 
                    ? 'w-full px-6 py-4 text-base' 
                    : 'px-8 py-6 text-lg'
                } transition-all group`}
                onClick={() => window.open('https://demo.oticsurveys.com/services', '_blank')}
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

      {/* Loading Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-30">
        <div 
          className="h-full bg-white transition-all duration-100 linear"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Fallback auto-slide trigger - ensures slides keep moving */}
      {slides.length > 1 && (
        <div className="hidden">
          <AutoSlideTrigger 
            currentSlide={currentSlide}
            goToNextSlide={goToNextSlide}
            interval={5000}
          />
        </div>
      )}
    </section>
  );
};

// Additional fallback component
const AutoSlideTrigger = ({ 
  currentSlide, 
  goToNextSlide, 
  interval 
}: { 
  currentSlide: number;
  goToNextSlide: () => void;
  interval: number;
}) => {
  useEffect(() => {
    const timer = setInterval(goToNextSlide, interval);
    return () => clearInterval(timer);
  }, [currentSlide, goToNextSlide, interval]);

  return null;
};