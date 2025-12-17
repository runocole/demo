import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "../components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  image: string;
  title: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    title: "Professional Drone Pilot",
    text: "The training program exceeded my expectations. The instructors were knowledgeable and the hands-on experience was invaluable. I feel confident in my drone mapping abilities now.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    title: "Agricultural Specialist",
    text: "Outstanding course! The bathymetric training opened up new opportunities for my surveying business. The parameter recommendations were particularly helpful.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    title: "Environmental Researcher",
    text: "Professional instructors and comprehensive curriculum. The field operation practice sessions gave me the confidence to handle real-world scenarios effectively.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    title: "Construction Manager",
    text: "Best investment in my professional development. The safety training and mission planning modules were exactly what I needed to launch my drone services.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    title: "Surveying Technician",
    text: "Incredible learning experience with practical applications. The certification has already helped me advance my career in the geospatial industry.",
    rating: 5,
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 2 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, testimonials.length - 2) : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

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
              Hear from professionals who have transformed their careers through our comprehensive drone training programs.
            </p>
          </div>

          {/* Right - Testimonial Cards */}
          <div className="lg:col-span-8">
            <div className="relative">
              {/* Cards Container */}
              <div className="flex gap-6 transition-transform duration-500 ease-in-out">
                {testimonials.slice(currentIndex, currentIndex + 2).map((testimonial, idx) => (
                  <div
                    key={testimonial.id}
                    className="flex-1 bg-white rounded-2xl p-8 shadow-xl min-w-[300px] border border-blue-100 hover:border-blue-200 transition-colors"
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

                      {/* Title */}
                      <h3 className="font-bold text-lg text-[#081748] mb-2">
                        {testimonial.title}
                      </h3>

                      {/* Testimonial Text */}
                      <p className="text-[#081748]/80 mb-6 flex-grow leading-relaxed">
                        {testimonial.text}
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

              {/* Navigation Arrows */}
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={prevSlide}
                  size="icon"
                  className="bg-white hover:bg-gray-50 text-[#081748] rounded-full w-12 h-12 shadow-lg transition-colors border border-blue-100"
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  onClick={nextSlide}
                  size="icon"
                  className="bg-white hover:bg-gray-50 text-[#081748] rounded-full w-12 h-12 shadow-lg transition-colors border border-blue-100"
                  disabled={currentIndex + 2 >= testimonials.length}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Dot Indicators */}
              <div className="flex gap-2 mt-6">
                {testimonials.map((_, index) => (
                  index % 1 === 0 && index + 1 < testimonials.length && (
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
                  )
                ))}
              </div>
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
      `}</style>
    </section>
  );
};