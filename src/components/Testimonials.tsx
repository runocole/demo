import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "../components/ui/button";
import obidi from "../assets/obidi.jpg";
import melhem from "../assets/melhem.jpg";
import tagbo from "../assets/tagbo.jpg";
import ebuka from "../assets/ebuka.jpg";
import prosper from "../assets/prosper.jpg";

interface Testimonial {
  id: number;
  name: string;
  image: string;
  course: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Surv. Ndidi Obieti",
    image: obidi,
    course: "Drone Mapping Course",
    text: "I am greatly impressed with this training. It exceeded my expectations. I am also ready for the next step which is getting a drone",
    rating: 5,
  },
  {
    id: 2,
    name: "Chukwuebuka Onwuama",
    image: ebuka,
    course: "Drone Mapping Course",
    text: "This was a beautiful training. My expectations for this training were met and surpassed. The trainers were wonderful. I am grateful to the one that recommended this training to me.",
    rating: 5,
  },
  {
    id: 3,
    name: "Surv. Tagbo Everistius",
    image: tagbo,
    course: "3D Laser Scanning Course",
    text: "The training was amazing. I got everything I needed from it. The trainers took their time to explain, no rush and they were really hospitable. I recommend this training to every surveyor both old and new. Thank you OTIC for this in-depth training.",
    rating: 5,
  },
  {
    id: 4,
    name: "Melhem Atallah",
    image: melhem,
    course: "GNSS Surveying Course",
    text: "The training was fantastic. The instructors knew what they were doing.",
    rating: 5,
  },
  {
    id: 5,
    name: "Prosper Uzor",
    image: prosper,
    course: "Drone Mapping Course",
    text: "I really enjoyed the training. I was highly satisfied with the outcome and can't wait to apply all I have learnt. I recommend this training to everyone looking to upskill",
    rating: 5,
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide on mobile
  useEffect(() => {
    if (!isMobile || isPaused || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // On mobile, show 1 card at a time
        if (prevIndex >= testimonials.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [isMobile, isPaused, testimonials.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (isMobile) {
        // Mobile: show 1 card at a time
        return prevIndex >= testimonials.length - 1 ? 0 : prevIndex + 1;
      } else {
        // Desktop: show 2 cards at a time
        return prevIndex + 2 >= testimonials.length ? 0 : prevIndex + 1;
      }
    });
  }, [isMobile, testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (isMobile) {
        // Mobile: show 1 card at a time
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      } else {
        // Desktop: show 2 cards at a time
        return prevIndex === 0 ? Math.max(0, testimonials.length - 2) : prevIndex - 1;
      }
    });
  }, [isMobile, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Determine how many cards to show based on screen size
  const getCardsToShow = () => {
    if (isMobile) {
      // Mobile: show only 1 card
      return [testimonials[currentIndex]];
    } else {
      // Desktop: show up to 2 cards
      const endIndex = Math.min(currentIndex + 2, testimonials.length);
      return testimonials.slice(currentIndex, endIndex);
    }
  };

  const cardsToShow = getCardsToShow();

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-3 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-blue-100 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full bg-blue-100 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Improved */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6 shadow-sm">
            <Quote className="w-8 h-8 text-blue-600" />
          </div>
          
          <div className="relative mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              What Our Students Say
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Hear from professionals who have transformed their careers through our comprehensive training programs.
          </p>
        </div>

        {/* Testimonial Cards - Enhanced */}
        <div className="max-w-6xl mx-auto">
          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 1000)}
          >
            {/* Cards Container */}
            <div className="flex gap-8 transition-transform duration-500 ease-in-out">
              {cardsToShow.map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`${isMobile ? 'w-full' : 'flex-1 min-w-0'} bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-100`}
                  style={{
                    animation: `fadeIn 0.5s ease-in-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Header with Avatar and Course */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Quote className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-blue-900 mb-1">
                          {testimonial.course}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">
                            {testimonial.rating}.0
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="mb-8 flex-grow">
                      <p className="text-gray-700 leading-relaxed italic font-normal relative pl-6">
                        <span className="absolute left-0 top-0 text-blue-400 text-2xl leading-none">"</span>
                        {testimonial.text}
                        <span className="text-blue-400 text-2xl leading-none ml-1">"</span>
                      </p>
                    </div>

                    {/* Student Name */}
                    <div className="pt-6 border-t border-gray-100">
                      <span className="font-semibold text-blue-900">
                        {testimonial.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-6 mt-10">
              {/* Left Arrow */}
              <Button
                onClick={prevSlide}
                size="icon"
                className="bg-white hover:bg-blue-50 text-blue-700 rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMobile ? currentIndex === 0 : currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Dot Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="group relative"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <div 
                      className={`w-8 h-2 rounded-full transition-all duration-300 ${
                        currentIndex === index
                          ? "bg-blue-600"
                          : "bg-gray-300 group-hover:bg-gray-400"
                      }`}
                    />
                    <div 
                      className={`absolute -top-1 -bottom-1 -left-2 -right-2 rounded-full transition-all ${
                        currentIndex === index
                          ? "bg-blue-100/50"
                          : "group-hover:bg-gray-100/50"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <Button
                onClick={nextSlide}
                size="icon"
                className="bg-white hover:bg-blue-50 text-blue-700 rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMobile ? currentIndex >= testimonials.length - 1 : currentIndex + 2 >= testimonials.length}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Auto-slide indicator (mobile only) */}
            {isMobile && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="text-sm text-gray-500">
                  {currentIndex + 1} of {testimonials.length}
                </div>
                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ 
                      width: isPaused ? '0%' : `${((currentIndex + 1) / testimonials.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};