import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { CurrencyType } from "../types/currency";

export interface CarouselItem {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category?: string;
}

interface CarouselSectionProps {
  title: string;
  items: CarouselItem[];
  buttonText?: string;
  buttonLink?: string;
  showCategory?: boolean;
  currentCurrency?: CurrencyType; // Add this
  exchangeRate?: number; // Add this
}

export const CarouselSection = ({ 
  title, 
  items, 
  buttonText = "Browse All", 
  buttonLink = "/buynow",
  showCategory = false,
  currentCurrency = 'USD', // Add default
  exchangeRate = 1500 // Add default
}: CarouselSectionProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Number of items to show at once
  const itemsPerView = 6;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= items.length - itemsPerView) {
        return 0; // Loop back to start
      }
      return prevIndex + 1;
    });
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return items.length - itemsPerView; // Loop to end
      }
      return prevIndex - 1;
    });
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || items.length <= itemsPerView) return;

    const interval = setInterval(nextSlide, 1000); // Change slide every 1 second
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, items.length]);

  if (!items || items.length === 0) {
    return (
      <section className="py-10 bg-white">
        <div className="w-full px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600">No items to display</p>
          </div>
        </div>
      </section>
    );
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
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-none"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 group mx-2">
                    {/* Image container with slant effect */}
                    <div className="relative w-full h-40 overflow-hidden bg-gray-100 group-hover:skew-x-3 group-hover:skew-y-1 transition-transform duration-500 ease-in-out">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out p-2 group-hover:-skew-x-3 group-hover:-skew-y-1"
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      {showCategory && item.category && (
                        <span className="text-xs text-gray-500 mb-1">{item.category}</span>
                      )}
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-gray-600 text-xs mb-2 flex-grow line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-base font-bold text-blue-900">${item.price}</span>
                        <button className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-2 py-1 rounded transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {items.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(items.length - itemsPerView + 1) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <button 
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-4 text-base transition-all rounded"
            onClick={() => navigate(buttonLink)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};