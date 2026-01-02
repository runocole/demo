import { useState, useEffect, useCallback } from "react";
import { Users, CheckCircle2, Monitor, Home, Award, ChevronLeft, ChevronRight } from "lucide-react";
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
import heroImage3 from "../assets/mission-planning.jpg";
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
    image: heroImage3,
    title: "Hands-On Experience",
    description: "Practical training with real-world equipment and scenarios",
    position: "right"
  },
  {
    id: 4,
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
    price: 175, // 250k NGN = ~$172 USD + $3 = $175
    groupPrice: 141 // 200k NGN = ~$138 USD + $3 = $141
  },
  {
    id: "totalstation",
    title: "Total Station Surveying Course",
    description: "A complete course on Total Station surveying for precision measurement, site setup, traversing, topographic surveys, and construction layout. Learners practice workflows with Leica, FOIF and COMNAV Total Stations, focusing on accurate field data capture, error reduction, and generating professional deliverables for Cadastral, Engineering, and Construction projects.",
    image: fieldImage,
    price: 244, // 350k NGN = ~$241 USD + $3 = $244
    groupPrice: 175 // 250k NGN = ~$172 USD + $3 = $175
  },
  {
    id: "dronemapping",
    title: "Drone Mapping Course",
    description: "This course teaches comprehensive drone mapping workflows, including mission planning, RTK and Non-RTK flights, aerial data acquisition, and photogrammetric processing. Participants create orthomosaics, 3D models, DSMs, and point clouds, integrating software such as Pix4D mapper, Drone deploy, Agisoft Metashape, and GIS software. Practical exercises and step-by-step demonstrations build expertise in surveying, construction monitoring, agriculture, and environmental mapping.",
    image: dronemapping,
    price: 279, // 400k NGN = ~$276 USD + $3 = $279
    groupPrice: 175 // 250k NGN = ~$172 USD + $3 = $175
  },
  {
    id: "3dlaserscanning",
    title: "3D Laser Scanning Course",
    description: "An advanced course covering 3D laser scanning techniques for survey, engineering, and BIM applications. Participants learn point cloud capture, scanner setup, scanning strategies, and post-processing using Cyclone, ReCap, and CloudCompare. Practical exercises focus on creating accurate 3D models, topographic maps, and as-built documentation for construction, infrastructure, and heritage projects.",
    image: bathImage,
    price: 520, // 750k NGN = ~$517 USD + $3 = $520
    groupPrice: 348 // 500k NGN = ~$345 USD + $3 = $348
  },
  {
    id: "bathymetric",
    title: "Bathymetric Survey Course",
    description: "This course focuses on bathymetric surveying, including operation of echosounders, transducers, and GNSS-integrated systems. Learners practice depth measurement, data acquisition, calibration, tide correction, and noise filtering, and perform post-processing using HYSURVEY, AutoCAD, Global Mapper, and Surfer. Exercises enable creation of contour maps, 3D surfaces, and precise navigation-ready datasets for marine, engineering, and environmental applications.",
    image: bathImage,
    price: 348, // 500k NGN = ~$345 USD + $3 = $348
    groupPrice: 244 // 350k NGN = ~$241 USD + $3 = $244
  },
  {
    id: "autocad",
    title: "AutoCAD Training",
    description: "A practical course for surveyors, engineers, and designers covering 2D and 3D drafting, layer management, blocks, annotation, and professional technical drawing workflows. Participants learn to produce site plans, engineering layouts, topographic maps, and construction drawings, with exercises designed to deliver client-ready and industry-standard outputs.",
    image: dronemapping,
    price: 175, // 250k NGN = ~$172 USD + $3 = $175
    groupPrice: 127 // 180k NGN = ~$124 USD + $3 = $127
  },
  {
    id: "gis",
    title: "GIS Training",
    description: "A practical GIS training course teaching spatial data analysis, map creation, and geospatial workflows for surveying, environmental, and urban planning projects.",
    image: safetyImage,
    price: 210, // 300k NGN = ~$207 USD + $3 = $210
    groupPrice: 175 // 250k NGN = ~$172 USD + $3 = $175
  },
  {
    id: "engineering",
    title: "Engineering Survey Course",
    description: "A professional Engineering Survey course designed for Surveyors, Civil Engineers, and Infrastructure professionals, covering precision site measurements, road and topographic surveys, cross-sections, longitudinal sections, drainage mapping, contour generation, and field-to-office workflows using AutoCAD, Global Mapper, and Surfer.",
    image: fieldImage,
    price: 313, // 450k NGN = ~$310 USD + $3 = $313
    groupPrice: 244 // 350k NGN = ~$241 USD + $3 = $244
  },
  {
    id: "lidar-drone",
    title: "LIDAR Drone Course (Advanced)",
    description: "Advanced LIDAR drone surveying and data processing for high-precision topographic mapping and volumetric analysis.",
    image: dronemapping,
    price: 520, // 750k NGN = ~$517 USD + $3 = $520
    groupPrice: 348 // 500k NGN = ~$345 USD + $3 = $348
  }
];

const Training = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { getConvertedPrice } = useCurrency();

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

  return (
    <div className="flex min-h-screen flex-col">
      <CurrencyBoxes />
      <Header />
      
      {/* Hero Carousel Section */}
      <section className="relative h-[750px] overflow-hidden">
        {/* Slides Container */}
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-primary/60" />
              </div>
              
              {/* Slide Content */}
              <div className={`relative z-10 h-full flex items-center justify-center ${getTextAlignment(slide.position)}`}>
                <div className="container mx-auto px-4">
                  <div className={`max-w-2xl ${slide.position === 'center' ? 'mx-auto' : slide.position === 'right' ? 'ml-auto' : 'mr-auto'}`}>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 font-montserrat tracking-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white mb-10 font-montserrat font-bold">
                      {slide.description}
                    </p>
                    <div className={slide.position === 'center' ? 'flex justify-center' : 'flex justify-start'}>
                      <Button
                        onClick={scrollToCourses}
                        size="lg"
                        className="bg-[#081748] text-white hover:bg-blue-800 font-bold text-base px-8 py-4 shadow-xl hover:shadow-2xl transition-all"
                      >
                        View Courses →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
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

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary bg-blue-100">
        <div className="container mx-auto px-4 bg-blue-100">
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
        </div>
      </section>

      {/* Training Formats Section */}
      <section id="formats" className="py-20 bg-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Perfect Training Format
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Online Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow bg-blue-50 border-blue-200">
              <Badge className="absolute top-4 right-4 bg-blue-100 text-[#081748] border-blue-300">Flexible</Badge> 
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6"> 
                  <Monitor className="w-8 h-8 text-[#081748]" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Online Training</h3>
                <p className="text-muted-foreground mb-6">
                 Learn from anywhere with flexible interactive online programs 
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Self paced online courses with video lessons, digital resources and assignments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Live training sessions with real time instructor support.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Post training support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Flexible and convenient learning platform</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-[#081748] bg-blue-100"
                  onClick={scrollToCourses}
                  size="lg"
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>

            {/* In-Person Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow bg-blue-50 border-blue-200">
              <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-[#081748] border-blue-300">Customized</Badge> 
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-[#081748]" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">In-Person Training</h3>
                <p className="text-muted-foreground mb-6">
                  Interactive, hands-on learning experiences at over 10 global training locations with direct instructor engagement.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Face-to-face interaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Hands-on workshops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Networking opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Immediate feedback</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-[#081748] bg-blue-100"
                  onClick={scrollToCourses}
                  size="lg"
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>

            {/* In-House Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow bg-blue-50 border-blue-200">
              <Badge className="absolute top-4 right-4 bg-blue-100 text-[#081748] border-blue-300">Most Popular</Badge> 
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-[#081748]" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Group Training/Events</h3>
                <p className="text-muted-foreground mb-6">
                  Customized training programs delivered directly at your workplace, tailored to your organization's specific needs.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Customized content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Team building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Cost-effective for groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#081748] mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Your preferred location</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-[#081748] bg-blue-100" 
                  onClick={() => navigate("/contact")}
                  size="lg"
                >
                  View Upcoming Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Courses Section */}
      <section id="content" className="py-20 bg-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Courses</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-background rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-68 object-cover"
                />
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">{course.title}</h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-lg font-bold text-primary">
                        {getConvertedPrice(course.price)}
                      </div>
                      {course.groupPrice && (
                        <div className="text-sm font-semibold text-green-600">
                          Group: {getConvertedPrice(course.groupPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link 
                    to={`/course/${course.id}`}
                    className="text-[#081748] hover:text-blue-800 font-semibold inline-block"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <Testimonials />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-100 text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-4xl font-bold">Certificate Inquiry</h2>
            <p className="text-xl text-black">
              Consult us for your certified training needs. Get in touch to learn more about our certification programs and training opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-100 text-black hover:bg-blue-900 hover:text-[#081748] font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
            <p className="text-black text-sm mt-4">
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