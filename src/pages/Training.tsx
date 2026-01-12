import { useState, useEffect, useCallback, useRef } from "react";
import { Users, CheckCircle2, Monitor, Home, Award, ChevronLeft, ChevronRight, X} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CurrencyBoxes from "../components/CurrencyBoxes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage1 from "../assets/hero-training.jpg";
import heroImage2 from "../assets/hero-training-2.jpg";
import heroImage4 from "../assets/dronemapping.jpg";
import safetyImage from "../assets/safety-training.jpg";
import bathImage from "../assets/bath.jpg";
import dronemapping from "../assets/dronemapping.jpg";
import threed from "../assets/3d.png"
import engineering from "../assets/engineering.jpg"
import totalstation from "../assets/total-training.jpg";
import { Testimonials } from "../components/Testimonials";
import { useCurrency } from "../context/CurrencyContext";

// Hero slides data
const heroSlides = [
  {
    id: 1,
    image: heroImage1,
    title: "GeossoTech Academy",
    description: "We train professionals worldwide to safely and efficiently operate in their field with comprehensive training programs",
    position: "left"
  },
  {
    id: 2,
    image: heroImage2,
    title: "Expert-Led Training",
    description: "Learn from industry professionals with years of field experience",
    position: "left"
  },
  {
    id: 3,
    image: heroImage4,
    title: "Certified Programs",
    description: "Get industry-recognized certifications to advance your career",
    position: "left"
  }
];

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  groupPrice?: number;
}

const courses: Course[] = [
  {
    id: "gnss",
    title: "GNSS Surveying Course",
    description: "A comprehensive course covering GNSS fundamentals, satellite constellations, and survey techniques including static, RTK, DGPS, CORS, and PPP. Participants gain hands-on experience in field data collection, stakeout, area computation, and professional post-processing using Compass Solution and Trimble Business Center, ensuring high-accuracy positioning and reliable survey outputs for Cadastral, Engineering, and GIS projects.",
    image: safetyImage,
    price: 175,
    groupPrice: 141
  },
  {
    id: "totalstation",
    title: "Total Station Surveying Course",
    description: "A complete course on Total Station surveying for precision measurement, site setup, traversing, topographic surveys, and construction layout. Learners practice workflows with Leica, FOIF and COMNAV Total Stations, focusing on accurate field data capture, error reduction, and generating professional deliverables for Cadastral, Engineering, and Construction projects.",
    image: totalstation,
    price: 244,
    groupPrice: 175
  },
  {
    id: "dronemapping",
    title: "Drone Mapping Course",
    description: "This course teaches comprehensive drone mapping workflows, including mission planning, RTK and Non-RTK flights, aerial data acquisition, and photogrammetric processing. Participants create orthomosaics, 3D models, DSMs, and point clouds, integrating software such as Pix4D mapper, Drone deploy, Agisoft Metashape, and GIS software. Practical exercises and step-by-step demonstrations build expertise in surveying, construction monitoring, agriculture, and environmental mapping.",
    image: dronemapping,
    price: 279,
    groupPrice: 175
  },
  {
    id: "3dlaserscanning",
    title: "3D Laser Scanning Course",
    description: "An advanced course covering 3D laser scanning techniques for survey, engineering, and BIM applications. Participants learn point cloud capture, scanner setup, scanning strategies, and post-processing using Cyclone, ReCap, and CloudCompare. Practical exercises focus on creating accurate 3D models, topographic maps, and as-built documentation for construction, infrastructure, and heritage projects.",
    image:threed,
    price: 520,
    groupPrice: 348
  },
  {
    id: "bathymetric",
    title: "Bathymetric Survey Course",
    description: "This course focuses on bathymetric surveying, including operation of echosounders, transducers, and GNSS-integrated systems. Learners practice depth measurement, data acquisition, calibration, tide correction, and noise filtering, and perform post-processing using HYSURVEY, AutoCAD, Global Mapper, and Surfer. Exercises enable creation of contour maps, 3D surfaces, and precise navigation-ready datasets for marine, engineering, and environmental applications.",
    image: bathImage,
    price: 348,
    groupPrice: 244
  },
  {
    id: "autocad",
    title: "AutoCAD Training",
    description: "A practical course for surveyors, engineers, and designers covering 2D and 3D drafting, layer management, blocks, annotation, and professional technical drawing workflows. Participants learn to produce site plans, engineering layouts, topographic maps, and construction drawings, with exercises designed to deliver client-ready and industry-standard outputs.",
    image: dronemapping,
    price: 175,
    groupPrice: 127
  },
  {
    id: "gis",
    title: "GIS Training",
    description: "A practical GIS training course teaching spatial data analysis, map creation, and geospatial workflows for surveying, environmental, and urban planning projects.",
    image: safetyImage,
    price: 210,
    groupPrice: 175
  },
  {
    id: "engineering",
    title: "Engineering Survey Course",
    description: "A professional Engineering Survey course designed for Surveyors, Civil Engineers, and Infrastructure professionals, covering precision site measurements, road and topographic surveys, cross-sections, longitudinal sections, drainage mapping, contour generation, and field-to-office workflows using AutoCAD, Global Mapper, and Surfer.",
    image: engineering,
    price: 313,
    groupPrice: 244
  },
  {
    id: "lidar-drone",
    title: "LIDAR Drone Course (Advanced)",
    description: "Advanced LIDAR drone surveying and data processing for high-precision topographic mapping and volumetric analysis.",
    image: dronemapping,
    price: 520,
    groupPrice: 348
  }
];

const Training = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedFormat, setExpandedFormat] = useState<string | null>(null);
  const [showMobileFormatModal, setShowMobileFormatModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const { getConvertedPrice } = useCurrency();
  const statsRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setExpandedFormat(null); // Collapse expanded formats on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('content');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getTextAlignment = (position: string) => {
    switch (position) {
      case 'left': return 'text-left';
      case 'center': return 'text-left';
      case 'right': return 'text-left';
      default: return 'text-left';
    }
  };

  // Mobile format selection
  const formatCards = [
    {
      id: "online",
      title: "Online Training",
      description: "Learn from anywhere with flexible interactive online programs",
      icon: Monitor,
      color: "bg-blue-50",
      badge: "Flexible",
      features: [
        "Self paced online courses with video lessons, digital resources and assignments",
        "Live training sessions with real time instructor support.",
        "Post training support",
        "Flexible and convenient learning platform"
      ]
    },
    {
      id: "inperson",
      title: "In-Person Training",
      description: "Interactive, hands-on learning experiences at our training locations",
      icon: Users,
      color: "bg-blue-50",
      badge: "Customized",
      features: [
        "Face-to-face interaction",
        "Hands-on workshops",
        "Networking opportunities",
        "Immediate feedback"
      ]
    },
    {
      id: "group",
      title: "Group Training/Events",
      description: "Customized training programs for your organization's specific needs",
      icon: Home,
      color: "bg-blue-50",
      badge: "Most Popular",
      features: [
        "Customized content",
        "Team building",
        "Cost-effective for groups",
        "Your preferred location"
      ]
    }
  ];

  const toggleFormat = (formatId: string) => {
    if (expandedFormat === formatId) {
      setExpandedFormat(null);
    } else {
      setExpandedFormat(formatId);
    }
  };

  const openMobileFormatModal = (formatId: string) => {
    setSelectedFormat(formatId);
    setShowMobileFormatModal(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <CurrencyBoxes />
      <Header />
      
      {/* Hero Carousel Section - Mobile Optimized */}
      <section className={`relative ${isMobile ? 'h-[60vh]' : 'h-[750px]'} overflow-hidden`}>
        {/* Slides Container */}
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Landscape focus on mobile */}
              <div className="absolute inset-0">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-primary/60" />
              </div>
              
              {/* Slide Content */}
              <div className={`relative z-10 h-full flex items-center justify-center ${getTextAlignment(slide.position)}`}>
                <div className="container mx-auto px-4">
                  <div className={`${isMobile ? 'max-w-full' : 'max-w-3xl'} ${slide.position === 'center' ? 'mx-auto' : slide.position === 'right' ? 'ml-auto' : ''}`}>
                    <h1 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'} font-extrabold text-white mb-6 leading-tight`}>
                      {slide.title}
                    </h1>
                    <p className={`${isMobile ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'} text-white mb-8 font-bold leading-relaxed`}>
                      {slide.description}
                    </p>
                    <div className={slide.position === 'center' ? 'flex justify-start' : 'flex justify-start'}>
                      <Button
                        onClick={scrollToCourses}
                        size={isMobile ? "lg" : "lg"}
                        className="bg-[#081748] text-white hover:bg-blue-800 font-extrabold px-8 py-6 text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all"
                      >
                        {isMobile ? "VIEW COURSES →" : "VIEW COURSES →"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {!isMobile && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 ${isMobile ? 'w-3 h-3' : ''} rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section - Horizontal on Mobile */}
      <section className="py-8 md:py-16 bg-secondary bg-blue-100">
        <div className="container mx-auto px-4 bg-blue-100">
          {isMobile ? (
            <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex-shrink-0 w-[140px] text-left">
                <div className="text-4xl font-extrabold text-primary">10+</div>
                <div className="text-base font-semibold text-muted-foreground">Courses</div>
              </div>
              <div className="flex-shrink-0 w-[140px] text-left">
                <div className="text-4xl font-extrabold text-primary">500+</div>
                <div className="text-base font-semibold text-muted-foreground">Trainees</div>
              </div>
              <div className="flex-shrink-0 w-[160px] text-left">
                <div className="text-4xl font-extrabold text-primary">500+</div>
                <div className="text-base font-semibold text-muted-foreground">Certificates</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-4">
                <div className="text-6xl font-extrabold text-primary">10+</div>
                <div className="text-2xl font-bold text-muted-foreground">Courses</div>
              </div>
              <div className="space-y-4">
                <div className="text-6xl font-extrabold text-primary">500+</div>
                <div className="text-2xl font-bold text-muted-foreground">Trainees</div>
              </div>
              <div className="space-y-4">
                <div className="text-6xl font-extrabold text-primary">500+</div>
                <div className="text-2xl font-bold text-muted-foreground">Certificates Issued</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Training Formats Section - Mobile Optimized */}
      <section id="formats" className="py-12 md:py-20 bg-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              CHOOSE YOUR TRAINING FORMAT
            </h2>
            <p className="text-lg md:text-xl font-semibold text-muted-foreground">
              Select the learning style that works best for you
            </p>
          </div>

          {isMobile ? (
            <>
              {/* Mobile - Horizontal format cards */}
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                {formatCards.map((format) => (
                  <div 
                    key={format.id}
                    className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-md p-5"
                    onClick={() => openMobileFormatModal(format.id)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <format.icon className="w-7 h-7 text-[#081748]" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-[#081748]">{format.title}</h3>
                        <Badge className="text-sm font-bold bg-blue-100 text-[#081748] border-blue-300 mt-2 px-3 py-1">
                          {format.badge}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-base font-semibold text-gray-700 mb-4 line-clamp-2">
                      {format.description}
                    </p>
                    <Button 
                      size="lg"
                      className="w-full text-base font-bold py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMobileFormatModal(format.id);
                      }}
                    >
                      READ MORE
                    </Button>
                  </div>
                ))}
              </div>

              {/* Mobile Format Modal */}
              {showMobileFormatModal && selectedFormat && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                    <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                      <h3 className="font-extrabold text-xl">
                        {formatCards.find(f => f.id === selectedFormat)?.title}
                      </h3>
                      <button 
                        onClick={() => setShowMobileFormatModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                          {selectedFormat === 'online' && <Monitor className="w-8 h-8 text-[#081748]" />}
                          {selectedFormat === 'inperson' && <Users className="w-8 h-8 text-[#081748]" />}
                          {selectedFormat === 'group' && <Home className="w-8 h-8 text-[#081748]" />}
                        </div>
                        <div>
                          <Badge className="bg-blue-100 text-[#081748] border-blue-300 font-bold px-4 py-1.5">
                            {formatCards.find(f => f.id === selectedFormat)?.badge}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-800 font-semibold text-lg mb-8">
                        {formatCards.find(f => f.id === selectedFormat)?.description}
                      </p>
                      
                      <div className="space-y-6 mb-8">
                        <h4 className="font-extrabold text-xl text-[#081748]">WHAT'S INCLUDED:</h4>
                        <ul className="space-y-4">
                          {formatCards.find(f => f.id === selectedFormat)?.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-800 font-semibold">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-[#081748] text-white font-extrabold py-3 text-lg"
                          onClick={scrollToCourses}
                        >
                          ENROLL NOW
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 font-bold py-3 text-lg"
                          onClick={() => {
                            setShowMobileFormatModal(false);
                            navigate("/contact");
                          }}
                        >
                          CONTACT US
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Desktop Layout */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {formatCards.map((format) => (
                <Card key={format.id} className={`relative overflow-hidden hover:shadow-xl transition-shadow ${format.color} border-blue-200`}>
                  <Badge className="absolute top-6 right-6 bg-blue-100 text-[#081748] border-blue-300 font-extrabold text-base px-4 py-2">
                    {format.badge}
                  </Badge> 
                  <CardContent className="p-8">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-8">
                      <format.icon className="w-10 h-10 text-[#081748]" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-card-foreground mb-6">
                      {format.title}
                    </h3>
                    <p className="text-xl font-semibold text-muted-foreground mb-8">
                      {format.description}
                    </p>
                    <ul className="space-y-4 mb-10">
                      {format.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-[#081748] mt-1 flex-shrink-0" />
                          <span className="text-lg font-semibold text-card-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-300 text-[#081748] bg-blue-100 font-extrabold py-6 text-lg"
                      onClick={scrollToCourses}
                      size="lg"
                    >
                      {format.id === 'group' ? 'VIEW EVENTS' : 'ENROLL NOW'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Courses Section - Mobile Optimized */}
      <section id="content" className="py-12 md:py-20 bg-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-left mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
              OUR COURSES
            </h2>
            <p className="text-lg md:text-2xl font-semibold text-muted-foreground">
              Browse through our comprehensive training programs
            </p>
          </div>

          <div className={isMobile ? "space-y-6" : "grid md:grid-cols-2 gap-10"}>
            {courses.map((course) => (
              <div key={course.id} className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className={isMobile ? "flex flex-col" : "flex"}>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className={`${isMobile ? 'w-full h-48 object-cover' : 'w-48 h-56 object-cover flex-shrink-0'}`}
                  />
                  <div className={`${isMobile ? 'p-5' : 'p-6'} space-y-4 flex-1`}>
                    <h3 className={`${isMobile ? 'text-2xl' : 'text-2xl'} font-extrabold text-foreground leading-tight`}>
                      {course.title}
                    </h3>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground line-clamp-3 font-medium`}>
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-2">
                        <div className={`${isMobile ? 'text-2xl' : 'text-2xl'} font-extrabold text-primary`}>
                          {getConvertedPrice(course.price)}
                        </div>
                        {course.groupPrice && (
                          <div className={`${isMobile ? 'text-lg' : 'text-lg'} font-bold text-green-700`}>
                            Group: {getConvertedPrice(course.groupPrice)}
                          </div>
                        )}
                      </div>
                      <Link 
                        to={`/course/${course.id}`}
                        className={`${isMobile ? 'text-lg' : 'text-lg'} text-[#081748] hover:text-blue-800 font-extrabold inline-block`}
                      >
                        READ MORE →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <Testimonials />

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-blue-100 text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-left space-y-6 md:space-y-10">
            <div className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-full bg-blue-100 flex items-center justify-center shadow-xl`}>
              <Award className={`${isMobile ? 'w-9 h-9' : 'w-12 h-12'} text-black`} />
            </div>
            <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-extrabold leading-tight`}>
              CERTIFICATE INQUIRY
            </h2>
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} text-black font-bold`}>
              Consult us for your certified training needs. Get in touch to learn more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size={isMobile ? "lg" : "lg"}
                className="bg-blue-100 text-black hover:bg-blue-900 hover:text-[#081748] font-extrabold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate("/contact")}
              >
                CONTACT US
              </Button>
            </div>
            <p className="text-black text-base md:text-lg font-bold mt-4">
              Need immediate assistance? Call us at +234 706 370 8703
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Training;