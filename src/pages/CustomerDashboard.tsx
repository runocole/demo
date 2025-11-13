import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import heroSlide1 from "../assets/hero-slide-1.jpg";
import heroSlide2 from "../assets/hero-slide-2.jpg";
import heroSlide3 from "../assets/hero-slide-3.jpg";
import heroSlide4 from "../assets/hero-slide-4.jpg";
import servicesImage from "../assets/services-tech.jpg";
import arrival1 from "../assets/arrival1.jpg";
import arrival2 from "../assets/arrival2.jpg";
import arrival3 from "../assets/arrival3.jpg";
// Types
interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface ContactInfo {
  icon: LucideIcon;
  title: string;
  details: string[];
}

// Constants
const SLIDES: (Slide & { position: 'left' | 'center' | 'right' })[] = [
  { 
    image: heroSlide1, 
    title: "Precision Survey Solutions", 
    subtitle: "Advanced Total Station & GPS Equipment",
    position: 'left'
  },
  { 
    image: heroSlide2, 
    title: "Drone Survey Technology", 
    subtitle: "UAV Mapping & Aerial Surveying Solutions",
    position: 'right'
  },
  { 
    image: heroSlide3, 
    title: "Underwater Drone Services", 
    subtitle: "Marine & Subsea Survey Technology",
    position: 'center'
  },
  { 
    image: heroSlide4, 
    title: "Expert Survey Teams", 
    subtitle: "Professional Geospatial Solutions Across Africa",
    position: 'left'
  },
];
const HIGHLIGHTS: string[] = [
  "Over 20 years of surveying excellence",
  "Licensed and certified professionals",
  "State-of-the-art equipment and technology",
  "Comprehensive project support",
  "Serving clients across the Africa",
];
// Custom Hooks
const useAutoSlide = (slides: Slide[], interval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval]);

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  }, []);

  return { currentSlide, isTransitioning, goToSlide };
};

// Memoized Components
interface HeroSlideProps {
  slide: Slide;
  isActive: boolean;
  isTransitioning: boolean;
}

const HeroSlide = ({ slide, isActive, isTransitioning }: HeroSlideProps) => (
  <div
    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
      isActive && !isTransitioning ? "opacity-100" : "opacity-0"
    }`}
    style={{ backgroundImage: `url(${slide.image})` }}
    aria-hidden={!isActive}
  >
    <div className="absolute inset-0 bg-hero-overlay/85"></div>
  </div>
);

interface ContactInfoCardProps {
  info: ContactInfo;
}

const ContactInfoCard = ({ info }: ContactInfoCardProps) => {
  const Icon = info.icon;

  return (
    <Card className="text-center p-6 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-primary" size={24} />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{info.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {info.details.map((detail, index) => (
          <p key={index} className="text-muted-foreground">{detail}</p>
        ))}
      </CardContent>
    </Card>
  );
};

// Main Component
const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentSlide, isTransitioning, goToSlide } = useAutoSlide(SLIDES);

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <Header />
      
      {/* HERO SECTION */}
      <section className="relative h-screen overflow-hidden">
        {SLIDES.map((slide, index) => (
          <HeroSlide
            key={index}
            slide={slide}
            isActive={index === currentSlide}
            isTransitioning={isTransitioning}
          />
        ))}
        
        {/* DYNAMIC HERO CONTENT */}
        <div className="relative z-10 flex items-center justify-center h-full">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-500 max-w-2xl px-6 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } ${
                slide.position === 'left' ? 'text-left left-8' :
                slide.position === 'right' ? 'text-right right-8' :
                'text-center left-1/2 transform -translate-x-1/2'
              }`}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 text-white">
                {slide.subtitle}
              </p>
              <div className={`flex gap-4 ${
                slide.position === 'left' ? 'justify-start' :
                slide.position === 'right' ? 'justify-end' :
                'justify-center'
              }`}>
    
                <Button 
          size="lg" 
          className="bg-[#081748] text-white hover:bg-blue-800 font-bold px-8 py-6 text-lg transition-all"
          onClick={() => navigate('/services')}
        >
          Explore Services 
        </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10"
                onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>
  {/* ABOUT PREVIEW SECTION */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Side - Text Content */}
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
          Precision from the Ground Up and the Sky Down
        </h1>
        
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
          <p>
            We are a leading provider of professional geospatial technology, empowering surveyors, 
            engineers, and mapping professionals with the industry's most reliable tools. While 
            renowned for our best-selling GNSS receivers and total stations, we offer a complete 
            ecosystem of cutting-edge solutions, including professional drones.
          </p>
          
          <p>
            Our expertise extends beyond the sale. We provide the technology and the specialized 
            drone services—such as aerial surveying, mapping, and inspection—to ensure you capture 
            accurate data from every perspective. Whether you need the premier receiver for your 
            field crew or a comprehensive aerial survey, we are your single source for precision.
          </p>
        </div>

        <Button 
          size="lg" 
          className="bg-[#081748] text-white hover:bg-blue-800 font-bold px-8 py-6 text-lg transition-all"
          onClick={() => navigate('/about')}
        >
          Read More About Us
        </Button>
      </div>
{/* Right Side - Video */}
<div className="relative">
  <div className="aspect-video bg-gray-200 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-300">
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/2SrceTLF5MU?autoplay=1"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
      </div>
    </div>
  </div>
</section>
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1">
      <div className="space-y-6">
        <h2 className="text-3xl md:text-3xl font-bold text-gray-900 leading-tight -mt-30">
          New Arrivals
        </h2>
      </div>
    </div>
  </div>
</section>
    {/* HORIZONTAL DIVIDER LINE */}
      <div className="container mx-auto px-6">
        <div className="h-0.5 bg-gray-400 my-16 w-full -mt-35"></div>
      </div>

{/* THREE PHOTOS SECTION */}
<section className="py-10 bg-white">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Reduced gap from gap-8 to gap-4 */}
      {/* Photo 1 with caption */}
      <div className="text-center">
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square w-80 h-70 mx-auto"> {/* Added mx-auto to center */}
          <img 
            src={arrival1} 
            alt="New Arrival 1" 
            className="w-80 h-70 object-cover"
          />
        </div>
        <p className="text-sm font-semibold text-gray-800 mt-3"> {/* Added caption */}
          GNSS Receiver X5
        </p>
      </div>
      
      {/* Photo 2 with caption */}
      <div className="text-center">
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square w-80 h-70 mx-auto">
          <img 
            src={arrival2}
            alt="New Arrival 2" 
            className="w-80 h-70 object-cover"
          />
        </div>
        <p className="text-sm font-semibold text-gray-800 mt-3"> {/* Added caption */}
          Total Station T7
        </p>
      </div>
      
      {/* Photo 3 with caption */}
      <div className="text-center">
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square w-80 h-70 mx-auto">
          <img 
            src={arrival3}
            alt="New Arrival 3" 
            className="w-80 h-70 object-cover"
          />
        </div>
        <p className="text-sm font-semibold text-gray-800 mt-3"> {/* Added caption */}
          Laser Scanner L3
        </p>
      </div>
    </div>
  </div>
</section>
{/* FULL WIDTH VIDEO SECTION */}
<section className="py-10 bg-white">
  <div className="w-full">
    <div className="aspect-video">
      <iframe
        className="w-full h-150"
        src="https://www.youtube.com/embed/LzsSBPmcQcA?autoplay=1&mute=1&loop=1"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={servicesImage} 
                alt="Survey Technology" 
                className="rounded-lg shadow-2xl w-full hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About Otic Surveys
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Otic Surveys is a premier surveying and geospatial solutions provider in the Africa, 
                specializing in cutting-edge technology and precision data collection. Our team of 
                experienced professionals delivers accurate, reliable results for projects of any scale.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We combine traditional surveying expertise with the latest technology including GPS, 
                laser scanning, and drone surveying to provide comprehensive solutions for construction, 
                infrastructure, and development projects.
              </p>

              <div className="space-y-4 mb-8">
                {HIGHLIGHTS.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-3 hover:translate-x-2 transition-transform duration-200">
                    <CheckCircle className="text-secondary mt-1 flex-shrink-0" size={24} />
                    <span className="text-foreground text-lg font-medium">{highlight}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" variant="default" className="hover:scale-105 transition-transform duration-200">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default CustomerDashboard;