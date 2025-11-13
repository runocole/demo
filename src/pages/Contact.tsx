import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music2Icon } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Share2,
  MapPin,
  Phone,
  CheckCircle,
  ChevronRight,
  Home,
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
  const formRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

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
      if (!captchaValue) e.captcha = "Please verify you are not a robot.";
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
    // Send to FormSubmit.co
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
        _captcha: "false", // Disable FormSubmit's built-in CAPTCHA since you have reCAPTCHA
        _template: "table" // Optional: makes email look nicer
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
        setCaptchaValue(null); // Reset CAPTCHA
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
  {/* HEADER - Now sits on top of background photo */}
  <Header />

  {/* HERO SECTION WITH BACKGROUND PHOTO */}
  <section
    className="relative w-full h-[50vh] flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: `url(${contactHero})`,
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
    
    {/* HERO CONTENT - LEFT ALIGNED */}
    <div className="relative z-10 w-full h-full flex items-center">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            className="space-y-4 max-w-2xl ml-20 mt-55"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Contact
          </h1>
          <p className="text-lg md:text-xl text-black/95 font-medium leading-relaxed">
            Let's build precision together
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2"> {/* Removed justify-center */}
            <Button 
              onClick={scrollToForm} 
              size="lg"
              className="bg-[#081748] text-white hover: bg-[#081748] font-bold text-base px-6 py-4 shadow-xl hover:shadow-2xl transition-all"
            >
              Send us an email
            </Button>

            <button
              onClick={() => {
                const mapSection = document.getElementById("map-section");
                mapSection?.scrollIntoView({ behavior: "smooth" });
                setMapLoaded(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold bg-blue-100/10 border-2 border-blue-100/30 text-white hover:bg-blue-100ite/20 transition-all backdrop-blur-md shadow-lg"
            >
              <MapPin className="w-4 h-4" />
              View location
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
      {/* BREADCRUMB NAVIGATION */}
      <section className="bg-primary/5 border-b-2 border-primary/10">
        <div className="container mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground font-bold"
          >
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-bold">Contact</span>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO SECTION */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* GET IN TOUCH - PHONE NUMBERS SIDE BY SIDE */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)" }}
  className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg hover:border-blue-900/50 transition-all"
>
  <div className="flex items-center gap-3 mb-6">
    <div className="p-3 bg-primary/20 rounded-xl">
      <Phone className="w-6 h-6 text-blue-900" />
    </div>
    <h3 className="text-2xl font-bold text-foreground">Get in touch</h3>
  </div>
  
  <div className="space-y-4">
    {/* Phone numbers */}
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

    {/* Email below */}
    <div className="text-center">
      <p className="text-sm font-bold text-foreground mb-2">Email:</p>
      <a
        className="font-bold text-primary hover:text-primary/80 transition"
        href="mailto:runocole@gmail.com"
      >
        sales@oticsurveys.com
      </a>
    </div>
  </div>
</motion.div>
          {/* ADDRESS */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
          whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)" }}
          className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-900/20 border-2 border-blue-900/30 shadow-lg hover:border-blue-900/50 transition-all"
>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue 900/20 rounded-xl">
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
              whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)" }}
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
            
            {/* Horizontal layout for social media icons */}
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
                href="hhttps://www.tiktok.com/@geossotech?_r=1&_t=ZS-91LBdvCOBiU"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
              >
                <Music2Icon className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
        
          {/* HORIZONTAL DIVIDER LINE */}
      <div className="container mx-auto px-6">
        <div className="h-0.5 bg-gray-400 my-16 w-full mt-0"></div>
      </div>

      {/* CONTACT FORM SECTION - FULL WIDTH */}
{/* CONTACT FORM SECTION - FULL WIDTH */}
<section ref={formRef} className="bg-primary/5 py-16 border-y-2 border-primary/10">
  <div className="container mx-auto px-6 -mt-30">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
     className="bg-blue-100 border-2 border-primary/20 rounded-2xl p-10 shadow-2xl max-w-9xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-10">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Send us an email
          </h2>
        </div>

        <div className="flex items-center gap-4 mt-15">
          <span className="text-sm font-bold text-muted-foreground">Prefer live chat?</span>
          <a
            className="inline-flex items-center gap-2 px-5 py-3 bg-green-500/10 text-green-700 rounded-xl text-sm hover:bg-green-500/20 transition font-bold border-2 border-green-500/20 shadow-md"
            href="https://wa.me/2347081427221"
            target="_blank"
            rel="noreferrer"
          >
            <Phone className="w-4 h-4" /> 
            WhatsApp Chat
          </a>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="space-y-6" 
      >
        {/* Name Input */}
        <div>
          <label className="text-sm font-bold text-foreground block mb-2">
            Name
          </label>
          <Input
            ref={nameInputRef}
            value={form.name}
            onChange={handleChange("name")}
            className="bg-gray-100 border-2 border-gray-300 text-foreground placeholder-muted-foreground h-12 font-semibold focus:border-primary"
          />
          {errors.name && (
            <p className="mt-2 text-xs font-bold text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="text-sm font-bold text-foreground block mb-2">
           Email
          </label>
          <Input
            value={form.email}
            onChange={handleChange("email")}
            className="bg-gray-100 border-2 border-gray-300 text-foreground placeholder-muted-foreground h-12 font-semibold focus:border-primary"
          />
          {errors.email && (
            <p className="mt-2 text-xs font-bold text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Subject Input */}
        <div>
          <label className="text-sm font-bold text-foreground block mb-2">
            Subject
          </label>
          <Input
            value={form.subject}
            onChange={handleChange("subject")}
            className="bg-gray-100 border-2 border-gray-300 text-foreground placeholder-muted-foreground h-12 font-semibold focus:border-primary"
          />
          {errors.subject && (
            <p className="mt-2 text-xs font-bold text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* Service Select */}
        <div>
          <label className="text-sm font-bold text-foreground block mb-2">
            Service type
          </label>
          <select
            value={form.service}
            onChange={handleChange("service")}
            className={`w-full h-12 rounded-lg border-2 px-4 bg-gray-100 border-gray-300 text-foreground font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.service ? "border-red-600" : ""
            }`}
          >
            <option value="">— Please choose an option —</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-2 text-xs font-bold text-red-600">{errors.service}</p>
          )}
        </div>

        {/* Product Input */}
        <div>
          <label className="text-sm font-bold text-foreground block mb-2">
            Product Name
          </label>
          <Input
            value={form.product}
            onChange={handleChange("product")}
            className="bg-gray-100 border-2 border-gray-300 text-foreground placeholder-muted-foreground h-12 font-semibold focus:border-primary"
          />
        </div>

        {/* Message Textarea */}
        <div>
          <label className="text-sm font-bold text-foreground block mb-2">
            Your message{" "}
            <span className="text-muted-foreground font-semibold">(optional)</span>
          </label>
          <textarea
            value={form.message}
            onChange={handleChange("message")}
            className="w-full rounded-lg border-2 border-gray-300 bg-gray-100 text-foreground placeholder-muted-foreground h-40 p-4 resize-none font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          {/*ReCaptcha*/}
           <div className="w-full">
    <ReCAPTCHA
      sitekey="6LfKJwgsAAAAAKKumSYveiaBc62hIHunEVyMVq4E" 
      onChange={(value) => setCaptchaValue(value)}
      className="mx-auto"
    />
    {errors.captcha && (
      <p className="mt-2 text-xs font-bold text-red-600 text-center">{errors.captcha}</p>
    )}
  </div>
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="bg-[#081748] text-white hover:bg-[#081748] font-bold shadow-xl hover:shadow-2xl px-10 py-6 text-lg transition-all"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
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
          className="mt-8 p-5 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-4 text-green-700"
        >
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-bold text-lg">Message successfully sent!</p>
            <p className="text-sm font-semibold text-green-600">
              Thanks for contacting us. We'll get back to you within 24 hours.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  </div>
</section>

      {/* MAP SECTION */}
      <section id="map-section" className="bg-secondary/20 py-16 border-y-2 border-primary/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-lg font-bold text-muted-foreground">
                Visit our office at No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos
              </p>
            </div>
            
            {mapLoaded ? (
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20 bg-blue-100">
                <div className="h-[500px] w-full">
                 <iframe
               title="Office location"
               src="https://maps.google.com/maps?q=OTIC%20Surveys%20Ltd,%20Lekki,%20Lagos&t=&z=15&ie=UTF8&iwloc=&output=embed"
               className="w-full h-full border-0"
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20 bg-blue-100">
  <div className="h-[500px] w-full">
    <iframe
      title="Office location"
      src="https://maps.google.com/maps?q=OTIC%20Surveys%20Ltd,%20Lekki,%20Lagos&t=&z=15&ie=UTF8&iwloc=&output=embed"
      className="w-full h-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Contact;