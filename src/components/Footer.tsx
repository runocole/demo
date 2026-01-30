import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music2Icon, LogIn, Mail, X } from "lucide-react";
import { CheckCircle } from "lucide-react";
import oticLogo from "../assets/otic-logo.png";
import { useNavigate } from "react-router-dom";

// Embedded ReturnRefundPopup Component
const ReturnRefundPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl bg-white rounded-lg shadow-2xl transform transition-transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-black">Return & Refund Policy</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4 text-sm text-black">
            <p>
              At OTIC Geosystems, we are committed to providing high-quality products and excellent customer service. 
              If you are not completely satisfied with your purchase, you may return or request a refund under the following conditions.
            </p>

            <div>
              <p className="font-semibold mb-2">Return Timeframes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Equipment can be returned within thirty days of purchase</li>
                <li>Accessories can be returned within ten days of purchase</li>
                <li>All items must be returned in their original condition, unused, and with all original packaging, manuals, and accessories</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Non-Returnable Items:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Products that have been used, damaged, or altered</li>
                <li>Items purchased on clearance or as final sale</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Refund Process:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Once your return is received and inspected, we will notify you of the approval or rejection of your refund</li>
                <li>Approved refunds will be processed to the original method of payment within seven to ten business days</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Exchanges:</p>
              <p>If you received a defective or damaged product, you may request an exchange instead of a refund. Exchanges are subject to product availability.</p>
            </div>

            <div>
              <p className="font-semibold mb-2">Shipping Costs:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Shipping costs for returning items are the responsibility of the customer</li>
                <li>Free return shipping only if the product is defective or the return is due to our error</li>
                <li>Refunds do not include original shipping fees</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">How to Initiate a Return:</p>
              <p>To initiate a return or refund, please contact our customer support at <a href="mailto:support@oticgs.com" className="text-blue-600 hover:underline">support@oticgs.com</a> with your order details. Our team will guide you through the return process.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <button onClick={onClose} className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors">
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};

// Define types for footer links
interface FooterLink {
  name: string;
  path?: string;
  isPopup?: boolean;
  action?: () => void;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Main Footer Component
const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const FORM_SUBMIT_TOKEN = "d2658563f9fb7fc7c3cb96e9ea8b7ddc";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${FORM_SUBMIT_TOKEN}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          type: "Newsletter Subscription",
          subscriber_email: email,
          subscription_date: new Date().toISOString().split('T')[0],
          source: "Website Footer Newsletter",
          _subject: `NEWSLETTER SUBSCRIPTION: ${email}`,
          _template: "basic",
          _captcha: "false",
          _replyto: email,
          _autoresponse: "Thank you for subscribing to our newsletter! You'll receive updates about our latest products and offers."
        })
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
        setTimeout(() => setIsSubscribed(false), 5000);
      } else {
        alert("Subscription failed. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDropdown = (section: string) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  // Navigation handler
  const handleNavigation = (path?: string) => {
    if (path) {
      navigate(path);
      setActiveDropdown(null); // Close mobile dropdowns
    }
  };


  const footerSections: FooterSection[] = [
    {
      title: "Survey Equipments",
      links: [
        { name: "GNSS Systems", path: "/buynow?category=GNSS%20Receiver" },
        { name: "Total Stations", path: "/buynow?category=Total%20Station" },
        { name: "Laser Scanners", path: "/buynow?category=Laser%20Scanner" },
        { name: "Levels", path: "/buynow?category=Level" },
        { name: "EchoSounder", path: "/buynow?category=EchoSounder" },
        { name: "Payloads", path: "/buynow?category=Payloads" },
        { name: "Auto-steering Systems", path: "/buynow?category=Auto-steering%20Systems" },
        { name: "Handheld GPS", path: "/buynow?category=Handheld%20GPS" },
        { name: "Survey Accessories", path: "/buynow?category=Accessory" },
      ]
    },
    {
      title: "Support & Services",
      links: [
        { name: "Product Demo", path: "/product-demo" },
        { name: "Product Support", path: "/product-support" },
        { name: "Trainings", path: "/training" },
      ]
    },
    {
      title: "Quick Links",
      links: [
        { name: "Blog", path: "/blog" },
        { name: "Shipping Policy", path: "/policy/shipping" },
        { name: "Privacy Policy", path: "/policy/privacy" },
        { name: "Refund and Return Policy", isPopup: true, action: () => setShowReturnPolicy(true) },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1LaTG6SCC9/?mibextid=wwXIfr", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/oticgeosystems?igsh=MW81MmY0cXMxNnVjMA==", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/otic-geosystems-limited/posts/?feedView=all", label: "LinkedIn" },
    { icon: Youtube, href: "https://www.youtube.com/@oticgeosystems", label: "YouTube" },
    { icon: Twitter, href: "https://x.com/geossotech?s=11", label: "X (Twitter)" },
    { icon: Music2Icon, href: "https://www.tiktok.com/@oticgeosystems?_r=1&_t=ZS-93O62vwcopZ", label: "TikTok" },
  ];

  return (
    <>
      <ReturnRefundPopup isOpen={showReturnPolicy} onClose={() => setShowReturnPolicy(false)} />
      
      <footer className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Mobile Accordion View */}
          <div className="lg:hidden">
            {footerSections.map((section, index) => (
              <div key={index} className="border-b border-white/20 last:border-b-0">
                <button
                  onClick={() => toggleDropdown(section.title)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <h3 className="text-base font-bold uppercase tracking-wide">{section.title}</h3>
                  <svg className={`w-5 h-5 transform transition-transform ${activeDropdown === section.title ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === section.title ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className="pb-4 space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.isPopup ? (
                          <button 
                            onClick={() => { 
                              if (link.action) {
                                link.action(); 
                                setActiveDropdown(null); 
                              }
                            }} 
                            className="w-full text-left text-sm font-medium hover:text-white/80 transition block py-1.5"
                          >
                            {link.name}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleNavigation(link.path)} 
                            className="w-full text-left text-sm font-medium hover:text-white/80 transition block py-1.5"
                          >
                            {link.name}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Newsletter Section for Mobile */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="text-base font-bold mb-3 uppercase tracking-wide">Newsletter</h4>
              <p className="text-sm text-white/80 mb-4">Stay updated with our latest products and offers</p>
              
              {isSubscribed ? (
                <div className="p-3 bg-green-600/20 border border-green-400 rounded text-green-300 text-sm text-center">
                  <CheckCircle className="w-4 h-4 inline mr-2" /> Thank you for subscribing! Check your email.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Your email address" 
                    required 
                    className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 placeholder:text-white/60 text-white" 
                    disabled={isSubmitting} 
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !email} 
                    className="w-full px-4 py-3 bg-white text-[#081748] text-sm font-bold rounded-lg hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#081748] border-t-transparent rounded-full animate-spin" />
                        Subscribing...
                      </>
                    ) : "Subscribe"}
                  </button>
                </form>
              )}
            </div>

            {/* Staff Login for Mobile */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="text-base font-bold mb-3 uppercase tracking-wide">Employee Access</h4>
              <p className="text-sm text-white/80 mb-4">Staff and admin members access portal</p>
              <button 
                onClick={() => handleNavigation('/login')} 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#081748] text-sm font-bold rounded-lg hover:bg-white/90 transition-all hover:scale-[1.02] border-2 border-white/30"
              >
                <LogIn className="w-4 h-4" /> Staff Login
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
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                      aria-label={social.label}
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
                <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.isPopup ? (
                        <button 
                          onClick={link.action} 
                          className="w-full text-left text-sm font-semibold hover:text-white/80 transition block py-1"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleNavigation(link.path)} 
                          className="w-full text-left text-sm font-semibold hover:text-white/80 transition block py-1"
                        >
                          {link.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Newsletter Section */}
                {section.title === "Support & Services" && (
                  <div className="mt-8">
                    <h4 className="text-sm font-bold mb-3 uppercase tracking-wide">Newsletter</h4>
                    <p className="text-xs text-white/80 mb-3">Stay updated with our latest products and offers</p>
                    
                    {isSubscribed ? (
                      <div className="p-2 bg-green-600/20 border border-green-400 rounded text-green-300 text-xs text-center flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Thank you for subscribing!
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex gap-2">
                        <input 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Your email" 
                          required 
                          className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:border-white/40 placeholder:text-white/60 text-white" 
                          disabled={isSubmitting} 
                        />
                        <button 
                          type="submit" 
                          disabled={isSubmitting || !email} 
                          className="px-4 py-2 bg-white text-[#081748] text-sm font-bold rounded hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-[#081748] border-t-transparent rounded-full animate-spin" />
                          ) : "Subscribe"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Staff Login */}
                {section.title === "Quick Links" && (
                  <div className="mt-8">
                    <h4 className="text-sm font-bold mb-3 uppercase tracking-wide">Employee Access</h4>
                    <p className="text-xs text-white/80 mb-3">Staff and admin members access portal</p>
                    <button 
                      onClick={() => handleNavigation('/login')} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#081748] text-sm font-bold rounded hover:bg-white/90 transition-all hover:scale-105 border-2 border-white/30"
                    >
                      <LogIn className="w-4 h-4" /> Staff Login
                    </button>
                  </div>
                )}

                {/* Social Media */}
                {section.title === "Quick Links" && (
                  <div className="mt-8">
                    <h4 className="text-sm font-bold mb-3 uppercase tracking-wide">Follow Us</h4>
                    <div className="flex items-center gap-2">
                      {socialLinks.map((social, index) => {
                        const Icon = social.icon;
                        return (
                          <a 
                            key={index} 
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110 border-2 border-white/30"
                            aria-label={social.label}
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
                <img src={oticLogo} alt="Otic logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <div>
                  <p className="text-sm font-bold text-white">© {new Date().getFullYear()} OTIC Geosystems. All rights reserved.</p>
                  <p className="text-xs text-white/60 mt-1">Precision Surveying & Geospatial Solutions</p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="hover:text-white/80 transition text-sm font-medium whitespace-nowrap bg-transparent border-none cursor-pointer text-white"
                >
                  Contact Us
                </button>
                <span className="text-white/40 hidden sm:inline">|</span>
                <button 
                  onClick={() => setShowReturnPolicy(true)} 
                  className="hover:text-white/80 transition text-sm font-medium whitespace-nowrap bg-transparent border-none cursor-pointer text-white"
                >
                  Return & Refund Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;