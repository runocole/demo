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
    <section className="py-20 bg-blue-100 relative overflow-hidden">
      {/* Background Pattern with Blue Tint */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-4 space-y-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Quote className="w-12 h-12 text-[#081748]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#081748]">
              What Our<br />Students Say
            </h2>
            <p className="text-[#081748]/80 text-lg">
              Hear from professionals who have transformed their careers through our comprehensive drone and surveying training programs.
            </p>
          </div>

          {/* Right - Testimonial Cards */}
          <div className="lg:col-span-8">
            <div 
              className="relative"
              onMouseEnter={() => setIsPaused(true)} // Pause on hover
              onMouseLeave={() => setIsPaused(false)} // Resume when mouse leaves
              onTouchStart={() => setIsPaused(true)} // Pause on touch
              onTouchEnd={() => setTimeout(() => setIsPaused(false), 1000)} // Resume after touch
            >
              {/* Cards Container */}
              <div className="flex gap-6 transition-transform duration-500 ease-in-out">
                {cardsToShow.map((testimonial, idx) => (
                  <div
                    key={testimonial.id}
                    className={`${isMobile ? 'w-full' : 'flex-1'} bg-white rounded-2xl p-8 shadow-xl min-w-[300px] border border-blue-100 hover:border-blue-200 transition-colors`}
                    style={{
                      animation: `fadeIn 0.5s ease-in-out ${idx * 0.1}s both`,
                    }}
                  >
                    <div className="flex flex-col h-full">
                      {/* Image */}
                      <div className="mb-6">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-100"
                        />
                      </div>

                      {/* Course Title */}
                      <h3 className="font-bold text-lg text-[#081748] mb-2">
                        {testimonial.course}
                      </h3>

                      {/* Testimonial Text */}
                      <p className="text-[#081748]/80 mb-6 flex-grow leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      {/* Name and Rating */}
                      <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                        <span className="font-bold text-[#081748] text-lg">
                          {testimonial.name}
                        </span>
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-[#081748] text-[#081748]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows - Hidden on mobile when auto-sliding is active */}
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={prevSlide}
                  size="icon"
                  className="bg-white hover:bg-gray-50 text-[#081748] rounded-full w-12 h-12 shadow-lg transition-colors border border-blue-100"
                  disabled={isMobile ? currentIndex === 0 : currentIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  onClick={nextSlide}
                  size="icon"
                  className="bg-white hover:bg-gray-50 text-[#081748] rounded-full w-12 h-12 shadow-lg transition-colors border border-blue-100"
                  disabled={isMobile ? currentIndex >= testimonials.length - 1 : currentIndex + 2 >= testimonials.length}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Dot Indicators */}
              <div className="flex gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentIndex === index
                        ? "bg-[#081748] w-8"
                        : "bg-[#081748]/30"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Auto-slide indicator (mobile only) */}
              {isMobile && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#081748]/30 relative overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full bg-[#081748] transition-all duration-4000 ease-linear ${isPaused ? 'w-0' : 'w-full'}`}
                      style={{ 
                        animation: isPaused ? 'none' : 'slideTimer 4s linear infinite'
                      }}
                    />
                  </div>
                  <span className="text-sm text-[#081748]/70">
                    {isPaused ? 'Paused' : 'Auto-sliding'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideTimer {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};