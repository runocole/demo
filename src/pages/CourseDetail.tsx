// src/components/CourseDetail.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Users, Calendar, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Import all images from the training component
import safetyImage from "../assets/safety-training.jpg";
import fieldImage from "../assets/field-practice.jpg";
import dronemapping from "../assets/dronemapping.jpg";
import missionImage from "../assets/mission-planning.jpg";

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
  format: string[];
  price: string;
  features: string[];
  instructor: {
    name: string;
    role: string;
    experience: string;
  };
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
    students: 300,
    format: ["Online", "In-Person"],
    price: "$299",
    features: [
      "GNSS survey planning and setup",
      "Field data collection (Static, RTK, DGPS, CORS, PPP)",
      "Safety and professional survey practices",
      "Accuracy and quality control",
      "Data processing using Compass & Trimble Business Center",
      "Producing professional survey outputs"
    ],
    instructor: {
      name: "Sarah Johnson",
      role: "Senior GNSS Specialist",
      experience: "8+ years in GNSS surveying"
    }
  },
  {
    id: "bathymetric",
    title: "Bathymetric Survey Course",
    description: "Master underwater surveying with echosounders and GNSS integration",
    longDescription: "This course focuses on bathymetric surveying, including operation of echosounders, transducers, and GNSS-integrated systems. Learners practice depth measurement, data acquisition, calibration, tide correction, and noise filtering, and perform post-processing using HYSURVEY, AutoCAD, Global Mapper, and Surfer. Exercises enable creation of contour maps, 3D surfaces, and precise navigation-ready datasets for marine, engineering, and environmental applications.",
    image: missionImage,
    rating: 4.8,
    reviews: 89,
    duration: "6 weeks",
    students: 150,
    format: ["In-Person", "Hybrid"],
    price: "$399",
    features: [
      "Survey planning and equipment setup",
      "Safe handling of echosounders and transducers",
      "Accurate depth and GNSS data capture",
      "Quality control and data cleaning",
      "Processing in HYSURVEY, AutoCAD, Global Mapper, Surfer",
      "Producing contour maps, 3D surfaces, and reports"
    ],
    instructor: {
      name: "Michael Chen",
      role: "Hydrographic Survey Expert",
      experience: "10+ years in bathymetry"
    }
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
    students: 220,
    format: ["Online", "In-Person"],
    price: "$249",
    features: [
      "Flight planning for RTK and Non-RTK missions",
      "Safety precautions and regulatory compliance",
      "High-quality aerial data capture",
      "Data accuracy and quality control",
      "Processing images into maps, DSMs, and 3D models",
      "Producing professional mapping deliverables"
    ],
    instructor: {
      name: "David Martinez",
      role: "Drone Mapping Specialist",
      experience: "6+ years in UAV operations"
    }
  },
  {
    id: "totalstation",
    title: "Total Station Surveying Course",
    description: "Precision measurement, traversing, and topographic surveys",
    longDescription: "A complete course on Total Station surveying for precision measurement, site setup, traversing, topographic surveys, and construction layout. Learners practice workflows with Leica, FOIF and COMNAV Total Stations, focusing on accurate field data capture, error reduction, and generating professional deliverables for Cadastral, Engineering, and Construction projects.",
    image: fieldImage,
    rating: 4.9,
    reviews: 156,
    duration: "5 weeks",
    students: 180,
    format: ["In-Person"],
    price: "$349",
    features: [
      "Instrument setup and calibration",
      "Traversing and topographic surveys",
      "Safety and field accuracy practices",
      "Quality control of measurements",
      "Data management and processing",
      "Producing client-ready survey plans"
    ],
    instructor: {
      name: "Emily Rodriguez",
      role: "Surveying Operations Manager",
      experience: "7+ years in field operations"
    }
  },
  {
    id: "gis",
    title: "GIS Training Course",
    description: "Spatial data analysis, map creation, and geospatial workflows",
    longDescription: "A practical GIS training course teaching spatial data analysis, map creation, and geospatial workflows for surveying, environmental, and urban planning projects.",
    image: safetyImage,
    rating: 4.6,
    reviews: 203,
    duration: "8 weeks",
    students: 450,
    format: ["Online"],
    price: "$199",
    features: [
      "Spatial data collection and management",
      "Map creation and visualization",
      "Quality control of GIS data",
      "Spatial analysis and geoprocessing",
      "Producing thematic maps and reports",
      "Delivering professional GIS outputs"
    ],
    instructor: {
      name: "Dr. James Wilson",
      role: "GIS Professor",
      experience: "12+ years in GIS education"
    }
  },
  {
    id: "3dlaserscanning",
    title: "3D Laser Scanning Course",
    description: "Point cloud capture, processing for survey and BIM applications",
    longDescription: "An advanced course covering 3D laser scanning techniques for survey, engineering, and BIM applications. Participants learn point cloud capture, scanner setup, scanning strategies, and post-processing using Cyclone, ReCap, and CloudCompare. Practical exercises focus on creating accurate 3D models, topographic maps, and as-built documentation for construction, infrastructure, and heritage projects.",
    image: missionImage,
    rating: 4.8,
    reviews: 118,
    duration: "7 weeks",
    students: 190,
    format: ["Online", "Hybrid"],
    price: "$379",
    features: [
      "Scanner setup and scan planning",
      "Field point cloud capture techniques",
      "Safety and precision in scanning",
      "Quality control of 3D data",
      "Processing with LSMASTER, ReCap, CloudCompare, Revit",
      "Producing accurate 3D models and reports"
    ],
    instructor: {
      name: "Dr. Lisa Wang",
      role: "3D Scanning Specialist",
      experience: "9+ years in laser scanning"
    }
  },
  {
    id: "autocad",
    title: "AutoCAD Training",
    description: "2D/3D drafting for surveyors, engineers, and designers",
    longDescription: "A comprehensive AutoCAD training course teaching 2D drafting, design documentation, and professional drawing workflows for survey, engineering, and construction projects. Participants learn to produce site plans, engineering layouts, topographic maps, and construction drawings, with exercises designed to deliver client-ready and industry-standard outputs.",
    image: dronemapping,
    rating: 4.7,
    reviews: 76,
    duration: "6 weeks",
    students: 120,
    format: ["Online"],
    price: "$329",
    features: [
      "2D and 3D drafting techniques",
      "Layer management and annotation",
      "Accuracy and drawing standards",
      "Technical plan and layout preparation",
      "Creating professional site and engineering plans",
      "Producing client-ready CAD drawings"
    ],
    instructor: {
      name: "Robert Taylor",
      role: "CAD Specialist",
      experience: "8+ years in AutoCAD"
    }
  },
  {
    id: "engineering",
    title: "Engineering Survey Course",
    description: "Professional surveying for civil engineers and infrastructure projects",
    longDescription: "A professional Engineering Survey course designed for Surveyors, Civil Engineers, and Infrastructure professionals, covering precision site measurements, road and topographic surveys, cross-sections, longitudinal sections, drainage mapping, contour generation, and field-to-office workflows using AutoCAD, Global Mapper, and Surfer.",
    image: fieldImage,
    rating: 4.8,
    reviews: 92,
    duration: "5 weeks",
    students: 160,
    format: ["Online", "In-Person"],
    price: "$299",
    features: [
      "Road, topographic, and site survey planning",
      "Cross-sections, longitudinal sections, and drainage mapping",
      "Accuracy and field data quality control",
      "Contour generation and layout preparation",
      "Integrating data with AutoCAD, Global Mapper, Surfer",
      "Producing professional plans, 3D models, and reports"
    ],
    instructor: {
      name: "Dr. Amanda Lee",
      role: "Engineering Survey Specialist",
      experience: "11+ years in engineering surveys"
    }
  }
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const course = courses.find(c => c.id === courseId);

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
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/training")}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Button>
      </div>

      {/* Course Header */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.longDescription}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(course.rating)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {course.rating} ({course.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{course.students} students</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>{course.format.join(", ")}</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-primary mb-6">{course.price}</div>

              <Button
                size="lg"
                className="bg-[#081748] text-white hover:bg-[#081748] font-bold"
                onClick={() => setIsFormOpen(true)}
              >
                Enroll Now
              </Button>
            </div>

            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Course Features */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Info */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Instructor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{course.instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{course.instructor.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor.experience} of professional experience
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Enroll in {course.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                >
                  ✕
                </Button>
              </div>

              <form 
                action="https://formsubmit.co/runocole@gmail.com" 
                method="POST"
                className="space-y-4"
              >
                <input type="hidden" name="_subject" value={`New enrollment for ${course.title}`} />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="course" value={course.title} />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#081748]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#081748]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#081748]"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#081748]"
                  />
                </div>

                <div>
                  <label htmlFor="format" className="block text-sm font-medium mb-2">
                    Preferred Format
                  </label>
                  <select
                    id="format"
                    name="format"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#081748]"
                  >
                    <option value="">Select format</option>
                    {course.format.map((fmt) => (
                      <option key={fmt} value={fmt}>{fmt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#081748]"
                    placeholder="Any specific requirements or questions..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#081748] text-white hover:bg-[#081748] font-bold py-3"
                >
                  Submit Enrollment Request
                </Button>
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