import { Users, CheckCircle2, Monitor, Home, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage from "../assets/hero-training.jpg";
import safetyImage from "../assets/safety-training.jpg";
import missionImage from "../assets/mission-planning.jpg";
import parametersImage from "../assets/parameters.jpg";
import fieldImage from "../assets/field-practice.jpg";
import procedureImage from "../assets/training-procedure.jpg";

const CorsNetwork = () => {
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
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-primary-foreground mb-8 font-montserrat font-light tracking-tight">
            Professional Training Academy
          </h1>
          <p className="text-2xl md:text-3xl text-primary-foreground/90 max-w-3xl mx-auto mb-10 font-montserrat font-light">
            We train professionals worldwide to safely and efficiently operate
            in their field with comprehensive training programs
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Get Started
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">20+</div>
              <div className="text-xl text-muted-foreground">Countries</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">40+</div>
              <div className="text-xl text-muted-foreground">Schools</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">1800+</div>
              <div className="text-xl text-muted-foreground">Authorized Instructors</div>
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Flexible learning solutions designed to fit your schedule, location, and learning preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* In-Person Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Most Popular</Badge>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">In-Person Training</h3>
                <p className="text-muted-foreground mb-6">
                  Interactive, hands-on learning experiences at over 10 global training locations with direct instructor engagement.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Face-to-face interaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Hands-on workshops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Networking opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Immediate feedback</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">View In-Person Schedules</Button>
              </CardContent>
            </Card>

            {/* Online Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <Badge className="absolute top-4 right-4 bg-highlight/10 text-highlight border-highlight">Flexible</Badge>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Monitor className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Online Training</h3>
                <p className="text-muted-foreground mb-6">
                  High-quality virtual courses accessible from anywhere, offering the same comprehensive content with remote convenience.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Learn from anywhere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Flexible scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Interactive sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Digital resources</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">View Virtual Schedules</Button>
              </CardContent>
            </Card>

            {/* In-House Training */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <Badge className="absolute top-4 right-4 bg-primary/10 text-primary border-primary">Customized</Badge>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">In-House Training</h3>
                <p className="text-muted-foreground mb-6">
                  Customized training programs delivered directly at your workplace, tailored to your organization's specific needs.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Customized content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Team building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Cost-effective for groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">Your preferred location</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Get Custom Quote</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Training Content Section */}
      <section id="content" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Training Content</h2>
          </div>

          <div className="space-y-16">
            {/* Safety and Regulation Training */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <img 
                  src={safetyImage} 
                  alt="Safety and Regulation Training" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="order-1 md:order-2 space-y-4">
                <h3 className="text-3xl font-bold text-foreground">Safety and Regulation Training</h3>
                <p className="text-lg text-muted-foreground">
                  Introduce local regulation requirements and safety operation procedures including: flight checklist, daily maintenance.
                </p>
              </div>
            </div>

            {/* Mission Planning and Operation Training */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-foreground">Mission Planning and Operation Training</h3>
                <p className="text-lg text-muted-foreground">
                  Field and flight path planning methods, and different operational modes.
                </p>
              </div>
              <div>
                <img 
                  src={missionImage} 
                  alt="Mission Planning and Operation Training" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>

            {/* Parameter Setting Recommendations */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <img 
                  src={parametersImage} 
                  alt="Parameter Setting Recommendations" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="order-1 md:order-2 space-y-4">
                <h3 className="text-3xl font-bold text-foreground">Parameter Setting Recommendations</h3>
                <p className="text-lg text-muted-foreground">
                  Flight parameters setting recommendations to ensure efficient and effective operations.
                </p>
              </div>
            </div>

            {/* Field Operation Practice */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-foreground">Field Operation Practice</h3>
                <p className="text-lg text-muted-foreground">
                  Hands-on training at the field including: automatic operations, configurations of spraying/spreading systems.
                </p>
              </div>
              <div>
                <img 
                  src={fieldImage} 
                  alt="Field Operation Practice" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Procedure Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-8">Training Procedure</h2>
            <img 
              src={procedureImage} 
              alt="Training Procedure Timeline" 
              className="rounded-lg shadow-lg w-full max-w-5xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-accent-foreground" />
            </div>
            <h2 className="text-4xl font-bold">Find a Local Training School</h2>
            <p className="text-xl text-primary-foreground/90">
              Connect with authorized training centers in your area and start your professional development journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Certificate Inquiry
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorsNetwork;
