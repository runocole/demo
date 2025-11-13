import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music2Icon, LogIn } from "lucide-react";
import oticLogo from "../assets/otic-logo.png";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call - replace with your actual newsletter service
    try {
      // Here you would integrate with your newsletter service (Mailchimp, ConvertKit, etc.)
      console.log("Subscribing email:", email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail("");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
      
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#081748] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Industries */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">Industries</h3>
            <ul className="space-y-3">
              <li>
                <a href="/industries/energy" className="text-sm font-semibold hover:text-white/80 transition">
                  Energy & Utility
                </a>
              </li>
              <li>
                <a href="/industries/agriculture" className="text-sm font-semibold hover:text-white/80 transition">
                  Agriculture
                </a>
              </li>
              <li>
                <a href="/industries/oil-gas" className="text-sm font-semibold hover:text-white/80 transition">
                  Oil & Gas
                </a>
              </li>
              <li>
                <a href="/industries/public-safety" className="text-sm font-semibold hover:text-white/80 transition">
                  Public Safety
                </a>
              </li>
              <li>
                <a href="/industries/construction" className="text-sm font-semibold hover:text-white/80 transition">
                  Construction
                </a>
              </li>
              <li>
                <a href="/industries/mining" className="text-sm font-semibold hover:text-white/80 transition">
                  Mining
                </a>
              </li>
            </ul>
          </div>

          {/* Survey Equipments */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">Survey Equipments</h3>
            <ul className="space-y-3">
              <li>
                <a href="/products/gnss" className="text-sm font-semibold hover:text-white/80 transition">
                  GNSS Systems
                </a>
              </li>
              <li>
                <a href="/products/total-stations" className="text-sm font-semibold hover:text-white/80 transition">
                  Total Stations
                </a>
              </li>
              <li>
                <a href="/products/laser-scanners" className="text-sm font-semibold hover:text-white/80 transition">
                  Laser Scanners
                </a>
              </li>
              <li>
                <a href="/products/levels" className="text-sm font-semibold hover:text-white/80 transition">
                  Levels
                </a>
              </li>
              <li>
                <a href="/products/echosounder" className="text-sm font-semibold hover:text-white/80 transition">
                 EchoSounder
                </a>
              </li>
              <li>
                <a href="/products/payloads" className="text-sm font-semibold hover:text-white/80 transition">
                  Payloads
                </a>
              </li>
              <li>
                <a href="/products/auto-steering systems" className="text-sm font-semibold hover:text-white/80 transition">
                  Auto-steering Systems
                </a>
              </li>
              <li>
                <a href="/products/accessories" className="text-sm font-semibold hover:text-white/80 transition">
                  Survey Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">Support & Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="/services/demo" className="text-sm font-semibold hover:text-white/80 transition">
                  Product Demo
                </a>
              </li>
              <li>
                <a href="/services/support" className="text-sm font-semibold hover:text-white/80 transition">
                  Product Support
                </a>
              </li>
              <li>
                <a href="/services/repairs" className="text-sm font-semibold hover:text-white/80 transition">
                  Repair Services
                </a>
              </li>
              <li>
                <a href="/services/trainings" className="text-sm font-semibold hover:text-white/80 transition">
                  Trainings
                </a>
              </li>
            </ul>

            {/* Newsletter Section */}
            <div className="mt-8">
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wide">Newsletter</h4>
              <p className="text-xs text-white/80 mb-3">
                Stay updated with our latest products and offers
              </p>
              
              {isSubscribed ? (
                <div className="p-2 bg-green-600/20 border border-green-400 rounded text-green-300 text-sm text-center">
                  Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:border-white/40 placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="px-4 py-2 bg-white text-[#081748] text-sm font-bold rounded hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/blog" className="text-sm font-semibold hover:text-white/80 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-sm font-semibold hover:text-white/80 transition">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm font-semibold hover:text-white/80 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/returns" className="text-sm font-semibold hover:text-white/80 transition">
                  Refund and Return Policy
                </a>
              </li>
            </ul>

            {/* Staff Login Section */}
            <div className="mt-8">
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wide">Employee Access</h4>
              <p className="text-xs text-white/80 mb-3">
                Staff and admin members access portal
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#081748] text-sm font-bold rounded hover:bg-white/90 transition-all hover:scale-105 border-2 border-white/30"
              >
                <LogIn className="w-4 h-4" />
                Staff Login
              </button>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30 bg-blue-950">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={oticLogo}
              alt="Otic logo"
              className="w-12 h-12 object-contain"
            />
            <p className="text-sm font-bold text-white">
              © {new Date().getFullYear()} Geosso Technologies Ltd. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-white/80 transition text-sm font-bold">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-white/80 transition text-sm font-bold">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;