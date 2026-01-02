import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music2Icon } from "lucide-react";
import {
  Share2,
  MapPin,
  Phone,
  CheckCircle,
  ChevronRight,
  Home,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import contactHero from "../assets/contact-hero.jpg";

type ServiceOption =
  | "Product Inquiry"
  | "Technical Support"
  | "Partnership"
  | "Repairs & Service"
  | "Request Demo"
  | "Certificate Inquiry"
  | "Training Inquiry"
  | "Other";

const SERVICE_OPTIONS: ServiceOption[] = [
  "Product Inquiry",
  "Technical Support",
  "Partnership",
  "Repairs & Service",
  "Request Demo",
  "Certificate Inquiry",
  "Training Inquiry",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  service: "" as ServiceOption | "",
  product: "",
  message: "",
};

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(() => ({ ...initialForm }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      if (!ok) e.email = "Enter a valid email address.";
    }
    if (!form.subject.trim()) e.subject = "Please enter a subject.";
    if (!form.service) e.service = "Select a service.";
    return e;
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => nameInputRef.current?.focus(), 400);
    }
  };

  const handleChange =
    (k: keyof typeof initialForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((s) => ({ ...s, [k]: e.target.value }));
      setErrors((prev) => ({ ...prev, [k]: "" }));
    };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      const firstKey = Object.keys(v)[0];
      toast?.({
        title: "Fix the errors",
        description: v[firstKey],
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/runocole@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          service: form.service,
          product: form.product,
          message: form.message,
          _captcha: "false",
          _template: "table"
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        toast?.({
          title: "Message sent!",
          description: "Thanks — we will get back to you within 24 hours.",
        });
        setTimeout(() => {
          setSubmitting(false);
          setForm({ ...initialForm });
        }, 600);
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setSubmitting(false);
      toast?.({
        title: "Submission failed",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION - Mobile Optimized */}
      <section
        className={`relative w-full ${isMobile ? 'h-[40vh]' : 'h-[50vh]'} flex items-center justify-center bg-cover bg-center`}
        style={{
          backgroundImage: `url(${contactHero})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        
        {/* HERO CONTENT */}
        <div className="relative z-10 w-full h-full flex items-center">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`space-y-3 ${isMobile ? 'max-w-full text-center' : 'max-w-2xl ml-0 md:ml-20'}`}
            >
              <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold text-white leading-tight`}>
                Contact Us
              </h1>
              <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-white/95 font-medium leading-relaxed`}>
                Let's build precision together
              </p>

              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-wrap items-center gap-3'} pt-2`}>
                <Button 
                  onClick={scrollToForm} 
                  size={isMobile ? "default" : "lg"}
                  className={`${isMobile ? 'w-full' : ''} bg-[#081748] text-white hover:bg-[#081748] font-bold text-sm md:text-base px-4 md:px-6 py-3 md:py-4 shadow-xl hover:shadow-2xl transition-all`}
                >
                  Send us an email
                </Button>

                <button
                  onClick={() => {
                    const mapSection = document.getElementById("map-section");
                    mapSection?.scrollIntoView({ behavior: "smooth" });
                    setMapLoaded(true);
                  }}
                  className={`${isMobile ? 'w-full' : 'inline-flex'} items-center gap-2 px-4 md:px-5 py-2.5 md:py-2.5 rounded-lg font-bold bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 transition-all backdrop-blur-md shadow-lg justify-center`}
                >
                  <MapPin className="w-4 h-4" />
                  View location
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BREADCRUMB NAVIGATION - Mobile Optimized */}
      <section className="bg-primary/5 border-b-2 border-primary/10">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-bold overflow-x-auto"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap"
            >
              <Home className="w-3 h-3 md:w-4 md:h-4" />
              Home
            </button>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-foreground font-bold whitespace-nowrap">Contact</span>
          </motion.div>
        </div>
      </section>

      {/* QUICK CONTACT BUTTONS - Mobile Only */}
      {isMobile && (
        <div className="sticky top-16 z-30 bg-blue-100 border-y border-blue-200 py-2 px-4">
          <div className="flex overflow-x-auto gap-2 pb-1">
            <a
              href="tel:+2348100277870"
              className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg text-sm font-semibold text-[#081748] whitespace-nowrap border border-blue-200"
            >
              <Phone className="w-3 h-3" />
              Call Us
            </a>
            <a
              href="mailto:sales@geossotech.com"
              className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg text-sm font-semibold text-[#081748] whitespace-nowrap border border-blue-200"
            >
              <Mail className="w-3 h-3" />
              Email Us
            </a>
            <a
              href="https://wa.me/2347061769934"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold whitespace-nowrap border border-green-200"
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* CONTACT INFO SECTION - Mobile Optimized */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        {isMobile ? (
          // Mobile - Horizontal Scroll Layout
          <div className="space-y-4">
            {/* Horizontal scroll for contact cards */}
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
              {/* Phone Card */}
              <div className="flex-shrink-0 w-[280px] p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Phone className="w-5 h-5 text-blue-900" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Call Us</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-foreground mb-1">Phone:</p>
                    <div className="space-y-1">
                      <a
                        className="block text-sm font-bold text-primary hover:text-primary/80 transition"
                        href="tel:+2348100277870"
                      >
                        +234 810 027 7870
                      </a>
                      <a
                        className="block text-sm font-bold text-primary hover:text-primary/80 transition"
                        href="tel:+2347081427221"
                      >
                        +234 708 142 7221
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground mb-1">Email:</p>
                    <a
                      className="block text-sm font-bold text-primary hover:text-primary/80 transition"
                      href="mailto:sales@geossotech.com"
                    >
                      sales@geossotech.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="flex-shrink-0 w-[280px] p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-900/20 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-900" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Visit Us</h3>
                </div>
                <p className="text-xs font-bold text-foreground leading-relaxed mb-4">
                  No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos, Nigeria
                </p>
                <a
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#081748] text-white rounded-lg text-xs hover:bg-[#081748] transition font-bold shadow-md"
                  href="https://www.google.com/maps/place/OTIC+Surveys+Ltd/@6.4411228,3.525624,17z/data=!3m1!4b1!4m6!3m5!1s0x103b9225321f2a2f:0xf5fce36cb77637f0!8m2!3d6.4411175!4d3.5281989!16s%2Fg%2F11f_1nfjp0?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="w-3 h-3" />
                  Open in Maps
                </a>
              </div>

              {/* Social Media Card */}
              <div className="flex-shrink-0 w-[280px] p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Share2 className="w-5 h-5 text-blue-900" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Follow Us</h3>
                </div>
                <p className="text-xs font-bold text-foreground mb-4">
                  Connect with us on social media
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { icon: Facebook, href: "https://www.facebook.com/share/1LaTG6SCC9/?mibextid=wwXIfr", label: "Facebook" },
                    { icon: Instagram, href: "https://www.instagram.com/geossotech?igsh=MTA0c203NG96NWNhcA==", label: "Instagram" },
                    { icon: Linkedin, href: "https://www.linkedin.com/company/geosso-technologies-limited/", label: "LinkedIn" },
                    { icon: Youtube, href: "https://youtube.com/@geossotech?si=K7Jr9Imz5PEUHsW9", label: "YouTube" },
                    { icon: Twitter, href: "https://x.com/geossotech?s=11", label: "Twitter" },
                    { icon: Music2Icon, href: "https://www.tiktok.com/@geossotech?_r=1&_t=ZS-91LBdvCOBiU", label: "TikTok" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      aria-label={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border border-white/30"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Phone Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg hover:border-blue-900/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Phone className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Get in touch</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground mb-2">Phone:</p>
                  <div className="flex items-center justify-center gap-1">
                    <a
                      className="font-bold text-primary hover:text-primary/80 transition"
                      href="tel:+2348100277870"
                    >
                      +234 810 027 7870
                    </a>
                    <span className="text-foreground">,</span>
                    <a
                      className="font-bold text-primary hover:text-primary/80 transition"
                      href="tel:+2347081427221"
                    >
                      +234 708 142 7221
                    </a>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold text-foreground mb-2">Email:</p>
                  <a
                    className="font-bold text-primary hover:text-primary/80 transition"
                    href="mailto:runocole@gmail.com"
                  >
                    sales@geossotech.com, geossoltd@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg hover:border-blue-900/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-900/20 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Address Info</h3>
              </div>
              
              <p className="text-sm font-bold text-foreground leading-relaxed mb-6">
                No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos, Nigeria
              </p>
              
              <a
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#081748] text-white rounded-lg text-sm hover:bg-[#081748] transition font-bold shadow-lg"
                href="https://www.google.com/maps/place/OTIC+Surveys+Ltd/@6.4411228,3.525624,17z/data=!3m1!4b1!4m6!3m5!1s0x103b9225321f2a2f:0xf5fce36cb77637f0!8m2!3d6.4411175!4d3.5281989!16s%2Fg%2F11f_1nfjp0?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
              >
                <MapPin className="w-4 h-4" /> 
                Open in Google Maps
              </a>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg hover:border-blue-900/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Share2 className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Social Media</h3>
              </div>
              
              <p className="text-sm font-bold text-foreground mb-6">
                Feel free to connect on social media
              </p>
              
              <div className="flex items-center gap-4 justify-center">
                <a
                  aria-label="Facebook"
                  href="https://www.facebook.com/share/1LaTG6SCC9/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  aria-label="Instagram"
                  href="https://www.instagram.com/geossotech?igsh=MTA0c203NG96NWNhcA=="
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  aria-label="LinkedIn"
                  href="https://www.linkedin.com/company/geosso-technologies-limited/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  aria-label="YouTube"
                  href="https://youtube.com/@geossotech?si=K7Jr9Imz5PEUHsW9"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  aria-label="X"
                  href="https://x.com/geossotech?s=11"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  aria-label="Tiktok"
                  href="https://www.tiktok.com/@geossotech?_r=1&_t=ZS-91LBdvCOBiU"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                >
                  <Music2Icon className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </section>
        
      {/* DIVIDER LINE */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="h-0.5 bg-gray-300 my-8 md:my-16 w-full"></div>
      </div>

      {/* CONTACT FORM SECTION - Mobile Optimized */}
      <section ref={formRef} className="bg-primary/5 py-8 md:py-16 border-y-2 border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-blue-100 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-10 shadow-lg ${isMobile ? '' : 'max-w-9xl mx-auto'}`}
          >
            <div className="flex flex-col gap-4 mb-6 md:mb-10">
              <div className="flex-1">
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground mb-2`}>
                  Send us an email
                </h2>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm font-bold text-muted-foreground">Prefer live chat?</span>
                <a
                  className="inline-flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 bg-green-500/10 text-green-700 rounded-lg md:rounded-xl text-xs md:text-sm hover:bg-green-500/20 transition font-bold border border-green-500/20 shadow-sm md:shadow-md"
                  href="https://wa.me/2347061769934"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4" /> 
                  WhatsApp Chat
                </a>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="space-y-4 md:space-y-6" 
            >
              {/* Name Input */}
              <div>
                <label className="text-xs md:text-sm font-bold text-foreground block mb-1 md:mb-2">
                  Name *
                </label>
                <Input
                  ref={nameInputRef}
                  value={form.name}
                  onChange={handleChange("name")}
                  className={`bg-gray-100 border border-gray-300 text-foreground placeholder-muted-foreground ${isMobile ? 'h-10' : 'h-12'} font-semibold focus:border-primary text-sm md:text-base`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="text-xs md:text-sm font-bold text-foreground block mb-1 md:mb-2">
                  Email *
                </label>
                <Input
                  value={form.email}
                  onChange={handleChange("email")}
                  type="email"
                  className={`bg-gray-100 border border-gray-300 text-foreground placeholder-muted-foreground ${isMobile ? 'h-10' : 'h-12'} font-semibold focus:border-primary text-sm md:text-base`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-bold text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <label className="text-xs md:text-sm font-bold text-foreground block mb-1 md:mb-2">
                  Subject *
                </label>
                <Input
                  value={form.subject}
                  onChange={handleChange("subject")}
                  className={`bg-gray-100 border border-gray-300 text-foreground placeholder-muted-foreground ${isMobile ? 'h-10' : 'h-12'} font-semibold focus:border-primary text-sm md:text-base`}
                  placeholder="What is this regarding?"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs font-bold text-red-600">{errors.subject}</p>
                )}
              </div>

              {/* Service Select */}
              <div>
                <label className="text-xs md:text-sm font-bold text-foreground block mb-1 md:mb-2">
                  Service type *
                </label>
                <select
                  value={form.service}
                  onChange={handleChange("service")}
                  className={`w-full ${isMobile ? 'h-10' : 'h-12'} rounded-lg border px-3 md:px-4 bg-gray-100 border-gray-300 text-foreground font-semibold focus:border-primary focus:outline-none text-sm md:text-base ${
                    errors.service ? "border-red-600" : ""
                  }`}
                >
                  <option value="">— Please choose —</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="mt-1 text-xs font-bold text-red-600">{errors.service}</p>
                )}
              </div>

              {/* Product Input */}
              <div>
                <label className="text-xs md:text-sm font-bold text-foreground block mb-1 md:mb-2">
                  Product Name (Optional)
                </label>
                <Input
                  value={form.product}
                  onChange={handleChange("product")}
                  className={`bg-gray-100 border border-gray-300 text-foreground placeholder-muted-foreground ${isMobile ? 'h-10' : 'h-12'} font-semibold focus:border-primary text-sm md:text-base`}
                  placeholder="If applicable"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label className="text-xs md:text-sm font-bold text-foreground block mb-1 md:mb-2">
                  Your message (Optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={handleChange("message")}
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 text-foreground placeholder-muted-foreground h-24 md:h-40 p-3 md:p-4 resize-none font-semibold focus:border-primary focus:outline-none text-sm md:text-base"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center md:justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                  size={isMobile ? "default" : "lg"}
                  className={`${isMobile ? 'w-full' : ''} bg-[#081748] text-white hover:bg-[#081748] font-bold shadow-lg hover:shadow-xl px-6 md:px-10 py-3 md:py-6 text-sm md:text-lg transition-all`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 md:border-3 border-white border-t-transparent rounded-full animate-spin" />
                      {isMobile ? "Sending..." : "Sending..."}
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </form>

            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 md:mt-8 p-4 md:p-5 bg-green-50 border border-green-200 rounded-lg md:rounded-xl flex items-center gap-3 md:gap-4 text-green-700"
              >
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                <div>
                  <p className="font-bold text-sm md:text-lg">Message sent successfully!</p>
                  <p className="text-xs md:text-sm font-semibold text-green-600">
                    Thanks for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* MAP SECTION - Mobile Optimized */}
      <section id="map-section" className="bg-secondary/20 py-8 md:py-16 border-y-2 border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="text-center">
              <p className="text-sm md:text-lg font-bold text-muted-foreground">
                Visit our office at No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos
              </p>
            </div>
            
            <div className="rounded-lg md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl border border-primary/20 bg-blue-100">
              <div className={`${isMobile ? 'h-[300px]' : 'h-[500px]'} w-full`}>
                <iframe
                  title="Office location"
                  src="https://maps.google.com/maps?q=OTIC%20Surveys%20Ltd,%20Lekki,%20Lagos&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Contact;