import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import type { Product } from "../types/product";

interface CarouselSectionProps {
  title: string;
  items: Product[];
  buttonText?: string;
  buttonLink?: string;
}

export const CarouselSection = ({
  title,
  items,
  buttonText = "Browse All",
  buttonLink = "/buynow",
}: CarouselSectionProps) => {
  const navigate = useNavigate();
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

  /* -------------------- DESKTOP CAROUSEL STATE -------------------- */
  const itemsPerView = isMobile ? 1 : 6;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (items.length <= itemsPerView) return 0;
      return prev >= items.length - itemsPerView ? 0 : prev + 1;
    });
  }, [items.length, itemsPerView]);

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (items.length <= itemsPerView) return 0;
      return prev === 0 ? items.length - itemsPerView : prev - 1;
    });
  };

  useEffect(() => {
    if (isPaused || items.length <= itemsPerView || isMobile) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, items.length, itemsPerView, isMobile]);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 sm:py-10 bg-white">
      <div className="w-full px-2 sm:px-6">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-10">
          {title}
        </h2>

        {/* ===================== MOBILE: ONE ITEM PER SWIPE ===================== */}
        <div className="block sm:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide -mx-2 px-2">
            {items.map((item) => (
              <div key={item.id} className="min-w-[85vw] snap-center px-1">
                <ProductCard
                  product={item}
                  onAddToCart={handleAddToCart}
                  variant="compact"
                  className="h-full"
                />
              </div>
            ))}
          </div>
          {/* Mobile Scroll Indicator */}
          <div className="text-center mt-2 text-sm text-gray-500">
            Swipe to browse
          </div>
        </div>

        {/* ===================== DESKTOP CAROUSEL ===================== */}
        <div
          className="relative hidden sm:block"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {items.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
                aria-label="Previous items"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
                aria-label="Next items"
              >
                ›
              </button>
            </>
          )}

          <div className="overflow-hidden py-4 px-2">
            <div
              className="flex transition-transform duration-500 ease-out gap-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex-none"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <ProductCard
                    product={item}
                    onAddToCart={handleAddToCart}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Indicators */}
          {items.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                   onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'bg-[#081748] scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to group ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

       
        {/* CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <button
            className="bg-[#081748] hover:bg-[#0a1f5a] text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-colors duration-300 w-full sm:w-auto" // CHANGED to #081748
            onClick={() => navigate(buttonLink)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};