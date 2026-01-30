import { useState, useEffect } from "react";
import { Users, CheckCircle2, Monitor, Home, Award, X, Shield, Star, Zap} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CurrencyBoxes from "../components/CurrencyBoxes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage1 from "../assets/hero-training.jpg";
import safetyImage from "../assets/safety-training.jpg";
import bathImage from "../assets/bath.jpg";
import dronemapping from "../assets/dronemapping.jpg";
import gistraining from "../assets/gis-training.jpg";
import threed from "../assets/3d.png"
import engineering from "../assets/engineering.jpg"
import totalstation from "../assets/total-training.jpg";
import lidar from "../assets/lidar.jpg";
import autocad from "../assets/autocad.jpg";
import { Testimonials } from "../components/Testimonials";
import { useCurrency } from "../context/CurrencyContext";

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
    description: "Master GNSS fundamentals, satellite constellations, and survey techniques. Hands-on experience with static, RTK, DGPS, and professional post-processing.",
    image: safetyImage,
    // Naira: Personal ₦250,000, Group ₦200,000
    price: 162, // $162.26 rounded UP from 250,000/1550
    groupPrice: 130 // $129.03 rounded UP from 200,000/1550
  },
  {
    id: "totalstation",
    title: "Total Station Surveying Course",
    description: "Precision measurement, site setup, traversing, and topographic surveys. Learn workflows with Leica, FOIF and COMNAV Total Stations.",
    image: totalstation,
    // Naira: Personal ₦350,000, Group ₦250,000
    price: 226, // $225.81 rounded UP from 350,000/1550
    groupPrice: 162 // $161.29 rounded UP from 250,000/1550
  },
  {
    id: "dronemapping",
    title: "Drone Mapping Course",
    description: "Comprehensive drone mapping workflows including mission planning, RTK flights, photogrammetric processing, and 3D model creation.",
    image: dronemapping,
    // Naira: Personal ₦400,000, Group ₦250,000
    price: 259, // $258.06 rounded UP from 400,000/1550
    groupPrice: 162 // $161.29 rounded UP from 250,000/1550
  },
  {
    id: "3dlaserscanning",
    title: "3D Laser Scanning Course",
    description: "Advanced 3D laser scanning techniques for survey, engineering, and BIM applications with point cloud processing.",
    image: threed,
    // Naira: Personal ₦750,000, Group ₦500,000
    price: 484, // $483.87 rounded UP from 750,000/1550
    groupPrice: 323 // $322.58 rounded UP from 500,000/1550
  },
  {
    id: "bathymetric",
    title: "Bathymetric Survey Course",
    description: "Master bathymetric surveying with echosounders, GNSS-integrated systems, and professional data processing workflows.",
    image: bathImage,
    // Naira: Personal ₦500,000, Group ₦350,000
    price: 323, // $322.58 rounded UP from 500,000/1550
    groupPrice: 226 // $225.81 rounded UP from 350,000/1550
  },
  {
    id: "autocad",
    title: "AutoCAD Training",
    description: "Professional 2D and 3D drafting, layer management, and technical drawing workflows for surveyors and engineers.",
    image: autocad,
    // Naira: Personal ₦250,000, Group ₦180,000
    price: 162, // $161.29 rounded UP from 250,000/1550
    groupPrice: 117 // $116.13 rounded UP from 180,000/1550
  },
  {
    id: "gis",
    title: "GIS Training",
    description: "Spatial data analysis, map creation, and geospatial workflows for surveying, environmental, and urban planning.",
    image: gistraining,
    // Naira: Personal ₦300,000, Group ₦250,000
    price: 194, // $193.55 rounded UP from 300,000/1550
    groupPrice: 162 // $161.29 rounded UP from 250,000/1550
  },
  {
    id: "engineering",
    title: "Engineering Survey Course",
    description: "Professional engineering survey techniques including road surveys, cross-sections, drainage mapping, and contour generation.",
    image: engineering,
    price: 291, // $290.32 rounded UP from 450,000/1550
    groupPrice: 226 // $225.81 rounded UP from 350,000/1550
  },
  {
    id: "lidar-drone",
    title: "LIDAR Drone Course (Advanced)",
    description: "Advanced LIDAR drone surveying and data processing for high-precision topographic mapping and volumetric analysis.",
    image: lidar,
    price: 484, // $483.87 rounded UP from 750,000/1550
    groupPrice: 323 // $322.58 rounded UP from 500,000/1550
  }
];

// Format cards data
const formatCards = [
  {
    id: "online",
    title: "Online Training",
    description: "Learn from anywhere with flexible interactive online programs",
    icon: Monitor,
    color: "bg-white",
    badge: "Flexible",
    features: [
      "Self-paced video lessons & digital resources",
      "Live instructor support sessions",
      "Post-training support included",
      "Flexible learning schedule"
    ],
    isPopular: false
  },
  {
    id: "inperson",
    title: "In-Person Training",
    description: "Interactive, hands-on learning experiences at our training locations",
    icon: Users,
    color: "bg-white",
    badge: "Customized",
    features: [
      "Face-to-face expert guidance",
      "Hands-on equipment workshops",
      "Networking with professionals",
      "Immediate feedback"
    ],
    isPopular: false
  },
  {
    id: "group",
    title: "Group Training/Events",
    description: "Customized training programs for your organization's specific needs",
    icon: Home,
    color: "bg-white",
    badge: "Most Popular",
    features: [
      "Customized content for your team",
      "Team building activities",
      "Cost-effective for groups",
      "Your preferred location"
    ],
    isPopular: true
  }
];

const Training = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFormatModal, setShowMobileFormatModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const { getConvertedPrice } = useCurrency();
  
  // Count-up animation state
  const [coursesCount, setCoursesCount] = useState(0);
  const [traineesCount, setTraineesCount] = useState(0);
  const [certificatesCount, setCertificatesCount] = useState(0);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Count-up animation effect
  useEffect(() => {
    const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, duration: number = 2000) => {
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        setter(value);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setter(target);
        }
      };
      requestAnimationFrame(step);
    };

    animateCounter(setCoursesCount, 10);
    animateCounter(setTraineesCount, 500);
    animateCounter(setCertificatesCount, 500);
  }, []);

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('content');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openMobileFormatModal = (formatId: string) => {
    setSelectedFormat(formatId);
    setShowMobileFormatModal(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pt-20">
      <CurrencyBoxes />
      <Header />
      
      {/* Hero Section - SINGLE IMAGE (No slideshow) */}
      <section className={`relative ${isMobile ? 'h-[50vh]' : 'h-[500px]'} overflow-hidden `}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0">
            <img 
              src={heroImage1} 
              alt="OTIC Geosystems Academy"
              className="w-full h-full object-cover object-center"
            />
            {/* BLACK OVERLAY */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-left">
            <div className="container mx-auto px-4">
              <div className={`${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
                <h1 className={`${isMobile ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} font-black text-white mb-4 leading-tight tracking-tight `}>
                  OTIC Geosystems Academy
                </h1>
                <p className={`${isMobile ? 'text-base md:text-lg' : 'text-xl md:text-2xl'} text-white mb-6 font-normal `}>
                  We train professionals worldwide to safely and efficiently operate in their field with comprehensive training programs
                </p>
                <div className="flex justify-start">
                  <Button
                    onClick={scrollToCourses}
                    size={isMobile ? "default" : "lg"}
                    className="bg-blue-900 text-white hover:bg-blue-800 font-bold px-6 py-3 text-base shadow-xl hover:shadow-2xl transition-all "
                  >
                    {isMobile ? "View Courses →" : "View Courses →"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Updated with count-up animation and centered */}
      <section className="py-10 md:py-16 bg-white ">
        <div className="container mx-auto px-4 bg-white">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900  mb-4">
              Training Excellence in Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-normal ">
              Join hundreds of professionals who have advanced their careers with our industry-leading programs
            </p>
          </div>
          
          {isMobile ? (
            <div className="flex justify-center overflow-x-auto gap-8 pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex-shrink-0 w-[120px] text-center">
                <div className="text-4xl font-black text-blue-900  mb-2">
                  {coursesCount}+
                </div>
                <div className="text-sm text-gray-600  font-medium"> Courses</div>
              </div>
              <div className="flex-shrink-0 w-[120px] text-center">
                <div className="text-4xl font-black text-blue-900  mb-2">
                  {traineesCount}+
                </div>
                <div className="text-sm text-gray-600  font-medium">Trained Professionals</div>
              </div>
              <div className="flex-shrink-0 w-[140px] text-center">
                <div className="text-4xl font-black text-blue-900  mb-2">
                  {certificatesCount}+
                </div>
                <div className="text-sm text-gray-600  font-medium">Certificates Issued</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-3 p-6 bg-blue-50/50 rounded-xl">
                <div className="text-5xl md:text-6xl font-black text-blue-900 ">
                  {coursesCount}+
                </div>
                <div className="text-xl text-gray-700 font-medium ">Professional Courses</div>
                <p className="text-gray-600 text-sm font-normal ">
                  Comprehensive programs covering all aspects of geospatial technology
                </p>
              </div>
              <div className="text-center space-y-3 p-6 bg-blue-50/50 rounded-xl">
                <div className="text-5xl md:text-6xl font-black text-blue-900 ">
                  {traineesCount}+
                </div>
                <div className="text-xl text-gray-700 font-medium ">Trained Professionals</div>
                <p className="text-gray-600 text-sm font-normal ">
                  Surveyors, engineers, and technicians trained globally
                </p>
              </div>
              <div className="text-center space-y-3 p-6 bg-blue-50/50 rounded-xl">
                <div className="text-5xl md:text-6xl font-black text-blue-900 ">
                  {certificatesCount}+
                </div>
                <div className="text-xl text-gray-700 font-medium ">Certificates Issued</div>
                <p className="text-gray-600 text-sm font-normal ">
                  Industry-recognized certifications for career advancement
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Training Formats Section - Improved Visual Hierarchy */}
      <section id="formats" className="py-8 md:py-16 bg-white ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-2xl md:text-4xl font-black text-blue-900 mb-3 tracking-tight ">
              Choose Your Training Format
            </div>
            <p className="text-base md:text-lg text-gray-600 font-normal  max-w-2xl mx-auto">
              Select the learning style that works best for your professional development
            </p>
          </div>

          {isMobile ? (
            <>
              {/* Mobile - Horizontal format cards */}
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                {formatCards.map((format) => (
                  <div 
                    key={format.id}
                    className={`flex-shrink-0 w-[280px] rounded-xl border shadow-lg p-5 transition-all duration-300 ${
                      format.isPopular 
                        ? 'bg-blue-50 border-blue-200 shadow-blue-100/50 scale-[1.02]' 
                        : 'bg-white border-gray-200'
                    }`}
                    onClick={() => openMobileFormatModal(format.id)}
                  >
                    {format.isPopular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white border-none px-3 py-1 text-xs font-bold">
                          <Zap className="w-3 h-3 mr-1" /> {format.badge}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        format.isPopular ? 'bg-blue-100' : 'bg-blue-50'
                      }`}>
                        <format.icon className={`w-6 h-6 ${format.isPopular ? 'text-blue-700' : 'text-blue-900'}`} />
                      </div>
                      <div>
                        <div className={`font-bold text-lg ${format.isPopular ? 'text-blue-800' : 'text-blue-900'} `}>
                          {format.title}
                        </div>
                        {!format.isPopular && (
                          <Badge className="text-xs bg-blue-50 text-blue-900 border-blue-200 mt-1 ">
                            {format.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-normal ">
                      {format.description}
                    </p>
                    <Button 
                      size="sm"
                      className={`w-full text-sm font-bold  ${
                        format.isPopular 
                          ? 'bg-blue-700 text-white hover:bg-blue-800' 
                          : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border-blue-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openMobileFormatModal(format.id);
                      }}
                    >
                      {format.isPopular ? 'Get Started' : 'Learn More'}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Mobile Format Modal */}
              {showMobileFormatModal && selectedFormat && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ">
                  <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-200 shadow-2xl">
                    <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                      <div className="font-bold text-lg text-blue-900 ">
                        {formatCards.find(f => f.id === selectedFormat)?.title}
                      </div>
                      <button 
                        onClick={() => setShowMobileFormatModal(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedFormat === 'group' ? 'bg-blue-100' : 'bg-blue-50'
                        }`}>
                          {selectedFormat === 'online' && (
                            <Monitor className="w-6 h-6 text-blue-900" />
                          )}
                          {selectedFormat === 'inperson' && (
                            <Users className="w-6 h-6 text-blue-900" />
                          )}
                          {selectedFormat === 'group' && (
                            <Home className="w-6 h-6 text-blue-700" />
                          )}
                        </div>
                        <div>
                          <Badge className={` ${
                            selectedFormat === 'group' 
                              ? 'bg-blue-600 text-white border-none' 
                              : 'bg-blue-50 text-blue-900 border-blue-200'
                          }`}>
                            {formatCards.find(f => f.id === selectedFormat)?.badge}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6 font-normal ">
                        {formatCards.find(f => f.id === selectedFormat)?.description}
                      </p>
                      
                      <div className="space-y-4 mb-6">
                        <div className="font-bold text-blue-900 ">What's Included:</div>
                        <ul className="space-y-3">
                          {formatCards.find(f => f.id === selectedFormat)?.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-5 h-5 ${selectedFormat === 'group' ? 'text-blue-600' : 'text-blue-500'} mt-0.5 flex-shrink-0`} />
                              <span className="text-gray-700 font-normal ">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          className={`flex-1 font-bold  ${
                            selectedFormat === 'group'
                              ? 'bg-blue-700 text-white hover:bg-blue-800'
                              : 'bg-blue-900 text-white hover:bg-blue-800'
                          }`}
                          onClick={scrollToCourses}
                        >
                          {selectedFormat === 'group' ? 'Schedule Group Training' : 'Enroll Now'}
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-blue-300 text-blue-900 hover:bg-blue-50 "
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
            /* Desktop Layout with Visual Hierarchy */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {formatCards.map((format) => (
                <div 
                  key={format.id} 
                  className={`relative transition-all duration-300 hover:scale-[1.02] ${
                    format.isPopular 
                      ? 'md:scale-105 md:-translate-y-2' 
                      : ''
                  }`}
                >
                  {format.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-blue-700 text-white border-none px-4 py-1.5 text-sm font-bold shadow-lg">
                        <Zap className="w-3.5 h-3.5 mr-1.5" /> {format.badge}
                      </Badge>
                    </div>
                  )}
                  <Card className={`relative overflow-hidden h-full transition-all duration-300 ${
                    format.isPopular 
                      ? 'bg-blue-50 border-2 border-blue-300 shadow-xl shadow-blue-100/50' 
                      : 'bg-white border border-gray-200 hover:shadow-lg'
                  } `}>
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                        format.isPopular ? 'bg-blue-100' : 'bg-blue-50'
                      }`}>
                        <format.icon className={`w-8 h-8 ${format.isPopular ? 'text-blue-700' : 'text-blue-900'}`} />
                      </div>
                      <div className={`text-2xl font-bold mb-4  ${
                        format.isPopular ? 'text-blue-800' : 'text-blue-900'
                      }`}>
                        {format.title}
                      </div>
                      <p className="text-gray-600 mb-8 font-normal  leading-relaxed">
                        {format.description}
                      </p>
                      <ul className="space-y-4 mb-10">
                        {format.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              format.isPopular ? 'text-blue-600' : 'text-blue-500'
                            }`} />
                            <span className="text-gray-700 font-normal  text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full font-bold py-3 text-base  ${
                          format.isPopular 
                            ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-md hover:shadow-lg' 
                            : 'bg-blue-900 text-white hover:bg-blue-800'
                        }`}
                        onClick={scrollToCourses}
                        size="lg"
                      >
                        {format.isPopular ? 'Schedule Group Training →' : 'Enroll Now →'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Courses Section - Enhanced */}
      <section id="content" className="py-8 md:py-16 bg-white ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-2xl md:text-4xl font-black text-blue-900 mb-3 tracking-tight ">
              Industry-Leading Training Programs
            </div>
            <p className="text-base md:text-lg text-gray-600 font-normal  max-w-3xl mx-auto">
              Comprehensive courses designed by experts to advance your career in geospatial technology
            </p>
          </div>

          <div className={isMobile ? "space-y-6" : "grid md:grid-cols-2 gap-8"}>
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200  group"
              >
                <div className={isMobile ? "flex" : "flex h-full"}>
                  <div className={`${isMobile ? 'w-32' : 'w-40'} flex-shrink-0 relative`}>
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className={`${isMobile ? 'flex-1' : 'flex-1'} p-5 flex flex-col`}>
                    <div className="flex-1">
                      <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-900  mb-3`}>
                        {course.title}
                      </div>
                      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 font-normal line-clamp-3 mb-4 `}>
                        {course.description}
                      </p>
                      
                      {/* Trust elements */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 ">
                          <Shield className="w-3 h-3 mr-1" /> Certificate
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 ">
                          <Star className="w-3 h-3 mr-1" /> Expert-Led
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-blue-900 `}>
                            {getConvertedPrice(course.price)}
                          </div>
                          <div className="text-xs text-gray-500 font-normal ">
                            Individual
                          </div>
                        </div>
                        {course.groupPrice && (
                          <div className="flex items-baseline gap-2">
                            <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-green-600 `}>
                              {getConvertedPrice(course.groupPrice)}
                            </div>
                            <div className="text-xs text-gray-500 font-normal ">
                              Group (Save {Math.round(((course.price - course.groupPrice) / course.price) * 100)}%)
                            </div>
                          </div>
                        )}
                      </div>
                      <Link 
                        to={`/course/${course.id}`}
                        className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md  whitespace-nowrap`}
                      >
                        View Course →
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
      <section id="contact" className="py-12 md:py-20 bg-white text-blue-900 ">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-full bg-blue-100 flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Award className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-blue-700`} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-900  mb-4`}>
                  Get Your Industry-Recognized Certification
                </div>
                <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-700 font-normal  mb-6`}>
                  Consult with our training specialists about certified programs, group discounts, and custom training solutions for your organization.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    className="bg-blue-700 text-white hover:bg-blue-800 font-bold px-8 shadow-xl hover:shadow-2xl transition-all duration-300 "
                    onClick={() => navigate("/contact")}
                  >
                    Request Certificate Info
                  </Button>
                  <Button 
                    variant="outline"
                    size={isMobile ? "default" : "lg"}
                    className="border-blue-300 text-blue-900 hover:bg-blue-50 font-bold "
                  >
                    Call: +234 706 370 8703
                  </Button>
                </div>
                <p className="text-gray-600 text-sm mt-4 font-normal ">
                  Speak directly with our training coordinator for immediate assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Training;