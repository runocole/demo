import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "./ui/button";
import carouselImage1 from "../assets/carousel-1.jpg";
import carouselImage2 from "../assets/carousel-2.jpg";
import carouselImage3 from "../assets/carousel-3.jpg";
import carouselImage4 from "../assets/carousel-4.jpg";
import carouselImage5 from "../assets/carousel-5.jpg";

const ImageCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 640px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 1 },
      }
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(1);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      
      // Set slides to show based on screen size
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;
    
    if (isPlaying) {
      emblaApi.plugins().autoplay?.stop();
      setIsPlaying(false);
    } else {
      emblaApi.plugins().autoplay?.play();
      setIsPlaying(true);
    }
  }, [emblaApi, isPlaying]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const images = [
    { src: carouselImage1, alt: "Survey team in field using GNSS equipment" },
    { src: carouselImage4, alt: "Office meeting with technical team" },
    { src: carouselImage3, alt: "Equipment demonstration to clients" },
    { src: carouselImage2, alt: "Training session for survey technicians" },
    { src: carouselImage5, alt: "Team collaboration on project mapping" },
  ];

  // Calculate visible slide width
  const slideWidth = slidesToShow === 1 ? '100%' : slidesToShow === 2 ? '50%' : '33.333%';

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 sm:-ml-6">
          {images.map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 pl-4 sm:pl-6 ${
                isMobile ? 'w-full' : slidesToShow === 2 ? 'w-1/2' : 'w-1/3'
              }`}
              style={{ flex: `0 0 ${slideWidth}` }}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={index < 2 ? "eager" : "lazy"}
                />
                {/* Mobile Touch Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 lg:hidden" />
                
                {/* Desktop Hover Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex items-center justify-center">
                  <span className="text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-full">
                    View Image {index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Previous Button */}
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          className={`bg-white/90 hover:bg-white shadow-lg border-gray-300 ${
            isMobile ? 'h-10 w-10' : 'px-4'
          }`}
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6 mr-2'}`} />
          {!isMobile && <span>Previous</span>}
        </Button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {images.slice(0, isMobile ? 5 : Math.ceil(images.length / slidesToShow)).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const targetSlide = index * slidesToShow;
                scrollTo(Math.min(targetSlide, images.length - 1));
              }}
              className={`transition-all duration-300 rounded-full ${
                Math.floor(selectedIndex / slidesToShow) === index
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              } ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}
              aria-label={`Go to slide group ${index + 1}`}
              aria-current={Math.floor(selectedIndex / slidesToShow) === index ? "true" : "false"}
            />
          ))}
        </div>

        {/* Play/Pause Button - Desktop Only */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900"
            onClick={toggleAutoplay}
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          className={`bg-white/90 hover:bg-white shadow-lg border-gray-300 ${
            isMobile ? 'h-10 w-10' : 'px-4'
          }`}
          onClick={scrollNext}
          aria-label="Next slide"
        >
          {!isMobile && <span>Next</span>}
          <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6 ml-2'}`} />
        </Button>
      </div>

      {/* Mobile Touch Instructions */}
      {isMobile && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Swipe left or right to navigate
          </p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-4">
        <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000 ease-out"
            style={{
              width: `${((selectedIndex + slidesToShow) / images.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Mobile Floating Navigation (for easier access) */}
      {isMobile && (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/95 hover:bg-white shadow-xl h-12 w-12"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/95 hover:bg-white shadow-xl h-12 w-12"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Current Position Indicator */}
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600">
          {selectedIndex + 1} of {images.length} images
          {slidesToShow > 1 && ` (showing ${slidesToShow} at a time)`}
        </p>
      </div>
    </div>
  );
};

export default ImageCarousel;