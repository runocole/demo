import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Clock,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import oticLogo from "../assets/otic-logo.png";

type ServiceOption =
  | "Product Inquiry"
  | "Technical Support"
  | "Partnership"
  | "Repairs & Service"
  | "Other";

const SERVICE_OPTIONS: ServiceOption[] = [
  "Product Inquiry",
  "Technical Support",
  "Partnership",
  "Repairs & Service",
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

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
      await new Promise((res) => setTimeout(res, 1100));
      setSubmitted(true);
      toast?.({
        title: "Message sent",
        description: "Thanks — we will get back to you within 24 hours.",
      });
      setTimeout(() => {
        setSubmitting(false);
        setForm({ ...initialForm });
      }, 600);
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
    <div className="min-h-screen bg-white text-slate-800">
      {/* HERO SECTION WITH BACKGROUND PHOTO AND HEADER */}
      <section
        className="relative w-full h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60" />
        
        {/* HEADER NAVIGATION ON BACKGROUND */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* LEFT SIDE - LOGO */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <img
                    src={oticLogo}
                    alt="Geosso Technologies"
                    className="w-16 h-16 object-contain"
                  />
                  <div className="leading-tight">
                    <h1 className="font-black text-2xl text-white tracking-tight">
                      GEOSSO TECHNOLOGIES
                    </h1>
                    <p className="text-sm text-slate-300">
                      Precision surveying equipment
                    </p>
                  </div>
                </div>

                {/* NAVIGATION MENU */}
                <nav className="hidden lg:flex items-center gap-8">
                  <a href="/about" className="text-white hover:text-blue-300 font-medium transition">
                    About
                  </a>
                  <a href="/survey-equipment" className="text-white hover:text-blue-300 font-medium transition">
                    Survey Equipment
                  </a>
                  <a href="/drone-solutions" className="text-white hover:text-blue-300 font-medium transition">
                    Drone Solutions
                  </a>
                  <a href="/industries" className="text-white hover:text-blue-300 font-medium transition">
                    Industries
                  </a>
                  <a href="/underwater-drone" className="text-white hover:text-blue-300 font-medium transition">
                    Underwater Drone
                  </a>
                  <div className="relative group">
                    <button className="flex items-center gap-1 text-white hover:text-blue-300 font-medium transition">
                      Support & Services
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <a href="/contact" className="text-blue-300 font-medium transition">
                    Contact
                  </a>
                </nav>
              </div>

              {/* RIGHT SIDE - CTA & CURRENCY */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <span className="font-medium">₦</span>
                  <span className="text-sm">NGN</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/get-quote"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/25"
                  >
                    Get a Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* HERO CONTENT */}
        <div className="relative z-10 w-full text-center mt-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                CONTACT US
              </h1>
              <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                Let's build precision together — reach out for product inquiries, technical support, partnerships, or anything else.
              </p>
              
              <div className="flex items-center gap-4 justify-center">
                <Button 
                  onClick={scrollToForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
                >
                  Send us an email
                </Button>
                
                <button
                  onClick={() => setMapLoaded(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium cursor-pointer bg-white/20 text-white border border-white/30 hover:bg-white/30 transition backdrop-blur-sm"
                >
                  <MapPin className="w-4 h-4" />
                  View location
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT INFO SECTION - WHITE BACKGROUND WITH BLUE CARDS */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GET IN TOUCH */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">Get in touch</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-blue-100">
                  Phone:{" "}
                  <a
                    className="font-medium text-white hover:text-blue-100 transition"
                    href="tel:+2348100277870"
                  >
                    +234 810 027 7870
                  </a>
                </p>
                <p className="text-sm text-blue-100">
                  Phone:{" "}
                  <a
                    className="font-medium text-white hover:text-blue-100 transition"
                    href="tel:+2347081427221"
                  >
                    +234 708 142 7221
                  </a>
                </p>
                <p className="text-sm text-blue-100">
                  Email:{" "}
                  <a
                    className="font-medium text-white hover:text-blue-100 transition"
                    href="mailto:sales@oticsurveys.com"
                  >
                    sales@oticsurveys.com
                  </a>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-500">
                <h4 className="text-sm font-semibold text-blue-100 mb-2">
                  Opening hours
                </h4>
                <p className="text-sm text-blue-200">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Monday to Friday: 8:00AM - 5:00PM
                </p>
              </div>
            </motion.div>

            {/* ADDRESS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">Address</h3>
              </div>
              
              <p className="text-sm text-blue-100 leading-relaxed">
                No. 3, Bello Close, Chevyview Estate, Chevron Drive, Lekki, Lagos, Nigeria
              </p>
              
              <a
                className="mt-4 inline-flex items-center gap-2 text-sm text-white hover:text-blue-100 transition font-medium"
                href="https://www.google.com/maps/place/Chevron+Drive,+Lekki,+Lagos/"
                target="_blank"
                rel="noreferrer"
              >
                <MapPin className="w-4 h-4" /> 
                Open in Google Maps
              </a>
            </motion.div>

            {/* SOCIAL MEDIA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Facebook className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">Social media</h3>
              </div>
              
              <p className="text-sm text-blue-100 mb-4">
                Follow us on social media for updates and news
              </p>
              
              <div className="flex items-center gap-3">
                <a
                  aria-label="Facebook"
                  href="https://www.facebook.com/share/1LaTG6SCC9/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full hover:bg-blue-700 transition-all hover:scale-110 bg-blue-500"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  aria-label="Instagram"
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full hover:bg-blue-700 transition-all hover:scale-110 bg-blue-500"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  aria-label="LinkedIn"
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full hover:bg-blue-700 transition-all hover:scale-110 bg-blue-500"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  aria-label="YouTube"
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full hover:bg-blue-700 transition-all hover:scale-110 bg-blue-500"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION - COMPACT */}
      <section ref={formRef} className="bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg max-w-4xl mx-auto"
          >
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                Send us an email
              </h3>
              <p className="text-slate-600">
                Fill the form below and our team will respond shortly.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Name Input */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Your name *
                </label>
                <Input
                  ref={nameInputRef}
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Jane Doe"
                  className="bg-white border-slate-300 text-slate-800 placeholder-slate-400 h-11"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Your email *
                </label>
                <Input
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="name@company.com"
                  className="bg-white border-slate-300 text-slate-800 placeholder-slate-400 h-11"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Subject *
                </label>
                <Input
                  value={form.subject}
                  onChange={handleChange("subject")}
                  placeholder="Short summary"
                  className="bg-white border-slate-300 text-slate-800 placeholder-slate-400 h-11"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* Service Select */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Service type *
                </label>
                <select
                  value={form.service}
                  onChange={handleChange("service")}
                  className={`w-full h-11 rounded-md border px-3 bg-white border-slate-300 text-slate-800 ${
                    errors.service ? "border-red-500" : ""
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
                  <p className="mt-1 text-xs text-red-500">{errors.service}</p>
                )}
              </div>

              {/* Product Input */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Product Name
                </label>
                <Input
                  value={form.product}
                  onChange={handleChange("product")}
                  placeholder="e.g. ProStation 5000 Total Station"
                  className="bg-white border-slate-300 text-slate-800 placeholder-slate-400 h-11"
                />
              </div>

              {/* Message Textarea */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Your message{" "}
                  <span className="text-slate-500 text-sm">(optional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={handleChange("message")}
                  className="w-full rounded-md border border-slate-300 bg-white text-slate-800 placeholder-slate-400 h-24 p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your message..."
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex items-center justify-center mt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700"
              >
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Message successfully sent!</p>
                  <p className="text-sm text-green-600">
                    Thanks for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* MAP SECTION - FULL WIDTH BELOW FORM */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
            {!mapLoaded ? (
              <div className="p-8 flex flex-col items-center justify-center gap-6 bg-slate-50 min-h-[400px]">
                <MapPin className="w-16 h-16 text-slate-400" />
                <div className="text-center">
                  <p className="text-lg text-slate-600 mb-2">
                    Office Location
                  </p>
                  <p className="text-sm text-slate-500">
                    Click "View location" above to load the map
                  </p>
                </div>
                <div className="text-center p-4">
                  <p className="font-semibold text-slate-800 text-lg">
                    Geosso Technologies Limited
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    No. 3, Bello Close, Chevyview Estate, Chevron Drive
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-[500px]">
                <iframe
                  title="Office location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.68285315376!2d3.379314274831835!3d6.441857223718351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xd9a6e78c5f1a5a0!2sChevron%20Drive%2C%20Lekki%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={oticLogo}
              alt="Geosso Technologies"
              className="w-10 h-10 object-contain"
            />
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} Geosso Technologies Ltd. All rights
              reserved.
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <a
              href="/privacy"
              className="hover:text-blue-600 transition text-sm"
            >
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-600 transition text-sm">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-blue-600 transition text-sm">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;