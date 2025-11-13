import { Users, CheckCircle2, Monitor, Home, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage from "../assets/hero-training.jpg";
import safetyImage from "../assets/safety-training.jpg";
import missionImage from "../assets/mission-planning.jpg";
import parametersImage from "../assets/parameters.jpg";
import fieldImage from "../assets/field-practice.jpg";
import {Testimonials} from "../components/Testimonials";
const Training = () => {
  const navigate = useNavigate();

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('content');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Hero Section */}
      <section className="relative h-[750px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 font-montserrat tracking-tight">
            GeossoTech Academy 
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-0 mb-10 font-montserrat font-bold">
            We train professionals worldwide to safely and efficiently operate
            in their field with comprehensive training programs
          </p>
          <div className="flex justify-start">
            <Button
              onClick={() => navigate("/contact")}
              size="lg"
              className="bg-[#081748] text-white hover:bg-[#081748] font-bold text-base px-8 py-4 shadow-xl hover:shadow-2xl transition-all mt-0"
            >
              Get Started →
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">6+</div>
              <div className="text-xl text-muted-foreground">Courses</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">300+</div>
              <div className="text-xl text-muted-foreground">Trainees</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">8+</div>
              <div className="text-xl text-muted-foreground">Certificate Issued</div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Formats Section */}
      <section id="formats" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Perfect Training Format
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Online Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow bg-blue-50 border-blue-200">
              <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 border-blue-300">Flexible</Badge> 
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6"> 
                  <Monitor className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Online Training</h3>
                <p className="text-muted-foreground mb-6">
                 Learn from anywhere with flexible interactive online programs 
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Self paced online courses with video lessons, digital resources and assignments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Live training sessions with real time instructor support.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Post training support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /> 
                    <span className="text-card-foreground">Flexible and convenient learning platfor</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={scrollToCourses}
                  size="lg"
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>

            {/* In-Person Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow bg-blue-50 border-blue-200">
              <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 border-blue-300">Customized</Badge> 
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">In-Person Training</h3>
                <p className="text-muted-foreground mb-6">
                  Interactive, hands-on learning experiences at over 10 global training locations with direct instructor engagement.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Face-to-face interaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Hands-on workshops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Networking opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Immediate feedback</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={scrollToCourses}
                  size="lg"
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>

            {/* In-House Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow bg-blue-50 border-blue-200">
              <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 border-blue-300">Most Popular</Badge> 
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Group Training/Events</h3>
                <p className="text-muted-foreground mb-6">
                  Customized training programs delivered directly at your workplace, tailored to your organization's specific needs.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Customized content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Team building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Cost-effective for groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-card-foreground">Your preferred location</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100" 
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
      <section id="content" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Courses</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Drone Mapping Training */}
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <img 
                src={safetyImage} 
                alt="Safety and Regulation Training" 
                className="w-full h-68 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Drone Mapping Training</h3>
                <p className="text-muted-foreground line-clamp-3">
                  Introduce local regulation requirements and safety operation procedures including: flight checklist, daily maintenance.
                </p>
                <Link 
                  to="/safety-training"
                  className="text-blue-600 hover:text-blue-800 font-semibold inline-block"
                >
                  Read More →
                </Link>
              </div>
            </div>

            {/* Bathymetic Training */}
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <img 
                src={missionImage} 
                alt="Mission Planning and Operation Training" 
                className="w-full h-68 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Bathymetric Training</h3>
                <p className="text-muted-foreground line-clamp-3">
                  Field and flight path planning methods, and different operational modes.
                </p>
                <Link 
                  to="/safety-training"
                  className="text-blue-600 hover:text-blue-800 font-semibold inline-block"
                >
                  Read More →
                </Link>
              </div>
            </div>

            {/* Parameter Setting Recommendations */}
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <img 
                src={parametersImage} 
                alt="Parameter Setting Recommendations" 
                className="w-full h-68 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Parameter Setting Recommendations</h3>
                <p className="text-muted-foreground line-clamp-3">
                  Flight parameters setting recommendations to ensure efficient and effective operations.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  Read More →
                </button>
              </div>
            </div>

            {/* Field Operation Practice */}
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <img 
                src={fieldImage} 
                alt="Field Operation Practice" 
                className="w-full h-68 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Field Operation Practice</h3>
                <p className="text-muted-foreground line-clamp-3">
                  Hands-on training at the field including: automatic operations, configurations of spraying/spreading systems.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  Read More →
                </button>
              </div>
            </div>

            {/* Parameter Setting Recommendations */}
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <img 
                src={parametersImage} 
                alt="Parameter Setting Recommendations" 
                className="w-full h-68 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Parameter Setting Recommendations</h3>
                <p className="text-muted-foreground line-clamp-3">
                  Flight parameters setting recommendations to ensure efficient and effective operations.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  Read More →
                </button>
              </div>
            </div>

            {/* Field Operation Practice */}
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <img 
                src={fieldImage} 
                alt="Field Operation Practice" 
                className="w-full h-68 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Field Operation Practice</h3>
                <p className="text-muted-foreground line-clamp-3">
                  Hands-on training at the field including: automatic operations, configurations of spraying/spreading systems.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Feedback Section */}
         <Testimonials />
     {/* Contact Section */}
<section id="contact" className="py-20 bg-white text-black">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto shadow-lg">
        <Award className="w-10 h-10 text-black" />
      </div>
      <h2 className="text-4xl font-bold">Certificate Inquiry</h2>
      <p className="text-xl text-black">
        Consult us for your certified training needs. Get in touch to learn more about our certification programs and training opportunities.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="bg-white text-black hover:bg-blue-900 hover:text-blue-700 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
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