import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useToast } from "../hooks/use-toast";
import { 
  Headphones, 
  MessageCircle, 
  FileText, 
  Clock, 
  Mail, 
  Phone, 
  ArrowLeft, 
  ExternalLink,
  Shield,
  FileQuestion,
  Zap,
  CheckCircle,
  AlertTriangle,
  LifeBuoy,
  Settings,
  Download,
  Video,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Header from "../components/Header";
import Footer from "../components/Footer";

const supportRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().trim().min(10, "Please provide more details (at least 10 characters)").max(2000, "Description must be less than 2000 characters"),
});

const ProductSupport = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    description: "",
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

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = supportRequestSchema.safeParse(formData);
    
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
      const response = await fetch("https://formsubmit.co/ajax/oticgs@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          category: formData.category,
          description: formData.description,
          _subject: `Support Ticket: ${formData.subject}`,
          _template: "table",
          _captcha: "false"
        })
      });

      const data = await response.json();
      
      if (data.success === "true") {
        toast({
          title: "Support Ticket Created!",
          description: "We've received your request. Our team will respond within 24-48 hours.",
        });
        
        setFormData({ name: "", email: "", subject: "", category: "", description: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your ticket. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportChannels = [
    {
      icon: Headphones,
      title: "Priority Technical Support",
      description: "Get dedicated assistance from our expert engineering team.",
      availability: "Mon-Fri, 9AM-6PM EST",
      action: () => navigate("/contact?service=technical-support"),
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: MessageCircle,
      title: "Live WhatsApp Chat",
      description: "Quick answers to your questions in real-time.",
      availability: "24/7 Available",
      action: () => window.open("https://wa.me/2347061769934", "_blank"),
      color: "from-green-500 to-green-700",
    },
    {
      icon: FileText,
      title: "Product Documentation",
      description: "Comprehensive guides, manuals and tutorials.",
      availability: "Always Available",
      action: () => navigate("/training"),
      color: "from-blue-700 to-blue-900",
    },
    {
      icon: Clock,
      title: "Calibration Services",
      description: "Schedule equipment calibration & maintenance.",
      availability: "Business Days",
      action: () => navigate("/contact?service=calibration"),
      color: "from-blue-800 to-blue-950",
    },
    {
      icon: Shield,
      title: "Equipment Warranty",
      description: "Check warranty status & repair services.",
      availability: "24/7 Portal",
      action: () => toast({ 
        title: "Warranty Portal", 
        description: "Please contact oticgs@gmail.com for warranty inquiries." 
      }),
      color: "from-blue-900 to-blue-950",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step equipment setup guides.",
      availability: "Always Available",
      action: () => window.open("https://youtube.com/@geossotech", "_blank"),
      color: "from-red-600 to-red-800",
    },
  ];

  const resourceCards = [
    {
      icon: Download,
      title: "Download Manuals",
      description: "Equipment user manuals & datasheets",
    },
    {
      icon: Settings,
      title: "Troubleshooting Guide",
      description: "Common issues & solutions",
    },
    {
      icon: Users,
      title: "Training Sessions",
      description: "Schedule equipment training",
    },
    {
      icon: LifeBuoy,
      title: "Emergency Support",
      description: "Critical equipment failure",
    },
  ];

  const faqs = [
    {
      question: "What's included in technical support?",
      answer: "Our technical support covers equipment setup, troubleshooting, software configuration, calibration guidance, and field application advice. We provide both remote and on-site support depending on the issue severity.",
    },
    {
      question: "How long does calibration take?",
      answer: "Standard calibration takes 3-5 business days. Express service (24-48 hours) is available for urgent cases. You'll receive a calibration certificate upon completion.",
    },
    {
      question: "What's covered under warranty?",
      answer: "Manufacturer defects, faulty components, and workmanship are covered for 1-3 years depending on the equipment. Regular wear and tear, accidental damage, or misuse are not covered.",
    },
    {
      question: "Do you provide on-site training?",
      answer: "Yes! We offer comprehensive on-site training for all our equipment. Our experts will travel to your location to train your team on proper usage, maintenance, and best practices.",
    },
    {
      question: "How do I schedule maintenance?",
      answer: "Contact our support team with your equipment serial number and preferred dates. We'll coordinate the maintenance schedule and provide you with a service plan.",
    },
    {
      question: "What's the response time for support tickets?",
      answer: "Priority support tickets receive response within 2 hours during business hours. Standard tickets are answered within 24 hours. Emergency critical issues have 24/7 support.",
    },
  ];

  const categories = [
    { value: "technical", label: "Technical Issue" },
    { value: "calibration", label: "Calibration Request" },
    { value: "maintenance", label: "Maintenance Service" },
    { value: "warranty", label: "Warranty Claim" },
    { value: "training", label: "Training Inquiry" },
    { value: "parts", label: "Spare Parts Order" },
    { value: "software", label: "Software Support" },
    { value: "other", label: "Other Inquiry" },
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
            <LifeBuoy className="w-5 h-5" />
            OTIC Geosystemss Support Center
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Expert Support for <span className="text-blue-900">Precision Equipment</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Get comprehensive support for your survey equipment, from technical troubleshooting to 
            calibration services. Our expert team ensures your equipment performs with precision.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
            >
              Submit Support Ticket
            </Button>
            <a href="https://wa.me/2347061769934" target="_blank" rel="noreferrer">
              <Button 
                variant="outline"
                className="px-8 py-3 border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-semibold transition-all duration-300 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Support
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-y border-orange-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700 font-semibold">
              Emergency Support Available 24/7: Call{" "}
              <a href="tel:+2349048332623" className="underline hover:text-orange-900">+234 904 833 2623</a>
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Support Channels Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
            Support Services
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Choose the support channel that best fits your needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <button
                key={index}
                onClick={channel.action}
                className="group text-left focus:outline-none"
              >
                <Card className="bg-white border border-gray-200 hover:border-blue-900/30 hover:shadow-2xl transition-all duration-300 h-full hover:-translate-y-1 shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <channel.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                      {channel.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {channel.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-1 rounded">
                        {channel.availability}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Resources Grid - Now non-clickable */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Quick Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {resourceCards.map((resource, index) => (
              <div
                key={index}
                className="group"
              >
                <Card className="bg-white border border-blue-100 hover:border-blue-900/30 hover:shadow-xl transition-all duration-300 h-full cursor-default shadow-md">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-blue-100 text-blue-900 group-hover:scale-110 transition-transform duration-300">
                      <resource.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Resource Actions Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">To access these resources:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => window.location.href = "mailto:oticgs@gmail.com"}
                className="px-6 py-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email for Manuals
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/training")}
                className="px-6 py-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Schedule Training
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "tel:+2349048332623"}
                className="px-6 py-2 border-red-600 text-red-700 hover:bg-red-600 hover:text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information - Enhanced */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 text-center">
            <button 
              onClick={() => window.location.href = "mailto:oticgs@gmail.com"}
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-blue-900" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Technical Support Email</p>
                <p className="font-semibold text-gray-900 group-hover:text-blue-900">oticgs@gmail.com</p>
              </div>
            </button>
            <button 
              onClick={() => window.location.href = "tel:+2349048332623"}
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-blue-900" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Emergency Hotline</p>
                <p className="font-semibold text-gray-900 group-hover:text-blue-900">+234 904 833 2623</p>
              </div>
            </button>
            <button 
              onClick={() => window.open("https://wa.me/2347061769934", "_blank")}
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-green-700" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">WhatsApp Support</p>
                <p className="font-semibold text-gray-900 group-hover:text-green-700">+234 706 176 9934</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Find quick answers to common questions about our support services
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-gray-900 hover:text-blue-900 hover:no-underline font-semibold text-lg">
                  <div className="flex items-center gap-3">
                    <FileQuestion className="w-5 h-5 text-blue-900" />
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Enhanced Support Ticket Form */}
      <section id="support-form" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-2xl overflow-hidden">
            <div className="md:grid md:grid-cols-3">
              {/* Form Sidebar */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-800 p-8 md:p-10 text-white">
                <h3 className="text-2xl font-bold mb-6">What We Need</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Equipment serial number (if applicable)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Detailed error description</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Photos or videos of the issue</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Purchase information</span>
                  </li>
                </ul>
                
                <div className="pt-6 border-t border-blue-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-blue-300" />
                    <span className="font-semibold">Priority Support</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-3">
                    For urgent technical issues requiring immediate attention
                  </p>
                  <a 
                    href="tel:+2349048332623" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Call Emergency Hotline
                  </a>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="md:col-span-2 p-8 md:p-10">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Submit Support Ticket
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Provide details about your equipment issue for faster resolution
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
                        <Label htmlFor="subject" className="text-gray-700 font-semibold">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g., GNSS Receiver Signal Issue"
                          className={`h-12 bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 ${errors.subject ? "border-red-500" : ""}`}
                        />
                        {errors.subject && <p className="text-sm text-red-600 font-medium">{errors.subject}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="category" className="text-gray-700 font-semibold">
                          Category *
                        </Label>
                        <Select value={formData.category} onValueChange={handleCategoryChange}>
                          <SelectTrigger className={`h-12 bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 ${errors.category ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select issue category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-red-600 font-medium">{errors.category}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="description" className="text-gray-700 font-semibold">
                          Issue Description *
                        </Label>
                        <span className="text-sm text-gray-500">Include equipment model & serial number if available</span>
                      </div>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the issue in detail. Include: Equipment model, error messages, when it started, what you've tried..."
                        rows={6}
                        className={`bg-white border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 resize-none ${errors.description ? "border-red-500" : ""}`}
                      />
                      {errors.description && <p className="text-sm text-red-600 font-medium">{errors.description}</p>}
                      <p className="text-sm text-gray-500">
                        The more details you provide, the faster we can resolve your issue
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
                            Submitting Ticket...
                          </span>
                        ) : (
                          "Submit Support Ticket"
                        )}
                      </Button>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-900 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">What happens next?</p>
                            <p className="text-sm text-gray-600">
                              You'll receive a ticket number via email. Our team will review and respond within 24 hours (business days). 
                              For urgent issues, call our hotline.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </div>
            </div>
          </Card>
          
          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 px-8 py-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-900" />
                <span className="text-sm font-semibold text-gray-700">Certified Technical Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-900" />
                <span className="text-sm font-semibold text-gray-700">Average Response: 4 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-900" />
                <span className="text-sm font-semibold text-gray-700">95% Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductSupport;