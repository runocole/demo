import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ArrowUp, MessageCircle } from "lucide-react";
import oticLogo from "../assets/otic-logo.png";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top functionality
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // WhatsApp functionality
  const openWhatsApp = () => {
    const phoneNumber = "+2347061739934";
    const message = "Hello! I'm interested in your geospatial solutions.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Navigation items with dropdowns
  const navigationItems = [
    {
      name: "Survey Equipment",
      href: "/buynow?category=survey-equipment",
      items: [
        { name: "Total Stations", href: "/buynow?category=Total Station" },
        { name: "GNSS Receivers", href: "/buynow?category=Receiver"},
        { name: "EchoSounders & USV", href: "/buynow?category=EchoSounder" },
        { name: "Payloads", href: "/buynow?category=Payloads" },
        { name: "Auto-steering Systems", href: "/buynow?category=Auto-steering Systems"},
        { name: "Handheld GPS", href: "/buynow?category=Receiver" },
        { name: "Laser Scanners", href: "/buynow?category=Laser Scanner" },
        { name: "Drones", href: "/buynow?category=Drones" },
        { name: "Levels", href: "/buynow?category=Level" },
      ],
    },
    {
      name: "Support & Services",
      href: "/contact",
      items: [
        { name: "Technical Support", href: "/contact?service=technical-support" },
        { name: "Maintenance", href: "/contact?service=maintenance" },
        { name: "Calibration", href: "/contact?service=calibration" },
      ],
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSubItemClick = (href: string) => {
    navigate(href);
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        {/* Logo at extreme left viewport edge */}
        <div className="fixed left-6 top-0 flex items-start gap-4">
          <div className="flex flex-col items-start">
            {/* Massive Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/customer/dashboard")}
            >
              <img
                src={oticLogo}
                alt="Otic logo" 
                className="w-32 h-32 object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Back Arrow - positioned below the logo */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 p-2 rounded-md hover:bg-white/10 transition-colors group mt-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-white group-hover:text-white/80 transition-colors" />
              <span className="text-sm font-medium text-white group-hover:text-white/80 transition-colors">
                Back
              </span>
            </button>
          </div>
        </div>

        {/* Center navigation with dropdowns */}
        <div className="flex items-center justify-center pt-12"> 
          <nav className="hidden md:flex items-center gap-6">
            {/* About - Simple link without dropdown */}
            <button
              onClick={() => handleNavigation("/about")}
              className="text-sm font-bold text-black hover:text-white/80 transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10"
            >
              About
            </button>

            {/* Training - Simple link without dropdown */}
            <button
              onClick={() => handleNavigation("/training")}
              className="text-sm font-bold text-black hover:text-white/80 transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10"
            >
              Training
            </button>

            {/* Cors Network - Simple link without dropdown */}
            <button
              onClick={() => handleNavigation("/corsnetwork")}
              className="text-sm font-bold text-black hover:text-white/80 transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10"
            >
              Cors Network
            </button>

            {/* Other navigation items with dropdowns */}
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <button 
                  onClick={() => handleNavigation(item.href)}
                  className="text-sm font-bold text-black hover:text-white/80 transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10 flex items-center gap-1"
                >
                  {item.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.name}
                        onClick={() => handleSubItemClick(subItem.href)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Contact link without dropdown */}
            <button
              onClick={() => handleNavigation("/contact")}
              className="text-sm font-bold text-black hover:text-white/80 transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* CTA Button at extreme right viewport edge */}
        <div className="fixed right-6 top-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/buynow")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#081748] text-white rounded-lg shadow-lg hover:bg-white/90 transition text-sm font-bold mt-5"
            >
              <Mail className="w-4 h-4" />
              Buy Now
            </button>
          </div>
        </div>
      </header>

      {/* Scroll to Top Button - Fixed position */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 z-50 w-12 h-12 bg-[#081748] hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* WhatsApp Button - Always visible, fixed position */}
      <button
        onClick={openWhatsApp}
        className="fixed right-6 bottom-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -left-2 -top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          Live
        </span>
      </button>
    </>
  );
};

export default Header;