import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Home,
  Wrench,
  HeadphonesIcon,
  Package,
  Cog,
  CalendarRange,
  FileText,
  Heart,
  GraduationCap,
  Users,
  TreePine,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutHero from "../assets/about-hero.jpg";
import ImageCarousel from "../components/ImageCarousel";

// Import your images
import csr1 from "../assets/csr1.jpg";
import csr2 from "../assets/csr2.jpg";
import csr3 from "../assets/csr3.jpg";
import csr4 from "../assets/csr4.jpg";


const About: React.FC = () => {
  const navigate = useNavigate();


  const features = [
    {
      icon: Package,
      title: "Equipment Sales",
      description: "We supply high-quality surveying and geospatial hardware and software from leading global brands, helping professionals get tools that deliver reliable field results.",
    },
    {
      icon: Wrench,
      title: "Equipment Calibration",
      description: "Ensure your surveying instruments remain accurate and reliable with expert calibration services tailored to industry standards.",
    },
    {
      icon: CalendarRange,
      title: "Equipment Rental",
      description: "Flexible rental options let you access advanced equipment for your project without making capital investments.",
    },
    {
      icon: HeadphonesIcon,
      title: "After-Sales Support",
      description: "Comprehensive support after purchase, backed by extensive field experience to keep your tools operational and effective.",
    },
    {
      icon: Cog,
      title: "Tutorials & Training",
      description: "Practical training and easy-to-follow tutorials help you master your equipment and get more value from your technology.",
    },
    {
      icon: FileText,
      title: "CORS Network Services",
      description: "Access real-time GNSS correction services via our nationwide CORS network — enabling high-accuracy positioning across Nigeria.",
    },
  ];

  const HeroSlider: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    
 const slides = [
  {
    image: csr1,
    title: "Pad-A-Girl Initiative in collaboration with JCI",
    description: "Empowering girls through education and menstrual health advocacy."
  },
  {
    image: csr2,
    title: "Educational Outreach",
    description: "Protecting ecosystems with community-led reforestation efforts."
  },
  {
    image: csr3,
    title: "Orphanage Visit",
    description: "Bringing joy and support to orphaned children through visitation."
  },
 {
        image: csr4, 
        title: "Community Support",
        description: "Water is Life Project in Collaboration with JCI"
      },
    ];
    
   
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }, [slides.length]);
    
    const nextSlide = (): void => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };
    
    const prevSlide = (): void => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
    
    return (
      <>
        <div className="w-full h-[400px] relative">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          
          {/* Slider Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Image Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-white text-xl font-bold mb-2">
              {slides[currentSlide].title}
            </h3>
            <p className="text-white/90 text-sm">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          aria-label="Previous slide"
        >
          <ChevronRight className="w-6 h-6 text-white rotate-180" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        
        {/* Slide Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION WITH BACKGROUND PHOTO - FIXED VERSION */}
   <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
  {/* Background image container */}
  <div className="absolute inset-0 flex items-center justify-center">
    <img
      src={aboutHero}
      alt=""
      className="w-auto h-auto min-w-full min-h-full object-contain"
    />
  </div>
  

        {/* HERO CONTENT - LEFT ALIGNED */}
        <div className="relative z-10 w-full h-full flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-2xl ml-0 md:ml-20"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mt-45">
                About
              </h1>
              <p className="text-lg md:text-xl text-black/95 font-medium leading-relaxed">
                Leave us a little info, and we'll be in touch.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={() => navigate("/contact")}
                  size="lg"
                  className="bg-[#081748] text-white hover:bg-[#081748] font-bold text-base px-8 py-4 shadow-xl hover:shadow-2xl transition-all mt-0"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <footer className="bg-[#081748] text-white"></footer>

      {/* BREADCRUMB NAVIGATION */}
      <section className="bg-blue-100 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 bg-blue-100">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4 bg-blue-100" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">About</span>
          </motion.div>
        </div>
      </section>

{/* MAIN HEADING SECTION */}
<section className="py-16 bg-blue-100">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Geospatial Solutions Provider & Technology Partner
      </h2>
      <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed -mt-0">
        <p>
         GeossoTech provides reliable geospatial equipment, services, and support for surveyors and professionals across surveying, engineering, construction, agriculture, energy, infrastructure, hydrographic operations, and government projects.
        </p>
        <p>
          We supply and support GNSS receivers, total stations, 3D laser scanners, professional drones, echo sounders, side scan sonars, autosteering systems, CORS network services, and geospatial software. Beyond supply, we calibrate and repair equipment, offer training, equipment rental, scanning services, and project support.
        </p>
        <p>
          GeossoTech works as a technology partner—helping clients choose the right tools, deploy them correctly, and keep them working in the field.
        </p>
      </div>
    </motion.div>
  </div>
</section>

{/* MISSION STATEMENT */}
<section className="py-16 bg-blue-100">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 -mt-30">
        To be the Leading Geospatial Technology Company – Revolutionizing Surveying Solutions
      </h2>
      <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed -mt-5">
        <p>
        As a leading geospatial technology company, we pride ourselves on delivering exceptional value to surveying professionals and organizations. Explore our curated selection of the latest surveying equipment from renowned manufacturers, GNSS receivers, total stations, 3D laser scanners, professional drones, echo sounders, side scan sonars, autosteering systems, CORS network services, and geospatial software.  From entry-level instruments to high-precision survey systems, we offer a comprehensive range that caters to every project requirement and expertise level. Our solutions are designed to enhance accuracy, efficiency, and productivity in geospatial data collection and analysis.
        </p>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-5 mb-4">
        Geospatial Services for Professional Practice
      </h3>
      <p className="text-base md:text-lg text-gray-700 leading-relaxed">
       GeossoTech works as a technology partner, helping clients choose the right tools, deploy them correctly, and keep them working in the field.
      </p>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-12 mb-4">
        Our Mission
      </h3>
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-12">
        To solve our customers' everyday challenges by being reliable, knowledgeable, and consistent in the solutions and support we provide.
      </p>
    </motion.div>

    {/* IMAGE CAROUSEL */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-16"
    >
      <ImageCarousel />
    </motion.div>
  </div>
</section>

      {/* CSR HIGHLIGHT SECTION WITH HERO SLIDER */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-blue-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Hero Photo Slider */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                {/* Custom Hero Slider Component */}
                <HeroSlider />
              </div>
              
              {/* Optional: Multiple small thumbnails below main slider */}
              <div className="flex gap-2 mt-4">
                <div className="flex-1 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-blue-200">
                  <img
                    src={csr1}
                    alt="Community activity 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                 <div className="flex-1 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-transparent hover:border-blue-200">
                  <img
                    src={csr2}
                    alt="Community activity 2"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-transparent hover:border-blue-200">
                  <img
                    src={csr3}
                    alt="Community activity 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-transparent hover:border-blue-200">
                  <img
                    src={csr4}
                    alt="Community activity 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            
           {/* Right side - CSR Highlight Card */}
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6, duration: 0.8 }}
  className="lg:w-2/5"
>
  <Card className="bg-blue-100/80 backdrop-blur-sm border-2 border-blue-100 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
    <CardContent className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Heart className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-black">Community Impact</h3>
          <p className="text-blue-600">Creating value beyond business</p>
        </div>
      </div>

      {/* CSR Items */}
      <div className="space-y-5">
        {/* Education & Training */}
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Education & Training</h4>
            <p className="text-gray-700 text-sm">
              Supporting future professionals through scholarships, mentorship, and hands-on technical training.
            </p>
          </div>
        </div>

        {/* Community Development */}
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Community Development</h4>
            <p className="text-gray-700 text-sm">
              Sponsoring community events and initiatives that promote growth, collaboration, and local development.
            </p>
          </div>
        </div>

        {/* Environmental Care */}
        <div className="flex items-start gap-3">
          <TreePine className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Environmental Care</h4>
            <p className="text-gray-700 text-sm">
              Supporting environmental sustainability through eco-friendly practices and community-driven initiatives.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-blue-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Why choose GeossoTech?
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-12">
  GeossoTech is a trusted geospatial solutions provider and technology partner built to support professionals, organizations, and institutions across surveying, mapping, engineering, and allied fields. We offer a complete ecosystem of geospatial solutions, equipment sales and rentals, certified training, technical consulting, and after-sales support, delivered under one roof for efficiency and reliability.
  <br /><br />
  Our strength lies in deep technical expertise, hands-on industry experience, and a clear understanding of real project demands. We work closely with our clients to recommend practical, proven technologies that align with their operational goals, budgets, and environments. Beyond supplying equipment, we ensure users are properly trained, supported, and confident in deploying solutions effectively.
  <br /><br />
  At GeossoTech, service quality is driven by a culture of accountability, continuous improvement, and client-focused delivery. This approach has positioned us as a dependable long-term partner, trusted for accurate guidance, responsive support, and consistent value. Choosing GeossoTech means choosing a partner committed to helping you work smarter, deliver better results, and grow sustainably.
</p>
                 
          {/* HORIZONTAL DIVIDER LINE */}
            <div className="container mx-auto px-6">
              <div className="h-0.5 bg-gray-400 my-16 w-full"></div>
            </div>

  {/* FEATURE CARDS GRID - Updated for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 md:p-6">
                        {/* Mobile Layout: Stacked with centered icon */}
                        <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row md:gap-4">
                          {/* Icon container - larger on mobile for better visibility */}
                          <div className="flex-shrink-0 mb-4 md:mb-0">
                            <div className="w-14 h-14 md:w-12 md:h-12 bg-[#081748]-100 rounded-lg flex items-center justify-center mx-auto md:mx-0">
                              <Icon className="w-7 h-7 md:w-6 md:h-6 text-blue-600" />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 md:mb-3">
                              {feature.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default About;