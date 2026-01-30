import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Users, Calendar, CheckCircle2, ArrowLeft, Scroll, Globe, Award, Zap, ChevronRight, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCurrency } from "../context/CurrencyContext";
import safetyImage from "../assets/safety-training.jpg";
import dronemapping from "../assets/dronemapping.jpg";
import bathImage from "../assets/bath.jpg";
import totalstation from "../assets/total-training.jpg";
import gistraining from "../assets/gis-training1.jpg";
import threedlaser from "../assets/t3dlaser.jpg";
import lidar from "../assets/lidar.jpg";
import engineering from "../assets/engineering.jpg"
import autocad from "../assets/autocad.jpg";
interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  rating: number;
  reviews: number;
  duration: string;
  students: number;
  certifications: string;
  format: string[];
  price: number; 
  groupPrice?: number; 
  features: string[];
}

const courses: Course[] = [
  {
    id: "gnss",
    title: "GNSS Surveying Course",
    description: "Master GNSS surveying with static, RTK, DGPS, and PPP techniques",
    longDescription: "A comprehensive course covering GNSS fundamentals, satellite constellations, and survey techniques including static, RTK, DGPS, CORS, and PPP. Participants gain hands-on experience in field data collection, stakeout, area computation, and professional post-processing using Compass Solution and Trimble Business Center, ensuring high-accuracy positioning and reliable survey outputs for Cadastral, Engineering, and GIS projects.",
    image: safetyImage,
    rating: 4.9,
    reviews: 127,
    duration: "4 weeks",
    certifications: "Certificate of Completion",
    students: 300,
    format: ["Online", "In-Person"],
    price: 175,
    groupPrice: 141,
    features: [
      "GNSS survey planning and setup",
      "Field data collection (Static, RTK, DGPS, CORS, PPP)",
      "Safety and professional survey practices",
      "Accuracy and quality control",
      "Data processing using Compass & Trimble Business Center",
      "Producing professional survey outputs"
    ],
  },
  {
    id: "bathymetric",
    title: "Bathymetric Survey Course",
    description: "Master underwater surveying with echosounders and GNSS integration",
    longDescription: "This course focuses on bathymetric surveying, including operation of echosounders, transducers, and GNSS-integrated systems. Learners practice depth measurement, data acquisition, calibration, tide correction, and noise filtering, and perform post-processing using HYSURVEY, AutoCAD, Global Mapper, and Surfer. Exercises enable creation of contour maps, 3D surfaces, and precise navigation-ready datasets for marine, engineering, and environmental applications.",
    image: bathImage,
    rating: 4.8,
    reviews: 89,
    duration: "6 weeks",
    students: 10,
    format: ["In-Person", "Hybrid"],
    certifications: "Certificate of Completion",
    price: 348,
    groupPrice: 244,
    features: [
      "Survey planning and equipment setup",
      "Safe handling of echosounders and transducers",
      "Accurate depth and GNSS data capture",
      "Quality control and data cleaning",
      "Processing in HYSURVEY, AutoCAD, Global Mapper, Surfer",
      "Producing contour maps, 3D surfaces, and reports"
    ],
  },
  {
    id: "dronemapping",
    title: "Drone Mapping Course",
    description: "Comprehensive drone mapping with RTK & photogrammetry workflows",
    longDescription: "This course teaches comprehensive drone mapping workflows, including mission planning, RTK and Non-RTK flights, aerial data acquisition, and photogrammetric processing. Participants create orthomosaics, 3D models, DSMs, and point clouds, integrating software such as Pix4D mapper, Drone deploy, Agisoft Metashape, and GIS software. Practical exercises and step-by-step demonstrations build expertise in surveying, construction monitoring, agriculture, and environmental mapping.",
    image: dronemapping,
    rating: 4.7,
    reviews: 94,
    duration: "3 weeks",
    students: 60,
    format: ["Online", "In-Person"],
    certifications: "Certificate of Completion",
    price: 279,
    groupPrice: 175,
    features: [
      "Flight planning for RTK and Non-RTK missions",
      "Safety precautions and regulatory compliance",
      "High-quality aerial data capture",
      "Data accuracy and quality control",
      "Processing images into maps, DSMs, and 3D models",
      "Producing professional mapping deliverables"
    ],
  },
  {
    id: "totalstation",
    title: "Total Station Surveying Course",
    description: "Precision measurement, traversing, and topographic surveys",
    longDescription: "A complete course on Total Station surveying for precision measurement, site setup, traversing, topographic surveys, and construction layout. Learners practice workflows with Leica, FOIF and COMNAV Total Stations, focusing on accurate field data capture, error reduction, and generating professional deliverables for Cadastral, Engineering, and Construction projects.",
    image: totalstation,
    rating: 4.9,
    reviews: 156,
    duration: "5 weeks",
    students: 50,
    format: ["In-Person"],
    certifications: "Certificate of Completion",
    price: 244,
    groupPrice: 175,
    features: [
      "Instrument setup and calibration",
      "Traversing and topographic surveys",
      "Safety and field accuracy practices",
      "Quality control of measurements",
      "Data management and processing",
      "Producing client-ready survey plans"
    ],
  },
  {
    id: "gis",
    title: "GIS Training Course",
    description: "Spatial data analysis, map creation, and geospatial workflows",
    longDescription: "A practical GIS training course teaching spatial data analysis, map creation, and geospatial workflows for surveying, environmental, and urban planning projects.",
    image: gistraining,
    rating: 4.6,
    reviews: 203,
    duration: "8 weeks",
    students: 1,
    format: ["Online"],
    certifications: "Certificate of Completion",
    price: 210,
    groupPrice: 175,
    features: [
      "Spatial data collection and management",
      "Map creation and visualization",
      "Quality control of GIS data",
      "Spatial analysis and geoprocessing",
      "Producing thematic maps and reports",
      "Delivering professional GIS outputs"
    ],
  },
  {
    id: "3dlaserscanning",
    title: "3D Laser Scanning Course",
    description: "Point cloud capture, processing for survey and BIM applications",
    longDescription: "An advanced course covering 3D laser scanning techniques for survey, engineering, and BIM applications. Participants learn point cloud capture, scanner setup, scanning strategies, and post-processing using Revit, ReCap, and CloudCompare. Practical exercises focus on creating accurate 3D models, topographic maps, and as-built documentation for construction, infrastructure, and heritage projects.",
    image: threedlaser,
    rating: 4.8,
    reviews: 118,
    duration: "7 weeks",
    students: 10,
    format: ["Online", "Hybrid"],
    certifications: "Certificate of Completion",
    price: 520,
    groupPrice: 348,
    features: [
      "Scanner setup and scan planning",
      "Field point cloud capture techniques",
      "Safety and precision in scanning",
      "Quality control of 3D data",
      "Processing with LSMASTER, ReCap, CloudCompare, Revit",
      "Producing accurate 3D models and reports"
    ],
  },
  {
    id: "autocad",
    title: "AutoCAD Training",
    description: "2D/3D drafting for surveyors, engineers, and designers",
    longDescription: "A comprehensive AutoCAD training course teaching 2D drafting, design documentation, and professional drawing workflows for survey, engineering, and construction projects. Participants learn to produce site plans, engineering layouts, topographic maps, and construction drawings, with exercises designed to deliver client-ready and industry-standard outputs.",
    image: autocad,
    rating: 4.7,
    reviews: 76,
    duration: "6 weeks",
    students: 1,
    format: ["Online"],
    certifications: "Certificate of Completion",
    price: 175,
    groupPrice: 127,
    features: [
      "2D and 3D drafting techniques",
      "Layer management and annotation",
      "Accuracy and drawing standards",
      "Technical plan and layout preparation",
      "Creating professional site and engineering plans",
      "Producing client-ready CAD drawings"
    ],
  },
  {
    id: "engineering",
    title: "Engineering Survey Course",
    description: "Professional surveying for civil engineers and infrastructure projects",
    longDescription: "A professional Engineering Survey course designed for Surveyors, Civil Engineers, and Infrastructure professionals, covering precision site measurements, road and topographic surveys, cross-sections, longitudinal sections, drainage mapping, contour generation, and field-to-office workflows using AutoCAD, Global Mapper, and Surfer.",
    image: engineering,
    rating: 4.8,
    reviews: 92,
    duration: "5 weeks",
    students: 20,
    format: ["Online", "In-Person"],
    certifications: "Certificate of Completion",
    price: 313,
    groupPrice: 244,
    features: [
      "Road, topographic, and site survey planning",
      "Cross-sections, longitudinal sections, and drainage mapping",
      "Accuracy and field data quality control",
      "Contour generation and layout preparation",
      "Integrating data with AutoCAD, Global Mapper, Surfer",
      "Producing professional plans, 3D models, and reports"
    ]
  },
  {
    id: "lidar-drone",
    title: "LIDAR Drone Course (Advanced)",
    description: "Advanced LIDAR drone surveying and data processing",
    longDescription: "An advanced course focusing on LIDAR drone technology for high-precision surveying. Learn to operate LIDAR-equipped drones, capture accurate point cloud data, and process results for topographic mapping, volumetric analysis, and infrastructure monitoring.",
    image: lidar,
    rating: 4.9,
    reviews: 65,
    duration: "4 weeks",
    students: 2,
    format: ["In-Person", "Hybrid"],
    certifications: "Certificate of Completion",
    price: 520,
    groupPrice: 348,
    features: [
      "LIDAR drone operation and safety",
      "Advanced point cloud data capture",
      "Data accuracy and quality assurance",
      "Processing LIDAR data in specialized software",
      "Creating high-precision topographic maps",
      "Volumetric calculations and analysis"
    ]
  }
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { getConvertedPrice } = useCurrency();

  const course = courses.find(c => c.id === courseId);

  // Fix: Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]); // Re-run when courseId changes

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Button onClick={() => navigate("/training")}>Back to Courses</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"
        }`}
      />
    ));
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'online':
        return <Globe className="w-4 h-4 mr-1.5" />;
      case 'in-person':
        return <Users className="w-4 h-4 mr-1.5" />;
      case 'hybrid':
        return <Zap className="w-4 h-4 mr-1.5" />;
      default:
        return <Calendar className="w-4 h-4 mr-1.5" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white ">
      <Header />
      
      {/* Enhanced Back Button Section */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate("/training")}
              className="flex items-center gap-3 text-blue-900 hover:text-blue-800 hover:bg-blue-50 px-5 py-3 rounded-xl transition-all duration-300 font-semibold group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Back to All Courses</span>
              <span className="sm:hidden">Courses</span>
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Training</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-semibold text-blue-900 truncate max-w-[200px]">
                {course.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Header - Enhanced */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Course Title */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-blue-900 leading-tight tracking-tight">
                  {course.title}
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed font-normal">
                  {course.description}
                </p>
              </div>

              {/* Rating & Stats - Improved */}
              <div className="flex flex-wrap items-center gap-6 p-6 bg-blue-50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(course.rating)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-blue-900">{course.rating}/5.0</span>
                    <span className="text-sm text-gray-600">({course.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-300 hidden sm:block" />
                
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-900" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-blue-900">{course.students}+</span>
                    <span className="text-sm text-gray-600">Students Trained</span>
                  </div>
                </div>
              </div>

              {/* Pill Badges - Modernized */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-semibold">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  {course.format.map((fmt, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-semibold">
                      {getFormatIcon(fmt)}
                      {fmt}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-semibold">
                    <Award className="w-4 h-4" />
                    {course.certifications}
                  </div>
                </div>
              </div>

              {/* Pricing Cards - Enhanced */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-blue-900">Choose Your Training Option</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Individual Training Card */}
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-1">
                        Individual Training
                      </div>
                      <div className="text-3xl font-black text-blue-900">
                        {getConvertedPrice(course.price)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Perfect for individual professionals seeking personal attention
                      </p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>One-on-one instructor support</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>Flexible scheduling</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>Customized learning pace</span>
                      </li>
                    </ul>
                  </div>

                  {/* Group Training Card */}
                  {course.groupPrice && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                          🎯 RECOMMENDED
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-1">
                          Group Training
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-black text-blue-900">
                            {getConvertedPrice(course.groupPrice)}
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            Save {Math.round(((course.price - course.groupPrice) / course.price) * 100)}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Ideal for teams and organizations (2+ people)
                        </p>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Cost-effective for teams</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Team building & collaboration</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Customized content for your organization</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary CTA - Enhanced */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                  onClick={() => setIsFormOpen(true)}
                >
                  <span className="flex items-center justify-center gap-3">
                    Enroll Now
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </Button>
                <p className="text-center text-gray-600 text-sm">
                  Secure your spot • Free consultation available • Flexible payment options
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-2xl">
                <div className="aspect-square overflow-hidden rounded-xl mb-6">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Course Highlights */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-900">Course Highlights</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                      <Scroll className="w-5 h-5 text-blue-700" />
                      <div>
                        <div className="font-semibold text-blue-900">Certificate Included</div>
                        <div className="text-sm text-gray-600">Industry-recognized {course.certifications}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                      <Users className="w-5 h-5 text-blue-700" />
                      <div>
                        <div className="font-semibold text-blue-900">Expert Instructors</div>
                        <div className="text-sm text-gray-600">Learn from field professionals</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-700" />
                      <div>
                        <div className="font-semibold text-blue-900">Flexible Schedule</div>
                        <div className="text-sm text-gray-600">{course.format.join(" & ")} options available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details - Enhanced */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Separator Line */}
            <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-16"></div>
            
            {/* What You'll Learn */}
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-4 tracking-tight">
                  What You'll Master
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Comprehensive skills and knowledge you'll gain from this professional training program
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {course.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <div className="text-blue-700 font-bold">{index + 1}</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2 text-lg">{feature}</h3>
                        <p className="text-gray-600 text-sm">
                          Practical, hands-on learning with real-world applications
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div className="mt-20 pt-12 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Detailed Course Overview</h3>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {course.longDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-blue-900">Enroll in {course.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                  className="hover:bg-gray-100 rounded-full"
                >
                  ✕
                </Button>
              </div>

              <form 
                action="https://formsubmit.co/sales@oticgs.com" 
                method="POST"
                className="space-y-4"
              >
                <input type="hidden" name="_subject" value={`New enrollment for ${course.title}`} />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="course" value={course.title} />

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+234 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Your company name (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="format" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Format
                  </label>
                  <select
                    id="format"
                    name="format"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                  >
                    <option value="">Select your preferred format</option>
                    {course.format.map((fmt) => (
                      <option key={fmt} value={fmt}>{fmt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Any specific requirements, questions, or preferred dates..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Enrollment Request
                </Button>
                
                <p className="text-center text-gray-600 text-sm mt-4">
                  We'll contact you within 24 hours to confirm your enrollment
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetail;