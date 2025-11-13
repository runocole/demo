import React from "react";
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
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutHero from "../assets/about-hero.jpg";
import ImageCarousel from "../components/ImageCarousel";

const About: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Package,
      title: "Hardware & Software Sales",
      description: "Our experts leverage over a decade of experience in the field to equip you with the perfect mission-ready solution",
    },
    {
      icon: Cog,
      title: "Mission-Critical Services",
      description: "Our drone experts provide operational fleet support services.",
    },
    {
      icon: HeadphonesIcon,
      title: "Responsive Support",
      description: "You're supported by experienced drone and robotics professionals whose sole job is to keep you operational 24/7",
    },
    {
      icon: Wrench,
      title: "Repairs & Maintenance",
      description: "We provide drone repairs and technical support to our customers.",
    },
    {
      icon: CalendarRange,
      title: "Equipment Rental",
      description: "We offer drone rental so you can avoid capital investment and get the equipment you need on rental basis according to your project requirement.",
    },
    {
      icon: FileText,
      title: "Program Development",
      description: "Our consultants are pulling it all together to provide you with a turnkey drone program.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION WITH BACKGROUND PHOTO */}
      <section
        className="relative w-full h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutHero})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />

        {/* HERO CONTENT - LEFT ALIGNED */}
        <div className="relative z-10 w-full h-full flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-2xl ml-0 md:ml-20"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-45">
                About
              </h1>
              <p className="text-lg md:text-xl text-white/95 font-medium leading-relaxed">
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
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">About</span>
          </motion.div>
        </div>
      </section>
{/* MAIN HEADING SECTION */}
<section className="py-16 bg-white">
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
          GeossoTech is the premier geospatial equipment and solutions provider. Our team brings extensive expertise in surveying technology and geospatial data applications. As an authorized distributor of leading geospatial brands, we deliver cutting-edge innovations in surveying instruments, GNSS systems, and geospatial software, tailored to meet the evolving needs of surveyors and allied professionals. We possess comprehensive knowledge across the entire geospatial spectrum - from hardware platforms and sensors to software solutions and system integration.
        </p>
        <p>
          Whether you're establishing your surveying practice, expanding your operational capabilities, or seeking more efficient workflows to manage your geospatial projects; we are your trusted partner for equipment, technology, service and support. Our experts guide you through every stage - from needs assessment and equipment selection to training implementation and maintenance planning. We are committed to exceeding client expectations and providing the insights and support necessary to ensure our clients' success.
        </p>
      </div>
    </motion.div>
  </div>
</section>

{/* MISSION STATEMENT */}
<section className="py-16 bg-white">
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
          As a leading geospatial technology company, we pride ourselves on delivering exceptional value to surveying professionals and organizations. Explore our curated selection of the latest surveying equipment from renowned manufacturers, including total stations, GNSS receivers, laser scanners, and UAV systems. From entry-level instruments to high-precision survey systems, we offer a comprehensive range that caters to every project requirement and expertise level. Our solutions are designed to enhance accuracy, efficiency, and productivity in geospatial data collection and analysis.
        </p>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-5 mb-4">
        Geospatial Services for Professional Practice
      </h3>
      <p className="text-base md:text-lg text-gray-700 leading-relaxed">
        GeossoTech, a premier geospatial solutions company, delivers advanced surveying and mapping services across diverse sectors. Leveraging technological innovation, we provide significant time and cost-saving benefits through precise data collection and analysis to industries including Construction, Infrastructure Development, Land Surveying, Mining, and Environmental Management. Our expertise spans traditional surveying methods to modern geospatial technologies.
      </p>

      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-12 mb-4">
        Our Mission
      </h3>
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-12">
        GeossoTech's mission is to empower surveyors and geospatial professionals with innovative technology solutions that streamline workflows, enhance accuracy, and drive efficiency in solving complex spatial challenges for their clients. We are dedicated to advancing the geospatial industry through cutting-edge equipment, comprehensive support, and expert guidance.
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

     {/* WHY CHOOSE US SECTION */}
<section className="py-20 bg-gray-50">
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
        GeossoTech is a leading geospatial solutions provider and technology partner, serving as an innovative center of expertise that offers cutting-edge technology (sales and rentals), comprehensive training, professional consultation, and reliable service - all in one place. Our team of geospatial experts has been confidently supporting surveying professionals and businesses with unmatched technical knowledge and personalized service. At GeossoTech, we cultivate a customer-focused, expert approach through a culture of excellence, collaboration, and continuous improvement, which is directly reflected in the quality of service we provide to our clients. Choose GeossoTech, recognized as a trusted partner in geospatial technology solutions.
      </p>
           
    {/* HORIZONTAL DIVIDER LINE */}
      <div className="container mx-auto px-6">
        <div className="h-0.5 bg-gray-400 my-16 w-full"></div>
      </div>

            {/* FEATURE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-[#081748]-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
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
