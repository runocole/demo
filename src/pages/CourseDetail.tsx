// src/components/CourseDetail.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Users, Calendar, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroSlide2 from "../assets/hero-slide-2.jpg";
import heroSlide3 from "../assets/hero-slide-3.jpg";
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
    id: "drone-mapping",
    title: "Drone Mapping Training",
    description: "Introduce local regulation requirements and safety operation procedures",
    longDescription: "Comprehensive drone mapping training covering local regulation requirements and safety operation procedures including flight checklist, daily maintenance, and compliance standards. This course provides hands-on experience with the latest mapping technologies and software.",
    image: heroSlide2,
    rating: 4.9,
    reviews: 127,
    duration: "4 weeks",
    students: 300,
    format: ["Online", "In-Person"],
    price: "$299",
    features: [
      "Flight planning and execution",
      "Regulatory compliance",
      "Safety procedures",
      "Data processing",
      "Quality control",
      "Certification preparation"
    ],
    instructor: {
      name: "Sarah Johnson",
      role: "Senior GIS Specialist",
      experience: "8+ years in drone mapping"
    }
  },
  {
    id: "bathymetric",
    title: "Bathymetric Training",
    description: "Field and flight path planning methods, and different operational modes",
    longDescription: "Advanced bathymetric training focusing on underwater mapping techniques, field planning, flight path optimization, and various operational modes for accurate hydrographic surveys.",
    image: heroSlide3,
    rating: 4.8,
    reviews: 89,
    duration: "6 weeks",
    students: 150,
    format: ["In-Person", "Hybrid"],
    price: "$399",
    features: [
      "Underwater data collection",
      "Sonar technology",
      "Depth measurement",
      "Data interpretation",
      "Quality assurance",
      "Field operations"
    ],
    instructor: {
      name: "Michael Chen",
      role: "Hydrographic Survey Expert",
      experience: "10+ years in bathymetry"
    }
  },
  {
    id: "parameter-setting",
    title: "Parameter Setting Recommendations",
    description: "Flight parameters setting recommendations for efficient operations",
    longDescription: "Master the art of parameter optimization for various flight operations. Learn to configure settings for different environments, payloads, and mission requirements to ensure maximum efficiency and data quality.",
    image: "/assets/parameters.jpg",
    rating: 4.7,
    reviews: 94,
    duration: "3 weeks",
    students: 220,
    format: ["Online", "In-Person"],
    price: "$249",
    features: [
      "Parameter optimization",
      "Environmental considerations",
      "Payload configuration",
      "Mission-specific settings",
      "Troubleshooting",
      "Best practices"
    ],
    instructor: {
      name: "David Martinez",
      role: "Flight Operations Specialist",
      experience: "6+ years in UAV operations"
    }
  },
  {
    id: "field-operation",
    title: "Field Operation Practice",
    description: "Hands-on training including automatic operations and system configurations",
    longDescription: "Practical field operation training covering automatic flight operations, spraying/spreading system configurations, and real-world scenario simulations. Gain confidence through extensive hands-on practice.",
    image: "/assets/field-practice.jpg",
    rating: 4.9,
    reviews: 156,
    duration: "5 weeks",
    students: 180,
    format: ["In-Person"],
    price: "$349",
    features: [
      "Automatic operations",
      "System configuration",
      "Field safety",
      "Equipment handling",
      "Practical exercises",
      "Real-world scenarios"
    ],
    instructor: {
      name: "Emily Rodriguez",
      role: "Field Operations Manager",
      experience: "7+ years in field operations"
    }
  },
  {
    id: "gis-fundamentals",
    title: "GIS Fundamentals",
    description: "Basic to intermediate GIS concepts and applications",
    longDescription: "Comprehensive GIS fundamentals course covering spatial data concepts, coordinate systems, data management, and basic spatial analysis techniques for beginners and intermediate users.",
    image: "/assets/safety-training.jpg",
    rating: 4.6,
    reviews: 203,
    duration: "8 weeks",
    students: 450,
    format: ["Online"],
    price: "$199",
    features: [
      "Spatial data concepts",
      "Coordinate systems",
      "Data management",
      "Basic analysis",
      "Map creation",
      "Software skills"
    ],
    instructor: {
      name: "Dr. James Wilson",
      role: "GIS Professor",
      experience: "12+ years in GIS education"
    }
  },
  {
    id: "remote-sensing",
    title: "Remote Sensing Applications",
    description: "Satellite imagery analysis and remote sensing techniques",
    longDescription: "Advanced remote sensing course focusing on satellite imagery analysis, spectral analysis, change detection, and various applications in environmental monitoring and resource management.",
    image: "/assets/mission-planning.jpg",
    rating: 4.8,
    reviews: 118,
    duration: "7 weeks",
    students: 190,
    format: ["Online", "Hybrid"],
    price: "$379",
    features: [
      "Image processing",
      "Spectral analysis",
      "Change detection",
      "Environmental monitoring",
      "Data interpretation",
      "Software tools"
    ],
    instructor: {
      name: "Dr. Lisa Wang",
      role: "Remote Sensing Scientist",
      experience: "9+ years in remote sensing"
    }
  },
  {
    id: "advanced-mapping",
    title: "Advanced Mapping Techniques",
    description: "Advanced cartography and spatial analysis methods",
    longDescription: "Master advanced mapping techniques including 3D visualization, web mapping, spatial statistics, and custom cartography for professional-grade map production and spatial analysis.",
    image: "/assets/parameters.jpg",
    rating: 4.7,
    reviews: 76,
    duration: "6 weeks",
    students: 120,
    format: ["Online"],
    price: "$329",
    features: [
      "3D visualization",
      "Web mapping",
      "Spatial statistics",
      "Custom cartography",
      "Data visualization",
      "Professional workflows"
    ],
    instructor: {
      name: "Robert Taylor",
      role: "Cartography Specialist",
      experience: "8+ years in mapping"
    }
  },
  {
    id: "data-analysis",
    title: "Spatial Data Analysis",
    description: "Statistical analysis and interpretation of spatial data",
    longDescription: "Comprehensive spatial data analysis course covering statistical methods, spatial patterns, hotspot analysis, and advanced techniques for extracting meaningful insights from geographic data.",
    image: "/assets/field-practice.jpg",
    rating: 4.8,
    reviews: 92,
    duration: "5 weeks",
    students: 160,
    format: ["Online", "In-Person"],
    price: "$299",
    features: [
      "Statistical analysis",
      "Spatial patterns",
      "Hotspot analysis",
      "Data interpretation",
      "Advanced techniques",
      "Case studies"
    ],
    instructor: {
      name: "Dr. Amanda Lee",
      role: "Data Scientist",
      experience: "11+ years in spatial analysis"
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
      
      {/* Back Button */}
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

              <h3 className="text-2xl font-bold mb-4">Course Description</h3>
              <p className="text-muted-foreground mb-6">
                {course.longDescription} This comprehensive course is designed to provide you with 
                practical skills and theoretical knowledge that you can immediately apply in your 
                professional work. Our expert instructors will guide you through every step of the process.
              </p>
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
                action="https://formsubmit.co/your-email@example.com" 
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