import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { Calendar, Clock, Users, CheckCircle, Play, ArrowLeft, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Header from "../components/Header";
import Footer from "../components/Footer";

const demoRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  company: z.string().trim().min(1, "Company is required").max(100, "Company name must be less than 100 characters"),
  phone: z.string().trim().max(20, "Phone number must be less than 20 characters").optional(),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional(),
});

const ProductDemo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = demoRequestSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Using FormSubmit to send email to oticgs@gmail.com
      const formElement = e.target as HTMLFormElement;
      const response = await fetch("https://formsubmit.co/ajax/oticgs@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone || "Not provided",
          message: formData.message || "No specific message",
          subject: "New Demo Request - OTIC Geosystemss",
          _subject: "New Demo Request - OTIC Geosystemss",
          _template: "table",
          _captcha: "false"
        })
      });

      const data = await response.json();
      
      if (data.success === "true") {
        toast({
          title: "Demo Request Submitted!",
          description: "Our team will contact you within 24 hours to schedule your demo.",
        });
        
        setFormData({ name: "", email: "", company: "", phone: "", message: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Play,
      title: "Live Walkthrough",
      description: "Get a personalized demo tailored to your specific needs and use cases.",
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Our product specialists will answer all your questions in real-time.",
      color: "from-blue-700 to-blue-900",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book a demo at a time that works best for your team.",
      color: "from-blue-800 to-blue-950",
    },
    {
      icon: CheckCircle,
      title: "No Commitment",
      description: "Explore our product with no obligation.",
      color: "from-blue-900 to-blue-950",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-900 rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Enhanced Hero Section */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-blue-900/10 to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <Calendar className="w-5 h-5" />
            Schedule a Personalized Demo
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Experience Our <span className="text-blue-900">Geospatial Solutions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Get a personalized walkthrough of our precision survey equipment and discover how our solutions 
            can transform your workflow. Our experts are ready to show you exactly what you need.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
            >
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Demo Request Form - Moved BEFORE the features section */}
      <section id="demo-form" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-2xl overflow-hidden">
            <div className="md:grid md:grid-cols-3">
              {/* Form Sidebar */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-800 p-8 md:p-10 text-white">
                <h3 className="text-2xl font-bold mb-6">What You'll Get</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>30-minute personalized demo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Live Q&A with experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Case studies relevant to you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Pricing & implementation plan</span>
                  </li>
                </ul>
                
                <div className="mt-10 pt-6 border-t border-blue-700/50">
                  <p className="text-blue-200 text-sm">
                    Need immediate assistance?
                  </p>
                  <a 
                    href="tel:+2349048332623" 
                    className="inline-flex items-center gap-2 mt-2 text-white hover:text-blue-200 transition-colors font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    +234 904 833 2623
                  </a>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="md:col-span-2 p-8 md:p-10">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Request Your Demo
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours to schedule your personalized demo.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-gray-700 font-semibold">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`h-12 bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-sm text-red-600 font-medium">{errors.name}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-gray-700 font-semibold">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          className={`h-12 bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && <p className="text-sm text-red-600 font-medium">{errors.email}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="company" className="text-gray-700 font-semibold">
                          Company Name *
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Inc."
                          className={`h-12 bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 ${errors.company ? "border-red-500" : ""}`}
                        />
                        {errors.company && <p className="text-sm text-red-600 font-medium">{errors.company}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-gray-700 font-semibold">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234 904 833 2623"
                          className="h-12 bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-gray-700 font-semibold">
                        What would you like to see in the demo? *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your specific needs, projects, or any particular equipment you're interested in..."
                        rows={5}
                        className="bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 resize-none"
                      />
                      <p className="text-sm text-gray-500">
                        Please be specific so we can tailor the demo to your needs
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full py-6 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting Request...
                          </span>
                        ) : (
                          "Schedule My Demo"
                        )}
                      </Button>
                      
                      <p className="text-center text-gray-600 text-sm mt-4">
                        By submitting, you agree to our{" "}
                        <a href="/privacy" className="text-blue-900 hover:underline font-medium">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </div>
            </div>
          </Card>
          
          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-blue-50 rounded-2xl border border-blue-100 animate-bounce-subtle">
              <CheckCircle className="w-5 h-5 text-blue-900" />
              <p className="text-sm font-semibold text-gray-700">
                Trusted by 500+ geospatial professionals across Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid - Moved to come AFTER the demo form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Schedule a Demo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group animate-bounce-subtle"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <Card className="bg-white border border-gray-200 hover:border-blue-900/30 hover:shadow-2xl transition-all duration-300 h-full hover:-translate-y-2 shadow-lg cursor-default">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDemo;