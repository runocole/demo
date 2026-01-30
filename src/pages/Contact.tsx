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
      const response = await fetch("https://formsubmit.co/ajax/oticgs@gmail.com", {
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
          _template: "box",
          _subject: `New Contact Form: ${form.subject || "Inquiry"}`,
          _replyto: form.email
        })
      });

      const data = await response.json();
      
      if (response.ok) {
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
    } catch (error) {
      setSubmitting(false);
      toast?.({
        title: "Submission failed",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white ">
      <Header />

      {/* IMPROVED HERO SECTION */}
      <section className={`relative w-full ${isMobile ? 'h-[50vh]' : 'h-[60vh]'} flex items-center`}>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${contactHero})` }}
        />
        
        {/* Soft Overlay Gradient - Left to Right fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#081748]/95 via-[#081748]/85 to-[#081748]/70" />
        
        {/* HERO CONTENT - Improved Hierarchy */}
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${isMobile ? 'text-center max-w-full' : 'max-w-2xl'}`}
          >
            {/* Improved Text Hierarchy */}
            <div className="space-y-4">
              <h1 className={`font-bold text-white leading-tight ${
                isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'
              }`}>
                Contact Us
              </h1>
              
              <p className={`text-white/70 font-normal leading-relaxed ${
                isMobile ? 'text-base' : 'text-lg md:text-xl'
              }`} style={{ lineHeight: '1.6' }}>
                Let's build precision together
              </p>
            </div>

            {/* Improved CTA Buttons - Primary & Secondary */}
            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-wrap items-center gap-4'} pt-4`}>
              <Button 
                onClick={scrollToForm} 
                size={isMobile ? "default" : "lg"}
                className={`${isMobile ? 'w-full' : ''} bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  isMobile ? 'text-sm px-6 py-3' : 'text-base px-8 py-4'
                }`}
              >
                Send us an email
              </Button>

              <button
                onClick={() => {
                  const mapSection = document.getElementById("map-section");
                  mapSection?.scrollIntoView({ behavior: "smooth" });
                  setMapLoaded(true);
                }}
                className={`${isMobile ? 'w-full' : ''} inline-flex items-center justify-center gap-2 ${
                  isMobile ? 'px-6 py-3' : 'px-6 py-3'
                } rounded-lg font-bold bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300`}
              >
                <MapPin className="w-4 h-4" />
                View location
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMPROVED BREADCRUMB SECTION */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 py-3 text-xs md:text-sm text-gray-600 font-medium"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 hover:text-[#081748] transition-colors whitespace-nowrap"
            >
              <Home className="w-3 h-3 md:w-4 md:h-4" />
              Home
            </button>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
            <span className="text-[#081748] font-semibold whitespace-nowrap">Contact</span>
          </motion.div>
        </div>
      </section>

      {/* QUICK CONTACT BUTTONS - Mobile Only */}
      {isMobile && (
        <div className="sticky top-16 z-30 bg-white border-b border-gray-100 py-2 px-4">
          <div className="flex overflow-x-auto gap-2 pb-1">
            <a
              href="tel:+2349048332623"
              className="flex items-center gap-1 px-3 py-2 bg-blue-50 rounded-lg text-sm font-semibold text-[#081748] whitespace-nowrap border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <Phone className="w-3 h-3" />
              Call Us
            </a>
            <a
              href="mailto:sales@oticgs.com"
              className="flex items-center gap-1 px-3 py-2 bg-blue-50 rounded-lg text-sm font-semibold text-[#081748] whitespace-nowrap border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <Mail className="w-3 h-3" />
              Email Us
            </a>
            <a
              href="https://wa.me/2349048332623"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold whitespace-nowrap border border-green-100 hover:bg-green-100 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* IMPROVED CONTACT INFO SECTION */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        {isMobile ? (
          // Mobile - Horizontal Scroll Layout
          <div className="space-y-6">
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
              {/* Phone Card */}
              <div className="flex-shrink-0 w-[280px] p-6 rounded-2xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Phone className="w-5 h-5 text-[#081748]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Get in touch</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Phone:</p>
                    <div className="space-y-1">
                      <a
                        className="block text-sm font-semibold text-[#081748] hover:text-blue-800 transition"
                       href="tel:+2349048332623"
                      >
                        +234 904 833 2623
                      </a>
                      <a
                        className="block text-sm font-semibold text-[#081748] hover:text-blue-800 transition"
                        href="tel:+2347061769934"
                      >
                        +234 706 176 9934
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Email:</p>
                    <a
                      className="block text-sm font-semibold text-[#081748] hover:text-blue-800 transition"
                      href="mailto:sales@oticgs.com"
                    >
                      sales@oticgs.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="flex-shrink-0 w-[280px] p-6 rounded-2xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-[#081748]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Visit Us</h3>
                </div>
                <p className="text-xs font-medium text-gray-600 mb-4">
                  No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos, Nigeria
                </p>
                <a
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#081748] text-white rounded-lg text-xs hover:bg-blue-900 transition font-semibold shadow-md hover:shadow-lg"
                  href="https://www.google.com/maps/place/OTIC+Surveys+Ltd/@6.4411228,3.525624,17z/data=!3m1!4b1!4m6!3m5!1s0x103b9225321f2a2f:0xf5fce36cb77637f0!8m2!3d6.4411175!4d3.5281989!16s%2Fg%2F11f_1nfjp0?entry=ttu&g_ep=EgoyMDI5MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="w-3 h-3" />
                  Open in Maps
                </a>
              </div>

              {/* Social Media Card */}
              <div className="flex-shrink-0 w-[280px] p-6 rounded-2xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Share2 className="w-5 h-5 text-[#081748]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Follow Us</h3>
                </div>
                <p className="text-xs font-medium text-gray-600 mb-4">
                  Connect with us on social media
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Facebook, href: "https://www.facebook.com/share/1LaTG6SCC9/?mibextid=wwXIfr", label: "Facebook" },
                    { icon: Instagram, href: "https://www.instagram.com/oticgeosystems?igsh=MW81MmY0cXMxNnVjMA==", label: "Instagram" },
                    { icon: Linkedin, href: "https://www.linkedin.com/company/otic-geosystems-limited/posts/?feedView=all", label: "LinkedIn" },
                    { icon: Youtube, href: "https://www.youtube.com/@oticgeosystems", label: "YouTube" },
                    { icon: Twitter, href: "https://x.com/geossotech?s=11", label: "Twitter" },
                    { icon: Music2Icon, href: "https://www.tiktok.com/@oticgeosystems?_r=1&_t=ZS-93O62vwcopZ", label: "TikTok" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      aria-label={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group p-2 rounded-full bg-gray-50 hover:bg-[#081748] transition-all duration-300 hover:scale-110"
                      title={social.label}
                    >
                      <social.icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Phone Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Phone className="w-6 h-6 text-[#081748]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Get in touch</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3">Phone:</p>
                  <div className="space-y-2">
                    <a
                      className="block text-base font-semibold text-[#081748] hover:text-blue-800 transition"
                      href="tel:+2349048332623"
                    >
                      +234 904 833 2623
                    </a>
                    <a
                      className="block text-base font-semibold text-[#081748] hover:text-blue-800 transition"
                      href="tel:+2347061769934"
                    >
                      +234 706 176 9934
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3">Email:</p>
                  <div className="space-y-1">
                    <a
                      className="block text-base font-semibold text-[#081748] hover:text-blue-800 transition"
                      href="mailto:sales@oticgs.com"
                    >
                      sales@oticgs.com
                    </a>
                    <a
                      className="block text-sm font-semibold text-[#081748] hover:text-blue-800 transition"
                      href="mailto:oticgs@gmail.com"
                    >
                      oticgs@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <MapPin className="w-6 h-6 text-[#081748]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Address Info</h3>
              </div>
              
              <p className="text-sm font-medium text-gray-600 mb-6 leading-relaxed">
                No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos, Nigeria
              </p>
              
              <a
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#081748] text-white rounded-lg hover:bg-blue-900 transition font-semibold shadow-lg hover:shadow-xl"
                href="https://www.google.com/maps/place/OTIC+Surveys+Ltd/@6.4411228,3.525624,17z/data=!3m1!4b1!4m6!3m5!1s0x103b9225321f2a2f:0xf5fce36cb77637f0!8m2!3d6.4411175!4d3.5281989!16s%2Fg%2F11f_1nfjp0?entry=ttu&g_ep=EgoyMDI5MTEwNC4xIKXMDSoASAFQAw%3D%3D"
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
              className="p-8 rounded-2xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Share2 className="w-6 h-6 text-[#081748]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Social Media</h3>
              </div>
              
              <p className="text-sm font-medium text-gray-600 mb-6">
                Feel free to connect on social media
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/share/1LaTG6SCC9/?mibextid=wwXIfr", label: "Facebook" },
                  { icon: Instagram, href: "https://www.instagram.com/oticgeosystems?igsh=MW81MmY0cXMxNnVjMA==", label: "Instagram" },
                  { icon: Linkedin, href: "https://www.linkedin.com/company/otic-geosystems-limited/posts/?feedView=all", label: "LinkedIn" },
                  { icon: Youtube, href: "https://www.youtube.com/@oticgeosystems", label: "YouTube" },
                  { icon: Twitter, href: "https://x.com/geossotech?s=11", label: "Twitter" },
                  { icon: Music2Icon, href: "https://www.tiktok.com/@oticgeosystems?_r=1&_t=ZS-93O62vwcopZ", label: "TikTok" },
                ].map((social) => (
                  <a
                    key={social.label}
                    aria-label={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group p-4 rounded-xl bg-gray-50 hover:bg-[#081748] transition-all duration-300 hover:scale-105 text-center"
                    title={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors mx-auto" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-white/90 mt-2 block">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* TRUST SIGNAL SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 md:mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 rounded-2xl border border-blue-100">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-semibold text-gray-700">
              Trusted by professionals across Nigeria's geospatial industry
            </p>
          </div>
        </motion.div>
      </section>
        
      {/* DIVIDER LINE */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-12 md:my-16"></div>
      </div>

      {/* CONTACT FORM SECTION */}
      <section ref={formRef} className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br from-blue-50 to-white border border-gray-200 rounded-2xl p-6 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${isMobile ? '' : 'max-w-6xl mx-auto'}`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 md:mb-12">
              <div className="flex-1">
                <h2 className={`font-bold text-gray-900 mb-3 ${
                  isMobile ? 'text-2xl' : 'text-3xl'
                }`}>
                  Send us a message
                </h2>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Prefer live chat?</span>
                <a
                  className="inline-flex items-center gap-2 px-5 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold border border-green-200 shadow-sm hover:shadow"
                  href="https://wa.me/2347061769934"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageSquare className="w-4 h-4" /> 
                  WhatsApp Chat
                </a>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="space-y-6 md:space-y-8" 
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Name *
                  </label>
                  <Input
                    ref={nameInputRef}
                    value={form.name}
                    onChange={handleChange("name")}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-12 font-medium focus:border-[#081748] focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-xs font-medium text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Email *
                  </label>
                  <Input
                    value={form.email}
                    onChange={handleChange("email")}
                    type="email"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-12 font-medium focus:border-[#081748] focus:ring-2 focus:ring-blue-100"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs font-medium text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Subject Input */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Subject *
                  </label>
                  <Input
                    value={form.subject}
                    onChange={handleChange("subject")}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-12 font-medium focus:border-[#081748] focus:ring-2 focus:ring-blue-100"
                    placeholder="What is this regarding?"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-xs font-medium text-red-600">{errors.subject}</p>
                  )}
                </div>

                {/* Service Select */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Service type *
                  </label>
                  <select
                    value={form.service}
                    onChange={handleChange("service")}
                    className={`w-full h-12 rounded-lg border px-4 bg-white border-gray-300 text-gray-900 font-medium focus:border-[#081748] focus:ring-2 focus:ring-blue-100 focus:outline-none ${
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
                    <p className="mt-2 text-xs font-medium text-red-600">{errors.service}</p>
                  )}
                </div>
              </div>

              {/* Product Input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Product Name (Optional)
                </label>
                <Input
                  value={form.product}
                  onChange={handleChange("product")}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-12 font-medium focus:border-[#081748] focus:ring-2 focus:ring-blue-100"
                  placeholder="If applicable"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Your message (Optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={handleChange("message")}
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 h-32 p-4 resize-none font-medium focus:border-[#081748] focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center md:justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                  size={isMobile ? "default" : "lg"}
                  className={`bg-[#081748] hover:bg-blue-900 text-white font-semibold shadow-lg hover:shadow-xl px-8 md:px-12 py-3 md:py-4 text-base md:text-lg transition-all duration-300 ${
                    isMobile ? 'w-full' : ''
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
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
                className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4 text-green-800"
              >
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-base">Message sent successfully!</p>
                  <p className="text-sm font-medium text-green-700">
                    Thanks for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section id="map-section" className="bg-white py-12 md:py-20 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Visit our office
              </h3>
              <p className="text-sm md:text-base font-medium text-gray-600">
                No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos
              </p>
            </div>
            
            <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-gray-200">
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

      <Footer />
    </div>
  );
};

export default Contact;