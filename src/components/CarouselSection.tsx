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

  /* -------------------- DESKTOP CAROUSEL STATE -------------------- */
  const itemsPerView = 6;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (items.length <= itemsPerView) return 0;
      return prev >= items.length - itemsPerView ? 0 : prev + 1;
    });
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (items.length <= itemsPerView) return 0;
      return prev === 0 ? items.length - itemsPerView : prev - 1;
    });
  };

  useEffect(() => {
    if (isPaused || items.length <= itemsPerView) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, items.length]);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="w-full px-4 sm:px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          {title}
        </h2>

        {/* ===================== MOBILE: ONE ITEM PER SWIPE ===================== */}
        <div className="block sm:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
            {items.map((item) => (
              <div key={item.id} className="min-w-full snap-center px-1">
                <ProductCard
                  product={item}
                  onAddToCart={handleAddToCart}
                  variant="compact"
                />
              </div>
            ))}
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
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg border"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg border"
              >
                ›
              </button>
            </>
          )}

          <div className="overflow-hidden py-4">
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
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded shadow-lg"
            onClick={() => navigate(buttonLink)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};