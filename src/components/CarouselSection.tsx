import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "./ProductCard"; 
import type { Product } from "../types/product"; 

interface CarouselSectionProps {
  title: string;
  items: Product[]; // Updated to use the Product type
  buttonText?: string;
  buttonLink?: string;
  showCategory?: boolean;
}

export const CarouselSection = ({ 
  title, 
  items, 
  buttonText = "Browse All", 
  buttonLink = "/buynow",
}: CarouselSectionProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerView = 6;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Prevent index out of bounds
      if (items.length <= itemsPerView) return 0;
      
      if (prevIndex >= items.length - itemsPerView) {
        return 0; 
      }
      return prevIndex + 1;
    });
  }, [items.length, itemsPerView]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
        if (items.length <= itemsPerView) return 0;

        if (prevIndex === 0) {
            return items.length - itemsPerView; 
        }
        return prevIndex - 1;
    });
  };

  useEffect(() => {
    if (isPaused || items.length <= itemsPerView) return;
    const interval = setInterval(nextSlide, 1000); // Slower auto-scroll (3s) for better UX
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, items.length, itemsPerView]);

  // Handle adding to cart (connect this to your CartContext later if needed)
  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
    // Optional: Add toast notification here
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-white">
      <div className="w-full px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          {items.length > itemsPerView && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden py-4"> {/* Added padding for shadows */}
            <div 
              className="flex transition-transform duration-500 ease-out gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-none"
                  style={{ width: `${100 / itemsPerView}%` }} // Dynamic width based on view count
                >
                    {/* 👇 3. REPLACED: No manual HTML. We use ProductCard here. 
                        This ensures the price converts automatically. */}
                    <div className="px-2 h-full">
                        <ProductCard 
                            product={item} 
                            onAddToCart={handleAddToCart}
                            className="h-full bg-white border-gray-200 text-gray-900 shadow-sm hover:shadow-md" // Overriding styles for light theme if needed
                        />
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {items.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(items.length - itemsPerView + 1) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-blue-900 w-4' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <button 
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-4 text-base transition-all rounded shadow-lg hover:shadow-xl active:scale-95"
            onClick={() => navigate(buttonLink)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};