import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music2Icon, LogIn, Mail } from "lucide-react";
import oticLogo from "../assets/otic-logo.png";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const toggleDropdown = (section: string) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  const footerSections = [
    {
      title: "Industries",
      links: [
        { name: "Energy & Utility", href: "/industries/energy" },
        { name: "Agriculture", href: "/industries/agriculture" },
        { name: "Oil & Gas", href: "/industries/oil-gas" },
        { name: "Public Safety", href: "/industries/public-safety" },
        { name: "Construction", href: "/industries/construction" },
        { name: "Mining", href: "/industries/mining" },
      ]
    },
    {
      title: "Survey Equipments",
      links: [
        { name: "GNSS Systems", href: "/buynow?category=GNSS%20Receiver" },
        { name: "Total Stations", href: "/buynow?category=Total%20Station" },
        { name: "Laser Scanners", href: "/buynow?category=Laser%20Scanner" },
        { name: "Levels", href: "/products/levels" },
        { name: "EchoSounder", href: "/buynow?category=EchoSounder" },
        { name: "Payloads", href: "/buynow?category=Payloads" },
        { name: "Auto-steering Systems", href: "/buynow?category=Auto-steering%20Systems" },
        { name: "Handheld GPS", href: "/buynow?category=Handheld%20GPS" },
        { name: "Survey Accessories", href: "/products/accessories" },
      ]
    },
    {
      title: "Support & Services",
      links: [
        { name: "Product Demo", href: "/services/demo" },
        { name: "Product Support", href: "/services/support" },
        { name: "Repair Services", href: "/services/repairs" },
        { name: "Trainings", href: "/services/trainings" },
      ]
    },
    {
      title: "Quick Links",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Shipping Policy", href: "/shipping" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Refund and Return Policy", href: "/returns" },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1LaTG6SCC9/?mibextid=wwXIfr", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/geossotech?igsh=MTA0c203NG96NWNhcA==", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/geosso-technologies-limited/", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@geossotech?si=K7Jr9Imz5PEUHsW9", label: "YouTube" },
    { icon: Twitter, href: "https://x.com/geossotech?s=11", label: "X (Twitter)" },
    { icon: Music2Icon, href: "https://www.tiktok.com/@geossotech?_r=1&_t=ZS-91LBdvCOBiU", label: "TikTok" },
  ];

  return (
    <footer className="bg-[#081748] text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile Accordion View */}
        <div className="lg:hidden">
          {footerSections.map((section, index) => (
            <div key={index} className="border-b border-white/20 last:border-b-0">
              <button
                onClick={() => toggleDropdown(section.title)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <h3 className="text-base font-bold uppercase tracking-wide">
                  {section.title}
                </h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    activeDropdown === section.title ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeDropdown === section.title ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <ul className="pb-4 space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-sm font-medium hover:text-white/80 transition block py-1.5"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Newsletter Section for Mobile */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="text-base font-bold mb-3 uppercase tracking-wide">Newsletter</h4>
            <p className="text-sm text-white/80 mb-4">
              Stay updated with our latest products and offers
            </p>
            
            {isSubscribed ? (
              <div className="p-3 bg-green-600/20 border border-green-400 rounded text-green-300 text-sm text-center">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 placeholder:text-white/60"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full px-4 py-3 bg-white text-[#081748] text-sm font-bold rounded-lg hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>

          {/* Staff Login for Mobile */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="text-base font-bold mb-3 uppercase tracking-wide">Employee Access</h4>
            <p className="text-sm text-white/80 mb-4">
              Staff and admin members access portal
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#081748] text-sm font-bold rounded-lg hover:bg-white/90 transition-all hover:scale-[1.02] border-2 border-white/30"
            >
              <LogIn className="w-4 h-4" />
              Staff Login
            </button>
          </div>

          {/* Social Media for Mobile */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="text-base font-bold mb-4 uppercase tracking-wide">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    aria-label={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold hover:text-white/80 transition block py-1"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Newsletter Section in Support & Services column */}
              {section.title === "Support & Services" && (
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
              )}

              {/* Staff Login in Quick Links column */}
              {section.title === "Quick Links" && (
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
              )}

              {/* Social Media in Quick Links column */}
              {section.title === "Quick Links" && (
                <div className="mt-8">
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          aria-label={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30 bg-blue-950">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-col sm:flex-row text-center sm:text-left">
              <img
                src={oticLogo}
                alt="Otic logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <p className="text-sm font-medium text-white">
                © {new Date().getFullYear()} Geosso Technologies Ltd. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              <a href="/terms" className="hover:text-white/80 transition text-sm font-medium whitespace-nowrap">
                Terms of Service
              </a>
              <span className="text-white/40 hidden sm:inline">|</span>
              <a href="/contact" className="hover:text-white/80 transition text-sm font-medium whitespace-nowrap">
                Contact Us
              </a>
              <span className="text-white/40 hidden sm:inline">|</span>
              <a href="/privacy" className="hover:text-white/80 transition text-sm font-medium whitespace-nowrap">
                Privacy Policy
              </a>
            </div>
          </div>
          
          {/* Mobile Additional Info */}
          <div className="mt-4 text-center md:text-left">
            <p className="text-xs text-white/60">
              Precision Surveying & Geospatial Solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;