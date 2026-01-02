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
import fieldImage from "../assets/field-practice.jpg";
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
    position: "center"
  },
  {
    id: 3,
    image: heroImage4,
    title: "Certified Programs",
    description: "Get industry-recognized certifications to advance your career",
    position: "center"
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
    image: fieldImage,
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
    image: bathImage,
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
    image: fieldImage,
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
      case 'center': return 'text-center';
      case 'right': return 'text-right';
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
                  <div className={`${isMobile ? 'max-w-full' : 'max-w-2xl'} ${slide.position === 'center' ? 'mx-auto' : slide.position === 'right' ? 'ml-auto' : 'mr-auto'}`}>
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold text-white mb-4 font-montserrat tracking-tight`}>
                      {slide.title}
                    </h1>
                    <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} text-white mb-6 font-montserrat font-bold`}>
                      {slide.description}
                    </p>
                    <div className={slide.position === 'center' ? 'flex justify-center' : 'flex justify-start'}>
                      <Button
                        onClick={scrollToCourses}
                        size={isMobile ? "sm" : "lg"}
                        className="bg-[#081748] text-white hover:bg-blue-800 font-bold px-6 py-3 shadow-xl hover:shadow-2xl transition-all"
                      >
                        {isMobile ? "View Courses →" : "View Courses →"}
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
              <div className="flex-shrink-0 w-[120px] text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div className="flex-shrink-0 w-[120px] text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Trainees</div>
              </div>
              <div className="flex-shrink-0 w-[140px] text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold text-primary">10+</div>
                <div className="text-xl text-muted-foreground">Courses</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-primary">500+</div>
                <div className="text-xl text-muted-foreground">Trainees</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-primary">500+</div>
                <div className="text-xl text-muted-foreground">Certificates Issued</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Training Formats Section - Mobile Optimized */}
      <section id="formats" className="py-12 md:py-20 bg-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Choose Your Training Format
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
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
                    className="flex-shrink-0 w-[280px] bg-white rounded-lg shadow-md p-4"
                    onClick={() => openMobileFormatModal(format.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <format.icon className="w-5 h-5 text-[#081748]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#081748]">{format.title}</h3>
                        <Badge className="text-xs bg-blue-100 text-[#081748] border-blue-300 mt-1">
                          {format.badge}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {format.description}
                    </p>
                    <Button 
                      size="sm"
                      className="w-full text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMobileFormatModal(format.id);
                      }}
                    >
                      Read More
                    </Button>
                  </div>
                ))}
              </div>

              {/* Mobile Format Modal */}
              {showMobileFormatModal && selectedFormat && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                    <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                      <h3 className="font-bold text-lg">
                        {formatCards.find(f => f.id === selectedFormat)?.title}
                      </h3>
                      <button 
                        onClick={() => setShowMobileFormatModal(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          {selectedFormat === 'online' && <Monitor className="w-6 h-6 text-[#081748]" />}
                          {selectedFormat === 'inperson' && <Users className="w-6 h-6 text-[#081748]" />}
                          {selectedFormat === 'group' && <Home className="w-6 h-6 text-[#081748]" />}
                        </div>
                        <div>
                          <Badge className="bg-blue-100 text-[#081748] border-blue-300">
                            {formatCards.find(f => f.id === selectedFormat)?.badge}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6">
                        {formatCards.find(f => f.id === selectedFormat)?.description}
                      </p>
                      
                      <div className="space-y-4 mb-6">
                        <h4 className="font-bold text-[#081748]">What's Included:</h4>
                        <ul className="space-y-3">
                          {formatCards.find(f => f.id === selectedFormat)?.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-[#081748] text-white"
                          onClick={scrollToCourses}
                        >
                          Enroll Now
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowMobileFormatModal(false);
                            navigate("/contact");
                          }}
                        >
                          Contact Us
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Desktop Layout */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {formatCards.map((format) => (
                <Card key={format.id} className={`relative overflow-hidden hover:shadow-lg transition-shadow ${format.color} border-blue-200`}>
                  <Badge className="absolute top-4 right-4 bg-blue-100 text-[#081748] border-blue-300">
                    {format.badge}
                  </Badge> 
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                      <format.icon className="w-8 h-8 text-[#081748]" />
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground mb-4">
                      {format.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {format.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {format.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0" />
                          <span className="text-card-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-300 text-[#081748] bg-blue-100"
                      onClick={scrollToCourses}
                      size="lg"
                    >
                      {format.id === 'group' ? 'View Events' : 'Enroll Now'}
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
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Our Courses
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Browse through our comprehensive training programs
            </p>
          </div>

          <div className={isMobile ? "space-y-4" : "grid md:grid-cols-2 gap-8"}>
            {courses.map((course) => (
              <div key={course.id} className="bg-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={isMobile ? "flex" : ""}>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className={`${isMobile ? 'w-32 h-32 object-cover' : 'w-full h-48 object-cover'}`}
                  />
                  <div className={`${isMobile ? 'flex-1' : ''} p-4 space-y-2`}>
                    <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-foreground`}>
                      {course.title}
                    </h3>
                    <p className={`${isMobile ? 'text-xs' : 'text-base'} text-muted-foreground line-clamp-2`}>
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-primary`}>
                          {getConvertedPrice(course.price)}
                        </div>
                        {course.groupPrice && (
                          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-green-600`}>
                            Group: {getConvertedPrice(course.groupPrice)}
                          </div>
                        )}
                      </div>
                      <Link 
                        to={`/course/${course.id}`}
                        className={`${isMobile ? 'text-xs' : 'text-base'} text-[#081748] hover:text-blue-800 font-semibold inline-block`}
                      >
                        Read More →
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
          <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-8">
            <div className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} rounded-full bg-blue-100 flex items-center justify-center mx-auto shadow-lg`}>
              <Award className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} text-black`} />
            </div>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>
              Certificate Inquiry
            </h2>
            <p className={`${isMobile ? 'text-sm' : 'text-xl'} text-black`}>
              Consult us for your certified training needs. Get in touch to learn more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size={isMobile ? "sm" : "lg"}
                className="bg-blue-100 text-black hover:bg-blue-900 hover:text-[#081748] font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
            <p className="text-black text-xs md:text-sm mt-2">
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